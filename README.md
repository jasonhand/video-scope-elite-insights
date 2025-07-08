# VideoScope Pro - Executive YouTube Analytics Dashboard

**URL**: [https://video-scope-elite-insights.lovable.app/]

## What is VideoScope Pro?

VideoScope Pro is a sophisticated YouTube analytics dashboard designed for content creators, marketers, and executives who need comprehensive insights into their video performance. It provides real-time analytics, engagement metrics, and performance trends across multiple YouTube videos and channels.

## Key Features

### 📊 **Comprehensive Analytics Dashboard**
- **Metrics Overview**: Total views, likes, comments, and engagement rates across all videos
- **Performance Trends**: Real-time trend analysis comparing newest vs oldest content
- **Engagement Rings**: Visual representation of audience engagement patterns
- **Performance Charts**: Interactive charts showing video performance over time

### 🎯 **Multi-Tab Analysis**
- **Overview Tab**: High-level metrics and key performance indicators
- **Performance Tab**: Detailed performance analytics and comparisons
- **Engagement Tab**: Deep dive into audience engagement metrics
- **Insights Tab**: AI-powered insights and recommendations
- **Raw Data Tab**: Exportable data for further analysis

### 🔗 **YouTube API Integration**
- Seamless connection to YouTube Data API v3
- Real-time data fetching and updates
- Support for multiple video URLs and channels
- Automatic video data validation and processing

### 🎨 **Executive-Grade UI**
- Modern, responsive design with glassmorphism effects
- Interactive charts and visualizations using Recharts
- Real-time data refresh capabilities
- Mobile-responsive interface

## How It Works

### 1. **API Setup**
- Connect your YouTube Data API v3 key (free tier: 10,000 calls/day)
- Automatic API key validation and secure storage
- One-time setup process

### 2. **Video Management**
- Add YouTube video URLs to track
- Automatic video ID extraction and data fetching
- Support for both individual videos and channel-wide analysis
- Remove videos from tracking as needed

### 3. **Data Processing**
- Real-time fetching of video statistics (views, likes, comments)
- Automatic calculation of engagement rates
- Trend analysis based on publish dates
- Data formatting and visualization

### 4. **Analytics Dashboard**
- Interactive metrics cards with trend indicators
- Detailed modal views for each metric
- Performance comparisons and insights
- Exportable data for external analysis

## Technology Stack

This project is built with modern web technologies:

- **Frontend**: React 18 with TypeScript
- **UI Framework**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom animations
- **Charts**: Recharts for data visualization
- **State Management**: React Context API
- **HTTP Client**: TanStack Query for API management
- **Build Tool**: Vite for fast development and building
- **Routing**: React Router DOM

## Getting Started

### Prerequisites
- Node.js & npm (install with [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- YouTube Data API v3 key from [Google Cloud Console](https://console.cloud.google.com/)

### Installation

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd video-scope-elite-insights

# Step 3: Install dependencies
npm install

# Step 4: Start the development server
npm run dev
```

### API Key Setup

1. Visit the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the YouTube Data API v3
4. Create credentials (API Key)
5. Copy your API key and paste it into the VideoScope Pro setup screen

## Usage

1. **Connect API**: Enter your YouTube Data API key in the setup screen
2. **Add Videos**: Input YouTube video URLs to track their performance
3. **View Analytics**: Navigate through different tabs to explore various metrics
4. **Refresh Data**: Click the refresh button to get the latest data
5. **Export Insights**: Use the Raw Data tab to export analytics for external analysis

## Project Structure

```
src/
├── components/
│   ├── dashboard/          # Analytics dashboard components
│   ├── setup/             # API setup and configuration
│   └── ui/                # Reusable UI components
├── contexts/              # React context providers
├── hooks/                 # Custom React hooks
├── pages/                 # Application pages
├── services/              # API services and utilities
└── lib/                   # Utility functions
```

## Deployment

### Via Lovable
Simply open [Lovable](https://lovable.dev/projects/46a3c4ad-e9ac-42fb-a766-220d4dc39d22) and click on Share → Publish.

### Custom Domain
To connect a custom domain, navigate to Project > Settings > Domains and click Connect Domain. Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Contributing

This project is built with Lovable. You can contribute by:

1. **Using Lovable**: Visit the [Lovable Project](https://lovable.dev/projects/46a3c4ad-e9ac-42fb-a766-220d4dc39d22) and start prompting
2. **Local Development**: Clone the repo and push changes
3. **GitHub**: Edit files directly in GitHub or use GitHub Codespaces

## License

This project is part of the Lovable platform. See Lovable's terms of service for more information.
