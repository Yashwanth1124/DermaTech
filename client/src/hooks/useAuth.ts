import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  username: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("dermatech_token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      const userData = await apiRequest("/api/auth/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem("dermatech_token");
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
      
      if (response.token) {
        localStorage.setItem("dermatech_token", response.token);
      }
      
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    username: string;
    role: string;
  }) => {
    try {
      const response = await apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      });
      
      // Don't automatically log in after registration
      // User should be redirected to login page instead
      return { 
        success: true, 
        message: response.message || "Registration successful! Please log in with your credentials." 
      };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.message || "Registration failed" 
      };
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("dermatech_token");
      if (token) {
        await apiRequest("/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      localStorage.removeItem("dermatech_token");
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
  };
}