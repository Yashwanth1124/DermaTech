import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  SystemHealthCard,
  UserMetricsCard,
  RevenueOverviewCard,
  AIProcessingCard,
  SystemAlertsCard,
  DepartmentPerformanceCard,
  RecentActivitiesCard,
  BlockchainMetricsCard,
  QuickActionsCard
} from "../../components/dashboard/AdminWidgets";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Settings,
  BarChart3,
  Server,
  Shield
} from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();
  
  // Fetch admin-specific dashboard data
  const { data: dashboardStats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    enabled: !!user,
  });

  const adminData = {
    totalUsers: (dashboardStats as any)?.totalUsers || 15420,
    activeUsers: (dashboardStats as any)?.activeUsers || 3240,
    totalDoctors: (dashboardStats as any)?.totalDoctors || 420,
    systemHealth: (dashboardStats as any)?.systemHealth || 98,
    dailyRevenue: (dashboardStats as any)?.dailyRevenue || 125000,
    aiProcessingLoad: (dashboardStats as any)?.aiProcessingLoad || 74,
    criticalAlerts: (dashboardStats as any)?.criticalAlerts || [],
    blockchainTransactions: (dashboardStats as any)?.blockchainTransactions || 2840,
    departments: [
      { name: 'Dermatology', utilization: 92, satisfaction: 4.8, staff: 15 },
      { name: 'Telemedicine', utilization: 87, satisfaction: 4.6, staff: 8 },
      { name: 'AI Diagnostics', utilization: 95, satisfaction: 4.9, staff: 5 },
      { name: 'Pharmacy', utilization: 78, satisfaction: 4.5, staff: 12 }
    ],
    recentActivities: [
      { type: 'doctor', message: 'Dr. Sarah Johnson joined the platform', time: '2 hours ago' },
      { type: 'patient', message: '150 new patient registrations today', time: '4 hours ago' },
      { type: 'system', message: 'AI model updated with 99.2% accuracy', time: '6 hours ago' },
      { type: 'pharmacy', message: 'New pharmacy partner: MedPlus Healthcare', time: '1 day ago' }
    ]
  };

  return (
    <div className="space-y-8">
      {/* Executive Header */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={(user as any)?.profileImageUrl} />
              <AvatarFallback className="bg-purple-600 text-white text-lg">
                {(user as any)?.firstName?.[0]}{(user as any)?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">System Health: <span className="font-semibold text-green-600">{adminData.systemHealth}%</span> • {adminData.activeUsers} active users</p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <Server className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">All systems operational</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-600">{adminData.blockchainTransactions} blockchain txns</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <Settings className="h-4 w-4 mr-2" />
              System Console
            </Button>
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <SystemHealthCard 
              systemHealth={adminData.systemHealth} 
              uptime={99.98} 
            />
            <UserMetricsCard 
              totalUsers={adminData.totalUsers}
              activeUsers={adminData.activeUsers}
              growth={8}
            />
            <RevenueOverviewCard 
              dailyRevenue={adminData.dailyRevenue}
              monthlyGrowth={15}
            />
            <AIProcessingCard 
              processingLoad={adminData.aiProcessingLoad}
              efficiency={97}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SystemAlertsCard alerts={adminData.criticalAlerts} />
            <DepartmentPerformanceCard departments={adminData.departments} />
            <RecentActivitiesCard activities={adminData.recentActivities} />
            <BlockchainMetricsCard 
              transactions={adminData.blockchainTransactions}
              security={100}
            />
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <UserMetricsCard 
              totalUsers={adminData.totalUsers}
              activeUsers={adminData.activeUsers}
              growth={8}
            />
            <RecentActivitiesCard activities={adminData.recentActivities} />
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SystemHealthCard 
              systemHealth={adminData.systemHealth} 
              uptime={99.98} 
            />
            <AIProcessingCard 
              processingLoad={adminData.aiProcessingLoad}
              efficiency={97}
            />
            <SystemAlertsCard alerts={adminData.criticalAlerts} />
            <QuickActionsCard />
          </div>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          <DepartmentPerformanceCard departments={adminData.departments} />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BlockchainMetricsCard 
              transactions={adminData.blockchainTransactions}
              security={100}
            />
            <SystemAlertsCard alerts={adminData.criticalAlerts} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}