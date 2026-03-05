import Link from "next/link";
import { Send, Facebook, Instagram, Twitter, ShieldCheck } from "lucide-react";

export default function FooterNewsletter() {
  return (
    <footer className="bg-card border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between bg-primary/5 rounded-3xl p-8 lg:p-12 mb-16 border border-primary/10">
          <div className="mb-6 lg:mb-0 text-center lg:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-heading">Join the Dream Club</h2>
            <p className="text-subheading mt-2">Get 20% off your first order and exclusive weekly deals.</p>
          </div>
          <div className="w-full max-w-md">
            <form className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-4 py-3 rounded-xl bg-input border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
              />
              <button className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all flex items-center gap-2">
                <Send className="w-4 h-4" /> Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-bold text-lg mb-6">Explore</h3>
            <ul className="space-y-4 text-sm text-subheading">
              <li><Link href="/new" className="hover:text-primary transition-colors">New Arrivals</Link></li>
              <li><Link href="/best-sellers" className="hover:text-primary transition-colors">Best Sellers</Link></li>
              <li><Link href="/collections" className="hover:text-primary transition-colors">Collections</Link></li>
              <li><Link href="/sale" className="hover:text-primary transition-colors">Flash Sale</Link></li>
            </ul>
          </div>
          {/* Repeat similar structures for other columns */}
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-primary w-5 h-5" />
            <span className="text-sm font-medium">100% Safe Checkout</span>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} Dream Shop. All transactions are encrypted.
          </p>
        </div>
      </div>
    </footer>
  );
}