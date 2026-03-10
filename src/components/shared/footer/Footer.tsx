import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, CreditCard, Store } from "lucide-react";
import { getGlobalSettings } from "@/lib/getSettings";

export default async function Footer() {
  // Fetch settings dynamically on the server
  const settings = await getGlobalSettings();

  // Map database values with strict fallbacks
  const storeName = settings?.storeName || "Dream Shop";
  const tagline = settings?.tagline || "The best place to find everything you need with fast delivery. Premium e-commerce experience right at your fingertips.";
  const address = settings?.address || "Rajshahi, Bangladesh";
  const phone = settings?.supportPhone || "+880 1700 000000";
  const email = settings?.supportEmail || "support@jswebdevs.com";
  const logoUrl = settings?.logo?.originalUrl || null;

  // Social Links extraction
  const socials = settings?.socialLinks || {};

  return (
    <footer className="bg-gradient-theme border-t border-border mt-auto pt-16 pb-24 md:pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">

          {/* BRANDING, TAGLINE & SOCIALS */}
          <div className="space-y-6 lg:col-span-4 lg:pr-8">
            <Link href="/" className="block w-fit">
              {logoUrl ? (
                <div className="relative h-12 w-48">
                  <Image
                    src={logoUrl}
                    alt={`${storeName} Logo`}
                    fill
                    sizes="(max-width: 768px) 192px, 200px"
                    className="object-contain object-left"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 text-primary">
                  <Store className="w-8 h-8" />
                  <span className="text-2xl font-bold tracking-tighter text-foreground uppercase">
                    {storeName}
                  </span>
                </div>
              )}
            </Link>

            <p className="text-subheading text-sm md:text-base leading-relaxed">
              {tagline}
            </p>

            {/* DYNAMIC SOCIAL LINKS */}
            <div className="flex flex-wrap gap-3 pt-2">
              {socials.facebook && (
                <a href={socials.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-sm" aria-label="Facebook">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {socials.twitter && (
                <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-sm" aria-label="Twitter">
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {socials.instagram && (
                <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-sm" aria-label="Instagram">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {socials.youtube && (
                <a href={socials.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-sm" aria-label="YouTube">
                  <Youtube className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="lg:col-span-2">
            <h3 className="text-heading font-bold mb-6 text-sm uppercase tracking-widest">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link href="/shop" className="text-subheading hover:text-primary text-sm font-medium transition-colors">Shop All Products</Link></li>
              <li><Link href="/faq" className="text-subheading hover:text-primary text-sm font-medium transition-colors">Help Center & FAQ</Link></li>
              <li><Link href="/deals" className="text-subheading hover:text-primary text-sm font-medium transition-colors">Today's Deals</Link></li>
              <li><Link href="/categories" className="text-subheading hover:text-primary text-sm font-medium transition-colors">Categories</Link></li>
              <li><Link href="/about" className="text-subheading hover:text-primary text-sm font-medium transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* CUSTOMER SERVICE & LEGAL */}
          <div className="lg:col-span-3">
            <h3 className="text-heading font-bold mb-6 text-sm uppercase tracking-widest">Customer Support</h3>
            <ul className="space-y-4">
              <li><Link href="/account" className="text-subheading hover:text-primary text-sm font-medium transition-colors">My Account</Link></li>
              <li><Link href="/track-order" className="text-subheading hover:text-primary text-sm font-medium transition-colors">Track Order</Link></li>
              <li><Link href="/policies/shipping-policy" className="text-subheading hover:text-primary text-sm font-medium transition-colors">Shipping Policy</Link></li>
              <li><Link href="/policies/return-policy" className="text-subheading hover:text-primary text-sm font-medium transition-colors">Returns & Refunds</Link></li>
              <li><Link href="/policies/privacy-policy" className="text-subheading hover:text-primary text-sm font-medium transition-colors">Privacy Policy</Link></li>
              <li><Link href="/policies/terms-of-service" className="text-subheading hover:text-primary text-sm font-medium transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* DYNAMIC CONTACT INFO */}
          <div className="lg:col-span-3">
            <h3 className="text-heading font-bold mb-6 text-sm uppercase tracking-widest">Contact Us</h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-4 text-sm text-subheading">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <span className="mt-2 font-medium leading-relaxed">{address}</span>
              </li>
              <li className="flex items-center gap-4 text-sm text-subheading">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <span className="font-medium">{phone}</span>
              </li>
              <li className="flex items-center gap-4 text-sm text-subheading">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <span className="font-medium">{email}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* COPYRIGHT */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground font-medium text-center md:text-left">
            © {new Date().getFullYear()} {storeName} by <a href="https://jswebdevs.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">JS Web Devs</a>. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-muted-foreground">
            <CreditCard className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-widest">Secure Payments</span>
          </div>
        </div>
      </div>
    </footer>
  );
}