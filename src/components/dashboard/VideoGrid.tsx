
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Eye, ThumbsUp, MessageCircle, TrendingUp, Clock } from 'lucide-react';

const VideoGrid = () => {
  const videos = [
    {
      id: 1,
      title: "Building a Modern React Dashboard with TypeScript",
      url: "https://youtu.be/qCW1n79Thgo?si=wQAZaqxJ7QgIEPZE",
      thumbnail: `https://img.youtube.com/vi/qCW1n79Thgo/maxresdefault.jpg`,
      views: "85.2K",
      likes: "2.8K",
      comments: "142",
      duration: "16:42",
      publishedDays: 5,
      performance: "excellent",
      engagement: 4.9,
    },
    {
      id: 2,
      title: "Advanced React Hooks and State Management",
      url: "https://youtu.be/QYTe2BBhN1c?si=ad0U74XxX1b0-Ilo",
      thumbnail: `https://img.youtube.com/vi/QYTe2BBhN1c/maxresdefault.jpg`,
      views: "127K",
      likes: "3.4K",
      comments: "218",
      duration: "22:15",
      publishedDays: 12,
      performance: "excellent",
      engagement: 5.1,
    },
    {
      id: 3,
      title: "Next.js 14 App Router Complete Guide",
      url: "https://youtu.be/qgTu6hv6Hys?si=BXduNRB9KnuJMEUR",
      thumbnail: `https://img.youtube.com/vi/qgTu6hv6Hys/maxresdefault.jpg`,
      views: "94.7K",
      likes: "2.1K",
      comments: "167",
      duration: "19:33",
      publishedDays: 8,
      performance: "good",
      engagement: 4.2,
    },
    {
      id: 4,
      title: "Tailwind CSS Pro Tips and Advanced Techniques",
      url: "https://youtu.be/ciLO96MDFbE?si=uL5DW5MBJ69PWhc8",
      thumbnail: `https://img.youtube.com/vi/ciLO96MDFbE/maxresdefault.jpg`,
      views: "156K",
      likes: "4.2K",
      comments: "289",
      duration: "14:28",
      publishedDays: 3,
      performance: "excellent",
      engagement: 5.3,
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
                  {getPerformanceBadge(video.performance)}
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
