export default function Hero5() {
  return (
    <section className="relative w-full py-20 md:py-40 flex items-center justify-center transition-colors duration-500 bg-background overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto bg-card/30 backdrop-blur-2xl border border-white/10 dark:border-white/5 rounded-[50px] p-8 md:p-20 shadow-theme-lg text-center space-y-8">
          <h1 className="text-5xl md:text-8xl font-black text-heading tracking-tight">
            Dream Big. <br />
            <span className="text-primary underline decoration-primary/20 underline-offset-8">Shop Bigger.</span>
          </h1>
          <p className="text-lg md:text-xl text-subheading max-w-2xl mx-auto">
            A curated marketplace for the dreamers, the doers, and the builders. 
            Join 10,000+ customers in Rajshahi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button className="bg-foreground text-background px-10 py-5 rounded-full font-black text-lg hover:scale-105 transition-all">
              Start Your Journey
            </button>
            <button className="bg-primary text-primary-foreground px-10 py-5 rounded-full font-black text-lg hover:scale-105 transition-all shadow-theme-md">
              Best Sellers
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}