import Link from "next/link";

export default function Hero1() {
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
           
           {/* Placeholder for real product image */}
           <div className="relative z-10 text-subheading font-medium border border-border bg-card/30 backdrop-blur-md w-3/4 h-3/4 rounded-3xl flex items-center justify-center shadow-theme-lg transition-all duration-500">
              [3D Render or Product Shot]
           </div>
        </div>
      </div>
    </section>
  );
}