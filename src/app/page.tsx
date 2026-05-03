import GinaGHero from "@/components/home/hero/GinaGHero";
import FeaturedProducts from "@/components/home/products/FeaturedProducts";
import StorySection from "@/components/home/sections/StorySection";
import HowItWorks from "@/components/home/sections/HowItWorks";
import FAQSection from "@/components/home/sections/FAQSection";
import StickyBanner from "@/components/home/sections/StickyBanner";
import { getHomepageConfig } from "@/lib/getSettings";

export default async function Home() {
  const hp = await getHomepageConfig();
  const whatsappLink: string = (hp.ginaGHero as any)?.whatsappLink || "";

  return (
    <main className="min-h-screen">
      <StickyBanner data={hp.stickyBanner} />
      <GinaGHero />
      <FeaturedProducts />
      <StorySection data={hp.story} />
      <HowItWorks data={hp.howItWorks} whatsappLink={whatsappLink} />
      <FAQSection data={hp.faq} />
    </main>
  );
}
