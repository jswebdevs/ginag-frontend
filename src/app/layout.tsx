import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import Navbar from "@/components/shared/navbar/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import TanstackProvider from "@/lib/tanstack";
import Footer from "@/components/shared/footer/Footer";
import { Toaster } from "sonner";

// 1. Settings and Guard Imports
import { getGlobalSettings, getActiveTheme } from "@/lib/getSettings";
import MaintenanceGuard from "@/components/shared/MaintenanceGuard";

// 🔥 Import the Global Floating Components
import FloatingWidget from "@/components/shared/chatbox/FloatingWidget";
import ToTopButton from "@/components/shared/totop/ToTopButton";

export const revalidate = 60; // revalidate layout data at most every 60 s

// 2. Dynamic Metadata Generation
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getGlobalSettings();

  const storeName = settings?.storeName || "Ginag";
  const tagline = settings?.tagline || "The best place to find everything you need with fast delivery.";
  const faviconUrl = settings?.favicon?.originalUrl || settings?.favicon?.thumbUrl || "/dreamecommerce.svg";
  const ogImageUrl = settings?.ogImage?.originalUrl || "https://yourdreamshop.com/default-og.jpg";

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_CLIENT_URL || "https://yourdreamshop.com"),
    title: {
      default: `${storeName} | ${tagline}`,
      template: `%s | ${storeName}`,
    },
    description: tagline,
    keywords: ["handmade bag charms", "custom purse charms", "personalized charms", "beaded bag charms", storeName.toLowerCase()],
    authors: [{ name: storeName }],
    creator: storeName,
    publisher: storeName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    icons: {
      icon: [
        { url: faviconUrl },
        { url: faviconUrl, sizes: '32x32', type: 'image/png' },
        { url: faviconUrl, sizes: '16x16', type: 'image/png' },
      ],
      shortcut: faviconUrl,
      apple: [
        { url: faviconUrl },
        { url: faviconUrl, sizes: '180x180', type: 'image/png' },
      ],
      other: [
        {
          rel: 'apple-touch-icon-precomposed',
          url: faviconUrl,
        },
      ],
    },
    manifest: '/manifest.json',
    alternates: {
      canonical: '/',
    },

    openGraph: {
      type: "website",
      locale: "en_US",
      url: "/",
      siteName: storeName,
      title: storeName,
      description: tagline,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${storeName} Banner`,
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: storeName,
      description: tagline,
      images: [ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export function generateViewport() {
  return {
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: '#ffffff' },
      { media: '(prefers-color-scheme: dark)', color: '#000000' },
    ],
  };
}


import { SettingsProvider } from "@/context/SettingsContext";

// 3. Updated Async Root Layout
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, activeTheme] = await Promise.all([
    getGlobalSettings(),
    getActiveTheme(),
  ]);

  const isMaintenanceMode = settings?.maintenanceMode ?? false;
  const maintenanceMessage = settings?.maintenanceMessage || "Our store is currently undergoing maintenance. We'll be back shortly!";

  return (
    <html lang="en" suppressHydrationWarning>
      {/* Apply dark class before paint to prevent flash of wrong theme */}
      <head>
        {/* Resource hints — establish early connection to the API server */}
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_API_URL?.split('/api')[0] ?? 'http://localhost:3000'} />
        <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_API_URL?.split('/api')[0] ?? 'http://localhost:3000'} />
        <script dangerouslySetInnerHTML={{
          __html: `
          (function(){
            try {
              var s = localStorage.getItem('dreamshop-theme-storage');
              var isDark = s ? JSON.parse(s)?.state?.isDark : true;
              if (isDark !== false) document.documentElement.classList.add('dark');
            } catch(e) { document.documentElement.classList.add('dark'); }
          })();
        `}} />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold focus:shadow-theme-lg"
        >
          Skip to main content
        </a>
        <TanstackProvider>
          <AuthProvider>
            <SettingsProvider initialSettings={settings}>
              <ThemeProvider initialTheme={activeTheme}>

              <MaintenanceGuard
                isMaintenanceMode={isMaintenanceMode}
                message={maintenanceMessage}
              >
                <Navbar initialSettings={settings} />
                <main id="main-content" className="flex-1">
                  {children}
                </main>
                <Footer />
              </MaintenanceGuard>

              {/* These components use React Portals to break out of layout constraints automatically */}
              {!isMaintenanceMode && (
                <>
                  <FloatingWidget />
                  <ToTopButton />
                </>
              )}

              <Toaster richColors position="top-right" />

            </ThemeProvider>
            </SettingsProvider>
          </AuthProvider>
        </TanstackProvider>
      </body>
    </html>
  );
}