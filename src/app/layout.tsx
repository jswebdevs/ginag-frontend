import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import Navbar from "@/components/shared/navbar/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import TanstackProvider from "@/lib/tanstack";
import Footer from "@/components/shared/footer/Footer";

// 1. Settings and Guard Imports
import { getGlobalSettings } from "@/lib/getSettings";
import MaintenanceGuard from "@/components/shared/MaintenanceGuard";

// 🔥 Import the Global Floating Components
import FloatingWidget from "@/components/shared/chatbox/FloatingWidget";
import ToTopButton from "@/components/shared/totop/ToTopButton";

// 2. Dynamic Metadata Generation
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getGlobalSettings();

  const storeName = settings?.storeName || "Dream Shop";
  const tagline = settings?.tagline || "The best place to find everything you need with fast delivery.";
  const faviconUrl = settings?.favicon?.thumbUrl || settings?.favicon?.originalUrl || "/dreamecommerce.svg";
  const ogImageUrl = settings?.ogImage?.originalUrl || "https://yourdreamshop.com/default-og.jpg";

  return {
    title: {
      default: `${storeName} | Premium E-commerce`,
      template: `%s | ${storeName}`,
    },
    description: tagline,
    keywords: ["ecommerce", "shopping", "bangladesh", "online store"],
    authors: [{ name: "JS Web Devs" }],
    icons: {
      icon: [
        { url: faviconUrl },
        { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' }
      ],
      apple: [
        { url: faviconUrl },
        { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' }
      ]
    },
    openGraph: {
      type: "website",
      locale: "en_IE",
      url: "https://yourdreamshop.com",
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
    }
  };
}

// 3. Updated Async Root Layout
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getGlobalSettings();

  const isMaintenanceMode = settings?.maintenanceMode ?? false;
  const maintenanceMessage = settings?.maintenanceMessage || "Our store is currently undergoing maintenance. We'll be back shortly!";

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
        <TanstackProvider>
          <AuthProvider>
            <ThemeProvider>

              <MaintenanceGuard
                isMaintenanceMode={isMaintenanceMode}
                message={maintenanceMessage}
              >
                <Navbar />
                <main className="flex-1">
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

            </ThemeProvider>
          </AuthProvider>
        </TanstackProvider>
      </body>
    </html>
  );
}