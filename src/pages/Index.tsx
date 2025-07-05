import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, TrendingUp, ThumbsUp, BarChart, Settings, RefreshCw } from 'lucide-react';
import MetricsOverview from '@/components/dashboard/MetricsOverview';
import PerformanceChart from '@/components/dashboard/PerformanceChart';
import VideoGrid from '@/components/dashboard/VideoGrid';
import EngagementRings from '@/components/dashboard/EngagementRings';
import ApiSetup from '@/components/setup/ApiSetup';
import SettingsDialog from '@/components/setup/SettingsDialog';
import { YouTubeProvider, useYouTube } from '@/contexts/YouTubeContext';
import PerformanceTab from '@/components/dashboard/PerformanceTab';
import EngagementTab from '@/components/dashboard/EngagementTab';
import InsightsTab from '@/components/dashboard/InsightsTab';
import RawDataTab from '@/components/dashboard/RawDataTab';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { apiKey, refreshData, isLoading } = useYouTube();

  const handleRefresh = () => {
    refreshData();
  };

  if (!apiKey) {
    return <ApiSetup onConnect={() => {}} />;
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
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              <SettingsDialog>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </SettingsDialog>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 lg:w-[500px] bg-white/60 backdrop-blur-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="data">Raw Data</TabsTrigger>
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
            <PerformanceTab />
          </TabsContent>

          <TabsContent value="engagement" className="space-y-8">
            <EngagementTab />
          </TabsContent>

          <TabsContent value="insights" className="space-y-8">
            <InsightsTab />
          </TabsContent>

          <TabsContent value="data" className="space-y-8">
            <RawDataTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

const Index = () => {
  return (
    <YouTubeProvider>
      <Dashboard />
    </YouTubeProvider>
  );
};

export default Index;
