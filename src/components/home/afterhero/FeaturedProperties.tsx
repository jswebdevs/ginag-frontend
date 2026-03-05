import Link from "next/link";
import { Smartphone, Shirt, Home, Watch, Laptop, Dumbbell, ArrowRight } from "lucide-react";

const categories = [
  { id: 1, name: "Electronics", icon: Laptop, count: "124 Items", color: "bg-blue-500/10 text-blue-500" },
  { id: 2, name: "Fashion", icon: Shirt, count: "342 Items", color: "bg-pink-500/10 text-pink-500" },
  { id: 3, name: "Smartphones", icon: Smartphone, count: "89 Items", color: "bg-purple-500/10 text-purple-500" },
  { id: 4, name: "Home & Living", icon: Home, count: "215 Items", color: "bg-orange-500/10 text-orange-500" },
  { id: 5, name: "Accessories", icon: Watch, count: "156 Items", color: "bg-emerald-500/10 text-emerald-500" },
  { id: 6, name: "Sports", icon: Dumbbell, count: "92 Items", color: "bg-red-500/10 text-red-500" },
];

export default function FeaturedCategories() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-heading mb-2">Shop by Category</h2>
            <p className="text-subheading">Explore our wide range of premium products.</p>
          </div>
          <Link 
            href="/categories" 
            className="group flex items-center gap-2 text-primary font-semibold hover:opacity-80 transition-opacity"
          >
            View All Categories 
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link 
                key={category.id} 
                href={`/category/${category.name.toLowerCase().replace(/ & | /g, "-")}`}
                className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center text-center group hover:border-primary hover:shadow-theme-lg transition-all duration-300"
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 ${category.color}`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-heading text-sm md:text-base mb-1 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs text-muted-foreground font-medium">
                  {category.count}
                </p>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}