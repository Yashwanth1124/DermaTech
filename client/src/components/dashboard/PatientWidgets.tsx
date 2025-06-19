import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar,
  Heart,
  Activity,
  Clock,
  Camera,
  FileText,
  Pill,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Star,
  Brain,
  Smartphone,
  Shield
} from "lucide-react";

export function HealthScoreCard({ healthScore, trend }: { healthScore: number, trend: string }) {
  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-100">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Skin Health Score</CardTitle>
        <Heart className="h-4 w-4 text-green-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-green-700">{healthScore}/100</div>
        <div className="flex items-center text-xs text-green-600 mt-1">
          <TrendingUp className="h-3 w-3 mr-1" />
          {trend}
        </div>
        <Progress value={healthScore} className="mt-3" />
      </CardContent>
    </Card>
  );
}

export function QuickActionsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
        <CardDescription>Start your health journey</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="h-20 flex-col gap-2">
          <Camera className="h-6 w-6" />
          <span className="text-xs">Skin Analysis</span>
        </Button>
        <Button variant="outline" className="h-20 flex-col gap-2">
          <Calendar className="h-6 w-6" />
          <span className="text-xs">Book Appointment</span>
        </Button>
        <Button variant="outline" className="h-20 flex-col gap-2">
          <FileText className="h-6 w-6" />
          <span className="text-xs">View Records</span>
        </Button>
        <Button variant="outline" className="h-20 flex-col gap-2">
          <Pill className="h-6 w-6" />
          <span className="text-xs">Medications</span>
        </Button>
      </CardContent>
    </Card>
  );
}

export function RecentDiagnosesCard({ diagnoses }: { diagnoses: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Recent AI Diagnoses
        </CardTitle>
        <CardDescription>Your latest skin analysis results</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {diagnoses?.slice(0, 3).map((diagnosis: any, index: number) => (
            <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  diagnosis.confidence > 90 ? 'bg-green-500' : 
                  diagnosis.confidence > 70 ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <div>
                  <p className="font-medium text-sm">{diagnosis.condition || 'Skin Analysis'}</p>
                  <p className="text-xs text-gray-500">{diagnosis.date || 'Recent'}</p>
                </div>
              </div>
              <Badge variant={diagnosis.confidence > 90 ? "default" : "secondary"}>
                {diagnosis.confidence || 95}% confidence
              </Badge>
            </div>
          )) || (
            <div className="text-center py-8 text-gray-500">
              <Brain className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No recent diagnoses</p>
              <Button variant="outline" size="sm" className="mt-2">
                <Camera className="h-4 w-4 mr-2" />
                Start Analysis
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function UpcomingAppointmentsCard({ appointments }: { appointments: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Upcoming Appointments
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {appointments?.slice(0, 3).map((appointment: any, index: number) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={appointment.doctorImage} />
                  <AvatarFallback>Dr</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">Dr. {appointment.doctorName || 'Sarah Johnson'}</p>
                  <p className="text-xs text-gray-500">{appointment.date || 'Tomorrow, 10:00 AM'}</p>
                </div>
              </div>
              <Badge variant="outline">{appointment.type || 'Consultation'}</Badge>
            </div>
          )) || (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No upcoming appointments</p>
              <Button variant="outline" size="sm" className="mt-2">
                Book Appointment
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function MedicationRemindersCard({ medications }: { medications: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pill className="h-5 w-5" />
          Medication Reminders
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {medications?.slice(0, 3).map((med: any, index: number) => (
            <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <div>
                  <p className="font-medium text-sm">{med.name || 'Tretinoin Cream'}</p>
                  <p className="text-xs text-gray-500">{med.time || '8:00 AM'} • {med.dosage || '0.025%'}</p>
                </div>
              </div>
              <Button size="sm" variant="outline">
                <CheckCircle className="h-4 w-4" />
              </Button>
            </div>
          )) || (
            <div className="text-center py-8 text-gray-500">
              <Pill className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No active medications</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function TreatmentProgressCard({ progress }: { progress: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Treatment Progress
        </CardTitle>
        <CardDescription>Your ongoing treatment plan</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Overall Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-700">14</div>
              <div className="text-xs text-green-600">Days completed</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-700">6</div>
              <div className="text-xs text-blue-600">Days remaining</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}