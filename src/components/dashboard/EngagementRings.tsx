
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThumbsUp, MessageCircle, Share2, Users } from 'lucide-react';
import { useYouTube } from '@/contexts/YouTubeContext';

const EngagementRings = () => {
  const { videos, isLoading } = useYouTube();

  const calculateEngagementData = () => {
    if (videos.length === 0) {
      return [
        { label: 'Likes', value: 0, count: '0', icon: ThumbsUp, color: 'stroke-blue-500', bgColor: 'text-blue-600' },
        { label: 'Comments', value: 0, count: '0', icon: MessageCircle, color: 'stroke-purple-500', bgColor: 'text-purple-600' },
        { label: 'Views', value: 0, count: '0', icon: Share2, color: 'stroke-indigo-500', bgColor: 'text-indigo-600' },
        { label: 'Engagement', value: 0, count: '0%', icon: Users, color: 'stroke-teal-500', bgColor: 'text-teal-600' },
      ];
    }

    const totalViews = videos.reduce((sum, video) => sum + parseInt(video.stats.viewCount || '0'), 0);
    const totalLikes = videos.reduce((sum, video) => sum + parseInt(video.stats.likeCount || '0'), 0);
    const totalComments = videos.reduce((sum, video) => sum + parseInt(video.stats.commentCount || '0'), 0);
    
    // Find the maximum values for percentage calculations
    const maxViews = Math.max(...videos.map(v => parseInt(v.stats.viewCount || '0')));
    const maxLikes = Math.max(...videos.map(v => parseInt(v.stats.likeCount || '0')));
    const maxComments = Math.max(...videos.map(v => parseInt(v.stats.commentCount || '0')));
    
    const formatNumber = (num: number) => {
      if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
      if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
      return num.toString();
    };

    // Calculate engagement rate
    const engagementRate = totalViews > 0 ? ((totalLikes + totalComments) / totalViews * 100) : 0;

    return [
      {
        label: 'Likes',
        value: maxLikes > 0 ? Math.round((totalLikes / maxLikes) * 100) : 0,
        count: formatNumber(totalLikes),
        icon: ThumbsUp,
        color: 'stroke-blue-500',
        bgColor: 'text-blue-600',
      },
      {
        label: 'Comments',
        value: maxComments > 0 ? Math.round((totalComments / maxComments) * 100) : 0,
        count: formatNumber(totalComments),
        icon: MessageCircle,
        color: 'stroke-purple-500',
        bgColor: 'text-purple-600',
      },
      {
        label: 'Views',
        value: maxViews > 0 ? Math.round((totalViews / maxViews) * 100) : 0,
        count: formatNumber(totalViews),
        icon: Share2,
        color: 'stroke-indigo-500',
        bgColor: 'text-indigo-600',
      },
      {
        label: 'Engagement',
        value: Math.min(Math.round(engagementRate * 10), 100), // Scale engagement rate for visual representation
        count: `${engagementRate.toFixed(1)}%`,
        icon: Users,
        color: 'stroke-teal-500',
        bgColor: 'text-teal-600',
      },
    ];
  };

  const engagementData = calculateEngagementData();

  if (isLoading) {
    return (
      <Card className="bg-white/60 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ThumbsUp className="h-5 w-5 text-purple-600" />
            <span>Engagement Breakdown</span>
          </CardTitle>
          <CardDescription>Loading engagement metrics...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate overall engagement score
  const overallEngagement = engagementData[3]?.count || '0%';
  const totalVideos = videos.length;

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ThumbsUp className="h-5 w-5 text-purple-600" />
          <span>Engagement Breakdown</span>
        </CardTitle>
        <CardDescription>Real-time engagement metrics from your videos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          {engagementData.map((item, index) => {
            const Icon = item.icon;
            
            return (
              <div key={index} className="flex flex-col items-center space-y-3 p-4 hover:bg-gray-50/50 rounded-lg transition-colors">
                {/* Ring Chart */}
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background Circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="rgb(229 231 235)"
                      strokeWidth="8"
                    />
                    {/* Progress Circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      className={item.color}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${(item.value / 100) * 251.2} 251.2`}
                      style={{
                        transition: 'stroke-dasharray 1s ease-in-out',
                      }}
                    />
                  </svg>
                  
                  {/* Center Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <Icon className={`h-4 w-4 ${item.bgColor}`} />
                    </div>
                  </div>
                  
                  {/* Percentage Label */}
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                    <span className="text-xs font-bold text-gray-700 bg-white px-2 py-1 rounded-full shadow-sm">
                      {item.value}%
                    </span>
                  </div>
                </div>

                {/* Labels */}
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">{item.count}</p>
                  <p className="text-sm text-gray-600">{item.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">Overall Engagement:</span> {overallEngagement} across {totalVideos} videos
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EngagementRings;
