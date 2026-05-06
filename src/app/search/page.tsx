"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { Loader2, PackageSearch, ArrowDownUp, Folder, Tag } from "lucide-react";
import ProductCard from "@/components/home/products/ProductCard";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    const fetchFullResults = async () => {
      if (!query.trim()) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await api.get(`/search?q=${encodeURIComponent(query)}&limit=50`);
        const data = res.data?.data || [];
        setResults(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Search fetch failed:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFullResults();
  }, [query]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium animate-pulse">Searching for "{query}"...</p>
      </div>
    );
  }

  const products = results.filter((item) => item.type === "product" || item.priceMin !== undefined);
  const otherResults = results.filter((item) => item.type !== "product" && item.priceMin === undefined);

  const priceOf = (p: any) => Number(p.priceMin ?? 0);
  const sortedProducts = [...products].sort((a, b) => {
    if (sortOrder === "price_low") return priceOf(a) - priceOf(b);
    if (sortOrder === "price_high") return Number(b.priceMax ?? 0) - Number(a.priceMax ?? 0);
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
  });

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl md:text-4xl font-black text-foreground mb-2">Search Results</h1>
          <p className="text-muted-foreground">
            Found <span className="font-bold text-foreground">{results.length}</span> results for{" "}
            <span className="text-primary font-bold">"{query}"</span>
          </p>
        </div>

        {products.length > 0 && (
          <div className="flex items-center gap-3">
            <ArrowDownUp className="w-4 h-4 text-muted-foreground" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-card border border-border text-foreground text-sm rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="newest">Newest</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>
        )}
      </div>

      {results.length > 0 ? (
        <div className="space-y-10">
          {otherResults.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">
                Related Categories
              </h3>
              <div className="flex flex-wrap gap-3">
                {otherResults.map((item, idx) => {
                  const itemSlug = item.slug || item.id;
                  const link = item.type === "category" ? `/categories/${itemSlug}` : "";
                  const Icon = item.type === "category" ? Folder : Tag;
                  return (
                    <Link
                      key={item.id || idx}
                      href={link}
                      className="flex items-center gap-2 bg-card border border-border hover:border-primary px-4 py-2 rounded-full text-sm font-semibold text-foreground hover:text-primary transition-all"
                    >
                      <Icon className="w-4 h-4 opacity-70" />
                      {item.name || item.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {sortedProducts.length > 0 && (
            <div>
              {otherResults.length > 0 && (
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">Products</h3>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {sortedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="min-h-[40vh] flex flex-col items-center justify-center text-center bg-card/50 rounded-3xl border border-dashed border-border py-12 px-4">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
            <PackageSearch className="w-10 h-10 text-muted-foreground opacity-50" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">No matches found</h2>
          <p className="text-muted-foreground max-w-md">
            Nothing matched <span className="font-semibold text-foreground">"{query}"</span>. Try a more general term.
          </p>
          <Link
            href="/categories"
            className="mt-8 bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform"
          >
            Browse Categories
          </Link>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <span className="font-medium text-muted-foreground">Loading…</span>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
