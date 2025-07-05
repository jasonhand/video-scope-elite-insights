
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Calendar } from 'lucide-react';
import { useYouTube } from '@/contexts/YouTubeContext';

const PerformanceChart = () => {
  const { videos, isLoading } = useYouTube();

  // Transform real video data into chart format
  const createChartData = () => {
    if (videos.length === 0) return [];

    // Sort videos by publish date and create a timeline
    const sortedVideos = [...videos].sort((a, b) => 
      new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
    );

    return sortedVideos.map((video, index) => {
      const views = parseInt(video.stats.viewCount || '0');
      const likes = parseInt(video.stats.likeCount || '0');
      const comments = parseInt(video.stats.commentCount || '0');
      const engagement = views > 0 ? ((likes + comments) / views * 100) : 0;
      
      const publishDate = new Date(video.publishedAt);
      const dayName = publishDate.toLocaleDateString('en-US', { weekday: 'short' });
      
      return {
        day: `${dayName} ${publishDate.getDate()}`,
        views: views,
        engagement: engagement,
        title: video.title.substring(0, 30) + (video.title.length > 30 ? '...' : ''),
      };
    });
  };

  const chartData = createChartData();
  const maxViews = chartData.length > 0 ? Math.max(...chartData.map(d => d.views)) : 1;

  // Calculate summary stats
  const totalViews = chartData.reduce((sum, d) => sum + d.views, 0);
  const avgEngagement = chartData.length > 0 
    ? chartData.reduce((sum, d) => sum + d.engagement, 0) / chartData.length 
    : 0;

  if (isLoading) {
    return (
      <Card className="bg-white/60 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <span>Performance Trajectory</span>
          </CardTitle>
          <CardDescription>Loading video performance data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span>Performance Trajectory</span>
            </CardTitle>
            <CardDescription>Video performance by publish date</CardDescription>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            <Calendar className="h-3 w-3 mr-1" />
            {videos.length} Videos
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Chart Area */}
          <div className="h-48 flex items-end justify-between space-x-2 bg-gradient-to-t from-blue-50 to-transparent p-4 rounded-lg">
            {chartData.map((data, index) => (
              <div key={index} className="flex flex-col items-center space-y-2 flex-1">
                <div className="w-full flex flex-col items-center">
                  {/* Views Bar */}
                  <div 
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-sm hover:from-blue-600 hover:to-blue-400 transition-all duration-300 cursor-pointer group relative"
                    style={{ height: `${(data.views / maxViews) * 120}px`, minHeight: '8px' }}
                    title={`${data.title}: ${data.views.toLocaleString()} views`}
                  >
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                      {data.title}
                      <br />
                      {data.views.toLocaleString()} views
                      <br />
                      {data.engagement.toFixed(1)}% engagement
                    </div>
                  </div>
                  {/* Engagement Indicator */}
                  <div 
                    className="w-2 h-2 bg-purple-500 rounded-full mt-1"
                    style={{ opacity: Math.min(data.engagement / 10, 1) }}
                    title={`${data.engagement.toFixed(1)}% engagement`}
                  />
                </div>
                <span className="text-xs font-medium text-gray-600 text-center">{data.day}</span>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-300 rounded"></div>
              <span className="text-gray-600">Views</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-gray-600">Engagement</span>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">
                {totalViews >= 1000000 ? `${(totalViews / 1000000).toFixed(1)}M` : 
                 totalViews >= 1000 ? `${(totalViews / 1000).toFixed(1)}K` : 
                 totalViews.toString()}
              </p>
              <p className="text-sm text-gray-600">Total Views</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-purple-600">{avgEngagement.toFixed(1)}%</p>
              <p className="text-sm text-gray-600">Avg Engagement</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
