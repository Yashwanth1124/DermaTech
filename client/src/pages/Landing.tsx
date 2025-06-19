import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play,
  Download,
  Star,
  Users,
  Clock,
  Shield,
  Smartphone,
  Heart,
  Activity,
  Stethoscope,
  Calendar,
  FileText,
  Pill,
  ArrowRight,
  CheckCircle,
  Globe,
  Award,
  Zap,
  Menu,
  X,
  Upload,
  MapPin,
  MessageCircle,
  BellRing,
  Mic,
  Settings,
  Code,
  Lock,
  BarChart,
  HelpCircle
} from "lucide-react";
// OAuth login page - all login buttons redirect to /api/login
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

export default function Landing() {
  const [isLoading, setIsLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [, setLocation] = useLocation();
  const [userType, setUserType] = useState("patient");
  const [skinType, setSkinType] = useState("normal");
  const [showNotification, setShowNotification] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [diagnosisCounter, setDiagnosisCounter] = useState(27845921);
  const heroImageRef = useRef(null);
  
  // Simulate counter increments
  useEffect(() => {
    const interval = setInterval(() => {
      setDiagnosisCounter(prev => prev + Math.floor(Math.random() * 5) + 1);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Show notification after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(true);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleOAuthLogin = () => {
    window.location.href = "/api/login";
  };
  
  const handleSkinDiagnosis = () => {
    setLocation("/ai");
  };
  
  // Simulated voice capture
  const handleVoiceCapture = () => {
    alert("Voice recording feature activated. Please describe your skin concerns.");
  };

  return (
    <div className="min-h-screen bg-white scroll-smooth">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <motion.div 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 text-transparent bg-clip-text"
              >
                DermaTech
              </motion.div>

            </div>
            

            
            <nav className="hidden md:flex space-x-6">
              <a href="#hero" className="text-gray-600 hover:text-gray-900 transition-colors hover:scale-105">Home</a>
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors hover:scale-105">Features</a>
              <a href="#derma-insights" className="text-gray-600 hover:text-gray-900 transition-colors hover:scale-105">Insights</a>
              <a href="#stats" className="text-gray-600 hover:text-gray-900 transition-colors hover:scale-105">About</a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors hover:scale-105">Contact</a>
              
              {/* AI Chatbot Trigger */}
              <button 
                onClick={() => setShowChatbot(!showChatbot)}
                className="flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors"
              >
                <HelpCircle className="h-4 w-4 mr-1" />
                Ask DermaBot
              </button>
            </nav>
            
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">

              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setLocation("/login")}
                className="hover:scale-105 transition-transform"
              >
                Sign In
              </Button>
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 hover:scale-105 transition-transform"
                onClick={() => setLocation("/register")}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Get Started"}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg border-b z-50"
            >
              <div className="px-4 py-6 space-y-4">

                
                <a 
                  href="#hero" 
                  className="block text-gray-600 hover:text-gray-900 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </a>
                <a 
                  href="#features" 
                  className="block text-gray-600 hover:text-gray-900 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </a>
                <a 
                  href="#derma-insights" 
                  className="block text-gray-600 hover:text-gray-900 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Insights
                </a>
                <a 
                  href="#stats" 
                  className="block text-gray-600 hover:text-gray-900 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </a>
                <a 
                  href="#contact" 
                  className="block text-gray-600 hover:text-gray-900 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </a>
                
                {/* AI Chatbot Mobile Trigger */}
                <button 
                  onClick={() => {
                    setShowChatbot(!showChatbot);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors"
                >
                  <HelpCircle className="h-4 w-4 mr-1" />
                  Ask DermaBot
                </button>
                
                <div className="pt-4 border-t space-y-3">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => {
                      handleOAuthLogin();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Sign In
                  </Button>
                  <Button 
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                    onClick={() => {
                      handleOAuthLogin();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Sign In with Replit
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* AI Chatbot Popup */}
        <AnimatePresence>
          {showChatbot && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-20 right-4 w-80 bg-white rounded-lg shadow-2xl border z-50"
            >
              <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
                <h3 className="font-medium">DermaBot AI Assistant</h3>
                <X className="h-5 w-5 cursor-pointer" onClick={() => setShowChatbot(false)} />
              </div>
              <div className="p-4 h-64 overflow-y-auto">
                <div className="mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg inline-block">
                    How can I help you with your skin concerns today?
                  </div>
                </div>
                <div className="mb-4 text-right">
                  <div className="bg-gray-100 p-3 rounded-lg inline-block">
                    I have a rash on my arm
                  </div>
                </div>
                <div className="mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg inline-block">
                    I'd be happy to help! Can you upload a photo or describe the rash in more detail?
                  </div>
                </div>
              </div>
              <div className="p-4 border-t flex gap-2">
                <input type="text" className="flex-1 p-2 border rounded-md" placeholder="Type your message..." />
                <Button size="sm">Send</Button>
                <Button variant="outline" size="sm"><Mic className="h-4 w-4" /></Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative py-20 overflow-hidden">
        {/* Background gradient with animated pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-100 z-0">
          <div className="absolute inset-0 opacity-20" style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231E40AF' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            animation: 'backgroundScroll 30s linear infinite'
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
                    Healthcare
                  </span>
                  <span className="block">meets AI</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Advanced AI-powered dermatology diagnostics, telemedicine with AR/VR technology, 
                  and personalized skin care plans. Your complete dermatological care solution.
                </p>
                
                {/* AI Diagnosis Simulator */}
                <div className="mb-8 bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg">
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <Upload className="h-5 w-5 mr-2 text-blue-600" />
                    AI Skin Analysis
                  </h3>
                  <div className="mb-4">
                    <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                      <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      <div className="flex flex-col items-center justify-center">
                        <Activity className="h-10 w-10 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Drop your skin photo here or click to upload</p>
                      </div>
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                    onClick={handleSkinDiagnosis}
                  >
                    Analyze Now
                  </Button>
                  
                  {/* Voice input button */}
                  <div className="flex items-center justify-center mt-3">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-gray-600 flex items-center"
                      onClick={handleVoiceCapture}
                    >
                      <Mic className="h-4 w-4 mr-1" />
                      <span className="text-xs">Or describe your symptoms</span>
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 px-8 py-4 text-lg"
                    onClick={handleOAuthLogin}
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Sign In with Replit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="px-8 py-4 text-lg"
                    onClick={() => {
                      const featuresSection = document.getElementById('features');
                      featuresSection?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Watch Demo
                  </Button>
                </div>
                
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-500 mr-1" />
                    <span className="font-semibold">4.9/5</span>
                    <span className="ml-1">rating</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-blue-500 mr-1" />
                    <span className="font-semibold">50M+</span>
                    <span className="ml-1">users</span>
                  </div>
                  <div className="flex items-center">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <MapPin className="h-5 w-5 text-red-500 mr-1" />
                    </motion.div>
                    <span className="font-semibold">Near you</span>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <div className="relative">
              <motion.div 
                ref={heroImageRef}
                initial={{ opacity: 0, rotate: 0, y: 20 }}
                animate={{ opacity: 1, rotate: 0, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                whileHover={{ rotate: 0, scale: 1.02 }}
                className="bg-white rounded-2xl shadow-2xl p-8"
              >
                {/* 3D Morphing Effect */}
                <div className="relative bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-6 mb-6 overflow-hidden">
                  <div className="absolute top-0 right-0 w-full h-full opacity-10 bg-grid-pattern"></div>
                  <div className="flex items-center justify-center h-48">
                    <motion.div
                      animate={{ 
                        rotateY: [0, 180, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        rotateY: { duration: 10, repeat: Infinity, ease: "linear" },
                        scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                      }}
                      className="w-40 h-40 relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 rounded-full opacity-20 animate-pulse"></div>
                      <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                        <Stethoscope className="h-16 w-16 text-blue-600" />
                      </div>
                    </motion.div>
                  </div>
                  <h3 className="text-xl font-bold text-center text-gray-900 mb-2">AI Dermatology Assistant</h3>
                  <p className="text-center text-gray-600 mb-4">Diagnose skin conditions with 97% accuracy</p>
                </div>
                
                {/* Real-time counter */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Activity className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-sm font-medium">Live Diagnoses</span>
                    </div>
                    <div className="bg-white px-3 py-1 rounded-full text-sm font-mono text-blue-600 font-semibold">
                      {diagnosisCounter.toLocaleString()}
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 h-1 mt-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-green-500 to-blue-500 h-full animate-progress"></div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                    onClick={() => setLocation("/ai")}
                  >
                    Skin Analysis
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex-1"
                    onClick={() => setLocation("/telemedicine")}
                  >
                    Virtual Consult
                  </Button>
                </div>
              </motion.div>
              
              {/* Floating badges */}
              <motion.div 
                initial={{ opacity: 0, x: -20, y: -10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute -left-4 top-10 bg-white p-2 rounded-lg shadow-lg flex items-center"
              >
                <div className="bg-green-100 p-2 rounded-md mr-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="text-xs">
                  <div className="font-semibold">ABDM Compliant</div>
                  <div className="text-gray-500">Health ID Integration</div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 20, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -right-4 bottom-10 bg-white p-2 rounded-lg shadow-lg flex items-center"
              >
                <div className="bg-blue-100 p-2 rounded-md mr-2">
                  <Lock className="h-4 w-4 text-blue-600" />
                </div>
                <div className="text-xs">
                  <div className="font-semibold">HIPAA Compliant</div>
                  <div className="text-gray-500">End-to-end Encryption</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 px-3 py-1 bg-gradient-to-r from-green-100 to-blue-100 text-blue-800 border-blue-200">
                Personalized Care
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Specialized Skin Health Features
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Advanced dermatological solutions powered by AI and medical expertise
              </p>
            </motion.div>
          </div>

          {/* User type tabs */}
          <Tabs defaultValue="patients" className="mb-12">
            <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto mb-8">
              <TabsTrigger value="patients" className="text-sm">For Patients</TabsTrigger>
              <TabsTrigger value="doctors" className="text-sm">For Dermatologists</TabsTrigger>
              <TabsTrigger value="clinics" className="text-sm">For Clinics</TabsTrigger>
              <TabsTrigger value="developers" className="text-sm">For Developers</TabsTrigger>
            </TabsList>
            
            <TabsContent value="patients">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer h-full bg-gradient-to-br from-white to-green-50"
                    onClick={() => setLocation("/ai")}
                  >
                    <CardHeader>
                      <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg flex items-center justify-center mb-4">
                        <Activity className="h-6 w-6 text-blue-600" />
                      </div>
                      <CardTitle className="text-xl">AI Skin Diagnostics</CardTitle>
                      <CardDescription className="text-base">
                        Upload a photo and get an accurate skin condition assessment in seconds with our AI technology.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">97% Accuracy</Badge>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer h-full bg-gradient-to-br from-white to-blue-50"
                    onClick={() => setLocation("/telemedicine")}
                  >
                    <CardHeader>
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center mb-4">
                        <Smartphone className="h-6 w-6 text-indigo-600" />
                      </div>
                      <CardTitle className="text-xl">Virtual Dermatologist</CardTitle>
                      <CardDescription className="text-base">
                        Connect with specialized dermatologists through AR/VR enabled video consultations.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200">AR/VR Enabled</Badge>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer h-full bg-gradient-to-br from-white to-yellow-50"
                    onClick={() => setLocation("/records")}
                  >
                    <CardHeader>
                      <div className="w-12 h-12 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-lg flex items-center justify-center mb-4">
                        <FileText className="h-6 w-6 text-amber-600" />
                      </div>
                      <CardTitle className="text-xl">Interactive Skin Journal</CardTitle>
                      <CardDescription className="text-base">
                        Track your skin's progress over time with our interactive journal and timeline.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Visual Timeline</Badge>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer h-full bg-gradient-to-br from-white to-purple-50"
                    onClick={() => setLocation("/appointments")}
                  >
                    <CardHeader>
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center mb-4">
                        <Calendar className="h-6 w-6 text-purple-600" />
                      </div>
                      <CardTitle className="text-xl">Smart Scheduling</CardTitle>
                      <CardDescription className="text-base">
                        AI-powered appointment recommendations based on your skin condition urgency.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Priority Based</Badge>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer h-full bg-gradient-to-br from-white to-red-50"
                    onClick={() => setLocation("/pharmacy")}
                  >
                    <CardHeader>
                      <div className="w-12 h-12 bg-gradient-to-r from-red-100 to-rose-100 rounded-lg flex items-center justify-center mb-4">
                        <Pill className="h-6 w-6 text-rose-600" />
                      </div>
                      <CardTitle className="text-xl">Personalized Treatment</CardTitle>
                      <CardDescription className="text-base">
                        Get customized skin care regimens and medications based on your unique skin profile.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-200">Skin Type Specific</Badge>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer h-full bg-gradient-to-br from-white to-green-50"
                    onClick={() => setLocation("/support")}
                  >
                    <CardHeader>
                      <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-teal-100 rounded-lg flex items-center justify-center mb-4">
                        <MessageCircle className="h-6 w-6 text-teal-600" />
                      </div>
                      <CardTitle className="text-xl">24/7 Derma Support</CardTitle>
                      <CardDescription className="text-base">
                        Get immediate assistance for urgent skin concerns through our AI chatbot or live support.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-200">Always Available</Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>
            
            <TabsContent value="doctors">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer h-full">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <Mic className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl">Voice-enabled EMR</CardTitle>
                    <CardDescription>
                      Document patient visits using voice commands for efficient record keeping.
                    </CardDescription>
                  </CardHeader>
                </Card>
                
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer h-full">
                  <CardHeader>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                      <Activity className="h-6 w-6 text-green-600" />
                    </div>
                    <CardTitle className="text-xl">AI Diagnosis Insights</CardTitle>
                    <CardDescription>
                      Get AI-powered diagnostic suggestions with medical reference data.
                    </CardDescription>
                  </CardHeader>
                </Card>
                
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer h-full">
                  <CardHeader>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                      <Calendar className="h-6 w-6 text-purple-600" />
                    </div>
                    <CardTitle className="text-xl">Smart Scheduling</CardTitle>
                    <CardDescription>
                      AI-optimized appointment scheduling to maximize your availability.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="clinics">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer h-full">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <BarChart className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl">Clinic Analytics</CardTitle>
                    <CardDescription>
                      Comprehensive reports on patient demographics, conditions, and treatments.
                    </CardDescription>
                  </CardHeader>
                </Card>
                
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer h-full">
                  <CardHeader>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <CardTitle className="text-xl">Virtual Waiting Room</CardTitle>
                    <CardDescription>
                      Digital queue management with real-time updates for patients.
                    </CardDescription>
                  </CardHeader>
                </Card>
                
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer h-full">
                  <CardHeader>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                      <Shield className="h-6 w-6 text-purple-600" />
                    </div>
                    <CardTitle className="text-xl">Compliance Dashboard</CardTitle>
                    <CardDescription>
                      Ensure regulatory compliance with our built-in monitoring tools.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="developers">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer h-full">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <Code className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl">API Platform</CardTitle>
                    <CardDescription>
                      Integrate our AI diagnostics into your healthcare applications.
                    </CardDescription>
                  </CardHeader>
                </Card>
                
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer h-full">
                  <CardHeader>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                      <Settings className="h-6 w-6 text-green-600" />
                    </div>
                    <CardTitle className="text-xl">Webhook Integration</CardTitle>
                    <CardDescription>
                      Real-time event notifications for seamless workflow automation.
                    </CardDescription>
                  </CardHeader>
                </Card>
                
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer h-full">
                  <CardHeader>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                      <Lock className="h-6 w-6 text-purple-600" />
                    </div>
                    <CardTitle className="text-xl">HIPAA Compliant Storage</CardTitle>
                    <CardDescription>
                      Secure storage solutions for sensitive patient data integration.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Partnership logos */}
          <div className="mt-20">
            <div className="text-center mb-8">
              <h3 className="text-lg font-medium text-gray-600">Trusted by leading healthcare organizations</h3>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
              <div className="grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100">
                <Badge className="px-4 py-2 text-lg bg-transparent hover:bg-transparent border-0 font-semibold text-gray-500">ABDM</Badge>
              </div>
              <div className="grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100">
                <Badge className="px-4 py-2 text-lg bg-transparent hover:bg-transparent border-0 font-semibold text-gray-500">FHIR</Badge>
              </div>
              <div className="grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100">
                <Badge className="px-4 py-2 text-lg bg-transparent hover:bg-transparent border-0 font-semibold text-gray-500">NHA</Badge>
              </div>
              <div className="grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100">
                <Badge className="px-4 py-2 text-lg bg-transparent hover:bg-transparent border-0 font-semibold text-gray-500">AWS</Badge>
              </div>
              <div className="grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100">
                <Badge className="px-4 py-2 text-lg bg-transparent hover:bg-transparent border-0 font-semibold text-gray-500">Google Cloud</Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Derma Insights Section */}
      <section id="derma-insights" className="py-20 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 px-3 py-1 bg-gradient-to-r from-green-100 to-blue-100 text-blue-800 border-blue-200">
                Knowledge Center
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Derma Insights & Resources
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Expert-backed dermatology content to help you understand and manage skin conditions
              </p>
            </motion.div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="relative h-48 bg-gradient-to-r from-blue-400 to-indigo-500">
                <div className="absolute inset-0 flex items-center justify-center text-white text-6xl opacity-20">
                  <Activity />
                </div>
                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-white/20 text-white">Guide</Badge>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Understanding Skin Types</h3>
                <p className="text-gray-600 mb-4">Learn about the different skin types and how to identify yours for better care.</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>May 12, 2024</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-blue-600">
                    Read Article
                  </Button>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="relative h-48 bg-gradient-to-r from-green-400 to-teal-500">
                <div className="absolute inset-0 flex items-center justify-center text-white text-6xl opacity-20">
                  <Pill />
                </div>
                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-white/20 text-white">Tutorial</Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge className="bg-white text-green-600">
                    <span className="flex items-center">
                      <Mic className="h-3 w-3 mr-1" />
                      Audio Available
                    </span>
                  </Badge>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Eczema Treatment Guide</h3>
                <p className="text-gray-600 mb-4">Evidence-based approaches to managing eczema and reducing flare-ups.</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>June 3, 2024</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-blue-600">
                    Read Article
                  </Button>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="relative h-48 bg-gradient-to-r from-purple-400 to-pink-500">
                <div className="absolute inset-0 flex items-center justify-center text-white text-6xl opacity-20">
                  <Smartphone />
                </div>
                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-white/20 text-white">Interactive</Badge>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Skin Condition Quiz</h3>
                <p className="text-gray-600 mb-4">Test your knowledge about common skin conditions with our interactive quiz.</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-1" />
                    <span>5.3k participants</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-blue-600">
                    Take Quiz
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="mt-12 text-center">
            <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
              View All Resources
            </Button>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section id="stats" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 px-3 py-1 bg-gradient-to-r from-green-100 to-blue-100 text-blue-800 border-blue-200">
                Our Impact
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Trusted by millions worldwide
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Join the dermatological care revolution with our AI-powered platform
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
                <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">50M+</div>
                <div className="text-gray-600">Active Users</div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg">
                <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600 mb-2">2000+</div>
                <div className="text-gray-600">Partner Clinics</div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg">
                <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-2">97%</div>
                <div className="text-gray-600">AI Accuracy</div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-lg">
                <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-600 mb-2">24/7</div>
                <div className="text-gray-600">Support Available</div>
              </div>
            </motion.div>
          </div>
          
          {/* Interactive map */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="mt-16 bg-gray-100 rounded-xl p-6 shadow-inner"
          >
            <h3 className="text-xl font-bold text-center mb-4">Global DermaTech Network</h3>
            <div className="h-64 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-30" style={{ 
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1000' height='600' viewBox='0 0 1000 600'%3E%3Cpath fill='%231E40AF' d='M213,300 a87,87 0 1,0 174,0 a87,87 0 1,0 -174,0' /%3E%3Cpath fill='%231E40AF' d='M550,250 a50,50 0 1,0 100,0 a50,50 0 1,0 -100,0' /%3E%3Cpath fill='%231E40AF' d='M750,400 a65,65 0 1,0 130,0 a65,65 0 1,0 -130,0' /%3E%3Cpath fill='%231E40AF' d='M600,480 a40,40 0 1,0 80,0 a40,40 0 1,0 -80,0' /%3E%3Cpath fill='%231E40AF' d='M400,500 a35,35 0 1,0 70,0 a35,35 0 1,0 -70,0' /%3E%3Cpath fill='%231E40AF' d='M300,150 a45,45 0 1,0 90,0 a45,45 0 1,0 -90,0' /%3E%3Cpath stroke='%231E40AF' stroke-width='2' fill='none' d='M300,300 C400,250 450,250 550,250' /%3E%3Cpath stroke='%231E40AF' stroke-width='2' fill='none' d='M300,300 C350,400 500,450 600,480' /%3E%3Cpath stroke='%231E40AF' stroke-width='2' fill='none' d='M600,480 C650,450 700,430 750,400' /%3E%3Cpath stroke='%231E40AF' stroke-width='2' fill='none' d='M300,300 C350,200 400,170 300,150' /%3E%3Cpath stroke='%231E40AF' stroke-width='2' fill='none' d='M300,300 C320,400 350,500 400,500' /%3E%3C/svg%3E")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}></div>
              <div className="text-center z-10">
                <p className="text-blue-800 font-medium mb-2">Present in 52 countries</p>
                <Button variant="outline" size="sm" className="bg-white/80">Find Nearby Clinics</Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-blue-600 skew-y-2 transform origin-top-left z-0"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Transform Your Dermatology Experience Today
            </h2>
            <p className="text-xl text-white mb-8 max-w-3xl mx-auto opacity-90">
              Join millions of users who trust DermaTech for their skin health. Experience the future of dermatological care with AI diagnostics and personalized treatment.
            </p>
            
            {/* App Store Badges */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <div className="bg-black/10 backdrop-blur-sm rounded-xl p-4 flex items-center hover:bg-black/20 transition-all cursor-pointer">
                <div className="mr-3 text-white text-3xl">
                  <Download />
                </div>
                <div className="text-left">
                  <div className="text-white/80 text-xs">Download on the</div>
                  <div className="text-white font-semibold">App Store</div>
                </div>
              </div>
              
              <div className="bg-black/10 backdrop-blur-sm rounded-xl p-4 flex items-center hover:bg-black/20 transition-all cursor-pointer">
                <div className="mr-3 text-white text-3xl">
                  <Download />
                </div>
                <div className="text-left">
                  <div className="text-white/80 text-xs">Get it on</div>
                  <div className="text-white font-semibold">Google Play</div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg hover:scale-105 transition-transform"
                onClick={handleOAuthLogin}
              >
                Try Web App Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg hover:scale-105 transition-transform"
                onClick={() => setLocation("/support")}
              >
                Contact Sales
              </Button>
            </div>
            
            {/* Floating notification */}
            <motion.div
              initial={{ opacity: 0, y: 50, x: -50 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              transition={{ delay: 0.5, type: "spring" }}
              viewport={{ once: true }}
              className="absolute bottom-0 left-10 bg-white rounded-lg shadow-xl p-3 hidden md:flex items-center"
            >
              <div className="bg-green-100 rounded-full p-2 mr-3">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-left pr-3">
                <div className="text-sm font-semibold">152 new users joined</div>
                <div className="text-xs text-gray-500">in the last hour</div>
              </div>
            </motion.div>
            
            {/* Floating rating */}
            <motion.div
              initial={{ opacity: 0, y: 50, x: 50 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              transition={{ delay: 0.7, type: "spring" }}
              viewport={{ once: true }}
              className="absolute bottom-0 right-10 bg-white rounded-lg shadow-xl p-3 hidden md:flex items-center"
            >
              <div className="bg-yellow-100 rounded-full p-2 mr-3">
                <Star className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold">4.9 out of 5 stars</div>
                <div className="text-xs text-gray-500">based on 15K+ reviews</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 text-transparent bg-clip-text mb-4">DermaTech</div>
              <p className="text-gray-400 mb-4">
                Your trusted skin health companion, making advanced dermatological care accessible and personalized for everyone.
              </p>
              
              <div className="flex space-x-4 mt-6">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <div className="bg-gray-800 hover:bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path></svg>
                  </div>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <div className="bg-gray-800 hover:bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10zm3.11 8.66c0-.11.01-.22.01-.33 0-3.38-2.57-7.33-7.27-7.33-1.45 0-2.79.42-3.94 1.15.2-.02.41-.03.61-.03 1.2 0 2.3.41 3.17 1.1-1.12.02-2.07.76-2.39 1.77.15-.03.31-.04.47-.04.23 0 .45.03.66.08-1.17.24-2.05 1.27-2.05 2.51v.03c.34-.19.74-.3 1.16-.31-.69.46-1.14 1.25-1.14 2.14 0 .47.13.91.35 1.29 1.26-1.55 3.15-2.58 5.27-2.68-.04.19-.07.38-.07.58 0 1.41 1.14 2.56 2.56 2.56.74 0 1.4-.31 1.87-.81.58.11 1.13.33 1.62.62-.19-.6-.6-1.11-1.13-1.43.52.06 1.01.2 1.47.41-.34-.52-.78-.97-1.29-1.33z"></path></svg>
                  </div>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <div className="bg-gray-800 hover:bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm-1-6.7c-.66 0-1.2-.54-1.2-1.2 0-.66.54-1.2 1.2-1.2.66 0 1.2.54 1.2 1.2 0 .66-.54 1.2-1.2 1.2zM17 15h-2v-2.9c0-.9-.33-1.5-1.17-1.5-.86 0-1.23.59-1.23 1.5V15h-2V9h2v.83c.42-.58 1.09-.92 1.84-.92 1.67 0 2.56 1.01 2.56 2.9V15z"></path></svg>
                  </div>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <div className="bg-gray-800 hover:bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm5.82 15.82c-.24.24-.57.36-.91.36s-.67-.12-.91-.36L12 15.82l-4 4c-.24.24-.57.36-.91.36s-.67-.12-.91-.36c-.51-.51-.51-1.31 0-1.82l4-4-4-4c-.51-.51-.51-1.31 0-1.82.51-.51 1.31-.51 1.82 0l4 4 4-4c.51-.51 1.31-.51 1.82 0 .51.51.51 1.31 0 1.82l-4 4 4 4c.51.51.51 1.31 0 1.82z"></path></svg>
                  </div>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white cursor-pointer" onClick={() => setLocation("/ai")}>AI Skin Diagnostics</a></li>
                <li><a href="#" className="hover:text-white cursor-pointer" onClick={() => setLocation("/telemedicine")}>Virtual Dermatologist</a></li>
                <li><a href="#" className="hover:text-white cursor-pointer" onClick={() => setLocation("/records")}>Skin Journal</a></li>
                <li><a href="#" className="hover:text-white cursor-pointer" onClick={() => setLocation("/pharmacy")}>Personalized Treatment</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Team</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Press</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
                <li><a href="#" className="hover:text-white">Developers</a></li>
              </ul>
            </div>
          </div>
          
          {/* Compliance logos */}
          <div className="mt-12 border-t border-gray-800 pt-8 flex flex-wrap justify-center gap-6">
            <div className="flex items-center bg-gray-800 px-4 py-2 rounded-lg">
              <div className="text-blue-400 mr-2"><Lock className="h-4 w-4" /></div>
              <span className="text-sm text-gray-400">HIPAA Compliant</span>
            </div>
            <div className="flex items-center bg-gray-800 px-4 py-2 rounded-lg">
              <div className="text-green-400 mr-2"><CheckCircle className="h-4 w-4" /></div>
              <span className="text-sm text-gray-400">ABDM Integrated</span>
            </div>
            <div className="flex items-center bg-gray-800 px-4 py-2 rounded-lg">
              <div className="text-purple-400 mr-2"><Shield className="h-4 w-4" /></div>
              <span className="text-sm text-gray-400">ISO 27001</span>
            </div>
            <div className="flex items-center bg-gray-800 px-4 py-2 rounded-lg">
              <div className="text-yellow-400 mr-2"><Award className="h-4 w-4" /></div>
              <span className="text-sm text-gray-400">FHIR Compatible</span>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; 2025 DermaTech Care. All rights reserved.</p>
            
            {/* Accessibility toggle */}
            <div className="mt-4 flex items-center justify-center">
              <Button variant="ghost" size="sm" className="text-gray-500 text-xs flex items-center">
                <Settings className="h-3 w-3 mr-1" />
                Accessibility Settings
              </Button>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Add animations keyframes */}
      <style>{`
        @keyframes backgroundScroll {
          0% { background-position: 0 0; }
          100% { background-position: 100% 100%; }
        }
        
        @keyframes animate-progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        
        .animate-progress {
          animation: animate-progress 3s infinite;
        }
        
        .bg-grid-pattern {
          background-image: radial-gradient(circle, #6366f1 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
}