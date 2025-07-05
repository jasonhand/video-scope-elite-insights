
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Lightbulb, Target, TrendingUp, Clock, Calendar } from 'lucide-react';
import { useYouTube } from '@/contexts/YouTubeContext';

const InsightsTab = () => {
  const { videos, isLoading } = useYouTube();

  const generateInsights = () => {
    if (videos.length === 0) return null;

    // Sort videos by publish date
    const sortedByDate = [...videos].sort((a, b) => 
      new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
    );

    // Calculate various metrics
    const totalViews = videos.reduce((sum, v) => sum + parseInt(v.stats.viewCount || '0'), 0);
    const totalLikes = videos.reduce((sum, v) => sum + parseInt(v.stats.likeCount || '0'), 0);
    const totalComments = videos.reduce((sum, v) => sum + parseInt(v.stats.commentCount || '0'), 0);

    // Performance analysis
    const avgViews = totalViews / videos.length;
    const avgLikes = totalLikes / videos.length;
    const avgComments = totalComments / videos.length;
    const overallEngagement = totalViews > 0 ? ((totalLikes + totalComments) / totalViews * 100) : 0;

    // Find patterns
    const bestPerformer = videos.reduce((best, current) => 
      parseInt(current.stats.viewCount || '0') > parseInt(best.stats.viewCount || '0') ? current : best
    );

    const mostEngaging = videos.reduce((best, current) => {
      const currentViews = parseInt(current.stats.viewCount || '0');
      const currentLikes = parseInt(current.stats.likeCount || '0');
      const currentComments = parseInt(current.stats.commentCount || '0');
      const currentEngagement = currentViews > 0 ? ((currentLikes + currentComments) / currentViews * 100) : 0;
      
      const bestViews = parseInt(best.stats.viewCount || '0');
      const bestLikes = parseInt(best.stats.likeCount || '0');
      const bestComments = parseInt(best.stats.commentCount || '0');
      const bestEngagement = bestViews > 0 ? ((bestLikes + bestComments) / bestViews * 100) : 0;
      
      return currentEngagement > bestEngagement ? current : best;
    });

    // Content analysis
    const avgTitleLength = videos.reduce((sum, v) => sum + v.title.length, 0) / videos.length;
    const videosWithNumbers = videos.filter(v => /\d/.test(v.title)).length;
    const videosWithQuestions = videos.filter(v => /\?/.test(v.title)).length;

    // Timing analysis
    const publishDates = videos.map(v => new Date(v.publishedAt));
    const publishDays = publishDates.map(d => d.getDay()); // 0 = Sunday, 1 = Monday, etc.
    const dayFrequency = publishDays.reduce((acc, day) => {
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const mostFrequentDay = Object.entries(dayFrequency).reduce((a, b) => 
      dayFrequency[parseInt(a[0])] > dayFrequency[parseInt(b[0])] ? a : b
    )[0];

    return {
      performance: {
        totalViews,
        avgViews,
        avgLikes,
        avgComments,
        overallEngagement,
        bestPerformer,
        mostEngaging,
      },
      content: {
        avgTitleLength,
        videosWithNumbers,
        videosWithQuestions,
        totalVideos: videos.length,
      },
      timing: {
        mostFrequentDay: dayNames[parseInt(mostFrequentDay)],
        dayFrequency,
        dayNames,
      },
    };
  };

  const insights = generateInsights();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardContent className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-2">Generating insights...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="space-y-6">
        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardContent className="text-center py-12">
            <p className="text-gray-500">No data available for insights</p>
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
      {/* Key Performance Insights */}
      <Card className="bg-white/60 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span>Performance Insights</span>
          </CardTitle>
          <CardDescription>Data-driven insights about your video performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">🏆 Top Performer</h4>
                <p className="text-sm text-green-800">
                  "{insights.performance.bestPerformer.title}" leads with{' '}
                  {formatNumber(parseInt(insights.performance.bestPerformer.stats.viewCount))} views
                </p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">🎯 Most Engaging</h4>
                <p className="text-sm text-blue-800">
                  "{insights.performance.mostEngaging.title}" has the highest engagement rate
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2">📊 Channel Health</h4>
                <p className="text-sm text-purple-800">
                  Overall engagement rate: {insights.performance.overallEngagement.toFixed(2)}%<br/>
                  Average views per video: {formatNumber(insights.performance.avgViews)}
                </p>
              </div>
              
              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-semibold text-orange-900 mb-2">💡 Quick Stats</h4>
                <p className="text-sm text-orange-800">
                  Total: {formatNumber(insights.performance.totalViews)} views across {insights.content.totalVideos} videos
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Strategy Insights */}
      <Card className="bg-white/60 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-purple-600" />
            <span>Content Strategy Analysis</span>
          </CardTitle>
          <CardDescription>Insights about your content patterns and optimization opportunities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(insights.content.avgTitleLength)}
              </div>
              <p className="text-sm text-gray-600">Average Title Length</p>
              <p className="text-xs text-gray-500 mt-1">
                {insights.content.avgTitleLength > 60 ? 'Consider shorter titles' : 'Good title length'}
              </p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {insights.content.videosWithNumbers}
              </div>
              <p className="text-sm text-gray-600">Videos with Numbers</p>
              <p className="text-xs text-gray-500 mt-1">
                Numbers can increase CTR
              </p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {insights.content.videosWithQuestions}
              </div>
              <p className="text-sm text-gray-600">Videos with Questions</p>
              <p className="text-xs text-gray-500 mt-1">
                Questions drive engagement
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Publishing Schedule Insights */}
      <Card className="bg-white/60 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <span>Publishing Pattern Analysis</span>
          </CardTitle>
          <CardDescription>When you publish and how it affects performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">📅 Most Active Day</h4>
              <p className="text-sm text-blue-800">
                You publish most often on {insights.timing.mostFrequentDay}s
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Publishing Frequency by Day</h4>
              {insights.timing.dayNames.map((day, index) => {
                const count = insights.timing.dayFrequency[index] || 0;
                const maxCount = Math.max(...Object.values(insights.timing.dayFrequency));
                const barWidth = maxCount > 0 ? (count / maxCount * 100) : 0;
                
                return (
                  <div key={day} className="flex items-center space-x-3">
                    <div className="w-20 text-sm text-gray-600">{day}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                      <div 
                        className="bg-blue-500 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${barWidth}%` }}
                      />
                      <span className="absolute right-2 top-0 text-xs text-gray-700 leading-4">
                        {count}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actionable Recommendations */}
      <Card className="bg-white/60 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            <span>Actionable Recommendations</span>
          </CardTitle>
          <CardDescription>Data-driven suggestions to improve your video performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-yellow-400 bg-yellow-50">
              <h4 className="font-semibold text-yellow-900">🎯 Content Optimization</h4>
              <ul className="text-sm text-yellow-800 mt-2 space-y-1">
                <li>• Consider analyzing what made "{insights.performance.bestPerformer.title}" successful</li>
                <li>• Your most engaging content gets {insights.performance.overallEngagement.toFixed(1)}% engagement - aim to match this</li>
                {insights.content.avgTitleLength > 60 && <li>• Try shorter titles (under 60 characters) for better mobile visibility</li>}
                {insights.content.videosWithNumbers < insights.content.totalVideos * 0.5 && <li>• Include numbers in titles - they tend to increase click-through rates</li>}
              </ul>
            </div>
            
            <div className="p-4 border-l-4 border-blue-400 bg-blue-50">
              <h4 className="font-semibold text-blue-900">📈 Growth Opportunities</h4>
              <ul className="text-sm text-blue-800 mt-2 space-y-1">
                <li>• Focus on topics similar to your top performer to maintain momentum</li>
                <li>• Consider creating series or follow-ups to your most engaging content</li>
                <li>• Your average of {formatNumber(insights.performance.avgViews)} views per video shows room for growth</li>
              </ul>
            </div>
            
            <div className="p-4 border-l-4 border-green-400 bg-green-50">
              <h4 className="font-semibold text-green-900">⏰ Timing Strategy</h4>
              <ul className="text-sm text-green-800 mt-2 space-y-1">
                <li>• You publish most on {insights.timing.mostFrequentDay}s - consider if this timing works for your audience</li>
                <li>• Experiment with different days to find your optimal posting schedule</li>
                <li>• Consistency is key - maintain regular publishing patterns</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InsightsTab;
