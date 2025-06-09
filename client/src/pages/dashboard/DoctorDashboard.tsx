import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  FileText, 
  Calendar, 
  Brain, 
  Stethoscope,
  BarChart3,
  Clock,
  TrendingUp,
  UserPlus
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

export default function DoctorDashboard() {
  const { user } = useAuth();

  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: ['/api/appointments'],
  });

  const { data: aiDiagnoses = [], isLoading: diagnosesLoading } = useQuery({
    queryKey: ['/api/ai-diagnoses'],
  });

  const todayAppointments = appointments.filter((apt: any) => {
    const today = new Date();
    const aptDate = new Date(apt.appointmentDate);
    return aptDate.toDateString() === today.toDateString();
  });

  // Mock queue data
  const queuePatients = [
    { id: 1, name: 'Rajesh Kumar', condition: 'Acne Treatment', token: 'T1' },
    { id: 2, name: 'Priya Sharma', condition: 'Skin Screening', token: 'T2' },
    { id: 3, name: 'Amit Singh', condition: 'Follow-up', token: 'T3' },
  ];

  // Mock analytics data
  const analyticsData = {
    satisfaction: 94.2,
    success: 89.7,
    todayScans: 24,
    successRate: 97.3,
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Welcome back, Dr. {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-blue-100">
              Ready to provide exceptional dermatological care today?
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
              <Stethoscope className="w-4 h-4 mr-2" />
              Start Consultation
            </Button>
          </div>
        </div>
      </div>

      {/* Dashboard Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Patient Queue Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Patient Queue</CardTitle>
              <Badge className="bg-blue-600">
                {queuePatients.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {queuePatients.map((patient) => (
                <div key={patient.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-cyan-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {patient.token}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{patient.name}</p>
                      <p className="text-sm text-slate-500">{patient.condition}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Call
                  </Button>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4">
              Manage Queue
            </Button>
          </CardContent>
        </Card>

        {/* AI Diagnostics Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">AI Diagnostics</CardTitle>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                97% Accuracy
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-purple-50 rounded-lg p-4 mb-4 text-center">
              <Brain className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm text-slate-600">Advanced skin analysis powered by AI</p>
            </div>
            <div className="space-y-2 text-sm text-slate-600 mb-4">
              <div className="flex justify-between">
                <span>Today's Scans:</span>
                <span className="font-medium">{analyticsData.todayScans}</span>
              </div>
              <div className="flex justify-between">
                <span>Success Rate:</span>
                <span className="font-medium text-green-600">{analyticsData.successRate}%</span>
              </div>
            </div>
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              <Brain className="w-4 h-4 mr-2" />
              Review AI Results
            </Button>
          </CardContent>
        </Card>

        {/* Today's Appointments */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Today's Appointments</CardTitle>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {todayAppointments.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayAppointments.length === 0 ? (
                <p className="text-slate-500 text-center py-4">No appointments today</p>
              ) : (
                todayAppointments.slice(0, 3).map((appointment: any) => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-800">Patient #{appointment.patientId}</p>
                      <p className="text-sm text-slate-500">
                        {new Date(appointment.appointmentDate).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Start
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600">
                        Reschedule
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Button variant="outline" className="w-full mt-4">
              <Calendar className="w-4 h-4 mr-2" />
              View All Appointments
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Analytics & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Analytics Dashboard */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Performance Analytics</CardTitle>
              <Badge variant="secondary" className="bg-cyan-100 text-cyan-800">
                Live Data
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Patient Satisfaction</span>
                  <span className="text-lg font-bold text-blue-600">{analyticsData.satisfaction}%</span>
                </div>
                <Progress value={analyticsData.satisfaction} className="h-2" />
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Treatment Success</span>
                  <span className="text-lg font-bold text-green-600">{analyticsData.success}%</span>
                </div>
                <Progress value={analyticsData.success} className="h-2" />
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">
              <BarChart3 className="w-4 h-4 mr-2" />
              View Detailed Analytics
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-800">Prescription Created</p>
                  <p className="text-sm text-slate-500">For Rajesh Kumar - 2:30 PM</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-800">AI Diagnosis Verified</p>
                  <p className="text-sm text-slate-500">Melanoma case - 1:45 PM</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 bg-purple-50 rounded-lg">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-800">New Patient Added</p>
                  <p className="text-sm text-slate-500">Priya Sharma - 12:15 PM</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-16 flex-col">
              <FileText className="w-6 h-6 mb-2" />
              Create Prescription
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <Users className="w-6 h-6 mb-2" />
              Add Patient
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <Calendar className="w-6 h-6 mb-2" />
              Schedule Appointment
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <BarChart3 className="w-6 h-6 mb-2" />
              View Reports
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
