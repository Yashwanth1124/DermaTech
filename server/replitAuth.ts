import type { Express, RequestHandler } from "express";
import session from "express-session";
import { storage } from "./storage";

// Simplified auth setup for demo purposes
export async function setupAuth(app: Express) {
  console.log("Setting up simplified authentication");
  
  // Simple session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to false for development
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }));

  // Demo login route - creates a demo user session
  app.get("/api/login", async (req, res) => {
    try {
      // Create a demo user for testing
      const demoUser = await storage.upsertUser({
        id: "demo-user-123",
        email: "demo@dermatech.com",
        firstName: "Demo",
        lastName: "User",
        profileImageUrl: null,
      });

      // Set session
      (req.session as any).user = demoUser;
      
      // Redirect to dashboard
      res.redirect("/");
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Logout route
  app.get("/api/logout", (req, res) => {
    req.session.destroy(() => {
      res.redirect("/");
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const sessionUser = (req.session as any)?.user;
  
  if (!sessionUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Attach user to request for route handlers
  (req as any).user = { claims: { sub: sessionUser.id } };
  next();
};