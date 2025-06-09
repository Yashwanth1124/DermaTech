import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Video, 
  Headset, 
  Calendar, 
  Clock, 
  Users, 
  Mic,
  MicOff,
  Camera,
  CameraOff,
  PhoneCall,
  PhoneOff,
  Settings,
  Monitor,
  Smartphone,
  Headphones,
  Eye,
  Hand,
  Layers,
  Globe,
  Wifi,
  Signal,
  Play,
  Square,
  RotateCcw,
  Maximize,
  Volume2,
  VolumeX
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export default function Telemedicine() {
  const { user } = useAuth();
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [isInSession, setIsInSession] = useState(false);
  const [sessionControls, setSessionControls] = useState({
    video: true,
    audio: true,
    vr: false,
    ar: false
  });
  const [deviceCapabilities, setDeviceCapabilities] = useState({
    webxr: false,
    vr: false,
    ar: false,
    camera: false,
    microphone: false
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const vrCanvasRef = useRef<HTMLCanvasElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Check device capabilities
  useEffect(() => {
    const checkCapabilities = async () => {
      try {
        // Check WebXR support
        const webxrSupported = 'xr' in navigator;
        let vrSupported = false;
        let arSupported = false;

        if (webxrSupported) {
          try {
            const vrSession = await (navigator as any).xr?.isSessionSupported('immersive-vr');
            const arSession = await (navigator as any).xr?.isSessionSupported('immersive-ar');
            vrSupported = vrSession;
            arSupported = arSession;
          } catch (error) {
            console.log('WebXR session check failed:', error);
          }
        }

        // Check media devices
        let cameraSupported = false;
        let microphoneSupported = false;

        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          cameraSupported = devices.some(device => device.kind === 'videoinput');
          microphoneSupported = devices.some(device => device.kind === 'audioinput');
        } catch (error) {
          console.log('Media device check failed:', error);
        }

        setDeviceCapabilities({
          webxr: webxrSupported,
          vr: vrSupported,
          ar: arSupported,
          camera: cameraSupported,
          microphone: microphoneSupported
        });
      } catch (error) {
        console.error('Failed to check device capabilities:', error);
      }
    };

    checkCapabilities();
  }, []);

  // Fetch AR/VR sessions
  const { data: sessions, isLoading } = useQuery({
    queryKey: ["ar-vr-sessions"],
    queryFn: () => apiRequest("/api/ar-vr-sessions"),
  });

  // Fetch upcoming appointments
  const { data: appointments } = useQuery({
    queryKey: ["appointments"],
    queryFn: () => apiRequest("/api/appointments"),
  });

  // Create AR/VR session mutation
  const createSessionMutation = useMutation({
    mutationFn: async (sessionData: any) => {
      return apiRequest("/api/ar-vr-sessions", {
        method: "POST",
        body: JSON.stringify(sessionData),
      });
    },
    onSuccess: (data) => {
      setSelectedSession(data);
      queryClient.invalidateQueries({ queryKey: ["ar-vr-sessions"] });
      toast({
        title: "AR/VR Session Created",
        description: "Your immersive consultation session is ready",
      });
    },
    onError: () => {
      toast({
        title: "Session Creation Failed",
        description: "Failed to create AR/VR session. Please try again.",
        variant: "destructive",
      });
    },
  });

  const startVRSession = async () => {
    try {
      if (!deviceCapabilities.vr) {
        toast({
          title: "VR Not Supported",
          description: "Your device doesn't support VR capabilities",
          variant: "destructive",
        });
        return;
      }

      // Initialize VR session
      const vrSession = await (navigator as any).xr.requestSession('immersive-vr', {
        requiredFeatures: ['local-floor'],
        optionalFeatures: ['hand-tracking', 'eye-tracking']
      });

      setIsInSession(true);
      setSessionControls(prev => ({ ...prev, vr: true }));
      
      toast({
        title: "VR Session Started",
        description: "Immersive VR consultation is now active",
      });
    } catch (error) {
      console.error('VR session failed:', error);
      toast({
        title: "VR Session Failed",
        description: "Could not start VR session. Check your headset connection.",
        variant: "destructive",
      });
    }
  };

  const startARSession = async () => {
    try {
      if (!deviceCapabilities.ar) {
        toast({
          title: "AR Not Supported",
          description: "Your device doesn't support AR capabilities",
          variant: "destructive",
        });
        return;
      }

      // Initialize AR session
      const arSession = await (navigator as any).xr.requestSession('immersive-ar', {
        requiredFeatures: ['local-floor'],
        optionalFeatures: ['hit-test', 'light-estimation']
      });

      setIsInSession(true);
      setSessionControls(prev => ({ ...prev, ar: true }));
      
      toast({
        title: "AR Session Started",
        description: "Augmented reality consultation is now active",
      });
    } catch (error) {
      console.error('AR session failed:', error);
      toast({
        title: "AR Session Failed",
        description: "Could not start AR session. Check camera permissions.",
        variant: "destructive",
      });
    }
  };

  const startVideoCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: sessionControls.video,
        audio: sessionControls.audio
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setIsInSession(true);
      
      toast({
        title: "Video Call Started",
        description: "Traditional video consultation is now active",
      });
    } catch (error) {
      console.error('Video call failed:', error);
      toast({
        title: "Video Call Failed",
        description: "Could not access camera/microphone. Check permissions.",
        variant: "destructive",
      });
    }
  };

  const endSession = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }

    setIsInSession(false);
    setSessionControls({
      video: true,
      audio: true,
      vr: false,
      ar: false
    });

    toast({
      title: "Session Ended",
      description: "Consultation session has been terminated",
    });
  };

  const toggleControl = (control: keyof typeof sessionControls) => {
    setSessionControls(prev => ({
      ...prev,
      [control]: !prev[control]
    }));
  };

  const createNewSession = async (type: string, appointmentId?: number) => {
    const sessionData = {
      appointmentId,
      patientId: user?.id,
      doctorId: "doctor_123", // Would be from appointment data
      sessionType: type,
      status: "scheduled"
    };

    await createSessionMutation.mutateAsync(sessionData);
  };

  const upcomingArVrAppointments = appointments?.filter((apt: any) => 
    apt.consultationType === "ar_vr" || apt.type === "ar_vr"
  ) || [];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AR/VR Telemedicine</h1>
          <p className="text-gray-600 mt-1">
            Immersive healthcare consultations with A-Frame + WebXR technology
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant={deviceCapabilities.webxr ? "default" : "secondary"}>
            <Headset className="mr-1 h-4 w-4" />
            WebXR {deviceCapabilities.webxr ? "Ready" : "Not Available"}
          </Badge>
          <Button
            onClick={() => createNewSession("vr")}
            disabled={!deviceCapabilities.vr || createSessionMutation.isPending}
            className="bg-gradient-to-r from-purple-600 to-blue-600"
          >
            <Headset className="mr-2 h-4 w-4" />
            Start VR Session
          </Button>
        </div>
      </div>

      <Tabs defaultValue="consultation" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="consultation">Active Session</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="history">Session History</TabsTrigger>
          <TabsTrigger value="settings">Device Setup</TabsTrigger>
        </TabsList>

        <TabsContent value="consultation" className="space-y-6">
          {isInSession ? (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Main Video/VR Display */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      {sessionControls.vr && <Headset className="mr-2 h-5 w-5 text-purple-600" />}
                      {sessionControls.ar && <Eye className="mr-2 h-5 w-5 text-blue-600" />}
                      {!sessionControls.vr && !sessionControls.ar && <Video className="mr-2 h-5 w-5 text-green-600" />}
                      {sessionControls.vr ? "VR Consultation" : sessionControls.ar ? "AR Consultation" : "Video Call"}
                    </div>
                    <Badge variant="default" className="bg-red-600">
                      <Signal className="mr-1 h-3 w-3" />
                      LIVE
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: "16/9" }}>
                    {sessionControls.vr ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <canvas
                          ref={vrCanvasRef}
                          className="w-full h-full"
                          style={{ background: "radial-gradient(circle, #1a1a2e, #16213e)" }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center text-white">
                            <Headset className="mx-auto h-16 w-16 mb-4 opacity-50" />
                            <p className="text-lg font-semibold">VR Session Active</p>
                            <p className="text-sm opacity-75">Put on your VR headset to join</p>
                          </div>
                        </div>
                      </div>
                    ) : sessionControls.ar ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Eye className="mx-auto h-16 w-16 mb-4 opacity-50" />
                          <p className="text-lg font-semibold">AR Session Active</p>
                          <p className="text-sm opacity-75">Point your camera at the patient area</p>
                        </div>
                      </div>
                    ) : (
                      <video
                        ref={videoRef}
                        autoPlay
                        muted
                        className="w-full h-full object-cover"
                      />
                    )}

                    {/* Session Controls Overlay */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                      <div className="flex items-center space-x-3 bg-black/70 backdrop-blur-sm rounded-full px-6 py-3">
                        <Button
                          size="sm"
                          variant={sessionControls.audio ? "default" : "secondary"}
                          onClick={() => toggleControl("audio")}
                          className="rounded-full w-10 h-10 p-0"
                        >
                          {sessionControls.audio ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant={sessionControls.video ? "default" : "secondary"}
                          onClick={() => toggleControl("video")}
                          className="rounded-full w-10 h-10 p-0"
                        >
                          {sessionControls.video ? <Camera className="h-4 w-4" /> : <CameraOff className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={endSession}
                          className="rounded-full w-10 h-10 p-0"
                        >
                          <PhoneOff className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full w-10 h-10 p-0"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Session Info Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Session Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Duration:</span>
                      <span className="text-sm font-medium">15:32</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Quality:</span>
                      <Badge variant="default" className="bg-green-600">HD</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Latency:</span>
                      <span className="text-sm font-medium">45ms</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Participants</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-600">DR</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Dr. Sarah Johnson</p>
                          <p className="text-xs text-gray-600">Dermatologist</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-green-600">YOU</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                          <p className="text-xs text-gray-600">Patient</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {sessionControls.vr && (
                    <div className="space-y-3">
                      <h4 className="font-medium">VR Features</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Hand Tracking</span>
                          <Badge variant="default">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Eye Tracking</span>
                          <Badge variant="secondary">Available</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Spatial Audio</span>
                          <Badge variant="default">Active</Badge>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* VR Consultation Option */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Headset className="mr-2 h-6 w-6 text-purple-600" />
                    Virtual Reality
                  </CardTitle>
                  <CardDescription>
                    Immersive 3D consultation environment
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Layers className="h-4 w-4 text-purple-600" />
                      <span className="text-sm">3D anatomical models</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Hand className="h-4 w-4 text-purple-600" />
                      <span className="text-sm">Hand gesture control</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Eye className="h-4 w-4 text-purple-600" />
                      <span className="text-sm">Eye tracking support</span>
                    </div>
                  </div>
                  <Button
                    onClick={startVRSession}
                    disabled={!deviceCapabilities.vr}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    <Headset className="mr-2 h-4 w-4" />
                    Start VR Session
                  </Button>
                  {!deviceCapabilities.vr && (
                    <p className="text-xs text-gray-500 text-center">VR headset required</p>
                  )}
                </CardContent>
              </Card>

              {/* AR Consultation Option */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Eye className="mr-2 h-6 w-6 text-blue-600" />
                    Augmented Reality
                  </CardTitle>
                  <CardDescription>
                    Overlay digital information on real world
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Real-world overlay</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Monitor className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Digital annotations</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Camera className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Camera-based tracking</span>
                    </div>
                  </div>
                  <Button
                    onClick={startARSession}
                    disabled={!deviceCapabilities.ar}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Start AR Session
                  </Button>
                  {!deviceCapabilities.ar && (
                    <p className="text-xs text-gray-500 text-center">AR-capable device required</p>
                  )}
                </CardContent>
              </Card>

              {/* Traditional Video Call */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Video className="mr-2 h-6 w-6 text-green-600" />
                    Video Call
                  </CardTitle>
                  <CardDescription>
                    Standard video consultation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Camera className="h-4 w-4 text-green-600" />
                      <span className="text-sm">HD video quality</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mic className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Crystal clear audio</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Smartphone className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Multi-device support</span>
                    </div>
                  </div>
                  <Button
                    onClick={startVideoCall}
                    disabled={!deviceCapabilities.camera}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Video className="mr-2 h-4 w-4" />
                    Start Video Call
                  </Button>
                  {!deviceCapabilities.camera && (
                    <p className="text-xs text-gray-500 text-center">Camera access required</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-6">
          {upcomingArVrAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingArVrAppointments.map((appointment: any) => (
                <Card key={appointment.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          <Headset className="mr-2 h-5 w-5 text-purple-600" />
                          AR/VR Consultation
                        </CardTitle>
                        <CardDescription>
                          {new Date(appointment.dateTime).toLocaleDateString()} at{" "}
                          {new Date(appointment.dateTime).toLocaleTimeString()}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">
                        {appointment.duration} minutes
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">Duration: {appointment.duration} min</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">Dr. Sarah Johnson</span>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <Button
                        onClick={() => createNewSession("vr", appointment.id)}
                        disabled={!deviceCapabilities.vr}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <Headset className="mr-2 h-4 w-4" />
                        Join VR Session
                      </Button>
                      <Button
                        onClick={() => createNewSession("ar", appointment.id)}
                        disabled={!deviceCapabilities.ar}
                        variant="outline"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Join AR Session
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No upcoming AR/VR sessions</h3>
                <p className="text-gray-600">Schedule an immersive consultation with your doctor</p>
                <Button className="mt-4">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Session
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          {sessions && sessions.length > 0 ? (
            <div className="space-y-4">
              {sessions.map((session: any) => (
                <Card key={session.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          {session.sessionType === "vr" && <Headset className="mr-2 h-5 w-5 text-purple-600" />}
                          {session.sessionType === "ar" && <Eye className="mr-2 h-5 w-5 text-blue-600" />}
                          {session.sessionType === "mixed_reality" && <Layers className="mr-2 h-5 w-5 text-indigo-600" />}
                          {session.sessionType === "vr" ? "VR Session" : 
                           session.sessionType === "ar" ? "AR Session" : "Mixed Reality Session"}
                        </CardTitle>
                        <CardDescription>
                          {new Date(session.createdAt).toLocaleDateString()} • 
                          {session.duration} minutes
                        </CardDescription>
                      </div>
                      <Badge variant={session.status === "completed" ? "default" : "secondary"}>
                        {session.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">Session Quality</p>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">HD Quality</Badge>
                          <Badge variant="outline">Low Latency</Badge>
                        </div>
                      </div>
                      <div className="space-x-2">
                        <Button size="sm" variant="outline">
                          <Play className="mr-1 h-3 w-3" />
                          View Recording
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
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Headset className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No session history</h3>
                <p className="text-gray-600">Your completed AR/VR sessions will appear here</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Device Capabilities */}
            <Card>
              <CardHeader>
                <CardTitle>Device Capabilities</CardTitle>
                <CardDescription>
                  Check your device's AR/VR compatibility
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">WebXR Support</span>
                    </div>
                    <Badge variant={deviceCapabilities.webxr ? "default" : "secondary"}>
                      {deviceCapabilities.webxr ? "Supported" : "Not Available"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Headset className="h-4 w-4 text-purple-600" />
                      <span className="text-sm">VR Headset</span>
                    </div>
                    <Badge variant={deviceCapabilities.vr ? "default" : "secondary"}>
                      {deviceCapabilities.vr ? "Connected" : "Not Connected"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Eye className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">AR Camera</span>
                    </div>
                    <Badge variant={deviceCapabilities.ar ? "default" : "secondary"}>
                      {deviceCapabilities.ar ? "Available" : "Not Available"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Camera className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Camera Access</span>
                    </div>
                    <Badge variant={deviceCapabilities.camera ? "default" : "secondary"}>
                      {deviceCapabilities.camera ? "Granted" : "Denied"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Mic className="h-4 w-4 text-orange-600" />
                      <span className="text-sm">Microphone Access</span>
                    </div>
                    <Badge variant={deviceCapabilities.microphone ? "default" : "secondary"}>
                      {deviceCapabilities.microphone ? "Granted" : "Denied"}
                    </Badge>
                  </div>
                </div>

                <Alert>
                  <AlertDescription>
                    For the best experience, ensure your VR headset is connected and permissions are granted for camera and microphone access.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Setup Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Setup Instructions</CardTitle>
                <CardDescription>
                  Get your device ready for AR/VR consultations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">VR Setup</h4>
                    <ol className="text-sm space-y-1 text-gray-600 list-decimal list-inside">
                      <li>Connect your VR headset to your computer</li>
                      <li>Install the latest VR runtime software</li>
                      <li>Ensure proper room-scale tracking setup</li>
                      <li>Test hand and eye tracking if available</li>
                    </ol>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">AR Setup</h4>
                    <ol className="text-sm space-y-1 text-gray-600 list-decimal list-inside">
                      <li>Grant camera access to your browser</li>
                      <li>Ensure good lighting in your environment</li>
                      <li>Clear the area for tracking space</li>
                      <li>Test camera focus and positioning</li>
                    </ol>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Audio/Video Setup</h4>
                    <ol className="text-sm space-y-1 text-gray-600 list-decimal list-inside">
                      <li>Test your microphone and speakers</li>
                      <li>Check internet connection stability</li>
                      <li>Close unnecessary applications</li>
                      <li>Position camera at eye level</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}