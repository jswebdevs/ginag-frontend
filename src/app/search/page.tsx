"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { Loader2, PackageSearch, ArrowDownUp, Folder, Tag, Image as ImageIcon } from "lucide-react";
import { useCurrency } from "@/context/SettingsContext";


function SearchContent() {
  const { symbol } = useCurrency();
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
        // Hits the new dedicated global search backend endpoint
        const res = await api.get(`/search?q=${encodeURIComponent(query)}&limit=50`);

        const data = res.data.data || res.data.results || res.data || [];
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

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-12 h-12 animate-spin text-primary" />
      <p className="text-muted-foreground font-medium animate-pulse">Searching for "{query}"...</p>
    </div>
  );

  // --- SMART SEPARATION OF MIXED RESULTS ---
  // The backend tags items with type: 'product' or type: 'category'
  const products = results.filter((item) => item.type === 'product' || item.basePrice);
  const otherResults = results.filter((item) => item.type !== 'product' && !item.basePrice);

  // Frontend sorting just for the products
  const sortedProducts = [...products].sort((a, b) => {
    if (sortOrder === "price_low") return Number(a.basePrice || 0) - Number(b.basePrice || 0);
    if (sortOrder === "price_high") return Number(b.basePrice || 0) - Number(a.basePrice || 0);
    // Default: Newest first
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
  });

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 animate-in fade-in duration-500">

      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl md:text-4xl font-black text-foreground mb-2">Search Results</h1>
          <p className="text-muted-foreground">
            Found <span className="font-bold text-foreground">{results.length}</span> results for <span className="text-primary font-bold">"{query}"</span>
          </p>
        </div>

        {/* Sort Dropdown (Only show if there are actual products) */}
        {products.length > 0 && (
          <div className="flex items-center gap-3">
            <ArrowDownUp className="w-4 h-4 text-muted-foreground" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-card border border-border text-foreground text-sm rounded-lg focus:ring-2 focus:ring-primary focus:border-primary p-2.5 outline-none cursor-pointer transition-colors shadow-sm"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>
        )}
      </div>

      {results.length > 0 ? (
        <div className="space-y-10">

          {/* SECTION 1: RELATED CATEGORIES */}
          {otherResults.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">Related Categories</h3>
              <div className="flex flex-wrap gap-3">
                {otherResults.map((item, idx) => {
                  const itemSlug = item.slug || item.id;
                  // Route dynamically based on type
                  const link = item.type === 'category' ? `/categories/${itemSlug}` : "";
                  const Icon = item.type === 'category' ? Folder : Tag;

                  return (
                    <Link
                      key={item.id || idx}
                      href={link}
                      className="flex items-center gap-2 bg-card border border-border hover:border-primary px-4 py-2 rounded-full text-sm font-semibold text-foreground hover:text-primary transition-all shadow-sm hover:shadow-theme-sm group"
                    >
                      <Icon className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                      {item.name || item.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 2: PRODUCTS GRID (Inline Generic Cards) */}
          {sortedProducts.length > 0 && (
            <div>
              {otherResults.length > 0 && (
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">Products</h3>
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {sortedProducts.map((product, idx) => {
                  const imageSrc = product.featuredImage?.thumbUrl || product.featuredImage?.originalUrl;
                  const price = product.basePrice ? `${symbol}${Number(product.basePrice).toLocaleString()}` : 'N/A';


                  return (
                    <Link
                      key={product.id || idx}
                      href={`/products/${product.slug || product.id}`}
                      className="group flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:border-primary transition-all duration-300 shadow-sm hover:shadow-theme-md"
                    >
                      {/* Image Area */}
                      <div className="aspect-square bg-muted/30 relative flex items-center justify-center overflow-hidden border-b border-border/50 p-4">
                        {imageSrc ? (
                          <img
                            src={imageSrc}
                            alt={product.name}
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 mix-blend-multiply dark:mix-blend-normal"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center shadow-sm">
                            <ImageIcon className="w-6 h-6 text-muted-foreground/40" />
                          </div>
                        )}
                      </div>

                      {/* Text Details */}
                      <div className="p-4 flex flex-col flex-1">
                        <h3 className="font-bold text-sm md:text-base text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <div className="mt-auto flex items-center justify-between">
                          <span className="font-black text-primary text-lg">{price}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      ) : (
        /* EMPTY STATE */
        <div className="min-h-[40vh] flex flex-col items-center justify-center text-center bg-card/50 rounded-3xl border border-border border-dashed py-12 px-4">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
            <PackageSearch className="w-10 h-10 text-muted-foreground opacity-50" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">No matches found</h2>
          <p className="text-muted-foreground max-w-md">
            We couldn't find anything matching <span className="font-semibold text-foreground">"{query}"</span>. Try checking your spelling or using more general terms.
          </p>
          <Link
            href="/categories"
            className="mt-8 bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform shadow-theme-md"
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
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <span className="font-medium text-muted-foreground">Loading search engine...</span>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}