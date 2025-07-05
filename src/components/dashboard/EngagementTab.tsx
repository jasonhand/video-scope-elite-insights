
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, MessageCircle, Users, Heart, TrendingUp } from 'lucide-react';
import { useYouTube } from '@/contexts/YouTubeContext';

const EngagementTab = () => {
  const { videos, isLoading } = useYouTube();

  const calculateEngagementAnalysis = () => {
    if (videos.length === 0) return null;

    // Calculate engagement metrics for each video
    const videosWithEngagement = videos.map(video => {
      const views = parseInt(video.stats.viewCount || '0');
      const likes = parseInt(video.stats.likeCount || '0');
      const comments = parseInt(video.stats.commentCount || '0');
      
      const likeRate = views > 0 ? (likes / views * 100) : 0;
      const commentRate = views > 0 ? (comments / views * 100) : 0;
      const totalEngagement = views > 0 ? ((likes + comments) / views * 100) : 0;
      
      return {
        ...video,
        metrics: {
          likeRate,
          commentRate,
          totalEngagement,
          likesToComments: comments > 0 ? likes / comments : likes > 0 ? Infinity : 0,
        }
      };
    });

    // Sort by different engagement metrics
    const sortedByEngagement = [...videosWithEngagement].sort((a, b) => 
      b.metrics.totalEngagement - a.metrics.totalEngagement
    );
    
    const sortedByLikes = [...videosWithEngagement].sort((a, b) => 
      b.metrics.likeRate - a.metrics.likeRate
    );
    
    const sortedByComments = [...videosWithEngagement].sort((a, b) => 
      b.metrics.commentRate - a.metrics.commentRate
    );

    // Calculate averages
    const avgEngagement = videosWithEngagement.reduce((sum, v) => sum + v.metrics.totalEngagement, 0) / videos.length;
    const avgLikeRate = videosWithEngagement.reduce((sum, v) => sum + v.metrics.likeRate, 0) / videos.length;
    const avgCommentRate = videosWithEngagement.reduce((sum, v) => sum + v.metrics.commentRate, 0) / videos.length;

    return {
      videosWithEngagement,
      topEngagement: sortedByEngagement[0],
      topLikes: sortedByLikes[0],
      topComments: sortedByComments[0],
      averages: {
        engagement: avgEngagement,
        likeRate: avgLikeRate,
        commentRate: avgCommentRate,
      }
    };
  };

  const analysis = calculateEngagementAnalysis();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardContent className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span className="ml-2">Loading engagement analytics...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="space-y-6">
        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardContent className="text-center py-12">
            <p className="text-gray-500">No engagement data available</p>
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
      {/* Engagement Champions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-500" />
              <span>Best Overall</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 line-clamp-2">{analysis.topEngagement.title}</h3>
              <div className="text-sm text-gray-600">
                <p>{analysis.topEngagement.metrics.totalEngagement.toFixed(2)}% engagement</p>
              </div>
              <Badge className="bg-red-100 text-red-700">Top Engagement</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <ThumbsUp className="h-5 w-5 text-blue-600" />
              <span>Most Liked</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 line-clamp-2">{analysis.topLikes.title}</h3>
              <div className="text-sm text-gray-600">
                <p>{analysis.topLikes.metrics.likeRate.toFixed(2)}% like rate</p>
                <p>{formatNumber(parseInt(analysis.topLikes.stats.likeCount))} total likes</p>
              </div>
              <Badge className="bg-blue-100 text-blue-700">Best Likes</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-purple-600" />
              <span>Most Discussion</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 line-clamp-2">{analysis.topComments.title}</h3>
              <div className="text-sm text-gray-600">
                <p>{analysis.topComments.metrics.commentRate.toFixed(2)}% comment rate</p>
                <p>{formatNumber(parseInt(analysis.topComments.stats.commentCount))} comments</p>
              </div>
              <Badge className="bg-purple-100 text-purple-700">Best Comments</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Breakdown Chart */}
      <Card className="bg-white/60 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            <span>Engagement Rate Comparison</span>
          </CardTitle>
          <CardDescription>Visual comparison of engagement rates across all videos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysis.videosWithEngagement.map((video, index) => {
              const maxEngagement = Math.max(...analysis.videosWithEngagement.map(v => v.metrics.totalEngagement));
              const barWidth = maxEngagement > 0 ? (video.metrics.totalEngagement / maxEngagement * 100) : 0;
              
              return (
                <div key={video.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900 truncate flex-1 pr-4">
                      {video.title}
                    </h4>
                    <span className="text-sm font-semibold text-gray-700">
                      {video.metrics.totalEngagement.toFixed(2)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>👍 {video.metrics.likeRate.toFixed(2)}%</span>
                    <span>💬 {video.metrics.commentRate.toFixed(2)}%</span>
                    <span>👁️ {formatNumber(parseInt(video.stats.viewCount))} views</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Engagement Insights */}
      <Card className="bg-white/60 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-teal-600" />
            <span>Engagement Insights</span>
          </CardTitle>
          <CardDescription>Key takeaways from your engagement data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {analysis.averages.engagement.toFixed(1)}%
              </div>
              <p className="text-sm text-blue-700">Average Engagement Rate</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {analysis.averages.likeRate.toFixed(2)}%
              </div>
              <p className="text-sm text-purple-700">Average Like Rate</p>
            </div>
            <div className="text-center p-4 bg-teal-50 rounded-lg">
              <div className="text-2xl font-bold text-teal-600">
                {analysis.averages.commentRate.toFixed(3)}%
              </div>
              <p className="text-sm text-teal-700">Average Comment Rate</p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">💡 Key Insights:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Your best-performing video has {analysis.topEngagement.metrics.totalEngagement.toFixed(1)}% engagement rate</li>
              <li>• Videos with higher like rates tend to perform {analysis.averages.likeRate > 2 ? 'exceptionally well' : 'moderately well'}</li>
              <li>• Comment engagement is {analysis.averages.commentRate > 0.5 ? 'strong' : 'developing'} - consider more discussion-provoking content</li>
              <li>• Total engagement across all videos: {videos.length} videos analyzed</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EngagementTab;
