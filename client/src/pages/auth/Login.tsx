import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, User, Stethoscope, Shield } from "lucide-react";
import { useAuthEnhanced } from "@/hooks/useAuthEnhanced";
import { useToast } from "@/hooks/use-toast";
import { BiometricLoginButton } from "@/components/auth/BiometricLoginButton";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login, register } = useAuthEnhanced();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  });
  const [registerForm, setRegisterForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    username: "",
    role: "patient"
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(loginForm);
      toast({
        title: "Login Successful",
        description: "Welcome to DermaTech!",
      });
      // Force page reload to trigger proper auth check
      window.location.href = "/";
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await register(registerForm);
      toast({
        title: "Registration Successful",
        description: "Welcome to DermaTech!",
      });
      // Force page reload to trigger proper auth check
      window.location.href = "/";
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      await login({
        email: "demo@dermatech.com",
        password: "demo123"
      });
      toast({
        title: "Demo Access Granted", 
        description: "Exploring DermaTech features",
      });
      // Force page reload to trigger proper auth check
      window.location.href = "/";
    } catch (error) {
      // If demo user doesn't exist, create it
      try {
        await register({
          email: "demo@dermatech.com",
          password: "demo123",
          firstName: "Demo",
          lastName: "Patient",
          username: "demo_patient",
          role: "patient"
        });
        toast({
          title: "Demo Account Created",
          description: "Welcome to DermaTech!",
        });
        // Don't redirect here - let the AuthWrapper handle it automatically
      } catch (regError: any) {
        toast({
          title: "Demo Access Failed",
          description: "Please try manual login",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
              <Heart className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">DermaTech</h1>
          <p className="text-gray-600">Advanced Healthcare Platform</p>
        </div>

        {/* Demo Access Alert */}
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <AlertDescription className="text-center">
            <Button
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
            >
              {isLoading ? "Accessing..." : "🚀 Try Demo Access"}
            </Button>
            <p className="text-xs text-blue-700 mt-2">
              Experience all DermaTech features instantly
            </p>
          </AlertDescription>
        </Alert>

        <BiometricLoginButton />

        <Tabs defaultValue="login" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="register">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>
                  Access your DermaTech healthcare dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>
                  Join DermaTech for advanced healthcare services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="First name"
                        value={registerForm.firstName}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, firstName: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Last name"
                        value={registerForm.lastName}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, lastName: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="Choose a username"
                      value={registerForm.username}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, username: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="Enter your email"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="Create a password"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Account Type</Label>
                    <select
                      id="role"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={registerForm.role}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, role: e.target.value }))}
                    >
                      <option value="patient">
                        <User className="inline mr-2" /> Patient
                      </option>
                      <option value="doctor">
                        <Stethoscope className="inline mr-2" /> Healthcare Provider
                      </option>
                      <option value="admin">
                        <Shield className="inline mr-2" /> Administrator
                      </option>
                    </select>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-600">
          <p>
            By signing in, you agree to our{" "}
            <span className="text-blue-600 cursor-pointer hover:underline">Terms of Service</span>
            {" "}and{" "}
            <span className="text-blue-600 cursor-pointer hover:underline">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
}







