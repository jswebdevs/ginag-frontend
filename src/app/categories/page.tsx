import Link from "next/link";
import type { Metadata } from "next";
import IconRenderer from "@/components/shared/IconRenderer";
import { LuLayoutGrid } from "react-icons/lu";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Browse Categories",
  description: "Explore our charm collections organized by category.",
  alternates: { canonical: "/categories" },
};

async function getCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
      next: { revalidate: 300, tags: ["categories"] },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-gradient-theme border-b border-border py-12 md:py-16 mb-8 md:mb-12">
        <div className="container mx-auto px-4 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-black text-heading mb-4 tracking-tight">
            Shop by <span className="text-primary">Category</span>
          </h1>
          <p className="text-subheading max-w-2xl mx-auto md:mx-0 text-base md:text-lg">
            Explore our wide range of premium products organized just for you.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {categories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {categories.map((cat: any) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="group relative bg-card border border-border rounded-3xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-theme-lg overflow-hidden"
              >
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="w-16 h-16 md:w-20 md:h-20 bg-muted/50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors duration-300 relative z-10">
                  <IconRenderer
                    name={cat.icon}
                    className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground group-hover:text-primary transition-colors duration-300 group-hover:scale-110"
                  />
                </div>

                <h3 className="font-bold text-sm md:text-base text-foreground group-hover:text-primary transition-colors duration-300 relative z-10 line-clamp-2">
                  {cat.name}
                </h3>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
              <LuLayoutGrid className="w-10 h-10 text-muted-foreground opacity-50" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">No Categories Found</h2>
          </div>
        )}
      </div>
    </div>
  );
}
