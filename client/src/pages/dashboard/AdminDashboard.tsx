import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Building, 
  Activity, 
  TrendingUp, 
  Calendar, 
  FileText,
  Stethoscope,
  Pill,
  BarChart3,
  Settings
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

export default function AdminDashboard() {
  const { user } = useAuth();

  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: ['/api/appointments'],
  });

  // Mock hospital statistics
  const hospitalStats = {
    totalPatients: 15420,
    activeDoctors: 45,
    todayAppointments: 234,
    pendingApprovals: 12,
    systemUptime: 99.98,
    avgWaitTime: 12, // minutes
    patientSatisfaction: 4.7, // out of 5
    monthlyRevenue: 2845000, // in INR
  };

  const recentActivities = [
    { id: 1, type: 'doctor', message: 'Dr. Sarah Johnson joined the platform', time: '2 hours ago' },
    { id: 2, type: 'patient', message: '150 new patient registrations today', time: '4 hours ago' },
    { id: 3, type: 'system', message: 'AI model updated with 99.2% accuracy', time: '6 hours ago' },
    { id: 4, type: 'pharmacy', message: 'New pharmacy partner: MedPlus Healthcare', time: '1 day ago' },
  ];

  const departmentPerformance = [
    { name: 'Dermatology', utilization: 92, satisfaction: 4.8 },
    { name: 'Telemedicine', utilization: 87, satisfaction: 4.6 },
    { name: 'AI Diagnostics', utilization: 95, satisfaction: 4.9 },
    { name: 'Pharmacy', utilization: 78, satisfaction: 4.5 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Hospital Administration Dashboard
            </h2>
            <p className="text-blue-100">
              Manage your healthcare facility with advanced analytics and insights
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
              <Settings className="w-4 h-4 mr-2" />
              System Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hospitalStats.totalPatients.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1 text-green-600" />
              +12.3% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Doctors</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hospitalStats.activeDoctors}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1 text-green-600" />
              +3 new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hospitalStats.todayAppointments}</div>
            <p className="text-xs text-muted-foreground">
              Avg wait time: {hospitalStats.avgWaitTime} min
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hospitalStats.systemUptime}%</div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Department Performance & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Department Performance</CardTitle>
            <CardDescription>Utilization and satisfaction metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentPerformance.map((dept) => (
                <div key={dept.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{dept.name}</span>
                    <span className="text-slate-600">{dept.utilization}% • ⭐ {dept.satisfaction}</span>
                  </div>
                  <Progress value={dept.utilization} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activities</CardTitle>
            <CardDescription>Latest system events and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg bg-slate-50">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    {activity.type === 'doctor' && <Stethoscope className="w-4 h-4 text-blue-600" />}
                    {activity.type === 'patient' && <Users className="w-4 h-4 text-green-600" />}
                    {activity.type === 'system' && <Activity className="w-4 h-4 text-purple-600" />}
                    {activity.type === 'pharmacy' && <Pill className="w-4 h-4 text-orange-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">{activity.message}</p>
                    <p className="text-xs text-slate-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Overview & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Financial Overview</CardTitle>
            <CardDescription>Monthly revenue and billing statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm text-slate-600">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-green-700">
                    ₹{(hospitalStats.monthlyRevenue / 100000).toFixed(1)}L
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-600">Pending Bills</p>
                  <p className="text-lg font-semibold">₹2.3L</p>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-600">Collection Rate</p>
                  <p className="text-lg font-semibold">94.2%</p>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">
              <BarChart3 className="w-4 h-4 mr-2" />
              View Financial Reports
            </Button>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">System Status</CardTitle>
            <CardDescription>Real-time system health monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-800">EMR System</p>
                  <p className="text-sm text-slate-600">All services operational</p>
                </div>
                <Badge className="bg-green-600">Online</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-800">AI Diagnostics</p>
                  <p className="text-sm text-slate-600">99.2% accuracy rate</p>
                </div>
                <Badge className="bg-green-600">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-800">Pharmacy Network</p>
                  <p className="text-sm text-slate-600">2,000+ partners connected</p>
                </div>
                <Badge className="bg-blue-600">Connected</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-800">Backup Systems</p>
                  <p className="text-sm text-slate-600">Scheduled maintenance</p>
                </div>
                <Badge variant="secondary" className="bg-yellow-200 text-yellow-800">Maintenance</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Administrative Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-16 flex-col">
              <Users className="w-6 h-6 mb-2" />
              Manage Users
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <Building className="w-6 h-6 mb-2" />
              Hospital Settings
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <FileText className="w-6 h-6 mb-2" />
              Generate Reports
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <Settings className="w-6 h-6 mb-2" />
              System Config
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
