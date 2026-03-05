import { ShieldCheck, Truck, RotateCcw } from "lucide-react";

export default function Hero4() {
  return (
    <section className="bg-background transition-colors duration-500">
      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold text-heading leading-tight">
              Tech Essentials for the <br />
              <span className="bg-gradient-to-r from-primary to-primary/40 bg-clip-text text-transparent italic">Modern Developer</span>
            </h1>
            <p className="text-lg text-subheading max-w-xl">
              From mechanical keyboards to high-refresh monitors. We provide the tools you need to build the future.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button className="bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-bold shadow-theme-md">Start Shopping</button>
              <button className="bg-muted text-foreground px-8 py-4 rounded-2xl font-bold border border-border">Custom Builds</button>
            </div>

            {/* Trust Bar */}
            <div className="pt-10 grid grid-cols-3 gap-4 border-t border-border">
              <div className="flex flex-col gap-1">
                <Truck className="w-6 h-6 text-primary" />
                <span className="text-sm font-bold text-heading">Fast Delivery</span>
                <span className="text-xs text-muted-foreground">Across Bangladesh</span>
              </div>
              <div className="flex flex-col gap-1">
                <ShieldCheck className="w-6 h-6 text-primary" />
                <span className="text-sm font-bold text-heading">Official Warranty</span>
                <span className="text-xs text-muted-foreground">100% Authentic</span>
              </div>
              <div className="flex flex-col gap-1">
                <RotateCcw className="w-6 h-6 text-primary" />
                <span className="text-sm font-bold text-heading">Easy Returns</span>
                <span className="text-xs text-muted-foreground">7-Day Policy</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative group">
            <div className="absolute inset-0 bg-primary/20 blur-[100px] group-hover:bg-primary/30 transition-all rounded-full" />
            <div className="relative bg-card border-2 border-border p-4 rounded-[40px] shadow-theme-lg rotate-3 hover:rotate-0 transition-all duration-500">
              <div className="w-full aspect-square bg-muted rounded-[30px] flex items-center justify-center text-muted-foreground">
                [Main Hero Image]
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}