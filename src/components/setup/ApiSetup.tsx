
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Play, Key, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

interface ApiSetupProps {
  onConnect: () => void;
}

const ApiSetup = ({ onConnect }: ApiSetupProps) => {
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleValidateApi = async () => {
    if (!apiKey.trim()) return;
    
    setIsValidating(true);
    
    // Simulate API validation
    setTimeout(() => {
      setValidationStatus('success');
      setIsValidating(false);
      setTimeout(() => {
        onConnect();
      }, 1500);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <Play className="h-8 w-8 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Welcome to VideoScope Pro
            </h1>
            <p className="text-xl text-gray-600 mt-2">
              Executive-level YouTube analytics made beautiful
            </p>
          </div>
        </div>

        {/* Setup Card */}
        <Card className="bg-white/70 backdrop-blur-md border-white/20 shadow-xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl flex items-center justify-center space-x-2">
              <Key className="h-6 w-6 text-blue-600" />
              <span>Connect Your YouTube API</span>
            </CardTitle>
            <CardDescription className="text-base">
              Connect your YouTube Data API to unlock powerful analytics insights
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* API Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-blue-900">Real-time Data</p>
                <p className="text-xs text-blue-700">Live performance metrics</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="h-4 w-4 text-purple-600" />
                </div>
                <p className="text-sm font-medium text-purple-900">Deep Analytics</p>
                <p className="text-xs text-purple-700">Detailed engagement data</p>
              </div>
              <div className="text-center p-4 bg-indigo-50 rounded-lg">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="h-4 w-4 text-indigo-600" />
                </div>
                <p className="text-sm font-medium text-indigo-900">Multi-Channel</p>
                <p className="text-xs text-indigo-700">Track all your channels</p>
              </div>
            </div>

            {/* API Key Input */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey" className="text-base font-medium">
                  YouTube Data API v3 Key
                </Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="h-12 text-base bg-white/60 border-white/30"
                />
              </div>

              {/* Validation Status */}
              {validationStatus === 'success' && (
                <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">API key validated successfully!</span>
                </div>
              )}

              {validationStatus === 'error' && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium">Invalid API key. Please check and try again.</span>
                </div>
              )}

              {/* Connect Button */}
              <Button 
                onClick={handleValidateApi}
                disabled={!apiKey.trim() || isValidating}
                className="w-full h-12 text-base bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isValidating ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Validating API Key...</span>
                  </div>
                ) : (
                  'Connect & Launch Dashboard'
                )}
              </Button>
            </div>

            {/* Help Link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">
                Need help getting your API key?
              </p>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                <ExternalLink className="h-4 w-4 mr-2" />
                YouTube API Setup Guide
              </Button>
            </div>

            {/* Free Tier Badge */}
            <div className="flex justify-center">
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                Free Tier: 10,000 API calls/day
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>Secure • Privacy-First • Executive-Grade Analytics</p>
        </div>
      </div>
    </div>
  );
};

export default ApiSetup;
