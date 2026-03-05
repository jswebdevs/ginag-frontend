import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import Navbar from "@/components/shared/navbar/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import TanstackProvider from "@/lib/tanstack";
import Footer from "@/components/shared/footer/Footer";
import Navbar1 from "@/components/shared/navbar/Navbar1";
import Navbar2 from "@/components/shared/navbar/Navbar2";
import Navbar3 from "@/components/shared/navbar/Navbar3";
import Navbar4 from "@/components/shared/navbar/Navbar4";
import FooterNewsletter from "@/components/shared/footer/FooterNewsLetter";
import FooterMinimal from "@/components/shared/footer/FooterMinimal";
import FooterDark from "@/components/shared/footer/FooterDark";
import FooterService from "@/components/shared/footer/FooterService";

export const metadata: Metadata = {
  title: {
    default: "Dream Shop | Premium E-commerce",
    template: "%s | Dream Shop"
  },
  icons: {
    icon: [
      { url: '/dreamecommerce.svg' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' }
    ],
    apple: [
      { url: '/dreamecommerce.svg' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' }
    ]
  },
  description: "The best place to find everything you need with fast delivery.",
  keywords: ["ecommerce", "shopping", "bangladesh", "online store"],
  authors: [{ name: "JS Web Devs" }],
  openGraph: {
    type: "website",
    locale: "en_IE",
    url: "https://yourdreamshop.com",
    siteName: "Dream Shop"
  }
};

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
              <Footer/>

            </ThemeProvider>
          </AuthProvider>
        </TanstackProvider>
      </body>
    </html>
  );
}