import Link from "next/link";
import * as LucideIcons from "lucide-react"; // Import for the Fire/Hot icon

export default function Hero1() {
  // Static product details derived from your provided JSON
  const featuredProduct = {
    name: "Cat-Eye Blue-Light Blocking Glasses",
    slug: "trendy-cat-eye-blue-light-blocking-glasses-1772725027480",
    price: "1400",
    imageUrl: "https://ppouajachylwosassljl.supabase.co/storage/v1/object/public/media/1772744674242-930736847.jpg"
  };

  return (
    <section className="relative w-full overflow-hidden transition-colors duration-500 bg-background">
      {/* Dynamic Ambient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background dark:via-primary/10 transition-colors duration-500 -z-10" />

      <div className="container mx-auto px-4 py-16 md:py-28 flex flex-col md:flex-row items-center relative z-10">
        <div className="md:w-1/2 text-center md:text-left z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold text-heading leading-[1.1] mb-6 transition-colors duration-500">
            Everything you need, <br />
            {/* Gradient Text linked directly to your dynamic primary theme */}
            <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent transition-all duration-500">
              Delivered to your door.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-subheading mb-8 max-w-lg transition-colors duration-500">
            Experience the next generation of e-commerce. Fast, secure, and built for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            {/* Primary Button */}
            <Link 
              href="/products" 
              className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold hover:scale-105 shadow-theme-md hover:shadow-theme-lg transition-all duration-300 flex items-center justify-center"
            >
              Shop Now
            </Link>
            {/* Outlined Adaptive Button */}
            <Link 
              href="/categories" 
              className="bg-card/50 backdrop-blur-sm border-2 border-border text-foreground px-8 py-4 rounded-full font-bold hover:bg-muted transition-all duration-300 flex items-center justify-center"
            >
              Browse Categories
            </Link>
          </div>
        </div>
        
        {/* Visual Graphic Area */}
        <div className="md:w-1/2 mt-16 md:mt-0 relative h-[350px] md:h-[500px] w-full flex items-center justify-center">
            {/* Primary Blob */}
            <div className="bg-primary rounded-full w-64 h-64 md:w-96 md:h-96 absolute blur-3xl opacity-20 animate-pulse transition-colors duration-500 translate-x-10 translate-y-10" />
            {/* Secondary Blob */}
            <div className="bg-primary/50 rounded-full w-64 h-64 md:w-80 md:h-80 absolute blur-3xl opacity-20 animate-pulse transition-colors duration-500 -translate-x-10 -translate-y-10" style={{ animationDelay: "2s" }} />
            
            {/* --- REPLACED PLACEHOLDER WITH PRODUCT CARD --- */}
            <Link 
              href={`/products/${featuredProduct.slug}`}
              className="relative z-10 group bg-card/60 backdrop-blur-lg w-full max-w-sm rounded-3xl p-6 shadow-theme-xl transition-all duration-500 border border-border flex flex-col items-center hover:scale-105 hover:border-primary/50"
            >
              {/* "HOT" Badge - Locked to Top-Right */}
              <div className="absolute -top-3 -right-3 bg-red-500 text-white px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-theme-lg flex items-center gap-1.5 animate-in slide-in-from-top-2 duration-1000">
                <LucideIcons.Zap className="w-3.5 h-3.5 animate-pulse" />
                HOT
              </div>

              {/* Product Image */}
              <div className="w-full h-48 md:h-64 rounded-2xl overflow-hidden mb-6 bg-muted/30">
                <img 
                  src={featuredProduct.imageUrl} 
                  alt={featuredProduct.name} 
                  className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110" // Scales up on hover for depth
                />
              </div>

              {/* Product Info */}
              <div className="w-full text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Trending Item
                </p>
                <h3 className="text-lg font-extrabold text-heading mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                  {featuredProduct.name}
                </h3>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-sm font-semibold text-muted-foreground line-through opacity-60">
                    ৳2100.00
                  </span>
                  <span className="text-2xl font-black text-primary">
                    ৳{featuredProduct.price}.00
                  </span>
                </div>
              </div>
            </Link>
        </div>
      </div>
    </section>
  );
}