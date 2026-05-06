import dynamic from "next/dynamic";
import GinaGHero from "@/components/home/hero/GinaGHero";
import StickyBanner from "@/components/home/sections/StickyBanner";
import { getHomepageConfig, getFeaturedProducts } from "@/lib/getSettings";

// Below-the-fold sections — code-split to keep the initial bundle lean.
// They still SSR (default), just shipped in their own chunks.
const FeaturedProducts = dynamic(() => import("@/components/home/products/FeaturedProducts"));
const StorySection = dynamic(() => import("@/components/home/sections/StorySection"));
const HowItWorks = dynamic(() => import("@/components/home/sections/HowItWorks"));
const GoogleReviewsSection = dynamic(
  () => import("@/components/home/reviews/GoogleReviewsSection"),
);
const FAQSection = dynamic(() => import("@/components/home/sections/FAQSection"));

export default async function Home() {
  const [hp, products] = await Promise.all([getHomepageConfig(), getFeaturedProducts()]);

  const whatsappLink: string = (hp.ginaGHero as any)?.whatsappLink || "";

  return (
    <main className="min-h-screen">
      <StickyBanner data={hp.stickyBanner} whatsappLink={whatsappLink} />
      <GinaGHero heroConfig={hp.ginaGHero} />
      <FeaturedProducts initialProducts={products} />
      <StorySection data={hp.story} />
      <HowItWorks data={hp.howItWorks} whatsappLink={whatsappLink} />
      <GoogleReviewsSection />
      <FAQSection data={hp.faq} />
    </main>
  );
}
