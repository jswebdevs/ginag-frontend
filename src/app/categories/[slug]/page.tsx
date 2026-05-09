import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import IconRenderer from "@/components/shared/IconRenderer";
import { LuPackageOpen } from "react-icons/lu";
import ProductCard from "@/components/home/products/ProductCard";

export const revalidate = 120;

async function fetchCategory(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${slug}`, {
      next: { revalidate: 300, tags: [`category-${slug}`] },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.category || json.data || null;
  } catch {
    return null;
  }
}

async function fetchAllCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
      next: { revalidate: 300, tags: ["categories"] },
    });
    if (!res.ok) return [];
    return (await res.json()).data || [];
  } catch {
    return [];
  }
}

async function fetchCategoryProducts(categoryId: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products?category=${categoryId}`,
      { next: { revalidate: 120, tags: [`category-products-${categoryId}`] } },
    );
    if (!res.ok) return [];
    return (await res.json()).data || [];
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await fetchCategory(slug);
  if (!category) return { title: "Category Not Found" };

  const description =
    category.description || `Explore our ${category.name.toLowerCase()} collection.`;

  return {
    title: category.name,
    description,
    openGraph: { title: category.name, description, type: "website" },
    alternates: { canonical: `/categories/${slug}` },
  };
}

export default async function SingleCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await fetchCategory(slug);
  if (!category) notFound();

  const [allCats, products] = await Promise.all([
    fetchAllCategories(),
    fetchCategoryProducts(category.id),
  ]);

  const subcategories = allCats.filter((c: any) => c.parentId === category.id);

  return (
    <div className="min-h-screen bg-background pb-20 animate-in fade-in duration-500">
      <div className="bg-gradient-theme border-b border-border py-12 md:py-16 mb-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-card border border-border rounded-3xl flex items-center justify-center shadow-theme-md shrink-0">
            <IconRenderer name={category.icon} className="w-10 h-10 md:w-12 md:h-12 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-heading mb-3 tracking-tight">
              {category.name}
            </h1>
            <p className="text-subheading max-w-2xl text-base md:text-lg">
              {category.description || `Explore our premium selection of ${category.name.toLowerCase()}.`}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 space-y-12">
        {subcategories.length > 0 && (
          <section aria-labelledby="subcats-heading">
            <div className="flex items-center gap-2 mb-6">
              <h2
                id="subcats-heading"
                className="text-xl md:text-2xl font-extrabold text-foreground tracking-tight"
              >
                Shop by Subcategory
              </h2>
              <div className="h-[2px] flex-1 bg-border/50 ml-4 rounded-full" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {subcategories.map((subcat: any) => (
                <Link
                  key={subcat.id}
                  href={`/categories/${subcat.slug}`}
                  className="group relative bg-card border border-border rounded-2xl p-5 flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-theme-md overflow-hidden"
                >
                  <div className="w-12 h-12 bg-muted/50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors duration-300">
                    <IconRenderer
                      name={subcat.icon}
                      className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors"
                    />
                  </div>
                  <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {subcat.name}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section aria-labelledby="products-heading">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <h2
                id="products-heading"
                className="text-xl md:text-2xl font-extrabold text-foreground tracking-tight"
              >
                All Products
              </h2>
              <span className="bg-muted text-muted-foreground text-xs font-bold px-2 py-1 rounded-md">
                {products.length}
              </span>
            </div>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-card/50 border border-border border-dashed rounded-3xl">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                <LuPackageOpen className="w-10 h-10 text-muted-foreground opacity-50" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">No Products Yet</h3>
              <p className="text-muted-foreground">
                We are currently restocking our {category.name} collection.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
