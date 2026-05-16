import dynamic from "next/dynamic";
import GinaGHero from "@/components/home/hero/GinaGHero";
import SignatureCharmSection from "@/components/home/sections/SignatureCharmSection";
import { getHomepageConfig, getFeaturedProducts } from "@/lib/getSettings";

// Below-the-fold sections — code-split to keep the initial bundle lean.
// They still SSR (default), just shipped in their own chunks.
const FeaturedProducts = dynamic(() => import("@/components/home/products/FeaturedProducts"));
const StorySection = dynamic(() => import("@/components/home/sections/StorySection"));

export default async function Home() {
  const [hp, products] = await Promise.all([getHomepageConfig(), getFeaturedProducts()]);

  return (
    <main className="min-h-screen">
      <GinaGHero heroConfig={hp.ginaGHero} />
      <SignatureCharmSection />
      <FeaturedProducts initialProducts={products} />
      <StorySection data={hp.story} />
    </main>
  );
}
