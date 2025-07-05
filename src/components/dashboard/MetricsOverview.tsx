
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Eye, Users, ThumbsUp, MessageCircle } from 'lucide-react';
import { useYouTube } from '@/contexts/YouTubeContext';

const MetricsOverview = () => {
  const { videos, isLoading } = useYouTube();

  // Calculate aggregated metrics from real video data
  const calculateMetrics = () => {
    if (videos.length === 0) {
      return {
        totalViews: '0',
        totalLikes: '0',
        totalComments: '0',
        avgEngagement: '0',
      };
    }

    const totalViews = videos.reduce((sum, video) => sum + parseInt(video.stats.viewCount || '0'), 0);
    const totalLikes = videos.reduce((sum, video) => sum + parseInt(video.stats.likeCount || '0'), 0);
    const totalComments = videos.reduce((sum, video) => sum + parseInt(video.stats.commentCount || '0'), 0);
    
    // Calculate engagement rate as (likes + comments) / views * 100
    const engagementRate = totalViews > 0 ? ((totalLikes + totalComments) / totalViews * 100) : 0;

    const formatNumber = (num: number) => {
      if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
      if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
      return num.toString();
    };

    return {
      totalViews: formatNumber(totalViews),
      totalLikes: formatNumber(totalLikes),
      totalComments: formatNumber(totalComments),
      avgEngagement: engagementRate.toFixed(1),
    };
  };

  const metrics = calculateMetrics();

  const metricsConfig = [
    {
      title: 'Total Views',
      value: isLoading ? '...' : metrics.totalViews,
      change: '+12.5%', // These would be calculated from historical data
      trend: 'up',
      icon: Eye,
      description: 'Across all videos',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Likes',
      value: isLoading ? '...' : metrics.totalLikes,
      change: '+8.2%',
      trend: 'up',
      icon: ThumbsUp,
      description: 'All-time likes',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Engagement Rate',
      value: isLoading ? '...' : `${metrics.avgEngagement}%`,
      change: '-0.3%',
      trend: 'down',
      icon: Users,
      description: 'Avg. per video',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      title: 'Comments',
      value: isLoading ? '...' : metrics.totalComments,
      change: '+15.7%',
      trend: 'up',
      icon: MessageCircle,
      description: 'Total comments',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricsConfig.map((metric, index) => {
        const Icon = metric.icon;
        const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown;
        
        return (
          <Card key={index} className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/70 transition-all duration-300 hover:shadow-lg hover:scale-105">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 ${metric.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${metric.color}`} />
                </div>
                <Badge variant={metric.trend === 'up' ? 'default' : 'secondary'} 
                       className={metric.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                  <TrendIcon className="h-3 w-3 mr-1" />
                  {metric.change}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-gray-900">{metric.value}</h3>
                <p className="text-sm font-medium text-gray-700">{metric.title}</p>
                <p className="text-xs text-gray-500">{metric.description}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default MetricsOverview;
