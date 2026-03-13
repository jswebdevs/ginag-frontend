"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/axios";

// 🔥 Use React Icons Lu set
import { LuHexagon } from "react-icons/lu";

// Swiper Imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function BrandCloud() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/brands')
      .then(res => {
        setBrands(res.data?.data || []);
      })
      .catch(err => console.error("Failed to fetch brands", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-8 md:py-12 bg-background border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <div className="h-4 w-48 md:w-64 bg-muted rounded animate-pulse mx-auto mb-8"></div>
          <div className="flex justify-center items-center gap-12 overflow-hidden">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-8 w-28 bg-muted rounded animate-pulse shrink-0"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (brands.length === 0) return null;

  return (
    <section className="py-8 md:py-12 bg-background border-t border-border overflow-hidden">
      <div className="container mx-auto px-4 text-center">
        <p className="text-[10px] md:text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mb-8">
          Trusted by over 10,000 customers & top brands
        </p>

        <Swiper
          modules={[Autoplay]}
          spaceBetween={40}
          slidesPerView={2}
          loop={true}
          speed={5000} // High speed + no delay = smooth continuous ticker effect
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          breakpoints={{
            480: { slidesPerView: 3, spaceBetween: 50 },
            768: { slidesPerView: 4, spaceBetween: 60 },
            1024: { slidesPerView: 5, spaceBetween: 80 },
            1280: { slidesPerView: 6, spaceBetween: 100 },
          }}
          className="brand-swiper !ease-linear" // Custom linear CSS for ticker effect
        >
          {brands.map((brand) => {
            const logoUrl = brand.logo?.originalUrl || brand.logo?.thumbUrl;

            return (
              <SwiperSlide key={brand.id} className="!flex items-center justify-center">
                <Link
                  href={`/products?brand=${brand.id}`}
                  className="group flex items-center justify-center gap-3 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 hover:scale-110 transition-all duration-500 cursor-pointer"
                  title={`Shop ${brand.name}`}
                >
                  {logoUrl ? (
                    <div className="relative h-7 md:h-9 w-24 md:w-32">
                      <Image
                        src={logoUrl}
                        alt={brand.name}
                        fill
                        sizes="(max-width: 768px) 6rem, 8rem"
                        className="object-contain object-center"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-foreground/80">
                      <LuHexagon className="w-5 h-5 md:w-6 md:h-6 group-hover:text-primary transition-colors" />
                      <span className="text-sm md:text-base font-black tracking-tighter uppercase group-hover:text-primary transition-colors whitespace-nowrap">
                        {brand.name}
                      </span>
                    </div>
                  )}
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      {/* Optional: Add this global style to your layout or a CSS file for the "Linear" ticker effect */}
      <style jsx global>{`
        .brand-swiper .swiper-wrapper {
          transition-timing-function: linear !important;
        }
      `}</style>
    </section>
  );
}