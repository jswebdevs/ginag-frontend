"use client";

import { Sparkles, ShieldCheck, Truck, Headphones } from "lucide-react";

export default function TrustBar() {
  const features = [
    { icon: Sparkles, title: "Handcrafted", desc: "Custom charms made to order" },
    { icon: Truck, title: "Pickup or Mail", desc: "Flat-rate mailing $18" },
    { icon: ShieldCheck, title: "Quality First", desc: "Every piece personally checked" },
    { icon: Headphones, title: "Personal Service", desc: "Direct line to the maker" },
  ];

  return (
    <div className="bg-card border-y border-border py-8 md:py-12 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-6">
          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="flex items-center gap-4 md:gap-5 group cursor-default"
                title={item.title}
              >
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground shadow-sm">
                  <Icon className="w-6 h-6 md:w-7 md:h-7" />
                </div>

                <div>
                  <h3 className="font-bold text-heading text-sm md:text-base group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}