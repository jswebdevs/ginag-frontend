import { Hexagon, Triangle, Circle, Square, Star, Diamond } from "lucide-react";

export default function BrandCloud() {
  // Using shapes as placeholder logos
  const brands = [
    { icon: Hexagon, name: "TechCorp" },
    { icon: Triangle, name: "Elevate" },
    { icon: Circle, name: "GlobalNet" },
    { icon: Square, name: "NextGen" },
    { icon: Star, name: "StarTech" },
    { icon: Diamond, name: "Luxe" },
  ];

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-8">
          Trusted by over 10,000 customers & top brands
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {brands.map((brand, idx) => {
            const Icon = brand.icon;
            return (
              <div key={idx} className="flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors cursor-pointer">
                <Icon className="w-8 h-8" />
                <span className="text-xl font-bold tracking-tight">{brand.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}