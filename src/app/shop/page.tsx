"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Star, Filter, SlidersHorizontal, X, ImageIcon, Search, Heart } from "lucide-react";
import api from "@/lib/axios";
import { useUserStore } from "@/store/useUserStore"; // Assuming this is your store path
import { toast } from "sonner";

export interface ProductVariation {
  id: string;
  stock: number;
  isDefault?: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  basePrice: string;
  salePrice?: string;
  origin?: string;
  featuredImage?: { originalUrl: string; thumbUrl: string };
  variations: ProductVariation[];
  rating?: number | string;
}

export default function ShopPage() {
  const router = useRouter();
  const { isAuthenticated } = useUserStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Track wishlist items by variationId
  const [wishlistVarIds, setWishlistVarIds] = useState<Set<string>>(new Set());

  // Filter States
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const [origin, setOrigin] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("newest");

  // Fetch Products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get("/products", {
        params: {
          search: search || undefined,
          category: category || undefined,

          origin: origin || undefined,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          sort: sort || undefined,
        }
      });
      const data = response.data.data || response.data;
      setProducts(data);
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch User's Wishlist (if logged in)
  const fetchWishlist = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.get('/wishlist');
      const items = res.data.data?.items || [];
      // Extract all variation IDs currently in the wishlist
      const ids = items.map((item: any) => item.variationId);
      setWishlistVarIds(new Set(ids));
    } catch (err) {
      console.error("Failed to load wishlist", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [sort]);

  useEffect(() => {
    fetchWishlist();
  }, [isAuthenticated]);

  // Handle Wishlist Toggle
  const handleWishlistToggle = async (e: React.MouseEvent, product: Product) => {
    e.preventDefault(); // Prevent navigating to product details
    e.stopPropagation();

    if (!isAuthenticated) {
      toast("Login required to save to wishlist.", {
        action: { label: "Log In", onClick: () => router.push("/login") },
      });
      return;
    }

    if (!product.variations || product.variations.length === 0) {
      toast.error("Product has no available variations.");
      return;
    }

    const targetVariation = product.variations.find(v => v.isDefault) || product.variations[0];
    const targetVarId = targetVariation.id;
    const isWished = wishlistVarIds.has(targetVarId);

    // 3. Optimistic UI Update & API Call
    try {
      if (isWished) {
        // Remove from UI instantly
        setWishlistVarIds(prev => { const next = new Set(prev); next.delete(targetVarId); return next; });
        await api.delete(`/wishlist/${targetVarId}`);
      } else {
        // Add to UI instantly
        setWishlistVarIds(prev => { const next = new Set(prev); next.add(targetVarId); return next; });
        await api.post('/wishlist', { variationId: targetVarId });
      }
    } catch (error) {
      // Revert if API fails
      fetchWishlist();
      console.error("Wishlist action failed", error);
    }
  };

  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    setSearch("");
    setCategory("");

    setOrigin("");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
    setTimeout(fetchProducts, 0);
  };

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="container mx-auto px-4">

        {/* Page Header & Filter Toggle */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-heading">Shop All</h1>
            <p className="text-subheading mt-2">Find exactly what you're looking for.</p>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-primary/10 text-primary px-5 py-2.5 rounded-full font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            {showFilters ? <X className="w-5 h-5" /> : <SlidersHorizontal className="w-5 h-5" />}
            {showFilters ? "Close Filters" : "Filter & Sort"}
          </button>
        </div>

        {/* Top Dropdown Filter Panel */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showFilters ? 'max-h-[1000px] opacity-100 mb-10' : 'max-h-0 opacity-0 mb-0'}`}>
          <form onSubmit={handleApplyFilters} className="bg-card border border-border rounded-2xl p-6 shadow-theme-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-heading">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-foreground"
                  />
                </div>
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-heading">Sort By</label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-foreground"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="az">Name: A to Z</option>
                  <option value="za">Name: Z to A</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-heading">Price Range ($)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-xl outline-none text-foreground"
                  />
                  <span className="text-muted-foreground">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-xl outline-none text-foreground"
                  />
                </div>
              </div>

              {/* Origin */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-heading">Origin</label>
                <select
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-border rounded-xl outline-none text-foreground"
                >
                  <option value="">All Origins</option>
                  <option value="Pakistan">Pakistan</option>
                  <option value="Bangladesh">Bangladesh</option>
                  <option value="India">India</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-border">
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-6 py-2 text-muted-foreground hover:text-heading font-medium transition-colors"
              >
                Clear All
              </button>
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-8 py-2 rounded-full font-bold shadow-theme-md hover:shadow-theme-lg transition-all hover:-translate-y-0.5"
              >
                Apply Filters
              </button>
            </div>
          </form>
        </div>

        {/* --- PRODUCT GRID --- */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="bg-card border border-border rounded-2xl h-[350px] animate-pulse"></div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 bg-card border border-dashed border-border rounded-2xl">
            <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-heading">No products found</h3>
            <p className="text-subheading mt-2">Try adjusting your filters or search term.</p>
            <button onClick={handleResetFilters} className="mt-6 text-primary font-semibold hover:underline">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const totalStock = product.variations?.reduce((sum, v) => sum + (Number(v.stock) || 0), 0) ?? 0;
              const imageUrl = product.featuredImage?.originalUrl;

              // Build price range from variations; fall back to product-level prices
              const prices = product.variations?.length > 0
                ? product.variations.map((v: any) => Number(v.salePrice || v.basePrice || 0)).filter(Boolean)
                : [Number(product.salePrice || product.basePrice || 0)];
              const minPrice = Math.min(...prices);
              const maxPrice = Math.max(...prices);
              const hasRange = minPrice !== maxPrice;

              // Check if the product's default/first variation is in the wishlist
              const targetVar = product.variations?.find(v => v.isDefault) || product.variations?.[0];
              const isWished = targetVar ? wishlistVarIds.has(targetVar.id) : false;

              return (
                <div key={product.id} className="bg-card border border-border rounded-2xl overflow-hidden group hover:border-primary/50 hover:shadow-theme-md transition-all flex flex-col relative">

                  {/* Absolute Wishlist Button over Image */}
                  <button
                    onClick={(e) => handleWishlistToggle(e, product)}
                    className="absolute top-3 right-3 z-10 p-2.5 rounded-full bg-background/80 backdrop-blur hover:bg-background transition-all shadow-sm border border-border/50 hover:scale-110 cursor-pointer"
                    title={isWished ? "Remove from Wishlist" : "Add to Wishlist"}
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${isWished
                          ? 'fill-red-500 text-red-500'
                          : 'text-muted-foreground hover:text-foreground'
                        }`}
                    />
                  </button>

                  <Link href={`/products/${product.slug}`} className="aspect-square bg-muted relative flex items-center justify-center overflow-hidden block">
                    {imageUrl ? (
                      <img src={imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <ImageIcon className="w-12 h-12 text-muted-foreground/30" />
                    )}
                    {totalStock === 0 && (
                      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                        <span className="bg-foreground text-background font-bold px-4 py-2 rounded-full text-sm">Out of Stock</span>
                      </div>
                    )}
                  </Link>

                  <div className="p-5 flex flex-col flex-grow">
                    <Link href={`/products/${product.slug}`} className="font-bold text-heading hover:text-primary transition-colors line-clamp-2 mb-2">
                      {product.name}
                    </Link>
                    <div className="mt-auto pt-4 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="font-black text-lg text-primary">
                          ${minPrice.toFixed(2)}{hasRange && ` – $${maxPrice.toFixed(2)}`}
                        </span>
                      </div>
                      <button disabled={totalStock === 0} className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50">
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}