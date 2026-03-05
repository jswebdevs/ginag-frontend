export default function Hero3() {
  return (
    <section className="relative w-full h-[80vh] min-h-[600px] flex items-center transition-colors duration-500">
      {/* The Image Layer */}
      <div 
        className="absolute inset-0 bg-cover bg-center -z-20"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070')" }} 
      />
      {/* The Theme-Aware Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent -z-10" />
      
      <div className="container mx-auto px-4">
        <div className="max-w-2xl space-y-8">
          <div className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-bold uppercase tracking-widest">
            New Arrival 2026
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-heading leading-tight">
            Work Smarter, <br />
            <span className="text-primary">Not Harder.</span>
          </h1>
          <p className="text-xl text-subheading leading-relaxed">
            Discover the latest in high-end workstations and ergonomic setups curated for the Rajshahi tech community.
          </p>
          <div className="flex items-center gap-6">
            <button className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold shadow-theme-lg hover:brightness-110 transition-all">
              View Collection
            </button>
            <button className="text-heading font-bold flex items-center gap-2 group">
              See Video <span className="group-hover:translate-x-2 transition-transform">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}