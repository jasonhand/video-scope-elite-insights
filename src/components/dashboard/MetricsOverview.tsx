
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Eye, Users, ThumbsUp, MessageCircle, MousePointer } from 'lucide-react';
import { useYouTube } from '@/contexts/YouTubeContext';
import MetricDetailModal from './MetricDetailModal';

const MetricsOverview = () => {
  const { videos, isLoading } = useYouTube();
  const [selectedMetric, setSelectedMetric] = useState<'views' | 'likes' | 'engagement' | 'comments' | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMetricClick = (metricType: 'views' | 'likes' | 'engagement' | 'comments') => {
    setSelectedMetric(metricType);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMetric(null);
  };

  // Calculate real trends by comparing newest vs oldest videos (by publish date)
  const calculateRealTrends = () => {
    if (videos.length < 2) {
      return {
        viewsTrend: 0,
        likesTrend: 0,
        engagementTrend: 0,
        commentsTrend: 0,
      };
    }

    // Sort videos by publish date
    const sortedVideos = [...videos].sort((a, b) => 
      new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
    );

    const oldestHalf = sortedVideos.slice(0, Math.floor(sortedVideos.length / 2));
    const newestHalf = sortedVideos.slice(Math.floor(sortedVideos.length / 2));

    const calcAverage = (videoList: typeof videos, metric: string) => {
      const sum = videoList.reduce((acc, video) => acc + parseInt(video.stats[metric as keyof typeof video.stats] || '0'), 0);
      return sum / videoList.length;
    };

    const oldViewsAvg = calcAverage(oldestHalf, 'viewCount');
    const newViewsAvg = calcAverage(newestHalf, 'viewCount');
    const oldLikesAvg = calcAverage(oldestHalf, 'likeCount');
    const newLikesAvg = calcAverage(newestHalf, 'likeCount');
    const oldCommentsAvg = calcAverage(oldestHalf, 'commentCount');
    const newCommentsAvg = calcAverage(newestHalf, 'commentCount');

    const oldEngagementAvg = oldViewsAvg > 0 ? ((oldLikesAvg + oldCommentsAvg) / oldViewsAvg * 100) : 0;
    const newEngagementAvg = newViewsAvg > 0 ? ((newLikesAvg + newCommentsAvg) / newViewsAvg * 100) : 0;

    return {
      viewsTrend: oldViewsAvg > 0 ? ((newViewsAvg - oldViewsAvg) / oldViewsAvg * 100) : 0,
      likesTrend: oldLikesAvg > 0 ? ((newLikesAvg - oldLikesAvg) / oldLikesAvg * 100) : 0,
      engagementTrend: oldEngagementAvg > 0 ? ((newEngagementAvg - oldEngagementAvg) / oldEngagementAvg * 100) : 0,
      commentsTrend: oldCommentsAvg > 0 ? ((newCommentsAvg - oldCommentsAvg) / oldCommentsAvg * 100) : 0,
    };
  };

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
  const trends = calculateRealTrends();

  const metricsConfig = [
    {
      title: 'Total Views',
      value: isLoading ? '...' : metrics.totalViews,
      change: `${trends.viewsTrend >= 0 ? '+' : ''}${trends.viewsTrend.toFixed(1)}%`,
      trend: trends.viewsTrend >= 0 ? 'up' : 'down',
      icon: Eye,
      description: 'Across all videos',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      metricType: 'views' as const,
    },
    {
      title: 'Total Likes',
      value: isLoading ? '...' : metrics.totalLikes,
      change: `${trends.likesTrend >= 0 ? '+' : ''}${trends.likesTrend.toFixed(1)}%`,
      trend: trends.likesTrend >= 0 ? 'up' : 'down',
      icon: ThumbsUp,
      description: 'All-time likes',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      metricType: 'likes' as const,
    },
    {
      title: 'Engagement Rate',
      value: isLoading ? '...' : `${metrics.avgEngagement}%`,
      change: `${trends.engagementTrend >= 0 ? '+' : ''}${trends.engagementTrend.toFixed(1)}%`,
      trend: trends.engagementTrend >= 0 ? 'up' : 'down',
      icon: Users,
      description: 'Avg. per video',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      metricType: 'engagement' as const,
    },
    {
      title: 'Comments',
      value: isLoading ? '...' : metrics.totalComments,
      change: `${trends.commentsTrend >= 0 ? '+' : ''}${trends.commentsTrend.toFixed(1)}%`,
      trend: trends.commentsTrend >= 0 ? 'up' : 'down',
      icon: MessageCircle,
      description: 'Total comments',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      metricType: 'comments' as const,
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricsConfig.map((metric, index) => {
          const Icon = metric.icon;
          const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown;
          
          return (
            <Card 
              key={index} 
              className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/70 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer group"
              onClick={() => handleMetricClick(metric.metricType)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 ${metric.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${metric.color}`} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={metric.trend === 'up' ? 'default' : 'secondary'} 
                           className={metric.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                      <TrendIcon className="h-3 w-3 mr-1" />
                      {metric.change}
                    </Badge>
                    <MousePointer className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
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

      <MetricDetailModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        metricType={selectedMetric}
      />
    </>
  );
};

export default MetricsOverview;
