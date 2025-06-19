import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  User, 
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function Appointments() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState<boolean>(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [appointmentNotes, setAppointmentNotes] = useState<string>('');
  const [doctorFilter, setDoctorFilter] = useState<string>('');
  const [suggestedTimes, setSuggestedTimes] = useState<Date[]>([]);
  const [urgency, setUrgency] = useState<string>('normal');

  const { data: appointments = [], isLoading } = useQuery<any[]>({
    queryKey: ['/api/appointments'],
  });

  const { data: doctors = [] } = useQuery({
    queryKey: ['doctors', doctorFilter],
    queryFn: () => apiRequest(`/api/doctors?search=${doctorFilter}`),
  });

  const createAppointmentMutation = useMutation({
    mutationFn: async (appointmentData: any) => {
      return apiRequest('/api/appointments', {
        method: 'POST',
        body: appointmentData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
      toast({
        title: "Success",
        description: "Appointment scheduled successfully.",
      });
      setIsScheduleModalOpen(false);
      setSelectedDoctor(null);
      setSelectedTime(null);
      setAppointmentNotes('');
    },
  });

  const updateAppointmentMutation = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      return apiRequest(`/api/appointments/${id}`, {
        method: 'PATCH',
        body: data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
      toast({
        title: "Success",
        description: "Appointment updated successfully.",
      });
    },
  });

  const fetchSuggestedTimes = async () => {
    if (!selectedDoctor) return;
    try {
      const response = await apiRequest(`/api/appointments/suggestions?preferences=${JSON.stringify({ doctorId: selectedDoctor.id })}&urgency=${urgency}`);
      setSuggestedTimes(response);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch suggested times.",
        variant: "destructive",
      });
    }
  };

  const handleScheduleAppointment = () => {
    if (!selectedDoctor || !selectedTime) {
      toast({
        title: "Error",
        description: "Please select a doctor and time.",
        variant: "destructive",
      });
      return;
    }
    createAppointmentMutation.mutate({
      doctorId: selectedDoctor.id,
      appointmentDate: selectedTime.toISOString(),
      notes: appointmentNotes,
      type: 'video',
    });
  };

  const filteredAppointments = appointments.filter((apt: any) => {
    const matchesSearch = apt.notes?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         apt.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const upcomingAppointments = filteredAppointments.filter((apt: any) => 
    new Date(apt.appointmentDate) > new Date()
  );

  const pastAppointments = filteredAppointments.filter((apt: any) => 
    new Date(apt.appointmentDate) <= new Date()
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'arvr': return <Video className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Appointments</h1>
          <p className="text-slate-600 mt-1">Manage your healthcare appointments</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button onClick={() => setIsScheduleModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Schedule Appointment
          </Button>
        </div>
      </div>

      {/* Schedule Appointment Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Schedule New Appointment</h2>
            <div className="space-y-4">
              <div>
                <Label>Search Doctor</Label>
                <Input
                  placeholder="Search by name or specialty"
                  value={doctorFilter}
                  onChange={(e) => setDoctorFilter(e.target.value)}
                />
                <div className="max-h-40 overflow-y-auto border rounded mt-1">
                  {doctors.length === 0 ? (
                    <p className="p-2 text-sm text-gray-500">No doctors found</p>
                  ) : (
                    doctors.map((doc: any) => (
                      <div
                        key={doc.id}
                        className={`p-2 cursor-pointer hover:bg-gray-100 ${selectedDoctor?.id === doc.id ? 'bg-blue-100' : ''}`}
                        onClick={() => {
                          setSelectedDoctor(doc);
                          setSuggestedTimes([]);
                          setSelectedTime(null);
                        }}
                      >
                        <p className="font-semibold">{doc.name}</p>
                        <p className="text-sm text-gray-600">{doc.qualifications}</p>
                        <p className="text-sm text-gray-600">{doc.specialties.join(', ')}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {selectedDoctor && (
                <div>
                  <Label>Urgency</Label>
                  <Select value={urgency} onValueChange={setUrgency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="mt-2" onClick={fetchSuggestedTimes}>
                    Fetch Suggested Times
                  </Button>
                </div>
              )}

              {suggestedTimes.length > 0 && (
                <div>
                  <Label>Select Time</Label>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    {suggestedTimes.map((time) => (
                      <Button
                        key={time.toISOString()}
                        variant={selectedTime?.toISOString() === time.toISOString() ? 'default' : 'outline'}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time.toLocaleString()}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Label>Notes</Label>
                <Input
                  value={appointmentNotes}
                  onChange={(e) => setAppointmentNotes(e.target.value)}
                  placeholder="Additional notes"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsScheduleModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleScheduleAppointment}>
                  Schedule
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search appointments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Appointments Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Calendar</CardTitle>
            <CardDescription>Select a date to view appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Appointments List */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="upcoming" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upcoming">
                Upcoming ({upcomingAppointments.length})
              </TabsTrigger>
              <TabsTrigger value="past">
                Past ({pastAppointments.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
              {upcomingAppointments.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <CalendarIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-500">No upcoming appointments</p>
                      <Button className="mt-4" onClick={() => setIsScheduleModalOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Schedule your first appointment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                upcomingAppointments.map((appointment: any) => (
                  <Card key={appointment.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            {getTypeIcon(appointment.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold text-slate-900">
                                {user?.role === 'patient' ? `Dr. ${appointment.doctorId}` : `Patient #${appointment.patientId}`}
                              </h3>
                              <Badge className={getStatusColor(appointment.status)}>
                                {appointment.status}
                              </Badge>
                            </div>
                            <div className="flex items-center text-sm text-slate-600 space-x-4">
                              <span className="flex items-center">
                                <CalendarIcon className="w-4 h-4 mr-1" />
                                {new Date(appointment.appointmentDate).toLocaleDateString()}
                              </span>
                              <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {new Date(appointment.appointmentDate).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            {appointment.notes && (
                              <p className="text-sm text-slate-600 mt-2">{appointment.notes}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            {appointment.type === 'video' || appointment.type === 'arvr' ? 'Join' : 'Start'}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateAppointmentMutation.mutate({
                              id: appointment.id,
                              status: 'cancelled'
                            })}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
              {pastAppointments.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <CalendarIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-500">No past appointments</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                pastAppointments.map((appointment: any) => (
                  <Card key={appointment.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            {getTypeIcon(appointment.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold text-slate-900">
                                {user?.role === 'patient' ? `Dr. ${appointment.doctorId}` : `Patient #${appointment.patientId}`}
                              </h3>
                              <Badge className={getStatusColor(appointment.status)}>
                                {appointment.status}
                              </Badge>
                            </div>
                            <div className="flex items-center text-sm text-slate-600 space-x-4">
                              <span className="flex items-center">
                                <CalendarIcon className="w-4 h-4 mr-1" />
                                {new Date(appointment.appointmentDate).toLocaleDateString()}
                              </span>
                              <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {new Date(appointment.appointmentDate).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            {appointment.notes && (
                              <p className="text-sm text-slate-600 mt-2">{appointment.notes}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            View
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateAppointmentMutation.mutate({
                              id: appointment.id,
                              status: 'cancelled'
                            })}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
