import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  HelpCircle, 
  MessageSquare, 
  Phone, 
  Mail, 
  Search,
  Send,
  Clock,
  CheckCircle,
  Star,
  Book,
  Video,
  FileText,
  Headphones,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export default function Support() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [chatMessage, setChatMessage] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [supportForm, setSupportForm] = useState({
    subject: '',
    category: 'general',
    priority: 'medium',
    message: '',
  });

  const submitTicketMutation = useMutation({
    mutationFn: async (ticketData: any) => {
      return apiRequest('POST', '/api/support/tickets', ticketData);
    },
    onSuccess: () => {
      setSupportForm({
        subject: '',
        category: 'general',
        priority: 'medium',
        message: '',
      });
      toast({
        title: "Support Ticket Created",
        description: "We'll get back to you within 24 hours.",
      });
    },
  });

  const sendChatMessage = () => {
    if (!chatMessage.trim()) return;
    
    toast({
      title: "Message Sent",
      description: "Our support team will respond shortly.",
    });
    setChatMessage('');
  };

  // FAQ Data
  const faqData = [
    {
      category: 'general',
      title: 'General Questions',
      items: [
        {
          question: 'How do I create an account?',
          answer: 'Click on "Sign Up" in the top right corner, fill in your details, and verify your email address. You can also link your ABHA ID for seamless access to your health records.'
        },
        {
          question: 'Is my health data secure?',
          answer: 'Yes, we use advanced encryption and blockchain technology to ensure your health data is completely secure. All data is encrypted end-to-end and stored using HIPAA-compliant security measures.'
        },
        {
          question: 'How do I link my ABHA ID?',
          answer: 'Go to your Profile settings and enter your ABHA ID in the designated field. You can also scan the QR code from your ABHA card for instant linking.'
        },
        {
          question: 'What browsers are supported?',
          answer: 'DermaTech works best on Chrome, Firefox, Safari, and Edge. For AR/VR consultations, you\'ll need a WebXR-compatible browser.'
        }
      ]
    },
    {
      category: 'appointments',
      title: 'Appointments & Consultations',
      items: [
        {
          question: 'How do I book an appointment?',
          answer: 'Navigate to the Appointments section, select your preferred doctor and time slot, then confirm your booking. You\'ll receive a confirmation email and SMS.'
        },
        {
          question: 'Can I cancel or reschedule appointments?',
          answer: 'Yes, you can cancel or reschedule appointments up to 2 hours before the scheduled time through the Appointments section.'
        },
        {
          question: 'How do AR/VR consultations work?',
          answer: 'AR/VR consultations provide immersive 3D visualization of skin conditions. You can use either a VR headset or AR-enabled smartphone for the consultation.'
        },
        {
          question: 'What if I miss my appointment?',
          answer: 'If you miss an appointment, you can reschedule it through the platform. Some doctors may charge a no-show fee as per their policy.'
        }
      ]
    },
    {
      category: 'ai-diagnostics',
      title: 'AI Diagnostics',
      items: [
        {
          question: 'How accurate is the AI diagnosis?',
          answer: 'Our AI has a 97% accuracy rate for common skin conditions. However, AI diagnosis is for screening purposes only and should always be confirmed by a qualified dermatologist.'
        },
        {
          question: 'What image quality is required?',
          answer: 'For best results, use high-resolution images (at least 1080p) with good lighting. Ensure the skin condition is clearly visible and in focus.'
        },
        {
          question: 'Can I save my AI diagnosis results?',
          answer: 'Yes, all AI diagnosis results are automatically saved to your health records. You can download detailed reports in PDF format.'
        },
        {
          question: 'What skin conditions can AI detect?',
          answer: 'Our AI can detect various conditions including acne, eczema, psoriasis, melanoma, and other common dermatological conditions.'
        }
      ]
    },
    {
      category: 'pharmacy',
      title: 'Pharmacy & Orders',
      items: [
        {
          question: 'How do I order medicines?',
          answer: 'Upload your prescription or search for medicines in the Pharmacy section. Select a nearby pharmacy and place your order for home delivery or pickup.'
        },
        {
          question: 'What are the delivery charges?',
          answer: 'Delivery charges vary by pharmacy and location. Most deliveries within 5km are free for orders above ₹500.'
        },
        {
          question: 'Can I track my medicine order?',
          answer: 'Yes, you can track your order in real-time through the Pharmacy section. You\'ll receive SMS updates at each stage of delivery.'
        },
        {
          question: 'How do I set up automatic refills?',
          answer: 'In the Pharmacy section, select "Schedule Refill" for any regular medication. We\'ll automatically remind you and can place orders based on your preferences.'
        }
      ]
    }
  ];

  const filteredFAQs = faqData.find(category => category.category === selectedCategory)?.items.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleFormChange = (field: string, value: string) => {
    setSupportForm({ ...supportForm, [field]: value });
  };

  const handleSubmitTicket = () => {
    if (!supportForm.subject.trim() || !supportForm.message.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    submitTicketMutation.mutate({
      ...supportForm,
      userId: user?.id,
    });
  };

  const contactMethods = [
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      action: 'Start Chat',
      available: true,
      onClick: () => setIsChatOpen(true)
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: '+91 1800-123-4567 (Toll-free)',
      action: 'Call Now',
      available: true,
      onClick: () => window.open('tel:+911800123456')
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'support@dermatech.in',
      action: 'Send Email',
      available: true,
      onClick: () => window.open('mailto:support@dermatech.in')
    },
    {
      icon: Video,
      title: 'Video Support',
      description: 'Screen sharing assistance',
      action: 'Schedule Call',
      available: false,
      onClick: () => {}
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Help & Support</h1>
          <p className="text-slate-600 mt-1">
            Get help with DermaTech features and services
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <Badge className="bg-green-100 text-green-800">
            <Clock className="w-3 h-3 mr-1" />
            24/7 Available
          </Badge>
          <Badge className="bg-blue-100 text-blue-800">
            Avg Response: 15 min
          </Badge>
        </div>
      </div>

      {/* Quick Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {contactMethods.map((method, index) => (
          <Card key={index} className={`cursor-pointer hover:shadow-md transition-shadow ${!method.available ? 'opacity-50' : ''}`}>
            <CardContent className="pt-6 text-center">
              <method.icon className={`w-8 h-8 mx-auto mb-3 ${
                method.available ? 'text-blue-600' : 'text-slate-400'
              }`} />
              <h3 className="font-semibold text-slate-900 mb-2">{method.title}</h3>
              <p className="text-sm text-slate-600 mb-4">{method.description}</p>
              <Button 
                size="sm" 
                variant={method.available ? "default" : "outline"}
                disabled={!method.available}
                onClick={method.onClick}
                className="w-full"
              >
                {method.action}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="faq" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="contact">Contact Us</TabsTrigger>
          <TabsTrigger value="guides">User Guides</TabsTrigger>
          <TabsTrigger value="status">System Status</TabsTrigger>
        </TabsList>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6">
          {/* Search and Filter */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      placeholder="Search for answers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Questions</SelectItem>
                    <SelectItem value="appointments">Appointments</SelectItem>
                    <SelectItem value="ai-diagnostics">AI Diagnostics</SelectItem>
                    <SelectItem value="pharmacy">Pharmacy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Content */}
          <Card>
            <CardHeader>
              <CardTitle>
                {faqData.find(cat => cat.category === selectedCategory)?.title}
              </CardTitle>
              <CardDescription>
                {filteredFAQs.length} questions found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredFAQs.length === 0 ? (
                <div className="text-center py-8">
                  <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-500">No questions found matching your search.</p>
                </div>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFAQs.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-slate-600">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Submit a Support Ticket</CardTitle>
              <CardDescription>
                Can't find what you're looking for? Create a support ticket and we'll help you out.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Brief description of your issue"
                    value={supportForm.subject}
                    onChange={(e) => handleFormChange('subject', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={supportForm.category} onValueChange={(value) => handleFormChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Support</SelectItem>
                      <SelectItem value="technical">Technical Issue</SelectItem>
                      <SelectItem value="billing">Billing & Payments</SelectItem>
                      <SelectItem value="medical">Medical Consultation</SelectItem>
                      <SelectItem value="pharmacy">Pharmacy Orders</SelectItem>
                      <SelectItem value="feature">Feature Request</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={supportForm.priority} onValueChange={(value) => handleFormChange('priority', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - General inquiry</SelectItem>
                    <SelectItem value="medium">Medium - Standard support</SelectItem>
                    <SelectItem value="high">High - Urgent issue</SelectItem>
                    <SelectItem value="critical">Critical - System down</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Please describe your issue in detail..."
                  rows={5}
                  value={supportForm.message}
                  onChange={(e) => handleFormChange('message', e.target.value)}
                />
              </div>

              <Button 
                onClick={handleSubmitTicket}
                disabled={submitTicketMutation.isPending}
                className="w-full md:w-auto"
              >
                <Send className="w-4 h-4 mr-2" />
                {submitTicketMutation.isPending ? 'Submitting...' : 'Submit Ticket'}
              </Button>
            </CardContent>
          </Card>

          {/* Live Chat */}
          {isChatOpen && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2 text-green-600" />
                    Live Chat Support
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setIsChatOpen(false)}>
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 h-64 bg-slate-50 mb-4 overflow-y-auto">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <Headphones className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-white rounded-lg p-3 max-w-xs">
                        <p className="text-sm">Hello! I'm here to help you with any questions about DermaTech. How can I assist you today?</p>
                        <span className="text-xs text-slate-500">Support Agent • now</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type your message..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                  />
                  <Button onClick={sendChatMessage}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* User Guides Tab */}
        <TabsContent value="guides" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <Book className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="font-semibold text-slate-900 mb-2">Getting Started Guide</h3>
                <p className="text-sm text-slate-600 mb-4">Learn the basics of using DermaTech platform</p>
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Read Guide
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <Video className="w-8 h-8 text-purple-600 mb-4" />
                <h3 className="font-semibold text-slate-900 mb-2">Video Tutorials</h3>
                <p className="text-sm text-slate-600 mb-4">Watch step-by-step video guides</p>
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Watch Videos
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <FileText className="w-8 h-8 text-green-600 mb-4" />
                <h3 className="font-semibent text-slate-900 mb-2">API Documentation</h3>
                <p className="text-sm text-slate-600 mb-4">Developer resources and API guides</p>
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Docs
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* System Status Tab */}
        <TabsContent value="status" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                All Systems Operational
              </CardTitle>
              <CardDescription>
                Current status of DermaTech services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { service: 'Web Application', status: 'operational' },
                  { service: 'AI Diagnostics', status: 'operational' },
                  { service: 'Video Consultations', status: 'operational' },
                  { service: 'AR/VR Services', status: 'operational' },
                  { service: 'Pharmacy Network', status: 'operational' },
                  { service: 'Blockchain Analytics', status: 'operational' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                    <span className="font-medium">{item.service}</span>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600 capitalize">{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Updates</CardTitle>
              <CardDescription>Latest system updates and maintenance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-medium text-slate-900">AI Model Update</h4>
                  <p className="text-sm text-slate-600">Enhanced skin condition detection accuracy to 97.3%</p>
                  <span className="text-xs text-slate-500">2 hours ago</span>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium text-slate-900">Performance Improvements</h4>
                  <p className="text-sm text-slate-600">Reduced page load times by 15% across all modules</p>
                  <span className="text-xs text-slate-500">1 day ago</span>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-medium text-slate-900">New AR/VR Features</h4>
                  <p className="text-sm text-slate-600">Added 3D skin visualization tools for consultations</p>
                  <span className="text-xs text-slate-500">3 days ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
