"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { Hexagon } from "lucide-react"; // Fallback icon

export default function BrandCloud() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the brands from your existing backend route
    api.get('/brands')
      .then(res => {
        // Grab the data, or default to empty array
        const fetchedBrands = res.data?.data || [];
        setBrands(fetchedBrands);
      })
      .catch(err => console.error("Failed to fetch brands", err))
      .finally(() => setLoading(false));
  }, []);

  // Show a subtle skeleton while loading
  if (loading) {
    return (
      <section className="py-12 bg-background border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <div className="h-4 w-64 bg-muted rounded animate-pulse mx-auto mb-8"></div>
          <div className="flex flex-wrap justify-center items-center gap-12">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-8 w-24 bg-muted rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // If no brands exist in DB, hide the section entirely
  if (brands.length === 0) return null;

  return (
    <section className="py-12 bg-background border-t border-border overflow-hidden">
      <div className="container mx-auto px-4 text-center">
        <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mb-8">
          Trusted by over 10,000 customers & top brands
        </p>

        {/* Container for the brands */}
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/products?brand=${brand.id}`} // Links to your product filter!
              className="group flex items-center gap-3 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:scale-105 transition-all duration-300 cursor-pointer"
              title={`Shop ${brand.name}`}
            >
              {/* Check if the brand has an uploaded logo */}
              {brand.logo?.originalUrl || brand.logo?.thumbUrl ? (
                <img
                  src={brand.logo.originalUrl || brand.logo.thumbUrl}
                  alt={brand.name}
                  className="h-10 w-auto object-contain"
                />
              ) : (
                // Fallback if the brand exists but has no logo image yet
                <div className="flex items-center gap-2 text-foreground">
                  <Hexagon className="w-8 h-8 group-hover:text-primary transition-colors" />
                  <span className="text-xl font-black tracking-tighter uppercase group-hover:text-primary transition-colors">
                    {brand.name}
                  </span>
                </div>
              )}
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}