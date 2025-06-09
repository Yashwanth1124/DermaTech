import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Video, 
  Headphones, 
  Calendar, 
  Users, 
  Settings,
  Camera,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  ScreenShare,
  MessageSquare,
  PenTool,
  Save,
  Clock,
  Star
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export default function Telemedicine() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [inCall, setInCall] = useState(false);
  const [callType, setCallType] = useState<'video' | 'arvr'>('video');
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [arvrMode, setArvrMode] = useState<'ar' | 'vr'>('ar');

  const { data: appointments = [] } = useQuery({
    queryKey: ['/api/appointments'],
  });

  const upcomingConsultations = appointments.filter((apt: any) => 
    (apt.type === 'video' || apt.type === 'arvr') && 
    new Date(apt.appointmentDate) > new Date()
  );

  const startCall = (type: 'video' | 'arvr') => {
    setCallType(type);
    setInCall(true);
    toast({
      title: "Consultation Started",
      description: `${type === 'arvr' ? 'AR/VR' : 'Video'} consultation is now active.`,
    });
  };

  const endCall = () => {
    setInCall(false);
    setVideoEnabled(true);
    setAudioEnabled(true);
    setScreenSharing(false);
    toast({
      title: "Consultation Ended",
      description: "The consultation has been ended successfully.",
    });
  };

  const toggleVideo = () => {
    setVideoEnabled(!videoEnabled);
    toast({
      title: videoEnabled ? "Camera Off" : "Camera On",
      description: `Camera has been ${videoEnabled ? 'disabled' : 'enabled'}.`,
    });
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    toast({
      title: audioEnabled ? "Microphone Off" : "Microphone On",
      description: `Microphone has been ${audioEnabled ? 'muted' : 'unmuted'}.`,
    });
  };

  const toggleScreenShare = () => {
    setScreenSharing(!screenSharing);
    toast({
      title: screenSharing ? "Screen Share Stopped" : "Screen Share Started",
      description: `Screen sharing ${screenSharing ? 'stopped' : 'started'}.`,
    });
  };

  // Mock consultation history
  const consultationHistory = [
    {
      id: 1,
      doctor: "Dr. Sarah Johnson",
      date: "2024-01-15",
      duration: "30 min",
      type: "video",
      rating: 5,
      notes: "Follow-up for acne treatment. Improvement noted."
    },
    {
      id: 2,
      doctor: "Dr. Michael Chen",
      date: "2024-01-10",
      duration: "45 min",
      type: "arvr",
      rating: 4,
      notes: "3D skin analysis for suspicious mole. Biopsy recommended."
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">AR/VR Consultations</h1>
          <p className="text-slate-600 mt-1">
            Immersive teleconsultations with 4K quality and real-time collaboration
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <Badge className="bg-purple-100 text-purple-800">
            <Headphones className="w-3 h-3 mr-1" />
            VR Ready
          </Badge>
          <Badge className="bg-blue-100 text-blue-800">
            4K Quality
          </Badge>
        </div>
      </div>

      {!inCall ? (
        <Tabs defaultValue="schedule" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="quick">Quick Consult</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Consultations</CardTitle>
                <CardDescription>Your scheduled video and AR/VR consultations</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingConsultations.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-500">No upcoming consultations</p>
                    <p className="text-sm text-slate-400 mt-2">Schedule your first telemedicine appointment</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingConsultations.map((consultation: any) => (
                      <div key={consultation.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            {consultation.type === 'arvr' ? (
                              <Headphones className="w-6 h-6 text-purple-600" />
                            ) : (
                              <Video className="w-6 h-6 text-blue-600" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-900">
                              {user?.role === 'patient' ? `Dr. ${consultation.doctorId}` : `Patient #${consultation.patientId}`}
                            </h4>
                            <div className="flex items-center text-sm text-slate-600 space-x-4">
                              <span>{new Date(consultation.appointmentDate).toLocaleDateString()}</span>
                              <span>{new Date(consultation.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              <Badge variant="secondary" className="text-xs">
                                {consultation.type === 'arvr' ? 'AR/VR' : 'Video'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            onClick={() => startCall(consultation.type)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Video className="w-4 h-4 mr-2" />
                            Join
                          </Button>
                          <Button variant="outline">
                            <Calendar className="w-4 h-4 mr-2" />
                            Reschedule
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quick Consult Tab */}
          <TabsContent value="quick" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Video Consultation */}
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Video className="w-5 h-5 mr-2 text-blue-600" />
                    Video Consultation
                  </CardTitle>
                  <CardDescription>
                    Traditional video call with screen sharing and annotations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">Features:</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• HD video quality</li>
                        <li>• Screen sharing</li>
                        <li>• Real-time annotations</li>
                        <li>• Recording capability</li>
                      </ul>
                    </div>
                    <Button 
                      onClick={() => startCall('video')} 
                      className="w-full"
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Start Video Call
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* AR/VR Consultation */}
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Headphones className="w-5 h-5 mr-2 text-purple-600" />
                    AR/VR Consultation
                  </CardTitle>
                  <CardDescription>
                    Immersive 3D consultation with spatial interaction
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-purple-50 rounded-lg p-4">
                      <h4 className="font-medium text-purple-900 mb-2">Features:</h4>
                      <ul className="text-sm text-purple-700 space-y-1">
                        <li>• 3D skin visualization</li>
                        <li>• Spatial annotations</li>
                        <li>• Virtual tools</li>
                        <li>• Immersive experience</li>
                      </ul>
                    </div>
                    <Select value={arvrMode} onValueChange={(value: 'ar' | 'vr') => setArvrMode(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ar">AR Mode (Smartphone)</SelectItem>
                        <SelectItem value="vr">VR Mode (Headset)</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      onClick={() => startCall('arvr')} 
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      <Headphones className="w-4 h-4 mr-2" />
                      Start AR/VR Session
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>System Requirements</CardTitle>
                <CardDescription>Ensure optimal consultation experience</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-slate-900 mb-3">Video Consultation</h4>
                    <ul className="text-sm text-slate-600 space-y-2">
                      <li>• Stable internet connection (5 Mbps+)</li>
                      <li>• Chrome, Firefox, or Safari browser</li>
                      <li>• Working camera and microphone</li>
                      <li>• Updated browser with WebRTC support</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 mb-3">AR/VR Consultation</h4>
                    <ul className="text-sm text-slate-600 space-y-2">
                      <li>• High-speed internet (10 Mbps+)</li>
                      <li>• WebXR compatible browser</li>
                      <li>• VR headset or AR-enabled smartphone</li>
                      <li>• Minimum 4GB RAM recommended</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            {consultationHistory.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-500">No consultation history</p>
                    <p className="text-sm text-slate-400 mt-2">Your past consultations will appear here</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {consultationHistory.map((session) => (
                  <Card key={session.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                            {session.type === 'arvr' ? (
                              <Headphones className="w-6 h-6 text-purple-600" />
                            ) : (
                              <Video className="w-6 h-6 text-blue-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-medium text-slate-900">{session.doctor}</h4>
                              <Badge variant="secondary" className="text-xs">
                                {session.type === 'arvr' ? 'AR/VR' : 'Video'}
                              </Badge>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i}
                                    className={`w-4 h-4 ${i < session.rating ? 'text-yellow-400 fill-current' : 'text-slate-300'}`}
                                  />
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center text-sm text-slate-600 space-x-4 mb-2">
                              <span>{new Date(session.date).toLocaleDateString()}</span>
                              <span>{session.duration}</span>
                            </div>
                            <p className="text-sm text-slate-600">{session.notes}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                          <Button size="sm" variant="outline">
                            Download Report
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        /* In-Call Interface */
        <Card className="h-[600px]">
          <CardContent className="p-0 h-full">
            <div className="relative h-full bg-slate-900 rounded-lg overflow-hidden">
              {/* Video Feed Area */}
              <div className="absolute inset-0 flex items-center justify-center">
                {callType === 'arvr' ? (
                  <div className="text-center text-white">
                    <Headphones className="w-24 h-24 mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-semibold mb-2">AR/VR Mode Active</h3>
                    <p className="text-slate-300">
                      {arvrMode === 'ar' ? 'AR visualization enabled' : 'VR environment loaded'}
                    </p>
                    {callType === 'arvr' && (
                      <div className="mt-4 p-4 bg-black/30 rounded-lg">
                        <p className="text-sm text-slate-300 mb-2">3D Controls:</p>
                        <div className="flex justify-center space-x-4 text-xs">
                          <span>Pinch: Zoom</span>
                          <span>Swipe: Rotate</span>
                          <span>Tap: Annotate</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-white">
                    <Video className="w-24 h-24 mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-semibold mb-2">Video Call Active</h3>
                    <p className="text-slate-300">Connected in HD quality</p>
                  </div>
                )}
              </div>

              {/* Self Video (Picture-in-Picture) */}
              <div className="absolute top-4 right-4 w-32 h-24 bg-slate-700 rounded-lg border-2 border-white/20">
                <div className="w-full h-full flex items-center justify-center">
                  {videoEnabled ? (
                    <Camera className="w-8 h-8 text-white/60" />
                  ) : (
                    <VideoOff className="w-8 h-8 text-red-400" />
                  )}
                </div>
              </div>

              {/* Call Info */}
              <div className="absolute top-4 left-4 text-white">
                <div className="bg-black/30 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm font-medium">Connected</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    {callType === 'arvr' ? 'AR/VR Session' : 'Video Call'} • 15:42
                  </p>
                </div>
              </div>

              {/* Annotation Tools (AR/VR Mode) */}
              {callType === 'arvr' && (
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <div className="bg-black/30 rounded-lg p-2 space-y-2">
                    <Button size="sm" variant="ghost" className="text-white">
                      <PenTool className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-white">
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-white">
                      <Save className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Call Controls */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                <div className="flex items-center space-x-4 bg-black/50 rounded-full p-4">
                  <Button
                    size="sm"
                    variant={audioEnabled ? "ghost" : "destructive"}
                    className={`rounded-full w-12 h-12 ${audioEnabled ? 'text-white hover:bg-white/20' : ''}`}
                    onClick={toggleAudio}
                  >
                    {audioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant={videoEnabled ? "ghost" : "destructive"}
                    className={`rounded-full w-12 h-12 ${videoEnabled ? 'text-white hover:bg-white/20' : ''}`}
                    onClick={toggleVideo}
                  >
                    {videoEnabled ? <Camera className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                  </Button>
                  
                  {callType === 'video' && (
                    <Button
                      size="sm"
                      variant={screenSharing ? "default" : "ghost"}
                      className={`rounded-full w-12 h-12 ${!screenSharing ? 'text-white hover:bg-white/20' : ''}`}
                      onClick={toggleScreenShare}
                    >
                      <ScreenShare className="w-5 h-5" />
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-full w-12 h-12 text-white hover:bg-white/20"
                  >
                    <MessageSquare className="w-5 h-5" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="destructive"
                    className="rounded-full w-12 h-12"
                    onClick={endCall}
                  >
                    <PhoneOff className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
