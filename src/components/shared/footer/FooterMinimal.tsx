import Link from "next/link";
import { Facebook, Instagram, Youtube } from "lucide-react";

export default function FooterMinimal() {
  return (
    <footer className="bg-background py-16 border-t border-border">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <Link href="/" className="text-3xl font-black tracking-tighter text-foreground mb-8">
          DREAM<span className="text-primary">.</span>
        </Link>
        
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-10">
          <Link href="/shop" className="text-sm font-medium text-subheading hover:text-primary transition-colors">Shop</Link>
          <Link href="/privacy" className="text-sm font-medium text-subheading hover:text-primary transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="text-sm font-medium text-subheading hover:text-primary transition-colors">Terms of Service</Link>
          <Link href="/contact" className="text-sm font-medium text-subheading hover:text-primary transition-colors">Contact</Link>
          <Link href="/shipping" className="text-sm font-medium text-subheading hover:text-primary transition-colors">Shipping Info</Link>
        </nav>

        <div className="flex gap-6 mb-10">
          <Facebook className="w-5 h-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
          <Instagram className="w-5 h-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
          <Youtube className="w-5 h-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
        </div>

        <p className="text-xs tracking-widest text-muted-foreground uppercase">
          Rajshahi, Bangladesh — Established 2026
        </p>
      </div>
    </footer>
  );
}