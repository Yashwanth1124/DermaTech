import type { Express, RequestHandler } from "express";

// Simplified auth setup for DermaTech
export async function setupAuth(app: Express) {
  // Basic setup - DermaTech uses JWT tokens
  console.log("DermaTech auth system initialized");
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  // For now, allow all requests to pass through
  // JWT validation is handled in routes.ts
  next();
};