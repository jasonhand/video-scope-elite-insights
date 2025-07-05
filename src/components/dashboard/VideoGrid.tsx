
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Eye, ThumbsUp, MessageCircle, TrendingUp, Clock } from 'lucide-react';

const VideoGrid = () => {
  const videos = [
    {
      id: 1,
      title: "Ultimate React Performance Guide 2024",
      thumbnail: "/api/placeholder/320/180",
      views: "125K",
      likes: "3.2K",
      comments: "187",
      duration: "12:34",
      publishedDays: 3,
      performance: "excellent",
      engagement: 4.8,
    },
    {
      id: 2,
      title: "Building Modern Dashboards with Next.js",
      thumbnail: "/api/placeholder/320/180",
      views: "89K",
      likes: "2.1K",
      comments: "94",
      duration: "15:22",
      publishedDays: 7,
      performance: "good",
      engagement: 3.9,
    },
    {
      id: 3,
      title: "TypeScript Tips Every Developer Should Know",
      thumbnail: "/api/placeholder/320/180",
      views: "67K",
      likes: "1.8K",
      comments: "156",
      duration: "8:45",
      publishedDays: 12,
      performance: "good",
      engagement: 4.1,
    },
    {
      id: 4,
      title: "CSS Grid vs Flexbox: Complete Comparison",
      thumbnail: "/api/placeholder/320/180",
      views: "234K",
      likes: "5.7K",
      comments: "312",
      duration: "18:56",
      publishedDays: 18,
      performance: "excellent",
      engagement: 5.2,
    },
  ];

  const getPerformanceBadge = (performance: string) => {
    switch (performance) {
      case 'excellent':
        return <Badge className="bg-green-100 text-green-700">Excellent</Badge>;
      case 'good':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700">Good</Badge>;
      default:
        return <Badge variant="outline">Average</Badge>;
    }
  };

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Play className="h-5 w-5 text-indigo-600" />
          <span>Video Performance Grid</span>
        </CardTitle>
        <CardDescription>Recent video performance with key metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos.map((video) => (
            <div key={video.id} className="group bg-white/40 rounded-lg p-4 hover:bg-white/60 transition-all duration-300 hover:shadow-md">
              {/* Video Thumbnail */}
              <div className="relative mb-4">
                <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                  <Play className="h-12 w-12 text-gray-500 group-hover:text-gray-700 transition-colors" />
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
                <div className="absolute top-2 left-2">
                  {getPerformanceBadge(video.performance)}
                </div>
              </div>

              {/* Video Info */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {video.title}
                </h3>
                
                {/* Metrics Row */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-3 w-3" />
                      <span>{video.views}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ThumbsUp className="h-3 w-3" />
                      <span>{video.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-3 w-3" />
                      <span>{video.comments}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-xs">
                    <Clock className="h-3 w-3" />
                    <span>{video.publishedDays}d ago</span>
                  </div>
                </div>

                {/* Engagement Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Engagement Rate</span>
                    <span className="font-medium text-gray-900">{video.engagement}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(video.engagement / 6) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Action */}
        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center justify-center space-x-2 mx-auto transition-colors">
            <TrendingUp className="h-4 w-4" />
            <span>View All Videos</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoGrid;
