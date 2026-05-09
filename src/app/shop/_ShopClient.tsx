"use client";

import { useState, useEffect } from "react";
import { Filter, SlidersHorizontal, X, Search } from "lucide-react";
import api from "@/lib/axios";
import ProductCard from "@/components/home/products/ProductCard";

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("newest");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get("/products", {
        params: {
          search: search || undefined,
          category: category || undefined,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          sort: sort || undefined,
        },
      });
      setProducts(response.data?.data || []);
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [sort]);

  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    setSearch("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
    setTimeout(fetchProducts, 0);
  };

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-heading">Catalog</h1>
            <p className="text-subheading mt-2">Browse the collection — order any piece via the order form.</p>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-primary/10 text-primary px-5 py-2.5 rounded-full font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            {showFilters ? <X className="w-5 h-5" /> : <SlidersHorizontal className="w-5 h-5" />}
            {showFilters ? "Close Filters" : "Filter & Sort"}
          </button>
        </div>

        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showFilters ? 'max-h-[1000px] opacity-100 mb-10' : 'max-h-0 opacity-0 mb-0'}`}>
          <form onSubmit={handleApplyFilters} className="bg-card border border-border rounded-2xl p-6 shadow-theme-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

              <div className="space-y-2">
                <label className="text-sm font-semibold text-heading">Sort By</label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-foreground"
                >
                  <option value="newest">Newest</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="az">Name: A to Z</option>
                  <option value="za">Name: Z to A</option>
                </select>
              </div>

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
            </div>

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

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-card border border-border rounded-3xl aspect-[4/5] animate-pulse" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
