import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, CreditCard } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-theme border-t border-border mt-auto pt-16 pb-24 md:pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          <div className="space-y-4">
            <Link href="/" className="text-2xl font-bold tracking-tighter text-primary block">
              DREAM<span className="text-foreground">SHOP</span>
            </Link>
            <p className="text-subheading text-sm leading-relaxed">
              The best place to find everything you need with fast delivery. Premium e-commerce experience right at your fingertips.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-heading font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/shop" className="text-subheading hover:text-primary text-sm transition-colors">Shop All Products</Link></li>
              <li><Link href="/deals" className="text-subheading hover:text-primary text-sm transition-colors">Today's Deals</Link></li>
              <li><Link href="/categories" className="text-subheading hover:text-primary text-sm transition-colors">Categories</Link></li>
              <li><Link href="/about" className="text-subheading hover:text-primary text-sm transition-colors">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-heading font-semibold mb-6">Customer Service</h3>
            <ul className="space-y-3">
              <li><Link href="/account" className="text-subheading hover:text-primary text-sm transition-colors">My Account</Link></li>
              <li><Link href="/track-order" className="text-subheading hover:text-primary text-sm transition-colors">Track Order</Link></li>
              <li><Link href="/returns" className="text-subheading hover:text-primary text-sm transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="/faq" className="text-subheading hover:text-primary text-sm transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-heading font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-subheading">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span>Rajshahi, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-subheading">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span>+880 1700 000000</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-subheading">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>support@jswebdevs.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Dream Shop by JS Web Devs. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-muted-foreground">
            <CreditCard className="w-6 h-6" />
            <span className="text-sm font-medium">Secure Payments</span>
          </div>
        </div>
      </div>
    </footer>
  );
}