import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";

// Placeholder imports for biometric and ABHA SDK integration
// import { useWebAuthn } from "@/lib/webauthn";
// import { useAbhaSdk } from "@/lib/abhaSdk";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  username: string;
}

export function useAuthEnhanced() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Placeholder hooks for biometric and ABHA SDK
  // const { authenticateWithBiometrics } = useWebAuthn();
  // const { loginWithAbha } = useAbhaSdk();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("auth_token");
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
      localStorage.removeItem("auth_token");
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: { email: string; password: string }) => {
    try {
      setError(null);
      const response = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
      
      if (response.token) {
        localStorage.setItem("auth_token", response.token);
      }
      
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (err: any) {
      setError(err.message || "Login failed");
      throw err;
    }
  };

  const loginWithBiometrics = async () => {
    try {
      setError(null);
      // Placeholder biometric authentication flow
      // const credentials = await authenticateWithBiometrics();
      // const response = await apiRequest("/api/auth/biometric-login", {
      //   method: "POST",
      //   body: JSON.stringify(credentials),
      // });
      // if (response.token) {
      //   localStorage.setItem("auth_token", response.token);
      // }
      // setUser(response.user);
      // setIsAuthenticated(true);
      // return response;

      throw new Error("Biometric login not implemented yet");
    } catch (err: any) {
      setError(err.message || "Biometric login failed");
      throw err;
    }
  };

  const loginWithAbha = async (abhaId: string) => {
    try {
      setError(null);
      // Placeholder ABHA login flow
      // const response = await loginWithAbha(abhaId);
      // if (response.token) {
      //   localStorage.setItem("auth_token", response.token);
      // }
      // setUser(response.user);
      // setIsAuthenticated(true);
      // return response;

      throw new Error("ABHA login not implemented yet");
    } catch (err: any) {
      setError(err.message || "ABHA login failed");
      throw err;
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
      setError(null);
      const response = await apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      });
      
      if (response.token) {
        localStorage.setItem("auth_token", response.token);
      }
      
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (err: any) {
      setError(err.message || "Registration failed");
      throw err;
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (token) {
        await apiRequest("/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch {
      // Continue logout even if API call fails
    } finally {
      localStorage.removeItem("auth_token");
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    error,
    login,
    loginWithBiometrics,
    loginWithAbha,
    register,
    logout,
  };
}
