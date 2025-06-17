import type { Express, Request, Response } from "express";
import { storage } from "./storage";
import { randomInt } from "crypto";

const otpStore: Map<string, { otp: string; expiresAt: number }> = new Map();

export function registerOtpRoutes(app: Express) {
  // Generate OTP for 2FA
  app.post("/api/auth/generate-otp", async (req: Request, res: Response) => {
    try {
      const { emailOrPhone } = req.body;
      if (!emailOrPhone) {
        return res.status(400).json({ message: "Email or phone is required" });
      }

      // Generate 6-digit OTP
      const otp = randomInt(100000, 999999).toString();

      // Store OTP with 5-minute expiry
      otpStore.set(emailOrPhone, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

      // TODO: Send OTP via Postmark or SMS gateway
      console.log(`Sending OTP ${otp} to ${emailOrPhone}`);

      res.json({ message: "OTP sent successfully" });
    } catch (error) {
      console.error("Generate OTP error:", error);
      res.status(500).json({ message: "Failed to generate OTP" });
    }
  });

  // Verify OTP for 2FA
  app.post("/api/auth/verify-otp", async (req: Request, res: Response) => {
    try {
      const { emailOrPhone, otp } = req.body;
      if (!emailOrPhone || !otp) {
        return res.status(400).json({ message: "Email/phone and OTP are required" });
      }

      const record = otpStore.get(emailOrPhone);
      if (!record) {
        return res.status(400).json({ message: "OTP not found or expired" });
      }

      if (record.expiresAt < Date.now()) {
        otpStore.delete(emailOrPhone);
        return res.status(400).json({ message: "OTP expired" });
      }

      if (record.otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      otpStore.delete(emailOrPhone);
      res.json({ message: "OTP verified successfully" });
    } catch (error) {
      console.error("Verify OTP error:", error);
      res.status(500).json({ message: "Failed to verify OTP" });
    }
  });
}
