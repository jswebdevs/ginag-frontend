import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import Navbar from "@/components/shared/navbar/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import TanstackProvider from "@/lib/tanstack";
import Footer from "@/components/shared/footer/Footer";

// 1. Import your new settings fetcher
import { getGlobalSettings } from "@/lib/getSettings";

// 2. Replace static metadata with dynamic generateMetadata
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getGlobalSettings();

  // 3. Set up dynamic variables with your existing fallbacks
  const storeName = settings?.storeName || "Dream Shop";
  const tagline = settings?.tagline || "The best place to find everything you need with fast delivery.";

  // Use uploaded favicon, fallback to your local SVG
  const faviconUrl = settings?.favicon?.thumbUrl || settings?.favicon?.originalUrl || "/dreamecommerce.svg";

  // Use uploaded OG Image, fallback to your local site URL
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
      locale: "en_IE", // Or "bn_BD" depending on your target audience!
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
        <TanstackProvider>
          <AuthProvider>
            <ThemeProvider>

              {/* Navbars */}
              <Navbar />

              <main className="flex-1">
                {children}
              </main>

              <Footer />

            </ThemeProvider>
          </AuthProvider>
        </TanstackProvider>
      </body>
    </html>
  );
}