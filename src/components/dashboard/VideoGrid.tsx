
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Eye, ThumbsUp, MessageCircle, TrendingUp, Clock, Loader2 } from 'lucide-react';
import { useYouTube } from '@/contexts/YouTubeContext';

const VideoGrid = () => {
  const { videos, isLoading, error } = useYouTube();

  const getPerformanceBadge = (viewCount: string, likeCount: string) => {
    const views = parseInt(viewCount || '0');
    const likes = parseInt(likeCount || '0');
    const engagementRate = views > 0 ? (likes / views * 100) : 0;
    
    if (engagementRate > 4) {
      return <Badge className="bg-green-100 text-green-700">Excellent</Badge>;
    } else if (engagementRate > 2) {
      return <Badge variant="secondary" className="bg-blue-100 text-blue-700">Good</Badge>;
    }
    return <Badge variant="outline">Average</Badge>;
  };

  const formatNumber = (num: string) => {
    const number = parseInt(num || '0');
    if (number >= 1000000) return `${(number / 1000000).toFixed(1)}M`;
    if (number >= 1000) return `${(number / 1000).toFixed(1)}K`;
    return number.toString();
  };

  const calculateEngagementRate = (views: string, likes: string, comments: string) => {
    const viewCount = parseInt(views || '0');
    const likeCount = parseInt(likes || '0');
    const commentCount = parseInt(comments || '0');
    
    if (viewCount === 0) return 0;
    return ((likeCount + commentCount) / viewCount * 100);
  };

  const daysSincePublished = (publishedAt: string) => {
    const publishDate = new Date(publishedAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - publishDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (error) {
    return (
      <Card className="bg-white/60 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-600">
            <Play className="h-5 w-5" />
            <span>Video Performance Grid</span>
          </CardTitle>
          <CardDescription>Error loading video data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-600">
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Play className="h-5 w-5 text-indigo-600" />
          <span>Video Performance Grid</span>
        </CardTitle>
        <CardDescription>Real-time video performance with key metrics</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading video analytics...</span>
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No videos found. Please check your API connection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videos.map((video) => {
              const engagementRate = calculateEngagementRate(
                video.stats.viewCount,
                video.stats.likeCount,
                video.stats.commentCount
              );

              return (
                <div key={video.id} className="group bg-white/40 rounded-lg p-4 hover:bg-white/60 transition-all duration-300 hover:shadow-md">
                  {/* Video Thumbnail */}
                  <div className="relative mb-4">
                    <a href={video.url} target="_blank" rel="noopener noreferrer" className="block">
                      <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg overflow-hidden relative">
                        <img 
                          src={video.thumbnail} 
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                        <div className="hidden absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                          <Play className="h-12 w-12 text-gray-500 group-hover:text-gray-700 transition-colors" />
                        </div>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                          <Play className="h-12 w-12 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </a>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                    <div className="absolute top-2 left-2">
                      {getPerformanceBadge(video.stats.viewCount, video.stats.likeCount)}
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="space-y-3">
                    <a href={video.url} target="_blank" rel="noopener noreferrer">
                      <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {video.title}
                      </h3>
                    </a>
                    
                    {/* Metrics Row */}
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>{formatNumber(video.stats.viewCount)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ThumbsUp className="h-3 w-3" />
                          <span>{formatNumber(video.stats.likeCount)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="h-3 w-3" />
                          <span>{formatNumber(video.stats.commentCount)}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-xs">
                        <Clock className="h-3 w-3" />
                        <span>{daysSincePublished(video.publishedAt)}d ago</span>
                      </div>
                    </div>

                    {/* Engagement Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">Engagement Rate</span>
                        <span className="font-medium text-gray-900">{engagementRate.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((engagementRate / 6) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Action */}
        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center justify-center space-x-2 mx-auto transition-colors">
            <TrendingUp className="h-4 w-4" />
            <span>Refresh Data</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoGrid;
