import PCCategoryBar from "@/components/shared/navbar/PCCategoryBar";
import Hero1 from "@/components/home/hero/Hero1";
import BrandCloud from "@/components/home/afterhero/BrandCloud";
import FeaturedCategories from "@/components/home/afterhero/FeaturedCategories";
import FlashSale from "@/components/home/afterhero/FlashSale";
import TrendingProducts from "@/components/home/afterhero/TrendingProducts";
import BrandStory from "@/components/home/afterhero/BrandStory";
import NewArrivals from "@/components/home/afterhero/NewArrivals";
import DynamicProductGrid from "@/components/home/afterhero/DynamicProductGrid";
import Testimonials from "@/components/home/afterhero/Testimonials";
import HomeBlogs from "@/components/home/afterhero/HomeBlogs";
import NewsLetter from "@/components/home/afterhero/NewsLetter";
import TrustBar from "@/components/home/afterhero/TrustBar";

export default function Home() {
  return (
    <>
      {/* 0. Optional PC Category Bar */}
      {/* <PCCategoryBar /> */}

      {/* 1. The Hook */}
      <Hero1 />

      {/* 2. Instant Trust & Authority */}
      <BrandCloud />

      {/* 3. Visual Directory Window Shopping */}
      <FeaturedCategories />

      {/* 4. The FOMO Generator (Urgency) */}
      <FlashSale />

      {/* 5. Social Proof (What others are buying) */}
      <TrendingProducts />

      {/* 6. Editorial Lifestyle & Manifesto */}
      <BrandStory />

      {/* 7. Fresh Out The Oven */}
      <NewArrivals />

      {/* 8. Deep Dive Product Grid (More to explore) */}
      <DynamicProductGrid />

      {/* 9. Authentic User Reviews */}
      <Testimonials />

      {/* 10. Value-Add Content & SEO Boost */}
      <HomeBlogs />

      {/* 11. The VIP Club Lead Capture */}
      <NewsLetter />

      {/* 12. Final Reassurance before Footer */}
      <TrustBar />
    </>
  );
}