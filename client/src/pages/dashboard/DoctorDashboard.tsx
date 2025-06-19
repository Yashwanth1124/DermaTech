import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { 
  TodaysScheduleCard,
  AIReviewQueueCard,
  PatientQueueCard,
  PerformanceMetricsCard,
  RevenueCard,
  UrgentCasesCard,
  QuickActionsCard
} from "../../components/dashboard/DoctorWidgets";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Brain,
  Video,
  Star,
  Shield
} from "lucide-react";

export default function DoctorDashboard() {
  const { user } = useAuth();

  // Fetch doctor-specific dashboard data
  const { data: dashboardStats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    enabled: !!user,
  });

  const doctorData = {
    todayAppointments: (dashboardStats as any)?.todayAppointments || 8,
    pendingDiagnoses: (dashboardStats as any)?.pendingDiagnoses || 12,
    totalPatientsToday: (dashboardStats as any)?.totalPatientsToday || 24,
    avgConsultationTime: (dashboardStats as any)?.avgConsultationTime || "24 min",
    aiAccuracyRate: (dashboardStats as any)?.aiAccuracyRate || 97,
    weeklyRevenue: (dashboardStats as any)?.weeklyRevenue || 45200,
    patientSatisfaction: (dashboardStats as any)?.patientSatisfaction || 4.8,
    urgentCases: (dashboardStats as any)?.urgentCases || [],
    queuePatients: [
      { id: 1, name: 'Rajesh Kumar', condition: 'Acne Treatment', token: 'T1' },
      { id: 2, name: 'Priya Sharma', condition: 'Skin Screening', token: 'T2' },
      { id: 3, name: 'Amit Singh', condition: 'Follow-up', token: 'T3' },
    ],
    performanceMetrics: {
      satisfaction: 4.8,
      aiAccuracy: 97,
      avgTime: 24,
      successRate: 94
    }
  };

  const timeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-8">
      {/* Professional Header */}
      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={(user as any)?.profileImageUrl} />
              <AvatarFallback className="bg-emerald-600 text-white text-lg">
                Dr. {(user as any)?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{timeBasedGreeting()}, Dr. {(user as any)?.lastName}!</h1>
              <p className="text-gray-600 mt-1">{(user as any)?.specialization || "Dermatology"} • {doctorData.todayAppointments} appointments today</p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">{doctorData.patientSatisfaction}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">{doctorData.aiAccuracyRate}% AI accuracy</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700">
              <Brain className="h-4 w-4 mr-2" />
              Review AI Cases
            </Button>
            <Button variant="outline">
              <Video className="h-4 w-4 mr-2" />
              Start Consultation
            </Button>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-sm font-medium transition-all">
            Overview
          </TabsTrigger>
          <TabsTrigger value="patients" className="data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-sm font-medium transition-all">
            Patients
          </TabsTrigger>
          <TabsTrigger value="ai-review" className="data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-sm font-medium transition-all">
            AI Review
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-sm font-medium transition-all">
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <TodaysScheduleCard 
              appointments={doctorData.queuePatients} 
              totalToday={doctorData.todayAppointments} 
            />
            <AIReviewQueueCard pendingDiagnoses={doctorData.pendingDiagnoses} />
            <RevenueCard 
              weeklyRevenue={doctorData.weeklyRevenue} 
              monthlyGrowth={12} 
            />
            <QuickActionsCard />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PatientQueueCard queuePatients={doctorData.queuePatients} />
            <PerformanceMetricsCard metrics={doctorData.performanceMetrics} />
            <UrgentCasesCard urgentCases={doctorData.urgentCases} />
          </div>
        </TabsContent>

        <TabsContent value="patients" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PatientQueueCard queuePatients={doctorData.queuePatients} />
            <UrgentCasesCard urgentCases={doctorData.urgentCases} />
          </div>
        </TabsContent>

        <TabsContent value="ai-review" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AIReviewQueueCard pendingDiagnoses={doctorData.pendingDiagnoses} />
            <PerformanceMetricsCard metrics={doctorData.performanceMetrics} />
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PerformanceMetricsCard metrics={doctorData.performanceMetrics} />
            <RevenueCard 
              weeklyRevenue={doctorData.weeklyRevenue} 
              monthlyGrowth={12} 
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}