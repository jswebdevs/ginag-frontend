import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";

import ProductGallery from "@/components/shop/ProductGallery";
import ProductInfo from "@/components/shop/ProductInfo";
import ProductTabs from "@/components/shop/ProductTabs";

export const revalidate = 120;

async function fetchProduct(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${slug}`, {
      next: { revalidate: 120, tags: [`product-${slug}`] },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.product || json.data || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProduct(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  const description =
    product.shortDesc || product.longDesc?.slice(0, 160) || `Custom charm — ${product.name}`;

  const ogImage =
    product.featuredImage?.originalUrl || product.featuredImage?.thumbUrl || undefined;

  return {
    title: product.name,
    description,
    openGraph: {
      title: product.name,
      description,
      type: "article",
      ...(ogImage ? { images: [{ url: ogImage, alt: product.name }] } : {}),
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title: product.name,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    alternates: { canonical: `/products/${slug}` },
  };
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await fetchProduct(slug);

  if (!product) notFound();

  return (
    <main className="min-h-screen bg-background py-6 md:py-12">
      <div className="container mx-auto px-[5%] max-w-360">
        <nav
          aria-label="Breadcrumb"
          className="hidden sm:flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-8"
        >
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-primary truncate max-w-75">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <ProductGallery
            featuredImage={product.featuredImage}
            images={product.images || []}
            productName={product.name}
            currentVariation={null}
          />
          <ProductInfo product={product} />
        </div>

        <ProductTabs product={product} />
      </div>
    </main>
  );
}
