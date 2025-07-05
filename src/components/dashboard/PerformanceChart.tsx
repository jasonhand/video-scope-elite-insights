
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Calendar } from 'lucide-react';

const PerformanceChart = () => {
  // Mock data for the chart visualization
  const chartData = [
    { day: 'Mon', views: 45000, engagement: 4.2 },
    { day: 'Tue', views: 52000, engagement: 4.8 },
    { day: 'Wed', views: 48000, engagement: 4.1 },
    { day: 'Thu', views: 61000, engagement: 5.2 },
    { day: 'Fri', views: 58000, engagement: 4.9 },
    { day: 'Sat', views: 67000, engagement: 5.8 },
    { day: 'Sun', views: 72000, engagement: 6.1 },
  ];

  const maxViews = Math.max(...chartData.map(d => d.views));

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span>Performance Trajectory</span>
            </CardTitle>
            <CardDescription>Weekly views and engagement trends</CardDescription>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            <Calendar className="h-3 w-3 mr-1" />
            Last 7 days
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Chart Area */}
          <div className="h-48 flex items-end justify-between space-x-2 bg-gradient-to-t from-blue-50 to-transparent p-4 rounded-lg">
            {chartData.map((data, index) => (
              <div key={index} className="flex flex-col items-center space-y-2 flex-1">
                <div className="w-full flex flex-col items-center">
                  {/* Views Bar */}
                  <div 
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-sm hover:from-blue-600 hover:to-blue-400 transition-all duration-300 cursor-pointer"
                    style={{ height: `${(data.views / maxViews) * 120}px` }}
                    title={`${data.views.toLocaleString()} views`}
                  />
                  {/* Engagement Indicator */}
                  <div 
                    className="w-2 h-2 bg-purple-500 rounded-full mt-1"
                    style={{ opacity: data.engagement / 6 }}
                    title={`${data.engagement}% engagement`}
                  />
                </div>
                <span className="text-xs font-medium text-gray-600">{data.day}</span>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-300 rounded"></div>
              <span className="text-gray-600">Views</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-gray-600">Engagement</span>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">403K</p>
              <p className="text-sm text-gray-600">Total Views</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-purple-600">5.0%</p>
              <p className="text-sm text-gray-600">Avg Engagement</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
