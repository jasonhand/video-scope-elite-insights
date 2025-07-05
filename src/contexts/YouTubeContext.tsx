
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
  'https://youtu.be/z45LjlhyGyE?si=6XyBlpUf-MJojL4E',
  'https://youtu.be/MD7L1HdCpX0?si=vuuQkEjq6vFxPLJ7',
  'https://youtu.be/EPZn3gidiS8?si=zIg9IEqXAdW0Ds52',
  'https://youtu.be/UPC03_FD0-I?si=v2573kt4MLY8Ntxd',
  'https://youtu.be/BuPf-qAzTJI?si=lkJaXjYpJ7ALP7Q2',
  'https://youtu.be/0jCd_Rcyl3I?si=Lsr5BRHix9ZNAJp1',
  'https://youtu.be/AcPDrBKy_Uw?si=dKlENNuUY-h39vJg',
  'https://youtu.be/DcnbH45lfkU?si=mIDYmDJOgFKdv8Th',
  'https://youtu.be/l2H0HADOa5o?si=y3LDFRYAeZrxrxw1',
  'https://youtu.be/hESEOJRZ-wc?si=-j-B_Nu-u-POcZ7P',
  'https://youtu.be/EursDsj4dCk?si=qAQ1RAJVVqcUQT7g',
  'https://youtu.be/DkooO8M0Xn8?si=b8b5byeGyZBjs2hM',
  'https://youtu.be/SwQwRsHVjM4?si=s7vgZZcswRY4110q',
  'https://youtu.be/IW9GjOzoFAw?si=lnSmq0l4HyPeFSsO',
  'https://youtu.be/9V5QlhpqBbw?si=4Aveh2AL7c39zXSL',
  'https://youtu.be/OxHCfE1bFBs?si=7QPzEuPrh-gKQNLl',
  'https://youtu.be/-yNJmVCR-nM?si=8ccqcMwOD1eb7XPf',
  'https://youtu.be/5ovKpnUeCb8?si=u-1S_DASN0HmAGZF',
  'https://youtu.be/ciLO96MDFbE?si=S-rqS2MpKTJL-vEx',
  'https://youtu.be/QYTe2BBhN1c?si=ZhNGkUoVoksnppi0',
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
