import PCCategoryBar from "@/components/shared/navbar/PCCategoryBar"; // <-- Add this import
import BrandCloud from "@/components/home/afterhero/BrandCloud";
import DynamicProductGrid from "@/components/home/afterhero/DynamicProductGrid";
import FeaturedCategories from "@/components/home/afterhero/FeaturedProperties";
import FlashSale from "@/components/home/afterhero/FlashSale";
import TrendingProducts from "@/components/home/afterhero/TrendingProducts";
import TrustBar from "@/components/home/afterhero/TrustBar";
import Hero1 from "@/components/home/hero/Hero1";


export default function Home() {
  return (
    <>
      {/* Shows ONLY on PC, ONLY on the Home Page */}
      <PCCategoryBar /> 
      
      <Hero1 />
      <FeaturedCategories/>
      <TrustBar/>
      <TrendingProducts/>
      <FlashSale/>
      <BrandCloud/>
      <DynamicProductGrid/>
    </>
  );
}