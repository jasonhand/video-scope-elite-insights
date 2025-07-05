
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { YouTubeApiService, VideoData } from '@/services/youtubeApi';

interface YouTubeContextType {
  apiKey: string | null;
  videos: VideoData[];
  isLoading: boolean;
  error: string | null;
  setApiKey: (key: string) => void;
  refreshData: () => Promise<void>;
  addVideos: (urls: string[]) => Promise<void>;
  removeVideo: (videoId: string) => void;
}

const YouTubeContext = createContext<YouTubeContextType | undefined>(undefined);

const DEFAULT_VIDEOS = [
  'https://youtu.be/qCW1n79Thgo?si=wQAZaqxJ7QgIEPZE',
  'https://youtu.be/QYTe2BBhN1c?si=ad0U74XxX1b0-Ilo',
  'https://youtu.be/qgTu6hv6Hys?si=BXduNRB9KnuJMEUR',
  'https://youtu.be/ciLO96MDFbE?si=uL5DW5MBJ69PWhc8',
];

export const YouTubeProvider = ({ children }: { children: ReactNode }) => {
  const [apiKey, setApiKeyState] = useState<string | null>(
    localStorage.getItem('youtube_api_key')
  );
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setApiKey = (key: string) => {
    localStorage.setItem('youtube_api_key', key);
    setApiKeyState(key);
  };

  const refreshData = async () => {
    if (!apiKey) return;

    setIsLoading(true);
    setError(null);

    try {
      const service = new YouTubeApiService(apiKey);
      const videoUrls = videos.length > 0 
        ? videos.map(v => v.url)
        : DEFAULT_VIDEOS;
      
      const fetchedVideos = await service.fetchVideosByUrls(videoUrls);
      setVideos(fetchedVideos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch video data');
    } finally {
      setIsLoading(false);
    }
  };

  const addVideos = async (urls: string[]) => {
    if (!apiKey) return;

    setIsLoading(true);
    setError(null);

    try {
      const service = new YouTubeApiService(apiKey);
      const newVideos = await service.fetchVideosByUrls(urls);
      setVideos(prev => [...prev, ...newVideos]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add videos');
    } finally {
      setIsLoading(false);
    }
  };

  const removeVideo = (videoId: string) => {
    setVideos(prev => prev.filter(v => v.id !== videoId));
  };

  // Load default videos when API key is set
  useEffect(() => {
    if (apiKey && videos.length === 0) {
      refreshData();
    }
  }, [apiKey]);

  return (
    <YouTubeContext.Provider value={{
      apiKey,
      videos,
      isLoading,
      error,
      setApiKey,
      refreshData,
      addVideos,
      removeVideo,
    }}>
      {children}
    </YouTubeContext.Provider>
  );
};

export const useYouTube = () => {
  const context = useContext(YouTubeContext);
  if (context === undefined) {
    throw new Error('useYouTube must be used within a YouTubeProvider');
  }
  return context;
};
