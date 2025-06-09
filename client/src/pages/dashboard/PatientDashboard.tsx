import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Calendar, 
  FileText, 
  Pill, 
  Bell, 
  TrendingUp,
  Camera,
  Zap,
  Heart,
  Activity,
  Clock,
  MapPin,
  Phone,
  Video,
  Users,
  Shield,
  Award,
  Globe
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

export default function PatientDashboard() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState("overview");

  // Dashboard statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: () => apiRequest("/api/dashboard/stats"),
  });

  // Recent AI diagnoses
  const { data: diagnoses } = useQuery({
    queryKey: ["ai-diagnoses"],
    queryFn: () => apiRequest("/api/ai-diagnoses"),
  });

  // Upcoming appointments
  const { data: appointments } = useQuery({
    queryKey: ["appointments"],
    queryFn: () => apiRequest("/api/appointments"),
  });

  // Recent pharmacy orders
  const { data: orders } = useQuery({
    queryKey: ["pharmacy-orders"],
    queryFn: () => apiRequest("/api/pharmacy-orders"),
  });

  // Health records
  const { data: records } = useQuery({
    queryKey: ["health-records"],
    queryFn: () => apiRequest("/api/health-records"),
  });

  // Notifications
  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => apiRequest("/api/notifications"),
  });

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your health dashboard...</p>
        </div>
      </div>
    );
  }

  const recentDiagnoses = diagnoses?.slice(0, 3) || [];
  const upcomingAppointments = appointments?.filter(apt => apt.status === "scheduled")?.slice(0, 3) || [];
  const recentOrders = orders?.slice(0, 3) || [];
  const unreadNotifications = notifications?.filter(n => !n.isRead)?.length || 0;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName || "Patient"}!
          </h1>
          <p className="text-gray-600 mt-1">
            Your comprehensive health dashboard with AI-powered insights
          </p>
        </div>
        <div className="flex space-x-3">
          <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
            <Camera className="mr-2 h-4 w-4" />
            AI Skin Scan
          </Button>
          <Button variant="outline">
            <Video className="mr-2 h-4 w-4" />
            AR/VR Consult
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats?.appointments || 0}</div>
            <p className="text-xs text-muted-foreground">
              {upcomingAppointments.length} upcoming
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Records</CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats?.records || 0}</div>
            <p className="text-xs text-muted-foreground">
              PHR/EMR integrated
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Scans</CardTitle>
            <Brain className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats?.aiScans || 0}</div>
            <p className="text-xs text-muted-foreground">
              97% accuracy rate
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Bell className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{unreadNotifications}</div>
            <p className="text-xs text-muted-foreground">
              New updates
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ai-diagnostics">AI Diagnostics</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="pharmacy">Pharmacy</TabsTrigger>
          <TabsTrigger value="health-records">Records</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent AI Diagnoses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="mr-2 h-5 w-5 text-purple-600" />
                  Recent AI Diagnoses
                </CardTitle>
                <CardDescription>
                  Latest skin condition analyses with 97% accuracy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentDiagnoses.length > 0 ? (
                  recentDiagnoses.map((diagnosis: any) => (
                    <div key={diagnosis.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{diagnosis.diagnosis}</p>
                        <p className="text-xs text-gray-600">
                          {diagnosis.confidence}% confidence • {diagnosis.severity}
                        </p>
                      </div>
                      <Badge variant={diagnosis.severity === "urgent" ? "destructive" : "secondary"}>
                        {diagnosis.severity}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Brain className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600">No AI diagnoses yet</p>
                    <Button className="mt-4" size="sm">
                      <Camera className="mr-2 h-4 w-4" />
                      Start AI Scan
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Appointments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-blue-600" />
                  Upcoming Appointments
                </CardTitle>
                <CardDescription>
                  Your scheduled consultations including AR/VR sessions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((appointment: any) => (
                    <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {appointment.consultationType === "ar_vr" ? "AR/VR Consultation" : "Regular Consultation"}
                        </p>
                        <p className="text-xs text-gray-600">
                          {new Date(appointment.dateTime).toLocaleDateString()} • {appointment.duration} min
                        </p>
                      </div>
                      <Badge variant={appointment.consultationType === "ar_vr" ? "default" : "secondary"}>
                        {appointment.type}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600">No upcoming appointments</p>
                    <Button className="mt-4" size="sm">
                      <Phone className="mr-2 h-4 w-4" />
                      Book Appointment
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Pharmacy Orders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Pill className="mr-2 h-5 w-5 text-green-600" />
                  Recent Orders
                </CardTitle>
                <CardDescription>
                  Your medication orders from 2000+ pharmacy partners
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order: any) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">Order #{order.orderNumber}</p>
                        <p className="text-xs text-gray-600">
                          ₹{order.finalAmount} • {order.medications?.length || 0} items
                        </p>
                      </div>
                      <Badge variant={order.status === "delivered" ? "default" : "secondary"}>
                        {order.status}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Pill className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600">No recent orders</p>
                    <Button className="mt-4" size="sm">
                      <MapPin className="mr-2 h-4 w-4" />
                      Browse Pharmacy
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Health Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-indigo-600" />
                  Health Insights
                </CardTitle>
                <CardDescription>
                  AI-powered health analytics and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Overall Health Score</span>
                    <span className="text-sm text-green-600 font-semibold">87/100</span>
                  </div>
                  <Progress value={87} className="h-2" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Skin Health</span>
                    <span className="text-sm text-blue-600 font-semibold">92/100</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Treatment Compliance</span>
                    <span className="text-sm text-purple-600 font-semibold">78/100</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-start">
                    <Heart className="h-4 w-4 text-blue-600 mt-1 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Recommendation</p>
                      <p className="text-xs text-blue-700 mt-1">
                        Continue your current skincare routine. Schedule a follow-up AI scan in 2 weeks.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai-diagnostics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="mr-2 h-5 w-5 text-purple-600" />
                  AI Skin Diagnostics - 97% Accuracy
                </CardTitle>
                <CardDescription>
                  Advanced TensorFlow + OpenCV powered analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-12 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border-2 border-dashed border-purple-200">
                  <Camera className="mx-auto h-16 w-16 text-purple-600 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Start AI Skin Analysis</h3>
                  <p className="text-gray-600 mb-6">
                    Upload or capture a photo for instant AI-powered diagnosis
                  </p>
                  <div className="space-y-3">
                    <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600">
                      <Camera className="mr-2 h-5 w-5" />
                      Capture Photo
                    </Button>
                    <Button size="lg" variant="outline">
                      <FileText className="mr-2 h-5 w-5" />
                      Upload Image
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 mb-1">97%</div>
                    <div className="text-sm text-gray-600">Average Accuracy</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-1">0.5s</div>
                    <div className="text-sm text-gray-600">Processing Time</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Award className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-sm">97% Accuracy</p>
                    <p className="text-xs text-gray-600">Clinical grade precision</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Zap className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-sm">Real-time Analysis</p>
                    <p className="text-xs text-gray-600">Sub-second processing</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-sm">HIPAA Compliant</p>
                    <p className="text-xs text-gray-600">Secure & private</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-sm">Multi-language</p>
                    <p className="text-xs text-gray-600">15 Indian languages</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Management</CardTitle>
              <CardDescription>
                Schedule consultations including AR/VR sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Video className="mx-auto h-16 w-16 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Advanced Consultations</h3>
                <p className="text-gray-600 mb-6">
                  Book regular, AR/VR, or emergency consultations
                </p>
                <div className="space-y-3">
                  <Button size="lg">
                    <Calendar className="mr-2 h-5 w-5" />
                    Schedule Appointment
                  </Button>
                  <Button size="lg" variant="outline">
                    <Video className="mr-2 h-5 w-5" />
                    AR/VR Consultation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pharmacy">
          <Card>
            <CardHeader>
              <CardTitle>Pharmacy Marketplace</CardTitle>
              <CardDescription>
                2000+ verified pharmacy partners across India
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Pill className="mx-auto h-16 w-16 text-green-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Medication Delivery</h3>
                <p className="text-gray-600 mb-6">
                  Order medications with real-time tracking
                </p>
                <Button size="lg">
                  <MapPin className="mr-2 h-5 w-5" />
                  Browse Pharmacies
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health-records">
          <Card>
            <CardHeader>
              <CardTitle>Health Records (PHR/EMR)</CardTitle>
              <CardDescription>
                Comprehensive health data with blockchain verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="mx-auto h-16 w-16 text-indigo-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Digital Health Records</h3>
                <p className="text-gray-600 mb-6">
                  ABHA integrated with blockchain security
                </p>
                <Button size="lg">
                  <Activity className="mr-2 h-5 w-5" />
                  View Records
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}