
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThumbsUp, MessageCircle, Share2, Users } from 'lucide-react';

const EngagementRings = () => {
  const engagementData = [
    {
      label: 'Likes',
      value: 87,
      count: '24.3K',
      icon: ThumbsUp,
      color: 'stroke-blue-500',
      bgColor: 'text-blue-600',
    },
    {
      label: 'Comments',
      value: 65,
      count: '2.1K',
      icon: MessageCircle,
      color: 'stroke-purple-500',
      bgColor: 'text-purple-600',
    },
    {
      label: 'Shares',
      value: 43,
      count: '892',
      icon: Share2,
      color: 'stroke-indigo-500',
      bgColor: 'text-indigo-600',
    },
    {
      label: 'Subscribers',
      value: 78,
      count: '1.2K',
      icon: Users,
      color: 'stroke-teal-500',
      bgColor: 'text-teal-600',
    },
  ];

  const createPath = (percentage: number, radius: number = 40) => {
    const angle = (percentage / 100) * 2 * Math.PI - Math.PI / 2;
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);
    const largeArcFlag = percentage > 50 ? 1 : 0;
    
    return `M 50,10 A ${radius},${radius} 0 ${largeArcFlag},1 ${x},${y}`;
  };

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ThumbsUp className="h-5 w-5 text-purple-600" />
          <span>Engagement Breakdown</span>
        </CardTitle>
        <CardDescription>Performance rings showing engagement metrics</CardDescription>
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
            <span className="font-semibold text-gray-900">Overall Engagement:</span> 68% above channel average
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EngagementRings;
