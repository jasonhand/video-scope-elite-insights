
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

export interface VideoStats {
  viewCount: string;
  likeCount: string;
  commentCount: string;
  subscriberCount?: string;
}

export interface VideoData {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  duration: string;
  stats: VideoStats;
  url: string;
}

export interface ChannelData {
  subscriberCount: string;
  viewCount: string;
  videoCount: string;
}

export class YouTubeApiService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  // Extract video ID from YouTube URL
  private extractVideoId(url: string): string | null {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  // Convert ISO 8601 duration to readable format
  private parseDuration(duration: string): string {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return '0:00';
    
    const hours = (match[1] || '').replace('H', '');
    const minutes = (match[2] || '').replace('M', '');
    const seconds = (match[3] || '').replace('S', '');
    
    if (hours) {
      return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
    }
    return `${minutes || '0'}:${seconds.padStart(2, '0')}`;
  }

  // Calculate days since published
  private daysSincePublished(publishedAt: string): number {
    const publishDate = new Date(publishedAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - publishDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Fetch video data by URLs
  async fetchVideosByUrls(urls: string[]): Promise<VideoData[]> {
    const videoIds = urls.map(url => this.extractVideoId(url)).filter(Boolean);
    
    if (videoIds.length === 0) {
      throw new Error('No valid video IDs found');
    }

    const response = await fetch(
      `${YOUTUBE_API_BASE}/videos?id=${videoIds.join(',')}&part=snippet,statistics,contentDetails&key=${this.apiKey}`
    );

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();
    
    return data.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.maxresdefault?.url || item.snippet.thumbnails.high.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      duration: this.parseDuration(item.contentDetails.duration),
      url: urls.find(url => this.extractVideoId(url) === item.id) || '',
      stats: {
        viewCount: item.statistics.viewCount || '0',
        likeCount: item.statistics.likeCount || '0',
        commentCount: item.statistics.commentCount || '0',
      }
    }));
  }

  // Fetch channel data
  async fetchChannelData(channelId: string): Promise<ChannelData> {
    const response = await fetch(
      `${YOUTUBE_API_BASE}/channels?id=${channelId}&part=statistics&key=${this.apiKey}`
    );

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();
    const stats = data.items[0]?.statistics;

    return {
      subscriberCount: stats?.subscriberCount || '0',
      viewCount: stats?.viewCount || '0',
      videoCount: stats?.videoCount || '0',
    };
  }

  // Validate API key
  async validateApiKey(): Promise<boolean> {
    try {
      const response = await fetch(`${YOUTUBE_API_BASE}/videos?id=dQw4w9WgXcQ&part=snippet&key=${this.apiKey}`);
      return response.ok;
    } catch {
      return false;
    }
  }
}
