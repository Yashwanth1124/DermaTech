import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users,
  Activity,
  TrendingUp,
  AlertTriangle,
  Shield,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  Globe,
  Database,
  Zap,
  Settings,
  Server,
  UserCheck,
  Brain,
  Smartphone
} from "lucide-react";

export function SystemHealthCard({ systemHealth, uptime }: { systemHealth: number, uptime: number }) {
  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-100">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">System Health</CardTitle>
        <Server className="h-4 w-4 text-green-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-green-700">{systemHealth}%</div>
        <p className="text-xs text-green-600 mt-1">{uptime || 99.98}% uptime</p>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-xs text-green-600">All systems operational</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function UserMetricsCard({ totalUsers, activeUsers, growth }: { totalUsers: number, activeUsers: number, growth: number }) {
  return (
    <Card className="bg-gradient-to-br from-blue-50 to-cyan-100">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">User Metrics</CardTitle>
        <Users className="h-4 w-4 text-blue-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-blue-700">{totalUsers?.toLocaleString() || '15,420'}</div>
        <p className="text-xs text-blue-600 mt-1">{activeUsers?.toLocaleString() || '3,240'} active now</p>
        <div className="flex items-center text-xs text-green-600 mt-1">
          <TrendingUp className="h-3 w-3 mr-1" />
          +{growth || 8}% this month
        </div>
      </CardContent>
    </Card>
  );
}

export function RevenueOverviewCard({ dailyRevenue, monthlyGrowth }: { dailyRevenue: number, monthlyGrowth: number }) {
  return (
    <Card className="bg-gradient-to-br from-purple-50 to-indigo-100">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Revenue Overview</CardTitle>
        <DollarSign className="h-4 w-4 text-purple-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-purple-700">₹{dailyRevenue?.toLocaleString() || '1,25,000'}</div>
        <p className="text-xs text-purple-600 mt-1">Today's revenue</p>
        <div className="flex items-center text-xs text-green-600 mt-1">
          <TrendingUp className="h-3 w-3 mr-1" />
          +{monthlyGrowth || 15}% vs last month
        </div>
      </CardContent>
    </Card>
  );
}

export function AIProcessingCard({ processingLoad, efficiency }: { processingLoad: number, efficiency: number }) {
  return (
    <Card className="bg-gradient-to-br from-orange-50 to-yellow-100">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">AI Processing</CardTitle>
        <Brain className="h-4 w-4 text-orange-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-orange-700">{processingLoad || 74}%</div>
        <p className="text-xs text-orange-600 mt-1">Current load</p>
        <Progress value={processingLoad || 74} className="mt-2" />
        <p className="text-xs text-gray-500 mt-1">{efficiency || 97}% efficiency</p>
      </CardContent>
    </Card>
  );
}

export function SystemAlertsCard({ alerts }: { alerts: any[] }) {
  return (
    <Card className="border-red-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-700">
          <AlertTriangle className="h-5 w-5" />
          System Alerts
        </CardTitle>
        <CardDescription>Critical system notifications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts?.length > 0 ? alerts.map((alert: any, index: number) => (
            <div key={index} className="flex items-start justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className={`w-3 h-3 rounded-full mt-1 ${
                  alert.severity === 'critical' ? 'bg-red-500' : 
                  alert.severity === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                }`} />
                <div>
                  <p className="font-medium text-sm">{alert.title || 'System Alert'}</p>
                  <p className="text-xs text-gray-500">{alert.message || 'Alert message'}</p>
                  <p className="text-xs text-gray-400">{alert.time || '5 min ago'}</p>
                </div>
              </div>
              <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                {alert.severity || 'warning'}
              </Badge>
            </div>
          )) : (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
              <p>No active alerts</p>
              <p className="text-xs">System running smoothly</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function DepartmentPerformanceCard({ departments }: { departments: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Department Performance
        </CardTitle>
        <CardDescription>Utilization and satisfaction metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {departments?.map((dept: any, index: number) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{dept.name || 'Department'}</span>
                <span className="text-gray-500">{dept.utilization || 85}%</span>
              </div>
              <Progress value={dept.utilization || 85} className="h-2" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Satisfaction: {dept.satisfaction || 4.5}/5</span>
                <span>{dept.staff || 12} staff</span>
              </div>
            </div>
          )) || [
            { name: 'Dermatology', utilization: 92, satisfaction: 4.8, staff: 15 },
            { name: 'Telemedicine', utilization: 87, satisfaction: 4.6, staff: 8 },
            { name: 'AI Diagnostics', utilization: 95, satisfaction: 4.9, staff: 5 },
            { name: 'Pharmacy', utilization: 78, satisfaction: 4.5, staff: 12 }
          ].map((dept, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{dept.name}</span>
                <span className="text-gray-500">{dept.utilization}%</span>
              </div>
              <Progress value={dept.utilization} className="h-2" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Satisfaction: {dept.satisfaction}/5</span>
                <span>{dept.staff} staff</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function RecentActivitiesCard({ activities }: { activities: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activities
        </CardTitle>
        <CardDescription>System events and updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities?.map((activity: any, index: number) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activity.type === 'doctor' ? 'bg-blue-100' :
                activity.type === 'patient' ? 'bg-green-100' :
                activity.type === 'system' ? 'bg-purple-100' : 'bg-orange-100'
              }`}>
                {activity.type === 'doctor' ? <UserCheck className="h-4 w-4 text-blue-600" /> :
                 activity.type === 'patient' ? <Users className="h-4 w-4 text-green-600" /> :
                 activity.type === 'system' ? <Settings className="h-4 w-4 text-purple-600" /> :
                 <Smartphone className="h-4 w-4 text-orange-600" />}
              </div>
              <div className="flex-1">
                <p className="text-sm">{activity.message || 'System activity'}</p>
                <p className="text-xs text-gray-500">{activity.time || 'Recent'}</p>
              </div>
            </div>
          )) || [
            { type: 'doctor', message: 'Dr. Sarah Johnson joined the platform', time: '2 hours ago' },
            { type: 'patient', message: '150 new patient registrations today', time: '4 hours ago' },
            { type: 'system', message: 'AI model updated with 99.2% accuracy', time: '6 hours ago' },
            { type: 'pharmacy', message: 'New pharmacy partner: MedPlus Healthcare', time: '1 day ago' }
          ].map((activity, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activity.type === 'doctor' ? 'bg-blue-100' :
                activity.type === 'patient' ? 'bg-green-100' :
                activity.type === 'system' ? 'bg-purple-100' : 'bg-orange-100'
              }`}>
                {activity.type === 'doctor' ? <UserCheck className="h-4 w-4 text-blue-600" /> :
                 activity.type === 'patient' ? <Users className="h-4 w-4 text-green-600" /> :
                 activity.type === 'system' ? <Settings className="h-4 w-4 text-purple-600" /> :
                 <Smartphone className="h-4 w-4 text-orange-600" />}
              </div>
              <div className="flex-1">
                <p className="text-sm">{activity.message}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function BlockchainMetricsCard({ transactions, security }: { transactions: number, security: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Blockchain Security
        </CardTitle>
        <CardDescription>Decentralized health records</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-lg font-bold text-blue-700">{transactions?.toLocaleString() || '2,840'}</div>
            <div className="text-xs text-blue-600">Transactions</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-lg font-bold text-green-700">{security || 100}%</div>
            <div className="text-xs text-green-600">Security</div>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Network health</span>
            <span>Excellent</span>
          </div>
          <Progress value={98} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}

export function QuickActionsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Actions</CardTitle>
        <CardDescription>System management tools</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="h-16 flex-col gap-2">
          <Settings className="h-5 w-5" />
          <span className="text-xs">System Config</span>
        </Button>
        <Button variant="outline" className="h-16 flex-col gap-2">
          <Users className="h-5 w-5" />
          <span className="text-xs">User Management</span>
        </Button>
        <Button variant="outline" className="h-16 flex-col gap-2">
          <BarChart3 className="h-5 w-5" />
          <span className="text-xs">Analytics</span>
        </Button>
        <Button variant="outline" className="h-16 flex-col gap-2">
          <Database className="h-5 w-5" />
          <span className="text-xs">Backup</span>
        </Button>
      </CardContent>
    </Card>
  );
}