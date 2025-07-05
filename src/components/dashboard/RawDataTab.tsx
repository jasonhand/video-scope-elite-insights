
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Database, Download, Copy, Eye } from 'lucide-react';
import { useYouTube } from '@/contexts/YouTubeContext';
import { useState } from 'react';

const RawDataTab = () => {
  const { videos, isLoading } = useYouTube();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (data: string, index: number) => {
    navigator.clipboard.writeText(data);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const downloadJSON = (data: any, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardContent className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading raw data...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Raw Data Overview */}
      <Card className="bg-white/60 backdrop-blur-sm border-white/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-blue-600" />
                <span>Raw YouTube API Data</span>
              </CardTitle>
              <CardDescription>Complete API responses and detailed video metadata</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">{videos.length} Videos</Badge>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => downloadJSON(videos, 'youtube-analytics-data.json')}
              >
                <Download className="h-4 w-4 mr-2" />
                Download All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{videos.length}</div>
              <p className="text-sm text-blue-700">Total Videos</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {videos.reduce((sum, v) => sum + parseInt(v.stats.viewCount || '0'), 0).toLocaleString()}
              </div>
              <p className="text-sm text-green-700">Total Views</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {videos.reduce((sum, v) => sum + parseInt(v.stats.likeCount || '0'), 0).toLocaleString()}
              </div>
              <p className="text-sm text-purple-700">Total Likes</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {videos.reduce((sum, v) => sum + parseInt(v.stats.commentCount || '0'), 0).toLocaleString()}
              </div>
              <p className="text-sm text-orange-700">Total Comments</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Video Data */}
      {videos.map((video, index) => (
        <Card key={video.id} className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-indigo-600" />
                  <span className="line-clamp-2">{video.title}</span>
                </CardTitle>
                <CardDescription className="mt-1">
                  Video ID: {video.id} • Published: {formatDate(video.publishedAt)}
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => copyToClipboard(JSON.stringify(video, null, 2), index)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  {copiedIndex === index ? 'Copied!' : 'Copy JSON'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => downloadJSON(video, `video-${video.id}-data.json`)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Basic Information</h4>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                    <div><span className="font-medium">Title:</span> {video.title}</div>
                    <div><span className="font-medium">Channel:</span> {video.channelTitle}</div>
                    <div><span className="font-medium">Duration:</span> {video.duration}</div>
                    <div><span className="font-medium">Published:</span> {formatDate(video.publishedAt)}</div>
                    <div><span className="font-medium">URL:</span> <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Video</a></div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Statistics</h4>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                    <div><span className="font-medium">Views:</span> {parseInt(video.stats.viewCount).toLocaleString()}</div>
                    <div><span className="font-medium">Likes:</span> {parseInt(video.stats.likeCount).toLocaleString()}</div>
                    <div><span className="font-medium">Comments:</span> {parseInt(video.stats.commentCount).toLocaleString()}</div>
                    <div>
                      <span className="font-medium">Engagement Rate:</span>{' '}
                      {(parseInt(video.stats.viewCount) > 0 
                        ? ((parseInt(video.stats.likeCount) + parseInt(video.stats.commentCount)) / parseInt(video.stats.viewCount) * 100).toFixed(2)
                        : '0')}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Raw JSON */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Raw JSON Data</h4>
                <div className="bg-gray-900 rounded-lg p-3 overflow-auto max-h-96">
                  <pre className="text-xs text-green-400 whitespace-pre-wrap">
                    {JSON.stringify(video, null, 2)}
                  </pre>
                </div>
              </div>
            </div>

            {/* Thumbnail */}
            <div className="mt-4">
              <h4 className="font-semibold text-gray-900 mb-2">Thumbnail</h4>
              <img 
                src={video.thumbnail} 
                alt={video.title}
                className="w-full max-w-sm mx-auto rounded-lg shadow-md"
              />
            </div>
          </CardContent>
        </Card>
      ))}

      {videos.length === 0 && (
        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardContent className="text-center py-12">
            <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No video data available</p>
            <p className="text-sm text-gray-400 mt-1">Connect your YouTube API to see raw data</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RawDataTab;
