
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Eye, Users, ThumbsUp, MessageCircle } from 'lucide-react';

const MetricsOverview = () => {
  const metrics = [
    {
      title: 'Total Views',
      value: '1.2M',
      change: '+12.5%',
      trend: 'up',
      icon: Eye,
      description: 'Last 30 days',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Subscribers',
      value: '45.8K',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      description: 'Net growth',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Engagement Rate',
      value: '4.7%',
      change: '-0.3%',
      trend: 'down',
      icon: ThumbsUp,
      description: 'Avg. per video',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      title: 'Comments',
      value: '2.3K',
      change: '+15.7%',
      trend: 'up',
      icon: MessageCircle,
      description: 'This month',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
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
