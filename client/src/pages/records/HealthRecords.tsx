import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  FileText, 
  Upload, 
  Download, 
  Search, 
  Filter,
  Plus,
  Eye,
  Image,
  FileImage,
  File,
  Calendar
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function HealthRecords() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [newRecord, setNewRecord] = useState({
    title: '',
    recordType: 'report',
    content: '',
    notes: ''
  });

  const { data: healthRecords = [], isLoading } = useQuery({
    queryKey: ['/api/health-records'],
  });

  const createRecordMutation = useMutation({
    mutationFn: async (recordData: any) => {
      return apiRequest('POST', '/api/health-records', recordData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/health-records'] });
      setUploadDialogOpen(false);
      setNewRecord({ title: '', recordType: 'report', content: '', notes: '' });
      toast({
        title: "Success",
        description: "Health record added successfully.",
      });
    },
  });

  const filteredRecords = healthRecords.filter((record: any) => {
    const matchesSearch = record.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.content?.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || record.recordType === typeFilter;
    return matchesSearch && matchesType;
  });

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'prescription': return <FileText className="w-5 h-5 text-blue-600" />;
      case 'image': return <FileImage className="w-5 h-5 text-purple-600" />;
      case 'ai_diagnosis': return <Image className="w-5 h-5 text-green-600" />;
      default: return <File className="w-5 h-5 text-slate-600" />;
    }
  };

  const getRecordTypeColor = (type: string) => {
    switch (type) {
      case 'prescription': return 'bg-blue-100 text-blue-800';
      case 'image': return 'bg-purple-100 text-purple-800';
      case 'ai_diagnosis': return 'bg-green-100 text-green-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real implementation, you would upload the file to a storage service
      console.log('File selected:', file.name);
      toast({
        title: "File Selected",
        description: `${file.name} is ready for upload.`,
      });
    }
  };

  const handleCreateRecord = () => {
    if (!newRecord.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for the record.",
        variant: "destructive",
      });
      return;
    }

    createRecordMutation.mutate({
      patientId: user?.id,
      recordType: newRecord.recordType,
      title: newRecord.title,
      content: {
        notes: newRecord.notes,
        uploadedBy: user?.id,
        uploadDate: new Date().toISOString(),
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {user?.role === 'doctor' ? 'Patient Records (EMR)' : 'Health Records (PHR)'}
          </h1>
          <p className="text-slate-600 mt-1">
            {user?.role === 'doctor' 
              ? 'Manage electronic medical records for your patients'
              : 'Your personal health records and medical history'
            }
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="w-4 h-4 mr-2" />
                Upload Record
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Upload Health Record</DialogTitle>
                <DialogDescription>
                  Add a new document or report to your health records.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter record title"
                    value={newRecord.title}
                    onChange={(e) => setNewRecord({ ...newRecord, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Record Type</Label>
                  <Select 
                    value={newRecord.recordType} 
                    onValueChange={(value) => setNewRecord({ ...newRecord, recordType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prescription">Prescription</SelectItem>
                      <SelectItem value="report">Medical Report</SelectItem>
                      <SelectItem value="image">Medical Image</SelectItem>
                      <SelectItem value="ai_diagnosis">AI Diagnosis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file">Upload File</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileUpload}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Additional notes about this record"
                    value={newRecord.notes}
                    onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button 
                    onClick={handleCreateRecord}
                    disabled={createRecordMutation.isPending}
                    className="flex-1"
                  >
                    {createRecordMutation.isPending ? 'Uploading...' : 'Upload Record'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setUploadDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="prescription">Prescriptions</SelectItem>
                <SelectItem value="report">Reports</SelectItem>
                <SelectItem value="image">Images</SelectItem>
                <SelectItem value="ai_diagnosis">AI Diagnoses</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Records List */}
      <div className="space-y-4">
        {isLoading ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-slate-500">Loading records...</p>
              </div>
            </CardContent>
          </Card>
        ) : filteredRecords.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500 mb-4">
                  {searchTerm || typeFilter !== 'all' 
                    ? 'No records match your search criteria'
                    : 'No health records found'
                  }
                </p>
                <Button onClick={() => setUploadDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Your First Record
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredRecords.map((record: any) => (
              <Card key={record.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                        {getRecordIcon(record.recordType)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-slate-900">{record.title}</h3>
                          <Badge className={getRecordTypeColor(record.recordType)}>
                            {record.recordType.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-slate-600 space-x-4 mb-2">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(record.createdAt).toLocaleDateString()}
                          </span>
                          {record.doctorId && (
                            <span>Dr. {record.doctorId}</span>
                          )}
                        </div>
                        {record.content?.notes && (
                          <p className="text-sm text-slate-600 mt-2">{record.content.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {filteredRecords.filter((r: any) => r.recordType === 'prescription').length}
              </div>
              <p className="text-sm text-slate-600">Prescriptions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {filteredRecords.filter((r: any) => r.recordType === 'image').length}
              </div>
              <p className="text-sm text-slate-600">Medical Images</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {filteredRecords.filter((r: any) => r.recordType === 'ai_diagnosis').length}
              </div>
              <p className="text-sm text-slate-600">AI Diagnoses</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-600">
                {filteredRecords.filter((r: any) => r.recordType === 'report').length}
              </div>
              <p className="text-sm text-slate-600">Reports</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
