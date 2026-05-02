import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, CreditCard, Store } from "lucide-react";
import { getGlobalSettings } from "@/lib/getSettings";
import FooterSocials from "./FooterSocials";

async function getPublicSocialLinks() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/social`, {
      next: { revalidate: 300 }
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export default async function Footer() {
  const [settings, socialLinks] = await Promise.all([
    getGlobalSettings(),
    getPublicSocialLinks()
  ]);

  const storeName = settings?.storeName || "Dream Shop";
  const tagline = settings?.tagline || "The best place to find everything you need with fast delivery. Premium e-commerce experience right at your fingertips.";
  const address = settings?.contactAddress || settings?.address || "Rajshahi, Bangladesh";
  const phone = settings?.contactPhone || settings?.supportPhone || "+880 1700 000000";
  const email = settings?.contactEmail || settings?.supportEmail || "support@jswebdevs.com";
  const logoUrl = settings?.logo?.originalUrl || null;
  const footerConfig = settings?.footerConfig as any;

  const col1 = footerConfig?.col1 || {
    showLogo: true,
    showTitle: true,
    title: settings?.storeName || "Industrial Artifacts",
    description: settings?.companySlogan || "Precision engineered accessories designed for the modern architectural lifestyle. Each piece is a testament to materiality and handcrafted integrity."
  };

  const col2 = footerConfig?.col2 || {
    title: "Quick Links",
    links: [
      { label: "Shop All Products", href: "/shop" },
      { label: "Help Center & FAQ", href: "/faq" },
      { label: "Today's Deals", href: "/deals" },
      { label: "Categories", href: "/categories" },
      { label: "About Us", href: "/about" }
    ]
  };

  const col3 = footerConfig?.col3 || {
    title: "Customer Support",
    links: [
      { label: "My Account", href: "/account" },
      { label: "Track Order", href: "/track-order" },
      { label: "Shipping Policy", href: "/policies/shipping-policy" },
      { label: "Returns & Refunds", href: "/policies/return-policy" },
      { label: "Privacy Policy", href: "/policies/privacy-policy" },
      { label: "Terms of Service", href: "/policies/terms-of-service" }
    ]
  };

  const col4 = footerConfig?.col4 || {
    title: "Contact Us",
    contacts: [
      { icon: "MapPin", text: address },
      { icon: "Phone", text: phone },
      { icon: "Mail", text: email }
    ]
  };

  const IconMap: Record<string, any> = { Mail, Phone, MapPin, Store };

  return (
    <footer className="bg-gradient-theme border-t border-border mt-auto pt-16 pb-24 md:pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">

          {/* COLUMN 1: BRANDING & ABOUT */}
          <div className="space-y-8 lg:col-span-4 lg:pr-12">
            <div className="space-y-4">
              {col1.showLogo && (
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
              )}

              {col1.showTitle && (
                <h4 className="text-[10px] font-black text-primary tracking-[0.3em] uppercase">
                  {col1.title}
                </h4>
              )}
            </div>

            <div className="space-y-4">
              <p className="text-subheading text-sm font-medium leading-relaxed max-w-sm">
                {tagline}
              </p>
              
              {col1.description && (
                <div className="pt-4 border-t border-white/5">
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                    {col1.description}
                  </p>
                </div>
              )}
            </div>

            <FooterSocials links={socialLinks} />
          </div>

          {/* COLUMN 2: LINKS */}
          <div className="lg:col-span-2">
            <h3 className="text-heading font-bold mb-6 text-sm uppercase tracking-widest">{col2.title}</h3>
            <ul className="space-y-4">
              {col2.links.map((link: any, i: number) => (
                <li key={i}>
                  <Link href={link.href} className="text-subheading hover:text-primary text-sm font-medium transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: LINKS */}
          <div className="lg:col-span-3">
            <h3 className="text-heading font-bold mb-6 text-sm uppercase tracking-widest">{col3.title}</h3>
            <ul className="space-y-4">
              {col3.links.map((link: any, i: number) => (
                <li key={i}>
                  <Link href={link.href} className="text-subheading hover:text-primary text-sm font-medium transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 4: CONTACTS */}
          <div className="lg:col-span-3">
            <h3 className="text-heading font-bold mb-6 text-sm uppercase tracking-widest">{col4.title}</h3>
            <ul className="space-y-5">
              {col4.contacts.map((contact: any, i: number) => {
                const Icon = IconMap[contact.icon] || MapPin;
                return (
                  <li key={i} className="flex items-start gap-4 text-sm text-subheading">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    {contact.link ? (
                      <a href={contact.link} className="mt-2 font-medium leading-relaxed hover:text-primary transition-colors">
                        {contact.text}
                      </a>
                    ) : (
                      <span className="mt-2 font-medium leading-relaxed">{contact.text}</span>
                    )}
                  </li>
                );
              })}
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

