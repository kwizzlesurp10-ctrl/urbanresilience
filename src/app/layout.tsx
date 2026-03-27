import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Urban Resilience AI | Climate Resilience Analytics for Cities',
  description: 'Proactive climate risk platform for city governments and urban planners. predict, prioritize, and communicate climate resilience with AI-driven insights.',
  openGraph: {
    title: 'Urban Resilience AI',
    description: 'See Your City\'s Climate Weak Points Before They Fail',
    url: 'https://urban-resilience-ai.com',
    siteName: 'Urban Resilience AI',
    images: [
      {
        url: 'https://picsum.photos/seed/urban-og/1200/630',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Urban Resilience AI',
    description: 'AI-driven Climate Resilience Analytics Platform for Cities',
    images: ['https://picsum.photos/seed/urban-twitter/1200/630'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Urban Resilience AI",
    "operatingSystem": "Web",
    "applicationCategory": "BusinessApplication",
    "description": "Climate Resilience Analytics Platform for city governments.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-body antialiased min-h-screen selection:bg-primary/30">
        {children}
      </body>
    </html>
  );
}