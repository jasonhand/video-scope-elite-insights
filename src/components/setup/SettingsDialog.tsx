import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Settings, 
  Key, 
  Play, 
  Download, 
  Eye,
  Save,
  X
} from 'lucide-react';
import { useYouTube } from '@/contexts/YouTubeContext';

interface SettingsDialogProps {
  children: React.ReactNode;
}

const SettingsDialog = ({ children }: SettingsDialogProps) => {
  const { apiKey, setApiKey, videos, removeVideo } = useYouTube();
  const [newApiKey, setNewApiKey] = useState(apiKey || '');
  const [refreshInterval, setRefreshInterval] = useState('5');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [theme, setTheme] = useState('light');
  const [exportFormat, setExportFormat] = useState('json');

  const handleSaveApiKey = () => {
    if (newApiKey.trim()) {
      setApiKey(newApiKey.trim());
    }
  };

  const handleClearApiKey = () => {
    localStorage.removeItem('youtube_api_key');
    setNewApiKey('');
  };

  const exportData = (format: string) => {
    const data = {
      videos: videos,
      settings: {
        refreshInterval,
        autoRefresh,
        theme,
        exportFormat
      },
      exportedAt: new Date().toISOString()
    };

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `videoscope-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'csv') {
      // Convert to CSV format
      const headers = ['Title', 'Channel', 'Views', 'Likes', 'Comments', 'Published', 'URL'];
      const csvContent = [
        headers.join(','),
        ...videos.map(video => [
          `"${video.title}"`,
          `"${video.channelTitle}"`,
          video.stats.viewCount,
          video.stats.likeCount,
          video.stats.commentCount,
          video.publishedAt,
          `"${video.url}"`
        ].join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `videoscope-data-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            VideoScope Pro Settings
          </DialogTitle>
          <DialogDescription>
            Configure your dashboard preferences and manage your YouTube API connection.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="api" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="api" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              API
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Videos
            </TabsTrigger>
            <TabsTrigger value="display" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Display
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </TabsTrigger>
          </TabsList>

          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>YouTube API Configuration</CardTitle>
                <CardDescription>
                  Manage your YouTube Data API v3 key for accessing video analytics.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="api-key"
                      type="password"
                      value={newApiKey}
                      onChange={(e) => setNewApiKey(e.target.value)}
                      placeholder="Enter your YouTube Data API v3 key"
                    />
                    <Button onClick={handleSaveApiKey} size="sm">
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button onClick={handleClearApiKey} variant="outline" size="sm">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="api-status"
                    checked={!!apiKey}
                    disabled
                  />
                  <Label htmlFor="api-status">
                    API Connection Status: {apiKey ? 'Connected' : 'Disconnected'}
                  </Label>
                </div>

                {apiKey && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    API Key is configured and working
                  </Badge>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="videos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Video Management</CardTitle>
                <CardDescription>
                  View and manage the videos currently being analyzed.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Videos: {videos.length}</span>
                    <Badge variant="outline">{videos.length} videos loaded</Badge>
                  </div>
                  
                  <Separator />
                  
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {videos.map((video) => (
                      <div key={video.id} className="flex items-center justify-between p-2 border rounded-lg">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{video.title}</p>
                          <p className="text-xs text-gray-500">{video.channelTitle}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {parseInt(video.stats.viewCount || '0').toLocaleString()} views
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeVideo(video.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="display" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Display Preferences</CardTitle>
                <CardDescription>
                  Customize how your dashboard looks and behaves.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto Refresh</Label>
                      <p className="text-sm text-gray-500">
                        Automatically refresh data at regular intervals
                      </p>
                    </div>
                    <Switch
                      checked={autoRefresh}
                      onCheckedChange={setAutoRefresh}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Refresh Interval (minutes)</Label>
                    <Select value={refreshInterval} onValueChange={setRefreshInterval}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 minute</SelectItem>
                        <SelectItem value="5">5 minutes</SelectItem>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <Select value={theme} onValueChange={setTheme}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="auto">Auto (System)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Export</CardTitle>
                <CardDescription>
                  Export your video analytics data in various formats.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Export Format</Label>
                    <Select value={exportFormat} onValueChange={setExportFormat}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => exportData(exportFormat)}
                      className="flex-1"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export All Data
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => exportData('json')}
                    >
                      JSON
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => exportData('csv')}
                    >
                      CSV
                    </Button>
                  </div>

                  <div className="text-sm text-gray-500">
                    <p>• JSON: Complete data with all analytics and settings</p>
                    <p>• CSV: Tabular format suitable for spreadsheet applications</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog; 