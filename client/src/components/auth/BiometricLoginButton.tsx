import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuthEnhanced } from "@/hooks/useAuthEnhanced";

export function BiometricLoginButton() {
  const { loginWithBiometrics } = useAuthEnhanced();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBiometricLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginWithBiometrics();
    } catch (err: any) {
      setError(err.message || "Biometric login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <Button
        onClick={handleBiometricLogin}
        disabled={loading}
        className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
        aria-label="Biometric Login"
        title="Login using fingerprint or face ID"
      >
        {loading ? "Authenticating..." : "🔒 Biometric Login"}
      </Button>
      {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}
    </div>
  );
}
