
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, BarChart3, Clock, Calendar } from 'lucide-react';
import { useYouTube } from '@/contexts/YouTubeContext';

const PerformanceTab = () => {
  const { videos, isLoading } = useYouTube();

  const calculatePerformanceMetrics = () => {
    if (videos.length === 0) return null;

    const sortedByViews = [...videos].sort((a, b) => 
      parseInt(b.stats.viewCount || '0') - parseInt(a.stats.viewCount || '0')
    );

    const sortedByEngagement = [...videos].map(video => {
      const views = parseInt(video.stats.viewCount || '0');
      const likes = parseInt(video.stats.likeCount || '0');
      const comments = parseInt(video.stats.commentCount || '0');
      const engagement = views > 0 ? ((likes + comments) / views * 100) : 0;
      return { ...video, engagementRate: engagement };
    }).sort((a, b) => b.engagementRate - a.engagementRate);

    const totalViews = videos.reduce((sum, v) => sum + parseInt(v.stats.viewCount || '0'), 0);
    const avgViews = totalViews / videos.length;

    const totalLikes = videos.reduce((sum, v) => sum + parseInt(v.stats.likeCount || '0'), 0);
    const avgLikes = totalLikes / videos.length;

    const totalComments = videos.reduce((sum, v) => sum + parseInt(v.stats.commentCount || '0'), 0);
    const avgComments = totalComments / videos.length;

    // Calculate days since published for each video
    const videosWithAge = videos.map(video => ({
      ...video,
      daysOld: Math.floor((Date.now() - new Date(video.publishedAt).getTime()) / (1000 * 60 * 60 * 24))
    }));

    return {
      topPerformer: sortedByViews[0],
      mostEngaging: sortedByEngagement[0],
      averages: { views: avgViews, likes: avgLikes, comments: avgComments },
      videosWithAge,
      totalViews,
      totalLikes,
      totalComments,
    };
  };

  const metrics = calculatePerformanceMetrics();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardContent className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading performance analytics...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="space-y-6">
        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardContent className="text-center py-12">
            <p className="text-gray-500">No video data available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return Math.round(num).toString();
  };

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span>Top Performer</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 line-clamp-2">{metrics.topPerformer.title}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>{formatNumber(parseInt(metrics.topPerformer.stats.viewCount))} views</span>
                <span>{formatNumber(parseInt(metrics.topPerformer.stats.likeCount))} likes</span>
              </div>
              <Badge className="bg-blue-100 text-blue-700">Best Views</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              <span>Most Engaging</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 line-clamp-2">{metrics.mostEngaging.title}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>{metrics.mostEngaging.engagementRate.toFixed(1)}% engagement</span>
              </div>
              <Badge className="bg-purple-100 text-purple-700">Best Engagement</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-indigo-600" />
              <span>Averages</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm">
                <span className="text-gray-600">Views: </span>
                <span className="font-semibold">{formatNumber(metrics.averages.views)}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Likes: </span>
                <span className="font-semibold">{formatNumber(metrics.averages.likes)}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Comments: </span>
                <span className="font-semibold">{formatNumber(metrics.averages.comments)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Performance Table */}
      <Card className="bg-white/60 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <span>Detailed Performance Analysis</span>
          </CardTitle>
          <CardDescription>Comprehensive view of all video metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.videosWithAge.map((video, index) => {
              const views = parseInt(video.stats.viewCount || '0');
              const likes = parseInt(video.stats.likeCount || '0');
              const comments = parseInt(video.stats.commentCount || '0');
              const engagement = views > 0 ? ((likes + comments) / views * 100) : 0;
              
              return (
                <div key={video.id} className="border rounded-lg p-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{video.title}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Views:</span>
                          <p className="font-semibold">{formatNumber(views)}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Likes:</span>
                          <p className="font-semibold">{formatNumber(likes)}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Comments:</span>
                          <p className="font-semibold">{formatNumber(comments)}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Engagement:</span>
                          <p className="font-semibold">{engagement.toFixed(1)}%</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{video.daysOld} days old</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{video.duration}</span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="w-20 h-12 object-cover rounded"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceTab;
