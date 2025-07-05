
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Calendar, Trophy, Eye, ThumbsUp, MessageCircle } from 'lucide-react';
import { useYouTube } from '@/contexts/YouTubeContext';

const PerformanceChart = () => {
  const { videos, isLoading } = useYouTube();

  // Get top 10 videos by views
  const getTopPerformers = () => {
    if (videos.length === 0) return [];

    return [...videos]
      .sort((a, b) => parseInt(b.stats.viewCount || '0') - parseInt(a.stats.viewCount || '0'))
      .slice(0, 10)
      .map((video, index) => {
        const views = parseInt(video.stats.viewCount || '0');
        const likes = parseInt(video.stats.likeCount || '0');
        const comments = parseInt(video.stats.commentCount || '0');
        const engagement = views > 0 ? ((likes + comments) / views * 100) : 0;
        
        return {
          rank: index + 1,
          title: video.title,
          channel: video.channelTitle,
          views,
          likes,
          comments,
          engagement,
          url: video.url,
          thumbnail: video.thumbnail,
        };
      });
  };

  const topPerformers = getTopPerformers();
  const maxViews = topPerformers.length > 0 ? Math.max(...topPerformers.map(v => v.views)) : 1;

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const daysSincePublished = (publishedAt: string) => {
    const publishDate = new Date(publishedAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - publishDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (isLoading) {
    return (
      <Card className="bg-white/60 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-blue-600" />
            <span>Top Performers</span>
          </CardTitle>
          <CardDescription>Loading top performing videos...</CardDescription>
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
              <Trophy className="h-5 w-5 text-blue-600" />
              <span>Top Performers</span>
            </CardTitle>
            <CardDescription>Top 10 videos by view count</CardDescription>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            <Eye className="h-3 w-3 mr-1" />
            {topPerformers.length} Videos
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Top Performers List */}
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {topPerformers.map((video, index) => (
              <div 
                key={video.rank} 
                className="flex items-center space-x-3 p-3 bg-white/40 rounded-lg hover:bg-white/60 transition-all duration-300 cursor-pointer group"
                onClick={() => window.open(video.url, '_blank')}
              >
                {/* Rank */}
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-700' :
                    index === 1 ? 'bg-gray-100 text-gray-700' :
                    index === 2 ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {video.rank}
                  </div>
                </div>

                {/* Thumbnail */}
                <div className="flex-shrink-0">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-12 h-8 object-cover rounded"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>

                {/* Video Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-600">{video.channel}</p>
                </div>

                {/* Metrics */}
                <div className="flex-shrink-0 text-right">
                  <div className="text-lg font-bold text-gray-900">
                    {formatNumber(video.views)}
                  </div>
                  <div className="text-xs text-gray-500">views</div>
                </div>

                {/* Engagement */}
                <div className="flex-shrink-0 text-right">
                  <div className="text-sm font-medium text-purple-600">
                    {video.engagement.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-500">engagement</div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">
                {formatNumber(topPerformers.reduce((sum, v) => sum + v.views, 0))}
              </p>
              <p className="text-sm text-gray-600">Total Views</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-purple-600">
                {(topPerformers.reduce((sum, v) => sum + v.engagement, 0) / topPerformers.length).toFixed(1)}%
              </p>
              <p className="text-sm text-gray-600">Avg Engagement</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-green-600">
                {formatNumber(topPerformers.reduce((sum, v) => sum + v.likes, 0))}
              </p>
              <p className="text-sm text-gray-600">Total Likes</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
