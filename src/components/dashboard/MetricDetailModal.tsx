import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  ThumbsUp, 
  MessageCircle, 
  Users, 
  TrendingUp, 
  TrendingDown,
  Play,
  ExternalLink
} from 'lucide-react';
import { useYouTube } from '@/contexts/YouTubeContext';

interface MetricDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  metricType: 'views' | 'likes' | 'engagement' | 'comments' | null;
}

const MetricDetailModal = ({ isOpen, onClose, metricType }: MetricDetailModalProps) => {
  const { videos } = useYouTube();

  const getMetricConfig = () => {
    switch (metricType) {
      case 'views':
        return {
          title: 'Total Views',
          icon: Eye,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          description: 'Videos sorted by view count',
          sortKey: 'viewCount' as keyof typeof videos[0]['stats'],
          formatValue: (value: string) => {
            const num = parseInt(value || '0');
            if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
            if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
            return num.toLocaleString();
          }
        };
      case 'likes':
        return {
          title: 'Total Likes',
          icon: ThumbsUp,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          description: 'Videos sorted by like count',
          sortKey: 'likeCount' as keyof typeof videos[0]['stats'],
          formatValue: (value: string) => {
            const num = parseInt(value || '0');
            if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
            if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
            return num.toLocaleString();
          }
        };
      case 'engagement':
        return {
          title: 'Engagement Rate',
          icon: Users,
          color: 'text-indigo-600',
          bgColor: 'bg-indigo-50',
          description: 'Videos sorted by engagement rate',
          sortKey: 'engagement' as keyof typeof videos[0]['stats'],
          formatValue: (value: string) => `${parseFloat(value || '0').toFixed(1)}%`
        };
      case 'comments':
        return {
          title: 'Comments',
          icon: MessageCircle,
          color: 'text-teal-600',
          bgColor: 'bg-teal-50',
          description: 'Videos sorted by comment count',
          sortKey: 'commentCount' as keyof typeof videos[0]['stats'],
          formatValue: (value: string) => {
            const num = parseInt(value || '0');
            if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
            if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
            return num.toLocaleString();
          }
        };
      default:
        return null;
    }
  };

  const config = getMetricConfig();
  if (!config) return null;

  const Icon = config.icon;

  // Sort videos by the selected metric
  const sortedVideos = [...videos].sort((a, b) => {
    if (config.sortKey === 'engagement') {
      const aViews = parseInt(a.stats.viewCount || '0');
      const bViews = parseInt(b.stats.viewCount || '0');
      const aEngagement = aViews > 0 ? ((parseInt(a.stats.likeCount || '0') + parseInt(a.stats.commentCount || '0')) / aViews * 100) : 0;
      const bEngagement = bViews > 0 ? ((parseInt(b.stats.likeCount || '0') + parseInt(b.stats.commentCount || '0')) / bViews * 100) : 0;
      return bEngagement - aEngagement;
    } else {
      const aValue = parseInt(a.stats[config.sortKey] || '0');
      const bValue = parseInt(b.stats[config.sortKey] || '0');
      return bValue - aValue;
    }
  });

  const formatNumber = (num: string) => {
    const number = parseInt(num || '0');
    if (number >= 1000000) return `${(number / 1000000).toFixed(1)}M`;
    if (number >= 1000) return `${(number / 1000).toFixed(1)}K`;
    return number.toLocaleString();
  };

  const daysSincePublished = (publishedAt: string) => {
    const publishDate = new Date(publishedAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - publishDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className={`w-8 h-8 ${config.bgColor} rounded-lg flex items-center justify-center`}>
              <Icon className={`h-4 w-4 ${config.color}`} />
            </div>
            {config.title}
          </DialogTitle>
          <DialogDescription>
            {config.description} - Showing {videos.length} videos
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {sortedVideos.map((video, index) => {
            const views = parseInt(video.stats.viewCount || '0');
            const likes = parseInt(video.stats.likeCount || '0');
            const comments = parseInt(video.stats.commentCount || '0');
            const engagement = views > 0 ? ((likes + comments) / views * 100) : 0;
            
            const metricValue = config.sortKey === 'engagement' 
              ? engagement.toString()
              : video.stats[config.sortKey] || '0';

            return (
              <Card key={video.id} className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/70 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1 min-w-0">
                      {/* Rank */}
                      <div className="flex-shrink-0">
                        <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center p-0 text-sm font-bold">
                          #{index + 1}
                        </Badge>
                      </div>

                      {/* Video Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
                              {video.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">{video.channelTitle}</p>
                            
                            {/* Metrics Row */}
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
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
                              <div className="flex items-center space-x-1">
                                <Users className="h-3 w-3" />
                                <span>{engagement.toFixed(1)}%</span>
                              </div>
                              <span className="text-xs text-gray-400">
                                {daysSincePublished(video.publishedAt)}d ago
                              </span>
                            </div>
                          </div>

                          {/* Primary Metric Value */}
                          <div className="flex-shrink-0 ml-4 text-right">
                            <div className="text-2xl font-bold text-gray-900">
                              {config.formatValue(metricValue)}
                            </div>
                            <div className="text-sm text-gray-500 capitalize">
                              {config.sortKey === 'viewCount' ? 'Views' : 
                               config.sortKey === 'likeCount' ? 'Likes' :
                               config.sortKey === 'commentCount' ? 'Comments' : 'Engagement'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex-shrink-0 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(video.url, '_blank')}
                        className="flex items-center gap-1"
                      >
                        <Play className="h-3 w-3" />
                        Watch
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {videos.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Icon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No videos available</p>
            <p className="text-sm text-gray-400 mt-1">Connect your YouTube API to see video data</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MetricDetailModal; 