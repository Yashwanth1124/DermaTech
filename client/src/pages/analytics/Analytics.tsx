import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Activity, 
  Award,
  Shield,
  Download,
  Calendar,
  Coins,
  Target,
  Zap,
  Globe
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

export default function Analytics() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('30d');
  const [chartType, setChartType] = useState('patients');

  const { data: appointments = [] } = useQuery({
    queryKey: ['/api/appointments'],
  });

  // Mock blockchain analytics data
  const blockchainData = {
    totalTransactions: 15420,
    immutableRecords: 8945,
    privacyScore: 98.7,
    consensusRate: 99.9,
    networkNodes: 156,
    rewardsDistributed: 24850
  };

  // Mock patient demographics and trends
  const patientDemographics = {
    totalPatients: 15420,
    newPatients: 1240,
    ageGroups: [
      { range: '18-25', count: 3240, percentage: 21 },
      { range: '26-35', count: 4620, percentage: 30 },
      { range: '36-45', count: 3850, percentage: 25 },
      { range: '46-60', count: 2480, percentage: 16 },
      { range: '60+', count: 1230, percentage: 8 }
    ],
    conditions: [
      { name: 'Acne', count: 4530, percentage: 29, trend: 'up' },
      { name: 'Eczema', count: 3240, percentage: 21, trend: 'down' },
      { name: 'Psoriasis', count: 2150, percentage: 14, trend: 'up' },
      { name: 'Skin Cancer Screening', count: 1890, percentage: 12, trend: 'up' },
      { name: 'Other', count: 3610, percentage: 24, trend: 'stable' }
    ]
  };

  const performanceMetrics = {
    patientSatisfaction: 94.2,
    treatmentSuccess: 89.7,
    averageWaitTime: 12,
    appointmentAdherence: 87.3,
    aiAccuracy: 97.3,
    consultationRating: 4.8
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4 text-slate-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {user?.role === 'admin' ? 'Hospital Analytics' : 'Practice Analytics'}
          </h1>
          <p className="text-slate-600 mt-1">
            Blockchain-powered insights and performance metrics
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Patients</p>
                <p className="text-2xl font-bold text-slate-900">{patientDemographics.totalPatients.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+12.3%</span>
                </div>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Patient Satisfaction</p>
                <p className="text-2xl font-bold text-slate-900">{performanceMetrics.patientSatisfaction}%</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+2.1%</span>
                </div>
              </div>
              <Award className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">AI Accuracy</p>
                <p className="text-2xl font-bold text-slate-900">{performanceMetrics.aiAccuracy}%</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+0.8%</span>
                </div>
              </div>
              <Zap className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Blockchain Records</p>
                <p className="text-2xl font-bold text-slate-900">{blockchainData.immutableRecords.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <Shield className="w-4 h-4 text-blue-600 mr-1" />
                  <span className="text-sm text-blue-600">Immutable</span>
                </div>
              </div>
              <Shield className="w-8 h-8 text-cyan-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Performance Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Key performance indicators for your practice</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Patient Satisfaction</span>
                    <span className="font-medium">{performanceMetrics.patientSatisfaction}%</span>
                  </div>
                  <Progress value={performanceMetrics.patientSatisfaction} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Treatment Success Rate</span>
                    <span className="font-medium">{performanceMetrics.treatmentSuccess}%</span>
                  </div>
                  <Progress value={performanceMetrics.treatmentSuccess} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Appointment Adherence</span>
                    <span className="font-medium">{performanceMetrics.appointmentAdherence}%</span>
                  </div>
                  <Progress value={performanceMetrics.appointmentAdherence} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>AI Diagnostic Accuracy</span>
                    <span className="font-medium">{performanceMetrics.aiAccuracy}%</span>
                  </div>
                  <Progress value={performanceMetrics.aiAccuracy} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
                <CardDescription>Growth and performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-blue-900">New Patients</p>
                      <p className="text-2xl font-bold text-blue-700">+1,240</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-green-900">Revenue Growth</p>
                      <p className="text-2xl font-bold text-green-700">+18.5%</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                    <div>
                      <p className="font-medium text-purple-900">Efficiency Score</p>
                      <p className="text-2xl font-bold text-purple-700">92.3%</p>
                    </div>
                    <Target className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Patients Tab */}
        <TabsContent value="patients" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Age Demographics */}
            <Card>
              <CardHeader>
                <CardTitle>Patient Demographics</CardTitle>
                <CardDescription>Age distribution of patient base</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patientDemographics.ageGroups.map((group) => (
                    <div key={group.range}>
                      <div className="flex justify-between text-sm mb-2">
                        <span>{group.range} years</span>
                        <span className="font-medium">{group.count.toLocaleString()} ({group.percentage}%)</span>
                      </div>
                      <Progress value={group.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Condition Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Common Conditions</CardTitle>
                <CardDescription>Most frequently treated conditions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patientDemographics.conditions.map((condition) => (
                    <div key={condition.name} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{condition.name}</span>
                          <div className="flex items-center space-x-2">
                            {getTrendIcon(condition.trend)}
                            <span className="text-sm font-medium">{condition.count.toLocaleString()}</span>
                          </div>
                        </div>
                        <Progress value={condition.percentage} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Blockchain Tab */}
        <TabsContent value="blockchain" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Shield className="w-12 h-12 text-cyan-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-slate-900 mb-2">Data Integrity</h3>
                  <div className="text-2xl font-bold text-cyan-600 mb-1">{blockchainData.privacyScore}%</div>
                  <p className="text-sm text-slate-600">Privacy Score</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Globe className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-slate-900 mb-2">Network Health</h3>
                  <div className="text-2xl font-bold text-blue-600 mb-1">{blockchainData.consensusRate}%</div>
                  <p className="text-sm text-slate-600">Consensus Rate</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Activity className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-slate-900 mb-2">Network Nodes</h3>
                  <div className="text-2xl font-bold text-green-600 mb-1">{blockchainData.networkNodes}</div>
                  <p className="text-sm text-slate-600">Active Validators</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Blockchain Transactions</CardTitle>
              <CardDescription>Immutable record of all healthcare transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-600">Total Transactions</p>
                  <p className="text-2xl font-bold text-slate-900">{blockchainData.totalTransactions.toLocaleString()}</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-600">Immutable Records</p>
                  <p className="text-2xl font-bold text-slate-900">{blockchainData.immutableRecords.toLocaleString()}</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-600">Data Validated</p>
                  <p className="text-2xl font-bold text-slate-900">100%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rewards Tab */}
        <TabsContent value="rewards" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Loyalty Rewards Program</CardTitle>
              <CardDescription>Blockchain-based patient loyalty and rewards system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                    <div>
                      <p className="font-medium text-yellow-900">Total Rewards Distributed</p>
                      <p className="text-2xl font-bold text-yellow-700">{blockchainData.rewardsDistributed.toLocaleString()}</p>
                    </div>
                    <Coins className="w-8 h-8 text-yellow-600" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-green-900">Active Participants</p>
                      <p className="text-2xl font-bold text-green-700">12,450</p>
                    </div>
                    <Users className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-blue-900">Redemption Rate</p>
                      <p className="text-2xl font-bold text-blue-700">78.3%</p>
                    </div>
                    <Award className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-900">Reward Categories</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 border border-slate-200 rounded-lg">
                      <span className="text-sm">Appointment Completion</span>
                      <Badge variant="secondary">+50 points</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 border border-slate-200 rounded-lg">
                      <span className="text-sm">Health Record Upload</span>
                      <Badge variant="secondary">+25 points</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 border border-slate-200 rounded-lg">
                      <span className="text-sm">AI Diagnosis Feedback</span>
                      <Badge variant="secondary">+15 points</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 border border-slate-200 rounded-lg">
                      <span className="text-sm">Referral Program</span>
                      <Badge variant="secondary">+100 points</Badge>
                    </div>
                  </div>
                  <Button className="w-full mt-4">
                    <Coins className="w-4 h-4 mr-2" />
                    Issue Rewards
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
