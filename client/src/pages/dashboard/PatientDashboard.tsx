import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  FileText, 
  Pill, 
  Brain, 
  Users, 
  Camera,
  Download,
  Eye,
  Plus
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

export default function PatientDashboard() {
  const { user } = useAuth();

  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: ['/api/appointments'],
  });

  const { data: healthRecords = [], isLoading: recordsLoading } = useQuery({
    queryKey: ['/api/health-records'],
  });

  const { data: pharmacyOrders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['/api/pharmacy-orders'],
  });

  const { data: aiDiagnoses = [], isLoading: diagnosesLoading } = useQuery({
    queryKey: ['/api/ai-diagnoses'],
  });

  const todayAppointments = appointments.filter((apt: any) => {
    const today = new Date();
    const aptDate = new Date(apt.appointmentDate);
    return aptDate.toDateString() === today.toDateString();
  });

  const recentRecords = healthRecords.slice(0, 3);
  const recentOrders = pharmacyOrders.slice(0, 2);

  // Mock family members data
  const familyMembers = [
    { id: 1, name: 'Amit Kumar', relation: 'Son, 12 years', initials: 'AK' },
    { id: 2, name: 'Priya Kumar', relation: 'Daughter, 8 years', initials: 'PK' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Welcome back, {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-blue-100">
              Take control of your health with our advanced dermatology platform
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
              <Calendar className="w-4 h-4 mr-2" />
              Link ABHA ID
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Vitals Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Health Vitals</CardTitle>
            <CardDescription>Track your skin health metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>UV Exposure</span>
                <span>Safe</span>
              </div>
              <Progress value={30} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Hydration</span>
                <span>Good</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            <Button className="w-full mt-4">
              <Camera className="w-4 h-4 mr-2" />
              Track Now
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
                <span>Total Scans:</span>
                <span className="font-medium">{aiDiagnoses.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Success Rate:</span>
                <span className="font-medium text-green-600">97.3%</span>
              </div>
            </div>
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              <Camera className="w-4 h-4 mr-2" />
              Analyze Skin
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
                todayAppointments.map((appointment: any) => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-800">Dr. Smith</p>
                      <p className="text-sm text-slate-500">
                        {new Date(appointment.appointmentDate).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Join
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Appointments
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Health Records & Pharmacy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Health Records */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Recent Health Records</CardTitle>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRecords.length === 0 ? (
                <p className="text-slate-500 text-center py-4">No records yet</p>
              ) : (
                recentRecords.map((record: any) => (
                  <div key={record.id} className="flex items-center space-x-4 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">{record.title}</p>
                      <p className="text-sm text-slate-500">
                        {new Date(record.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pharmacy Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Pharmacy Orders</CardTitle>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                2,000+ Partners
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-4">
              {recentOrders.length === 0 ? (
                <p className="text-slate-500 text-center py-4">No orders yet</p>
              ) : (
                recentOrders.map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-800">#{order.id}</p>
                      <p className="text-sm text-slate-500">{order.pharmacyName}</p>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={order.status === 'delivered' ? 'default' : 'secondary'}
                        className={order.status === 'delivered' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {order.status}
                      </Badge>
                      <p className="text-sm text-slate-500 mt-1">₹{order.totalAmount}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Button className="w-full bg-green-600 hover:bg-green-700">
              <Pill className="w-4 h-4 mr-2" />
              Browse Pharmacy
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Family Profiles */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Family Profiles</CardTitle>
            <Button variant="ghost" size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Add Member
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {familyMembers.map((member) => (
              <div key={member.id} className="flex items-center space-x-4 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 bg-cyan-600 text-white rounded-full flex items-center justify-center font-medium">
                  {member.initials}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-800">{member.name}</p>
                  <p className="text-sm text-slate-500">{member.relation}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
