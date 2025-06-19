import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  HealthScoreCard,
  QuickActionsCard,
  RecentDiagnosesCard,
  UpcomingAppointmentsCard,
  MedicationRemindersCard,
  TreatmentProgressCard
} from "@/components/dashboard/PatientWidgets";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Camera,
  Calendar,
  TrendingUp
} from "lucide-react";

export default function PatientDashboard() {
  const { user } = useAuth();
  
  // Fetch patient-specific dashboard data
  const { data: dashboardStats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    enabled: !!user,
  });

  const patientData = {
    recentDiagnoses: (dashboardStats as any)?.recentDiagnoses || [],
    upcomingAppointments: (dashboardStats as any)?.upcomingAppointments || [],
    healthScore: (dashboardStats as any)?.healthScore || 85,
    treatmentProgress: (dashboardStats as any)?.treatmentProgress || 72,
    medicationReminders: (dashboardStats as any)?.medicationReminders || [],
    skinHealthTrend: (dashboardStats as any)?.skinHealthTrend || "improving"
  };

  return (
    <div className="space-y-8">
      {/* Personalized Welcome Header */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={(user as any)?.profileImageUrl} />
              <AvatarFallback className="bg-blue-600 text-white text-lg">
                {(user as any)?.firstName?.[0]}{(user as any)?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {(user as any)?.firstName}!</h1>
              <p className="text-gray-600 mt-1">Your skin health score: <span className="font-semibold text-green-600">{patientData.healthScore}/100</span></p>
              <div className="flex items-center gap-2 mt-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600 capitalize">{patientData.skinHealthTrend}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600">
              <Camera className="h-4 w-4 mr-2" />
              AI Skin Analysis
            </Button>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Book Appointment
            </Button>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="health">Health Tracking</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <HealthScoreCard 
              healthScore={patientData.healthScore} 
              trend={patientData.skinHealthTrend} 
            />
            <TreatmentProgressCard progress={patientData.treatmentProgress} />
            <QuickActionsCard />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentDiagnosesCard diagnoses={patientData.recentDiagnoses} />
            <UpcomingAppointmentsCard appointments={patientData.upcomingAppointments} />
            <MedicationRemindersCard medications={patientData.medicationReminders} />
          </div>
        </TabsContent>

        <TabsContent value="health" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <HealthScoreCard 
              healthScore={patientData.healthScore} 
              trend={patientData.skinHealthTrend} 
            />
            <TreatmentProgressCard progress={patientData.treatmentProgress} />
            <RecentDiagnosesCard diagnoses={patientData.recentDiagnoses} />
          </div>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-6">
          <UpcomingAppointmentsCard appointments={patientData.upcomingAppointments} />
        </TabsContent>

        <TabsContent value="medications" className="space-y-6">
          <MedicationRemindersCard medications={patientData.medicationReminders} />
        </TabsContent>
      </Tabs>
    </div>
  );
}