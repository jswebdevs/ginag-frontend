import Link from "next/link";
import { Star, ShoppingCart, Heart } from "lucide-react";

export default function TrendingProducts() {
  const products = [1, 2, 3, 4]; // Dummy array for 4 products

  return (
    <section className="py-16 md:py-24 bg-background border-t border-border">
      <div className="container mx-auto px-4">
        
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-heading">Trending Now</h2>
            <p className="text-subheading mt-2">The products everyone is talking about.</p>
          </div>
          <Link href="/shop" className="text-primary font-semibold hover:underline hidden sm:block">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((item) => (
            <div key={item} className="bg-card border border-border rounded-2xl overflow-hidden group hover:border-primary/50 hover:shadow-theme-md transition-all">
              {/* Image Box */}
              <div className="aspect-square bg-muted/20 relative flex items-center justify-center p-6">
                <span className="absolute top-3 left-3 bg-background text-foreground text-xs font-bold px-2 py-1 rounded shadow-sm">
                  New
                </span>
                <button className="absolute top-3 right-3 w-8 h-8 bg-background rounded-full flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
                  <Heart className="w-4 h-4" />
                </button>
                <div className="w-full h-full bg-border/20 rounded-xl group-hover:scale-105 transition-transform duration-500"></div>
              </div>
              
              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-1 text-yellow-500 mb-2">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current opacity-30" />
                  <span className="text-xs text-muted-foreground ml-1">(4.0)</span>
                </div>
                <Link href="#" className="font-bold text-heading hover:text-primary transition-colors line-clamp-1">
                  Premium Leather Smart Wallet
                </Link>
                <div className="flex items-center justify-between mt-4">
                  <span className="font-black text-lg text-primary">$49.99</span>
                  <button className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}