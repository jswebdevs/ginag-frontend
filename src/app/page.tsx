import SingleCategoryAuthorityHero from "@/components/home/hero/SingleCategoryAuthorityHero";
import ProductShowcase from "@/components/home/products/ProductShowcase";

export default function Home() {
  return (
    <main className="min-h-screen">
      <SingleCategoryAuthorityHero />
      <ProductShowcase />
    </main>
  );
}