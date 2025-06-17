import type { Express, Request, Response } from "express";
import { storage } from "./storage";

// Placeholder in-memory store for biometric credentials
const biometricCredentialsStore: Map<string, any> = new Map();

export function registerBiometricRoutes(app: Express) {
  // Register biometric credential for a user
  app.post("/api/auth/biometric/register", async (req: Request, res: Response) => {
    try {
      const { userId, credential } = req.body;
      if (!userId || !credential) {
        return res.status(400).json({ message: "User ID and credential are required" });
      }

      // Store credential securely (in-memory for demo)
      biometricCredentialsStore.set(userId, credential);

      res.json({ message: "Biometric credential registered successfully" });
    } catch (error) {
      console.error("Biometric register error:", error);
      res.status(500).json({ message: "Failed to register biometric credential" });
    }
  });

  // Authenticate user via biometric credential
  app.post("/api/auth/biometric/login", async (req: Request, res: Response) => {
    try {
      const { userId, credential } = req.body;
      if (!userId || !credential) {
        return res.status(400).json({ message: "User ID and credential are required" });
      }

      const storedCredential = biometricCredentialsStore.get(userId);
      if (!storedCredential) {
        return res.status(404).json({ message: "Biometric credential not found" });
      }

      // Placeholder comparison logic
      if (JSON.stringify(storedCredential) !== JSON.stringify(credential)) {
        return res.status(401).json({ message: "Biometric authentication failed" });
      }

      // Generate JWT token
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const jwt = require("jsonwebtoken");
      const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || "dermatech-secret-key");

      const { password, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, token });
    } catch (error) {
      console.error("Biometric login error:", error);
      res.status(500).json({ message: "Failed to authenticate biometrically" });
    }
  });
}
