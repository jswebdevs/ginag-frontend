import SingleCategoryAuthorityHero from "@/components/home/hero/SingleCategoryAuthorityHero";
import ProductShowcase from "@/components/home/products/ProductShowcase";
import IndustrialProcess from "@/components/home/sections/IndustrialProcess";
import MaterialTechnology from "@/components/home/sections/MaterialTechnology";
import PersonalizationBlueprint from "@/components/home/sections/PersonalizationBlueprint";
import TechnicalIntegrity from "@/components/home/sections/TechnicalIntegrity";
import AestheticLifestyle from "@/components/home/sections/AestheticLifestyle";
import GiftCuration from "@/components/home/sections/GiftCuration";

export default function Home() {
  return (
    <main className="min-h-screen">
      <SingleCategoryAuthorityHero />
      <IndustrialProcess />
      <ProductShowcase />
      <MaterialTechnology />
      <PersonalizationBlueprint />
      <TechnicalIntegrity />
      <AestheticLifestyle />
      <GiftCuration />
    </main>
  );
}