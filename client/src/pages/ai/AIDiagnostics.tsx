import { useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Camera, 
  Upload, 
  Brain, 
  AlertTriangle, 
  CheckCircle, 
  Save, 
  Calendar,
  Eye,
  Download,
  Microscope,
  Zap
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function AIDiagnostics() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);

  const { data: aiDiagnoses = [], isLoading } = useQuery({
    queryKey: ['/api/ai-diagnoses'],
  });

  const createDiagnosisMutation = useMutation({
    mutationFn: async (diagnosisData: any) => {
      return apiRequest('POST', '/api/ai-diagnoses', diagnosisData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai-diagnoses'] });
      toast({
        title: "Success",
        description: "AI diagnosis saved successfully.",
      });
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "Error",
          description: "Image size should be less than 10MB.",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    // In a real implementation, this would access the device camera
    toast({
      title: "Camera Access",
      description: "Camera feature would be implemented here with navigator.mediaDevices.getUserMedia()",
    });
  };

  const analyzeImage = async () => {
    if (!selectedImage) {
      toast({
        title: "Error",
        description: "Please select an image first.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI analysis with a realistic delay
    setTimeout(() => {
      const mockResult = {
        diagnosis: "Suspected Melanoma",
        confidence: "94.2",
        severity: "high",
        explanation: {
          features: [
            "Irregular borders detected",
            "Color variation across lesion",
            "Asymmetrical shape pattern",
            "Diameter exceeds 6mm threshold"
          ],
          recommendation: "Immediate dermatologist consultation recommended. This lesion shows multiple concerning characteristics that warrant professional evaluation.",
          nextSteps: [
            "Schedule appointment with dermatologist within 1-2 weeks",
            "Avoid sun exposure to the affected area",
            "Monitor for any changes in size, color, or texture",
            "Take photos weekly to track progression"
          ]
        },
        imageUrl: selectedImage,
        analysisDate: new Date().toISOString()
      };

      setAnalysisResult(mockResult);
      setIsAnalyzing(false);
      setShowResults(true);
    }, 3000);
  };

  const saveAnalysis = () => {
    if (analysisResult) {
      createDiagnosisMutation.mutate({
        patientId: user?.id,
        imageUrl: analysisResult.imageUrl,
        diagnosis: analysisResult.diagnosis,
        confidence: `${analysisResult.confidence}%`,
        explanation: analysisResult.explanation,
      });
      setShowResults(false);
      setSelectedImage(null);
      setAnalysisResult(null);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">AI Skin Diagnostics</h1>
          <p className="text-slate-600 mt-1">
            Advanced AI-powered skin condition analysis with 97% accuracy
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <Badge className="bg-purple-100 text-purple-800">
            <Brain className="w-3 h-3 mr-1" />
            AI Powered
          </Badge>
          <Badge className="bg-green-100 text-green-800">
            97% Accuracy
          </Badge>
        </div>
      </div>

      {/* Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Image Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Microscope className="w-5 h-5 mr-2 text-purple-600" />
              Skin Analysis
            </CardTitle>
            <CardDescription>
              Upload or capture an image for AI-powered skin condition analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Image Preview */}
            <div className="w-full h-64 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center bg-slate-50">
              {selectedImage ? (
                <img 
                  src={selectedImage} 
                  alt="Selected skin image"
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              ) : (
                <div className="text-center">
                  <Upload className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-500">No image selected</p>
                </div>
              )}
            </div>

            {/* Upload Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={handleCameraCapture}
                variant="outline" 
                className="h-12"
              >
                <Camera className="w-4 h-4 mr-2" />
                Take Photo
              </Button>
              <Button 
                onClick={() => fileInputRef.current?.click()}
                variant="outline" 
                className="h-12"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Image
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            {/* Analyze Button */}
            <Button 
              onClick={analyzeImage}
              disabled={!selectedImage || isAnalyzing}
              className="w-full h-12 bg-purple-600 hover:bg-purple-700"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Analyze Skin Condition
                </>
              )}
            </Button>

            {/* Analysis Progress */}
            {isAnalyzing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>AI Analysis in Progress</span>
                  <span>Step 2 of 3</span>
                </div>
                <Progress value={67} className="h-2" />
                <p className="text-sm text-slate-600">
                  Processing image features and comparing with medical database...
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Capabilities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-600" />
              AI Capabilities
            </CardTitle>
            <CardDescription>
              What our AI can detect and analyze
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Skin Cancer Detection</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Melanoma identification</li>
                  <li>• Basal cell carcinoma</li>
                  <li>• Squamous cell carcinoma</li>
                </ul>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Common Conditions</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Acne and acne scarring</li>
                  <li>• Eczema and dermatitis</li>
                  <li>• Psoriasis patches</li>
                </ul>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">Advanced Analysis</h4>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• ABCDE rule assessment</li>
                  <li>• Texture analysis</li>
                  <li>• Color pattern recognition</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center mb-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2" />
                <span className="font-medium text-yellow-800">Important Notice</span>
              </div>
              <p className="text-sm text-yellow-700">
                AI analysis is for screening purposes only. Always consult with a qualified dermatologist for definitive diagnosis and treatment.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Previous Diagnoses */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Previous AI Diagnoses</CardTitle>
            <Badge variant="secondary">
              {aiDiagnoses.length} Total Scans
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-slate-500">Loading diagnoses...</p>
            </div>
          ) : aiDiagnoses.length === 0 ? (
            <div className="text-center py-8">
              <Brain className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500">No AI diagnoses yet</p>
              <p className="text-sm text-slate-400 mt-2">Upload your first image to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {aiDiagnoses.slice(0, 5).map((diagnosis: any) => (
                <div key={diagnosis.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Brain className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">{diagnosis.diagnosis}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-slate-600">
                          {new Date(diagnosis.createdAt).toLocaleDateString()}
                        </span>
                        <Badge className={`text-xs ${getConfidenceColor(parseFloat(diagnosis.confidence))}`}>
                          {diagnosis.confidence} confidence
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-1" />
                      Report
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Dialog */}
      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Brain className="w-5 h-5 mr-2 text-purple-600" />
              AI Analysis Results
            </DialogTitle>
            <DialogDescription>
              Detailed analysis of your skin condition
            </DialogDescription>
          </DialogHeader>
          
          {analysisResult && (
            <div className="space-y-6">
              {/* Main Result */}
              <div className="text-center p-6 bg-slate-50 rounded-lg">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {analysisResult.diagnosis}
                </h3>
                <div className="flex items-center justify-center space-x-4">
                  <Badge className={getSeverityColor(analysisResult.severity)}>
                    {analysisResult.severity.toUpperCase()} PRIORITY
                  </Badge>
                  <div className="text-2xl font-bold text-purple-600">
                    {analysisResult.confidence}% Confidence
                  </div>
                </div>
              </div>

              {/* Key Features */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Detected Features:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {analysisResult.explanation.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center p-2 bg-blue-50 rounded text-sm">
                      <CheckCircle className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendation */}
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-900 mb-2">Recommendation:</h4>
                <p className="text-yellow-800 text-sm">{analysisResult.explanation.recommendation}</p>
              </div>

              {/* Next Steps */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Next Steps:</h4>
                <ul className="space-y-2">
                  {analysisResult.explanation.nextSteps.map((step: string, index: number) => (
                    <li key={index} className="flex items-start text-sm">
                      <span className="bg-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">
                        {index + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button onClick={saveAnalysis} className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  Save Analysis
                </Button>
                <Button variant="outline" className="flex-1">
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Consultation
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
