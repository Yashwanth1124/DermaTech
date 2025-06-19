import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar,
  Users,
  Brain,
  Clock,
  CheckCircle,
  AlertTriangle,
  Activity,
  TrendingUp,
  FileText,
  Video,
  Star,
  Stethoscope,
  UserCheck,
  ClipboardList,
  BarChart3,
  Shield,
  Zap,
  DollarSign
} from "lucide-react";

export function TodaysScheduleCard({ appointments, totalToday }: { appointments: any[], totalToday: number }) {
  return (
    <Card className="bg-gradient-to-br from-blue-50 to-cyan-100">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Today's Schedule</CardTitle>
        <Calendar className="h-4 w-4 text-blue-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-blue-700">{totalToday} appointments</div>
        <p className="text-xs text-blue-600 mt-1">3 consultations in progress</p>
        <div className="mt-4 space-y-2">
          {appointments?.slice(0, 2).map((apt: any, index: number) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <span>{apt.time || '10:00 AM'} - {apt.patientName || 'Patient'}</span>
              <Badge variant="outline" className="text-xs">{apt.type || 'Consultation'}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function AIReviewQueueCard({ pendingDiagnoses }: { pendingDiagnoses: number }) {
  return (
    <Card className="bg-gradient-to-br from-purple-50 to-indigo-100">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">AI Review Queue</CardTitle>
        <Brain className="h-4 w-4 text-purple-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-purple-700">{pendingDiagnoses}</div>
        <p className="text-xs text-purple-600 mt-1">Pending your review</p>
        <Button size="sm" className="mt-3 bg-purple-600 hover:bg-purple-700">
          Review Now
        </Button>
      </CardContent>
    </Card>
  );
}

export function PatientQueueCard({ queuePatients }: { queuePatients: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Patient Queue
        </CardTitle>
        <CardDescription>Patients waiting for consultation</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {queuePatients?.map((patient: any, index: number) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-700">{patient.token || `T${index + 1}`}</span>
                </div>
                <div>
                  <p className="font-medium text-sm">{patient.name || 'Patient Name'}</p>
                  <p className="text-xs text-gray-500">{patient.condition || 'General Consultation'}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Video className="h-4 w-4" />
                </Button>
                <Button size="sm">
                  Call
                </Button>
              </div>
            </div>
          )) || (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No patients in queue</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function PerformanceMetricsCard({ metrics }: { metrics: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Performance Metrics
        </CardTitle>
        <CardDescription>Your clinical performance this week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Patient Satisfaction</span>
              <span className="font-medium">{metrics?.satisfaction || 4.8}/5</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <Progress value={(metrics?.satisfaction || 4.8) * 20} className="flex-1" />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>AI Accuracy Rate</span>
              <span className="font-medium">{metrics?.aiAccuracy || 97}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="h-4 w-4 text-green-500" />
              <Progress value={metrics?.aiAccuracy || 97} className="flex-1" />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Consultation Time</span>
              <span className="font-medium">{metrics?.avgTime || 24} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-blue-500" />
              <Progress value={100 - (metrics?.avgTime || 24)} className="flex-1" />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Success Rate</span>
              <span className="font-medium">{metrics?.successRate || 94}%</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <Progress value={metrics?.successRate || 94} className="flex-1" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function RevenueCard({ weeklyRevenue, monthlyGrowth }: { weeklyRevenue: number, monthlyGrowth: number }) {
  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-100">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Weekly Revenue</CardTitle>
        <DollarSign className="h-4 w-4 text-green-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-green-700">₹{weeklyRevenue?.toLocaleString() || '45,200'}</div>
        <div className="flex items-center text-xs text-green-600 mt-1">
          <TrendingUp className="h-3 w-3 mr-1" />
          +{monthlyGrowth || 12}% from last month
        </div>
      </CardContent>
    </Card>
  );
}

export function UrgentCasesCard({ urgentCases }: { urgentCases: any[] }) {
  return (
    <Card className="border-orange-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-700">
          <AlertTriangle className="h-5 w-5" />
          Urgent Cases
        </CardTitle>
        <CardDescription>Cases requiring immediate attention</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {urgentCases?.length > 0 ? urgentCases.map((case_: any, index: number) => (
            <div key={index} className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <div>
                  <p className="font-medium text-sm">{case_.patientName || 'Emergency Case'}</p>
                  <p className="text-xs text-gray-500">{case_.condition || 'Severe skin reaction'}</p>
                </div>
              </div>
              <Badge variant="destructive">Urgent</Badge>
            </div>
          )) : (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
              <p>No urgent cases</p>
              <p className="text-xs">All patients are stable</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function QuickActionsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Streamline your workflow</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="h-16 flex-col gap-2">
          <Video className="h-5 w-5" />
          <span className="text-xs">Start Telemedicine</span>
        </Button>
        <Button variant="outline" className="h-16 flex-col gap-2">
          <Brain className="h-5 w-5" />
          <span className="text-xs">Review AI Cases</span>
        </Button>
        <Button variant="outline" className="h-16 flex-col gap-2">
          <FileText className="h-5 w-5" />
          <span className="text-xs">Patient Records</span>
        </Button>
        <Button variant="outline" className="h-16 flex-col gap-2">
          <BarChart3 className="h-5 w-5" />
          <span className="text-xs">Analytics</span>
        </Button>
      </CardContent>
    </Card>
  );
}