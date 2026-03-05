"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, Star, Filter, SlidersHorizontal, X, ImageIcon, Search } from "lucide-react";
import api from "@/lib/axios";

// Match the interface from your homepage
export interface Product {
  id: string;
  name: string;
  slug: string;
  basePrice: string;
  salePrice?: string;
  origin?: string;
  featuredImage?: { originalUrl: string; thumbUrl: string };
  variations: { stock: number }[];
  rating?: number | string;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filter States
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [origin, setOrigin] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("newest"); // newest, az, za, price_low, price_high

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get("/products", {
        params: {
          search: search || undefined,
          category: category || undefined,
          brand: brand || undefined,
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

  // Fetch products on initial load and whenever filters are applied
  useEffect(() => {
    fetchProducts();
  }, [sort]); // Auto-fetch when sort changes

  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
    setShowFilters(false); // Close mobile panel after applying
  };

  const handleResetFilters = () => {
    setSearch("");
    setCategory("");
    setBrand("");
    setOrigin("");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
    setTimeout(fetchProducts, 0); // Fetch immediately after state clears
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
            className="flex items-center gap-2 bg-primary/10 text-primary px-5 py-2.5 rounded-full font-semibold hover:bg-primary hover:text-white transition-colors"
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
                    className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-heading">Sort By</label>
                <select 
                  value={sort} 
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
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
                    className="w-full px-3 py-2 bg-background border border-border rounded-xl outline-none"
                  />
                  <span className="text-muted-foreground">-</span>
                  <input 
                    type="number" 
                    placeholder="Max" 
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-xl outline-none"
                  />
                </div>
              </div>

              {/* Origin (You can replace these options with an API call later) */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-heading">Origin</label>
                <select 
                  value={origin} 
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-border rounded-xl outline-none"
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
                className="bg-primary text-white px-8 py-2 rounded-full font-bold shadow-theme-md hover:shadow-theme-lg transition-all hover:-translate-y-0.5"
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
              const totalStock = product.variations?.reduce((sum, v) => sum + (Number(v.stock) || 0), 0) || 0;
              const currentPrice = Number(product.salePrice || product.basePrice || 0);
              const originalPrice = product.salePrice ? Number(product.basePrice) : null;
              const imageUrl = product.featuredImage?.originalUrl;

              return (
                <div key={product.id} className="bg-card border border-border rounded-2xl overflow-hidden group hover:border-primary/50 hover:shadow-theme-md transition-all flex flex-col">
                  <Link href={`/products/${product.slug}`} className="aspect-square bg-white relative flex items-center justify-center overflow-hidden block">
                    {imageUrl ? (
                      <img src={imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
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
                        <span className="font-black text-lg text-primary">${currentPrice.toFixed(2)}</span>
                        {originalPrice && <span className="text-xs text-muted-foreground line-through">${originalPrice.toFixed(2)}</span>}
                      </div>
                      <button disabled={totalStock === 0} className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors disabled:opacity-50">
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
