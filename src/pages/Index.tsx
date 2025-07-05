
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, TrendingUp, Users, Eye, ThumbsUp, MessageCircle, Share2, BarChart, Settings, Upload } from 'lucide-react';
import MetricsOverview from '@/components/dashboard/MetricsOverview';
import PerformanceChart from '@/components/dashboard/PerformanceChart';
import VideoGrid from '@/components/dashboard/VideoGrid';
import EngagementRings from '@/components/dashboard/EngagementRings';
import ApiSetup from '@/components/setup/ApiSetup';

const Index = () => {
  const [apiConnected, setApiConnected] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  if (!apiConnected) {
    return <ApiSetup onConnect={() => setApiConnected(true)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Play className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  VideoScope Pro
                </h1>
                <p className="text-sm text-gray-500">Executive Analytics Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                API Connected
              </Badge>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 lg:w-[400px] bg-white/60 backdrop-blur-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <MetricsOverview />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <PerformanceChart />
              <EngagementRings />
            </div>
            <VideoGrid />
          </TabsContent>

          <TabsContent value="performance" className="space-y-8">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <span>Performance Analytics</span>
                </CardTitle>
                <CardDescription>
                  Deep dive into your video performance metrics and trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  Advanced performance analytics coming soon...
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="engagement" className="space-y-8">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ThumbsUp className="h-5 w-5 text-purple-600" />
                  <span>Engagement Analysis</span>
                </CardTitle>
                <CardDescription>
                  Understand how your audience interacts with your content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  Engagement analysis tools coming soon...
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-8">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart className="h-5 w-5 text-indigo-600" />
                  <span>AI-Powered Insights</span>
                </CardTitle>
                <CardDescription>
                  Actionable recommendations to improve your video strategy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  AI insights engine coming soon...
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
