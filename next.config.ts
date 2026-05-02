import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'picsum.photos', port: '', pathname: '/**' },
      // Mapbox tile CDN — used when NEXT_PUBLIC_MAPBOX_TOKEN is set
      { protocol: 'https', hostname: '*.mapbox.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'api.mapbox.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'events.mapbox.com', port: '', pathname: '/**' },
    ],
  },
};

export default nextConfig;
