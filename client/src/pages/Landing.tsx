import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Smartphone, 
  Shield, 
  Zap, 
  Users, 
  Globe, 
  Award,
  Stethoscope,
  Pill,
  Activity,
  Eye,
  Heart
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

export default function Landing() {
  const { login, register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();

  const handleQuickLogin = async () => {
    setIsLoading(true);
    try {
      await login({
        email: "demo@dermatech.com",
        password: "demo123"
      });
      setLocation("/");
    } catch (error) {
      // If demo user doesn't exist, create it
      try {
        await register({
          email: "demo@dermatech.com",
          password: "demo123",
          firstName: "Demo",
          lastName: "User",
          username: "demo",
          role: "patient"
        });
        setLocation("/");
      } catch (regError) {
        console.error("Demo login failed:", regError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-16 text-center">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium">
              🏆 Leading Healthcare Innovation in India
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              DermaTech
              <span className="block text-4xl md:text-5xl bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                97% AI Accuracy
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Revolutionary dermatology healthcare platform with AI-powered skin diagnostics, 
              AR/VR teleconsultations, comprehensive PHR/EMR, and 2000+ pharmacy partnerships. 
              Designed to surpass Eka Care with advanced blockchain analytics and ABHA integration.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              onClick={handleQuickLogin}
              disabled={isLoading}
            >
              <Smartphone className="mr-2 h-5 w-5" />
              {isLoading ? "Loading..." : "Launch DermaTech"}
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
              <Eye className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">97%</div>
              <div className="text-sm text-gray-600">AI Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">2000+</div>
              <div className="text-sm text-gray-600">Pharmacy Partners</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">0.5s</div>
              <div className="text-sm text-gray-600">Load Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">15</div>
              <div className="text-sm text-gray-600">Indian Languages</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Healthcare Ecosystem
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Advanced features designed to revolutionize healthcare delivery in India
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Brain className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle className="text-xl">AI Skin Diagnostics</CardTitle>
                <CardDescription>
                  97% accurate TensorFlow + OpenCV powered analysis with real-time processing
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Globe className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle className="text-xl">AR/VR Teleconsultations</CardTitle>
                <CardDescription>
                  Immersive consultations with A-Frame + WebXR technology for enhanced diagnosis
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Activity className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle className="text-xl">PHR/EMR Integration</CardTitle>
                <CardDescription>
                  Complete health records with blockchain verification and ABHA integration
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Pill className="h-12 w-12 text-red-600 mb-4" />
                <CardTitle className="text-xl">Pharmacy Marketplace</CardTitle>
                <CardDescription>
                  2000+ verified pharmacy partners with real-time inventory and delivery tracking
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-l-4 border-l-yellow-500 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 text-yellow-600 mb-4" />
                <CardTitle className="text-xl">Blockchain Analytics</CardTitle>
                <CardDescription>
                  Hyperledger Fabric powered transparency with immutable health data records
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-l-4 border-l-indigo-500 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Zap className="h-12 w-12 text-indigo-600 mb-4" />
                <CardTitle className="text-xl">Performance Optimized</CardTitle>
                <CardDescription>
                  Sub-500ms load times, 99.99% uptime, works on 3GB RAM devices
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Advanced Technology Stack
            </h2>
            <p className="text-lg text-gray-600">
              Built with cutting-edge technologies for maximum performance and scalability
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="font-semibold text-gray-900 mb-2">AI/ML Engine</h3>
              <p className="text-sm text-gray-600">TensorFlow 2.14, OpenCV 4.8, Custom CNN Models</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="font-semibold text-gray-900 mb-2">AR/VR Platform</h3>
              <p className="text-sm text-gray-600">A-Frame, WebXR, Three.js, Real-time Rendering</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="font-semibold text-gray-900 mb-2">Blockchain</h3>
              <p className="text-sm text-gray-600">Hyperledger Fabric, Smart Contracts, IPFS</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="font-semibold text-gray-900 mb-2">Backend</h3>
              <p className="text-sm text-gray-600">Node.js, Express, GraphQL, PostgreSQL</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-6 py-16 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Experience the Future of Healthcare?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of patients and healthcare providers revolutionizing medical care in India
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="px-8 py-4 text-lg font-semibold"
              onClick={handleQuickLogin}
              disabled={isLoading}
            >
              <Heart className="mr-2 h-5 w-5" />
              {isLoading ? "Loading..." : "Start Your Health Journey"}
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="px-8 py-4 text-lg bg-transparent border-white text-white hover:bg-white hover:text-blue-600"
            >
              <Stethoscope className="mr-2 h-5 w-5" />
              Healthcare Provider Access
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">DermaTech</h3>
              <p className="text-gray-400 text-sm">
                Revolutionary healthcare platform designed to surpass existing solutions with 
                advanced AI, AR/VR, and blockchain technologies.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>AI Skin Diagnostics</li>
                <li>AR/VR Consultations</li>
                <li>Pharmacy Marketplace</li>
                <li>Health Records</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Technology</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>97% AI Accuracy</li>
                <li>Blockchain Analytics</li>
                <li>ABHA Integration</li>
                <li>15 Indian Languages</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Compliance</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>HIPAA Compliant</li>
                <li>ABDM Standards</li>
                <li>Open Source</li>
                <li>Enterprise Grade</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>© 2024 DermaTech. Advanced Healthcare Technology Platform. Built to surpass Eka Care.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}