import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, User, Store, Sparkles } from "lucide-react";
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

  const storeName = settings?.storeName || "Ginag";
  const tagline = settings?.tagline || "The best place to find everything you need with fast delivery. Premium e-commerce experience right at your fingertips.";
  const logoUrl = settings?.logo?.originalUrl || null;

  return (
    <footer className="bg-gradient-theme border-t border-border mt-auto pt-16 pb-24 md:pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">

          {/* COLUMN 1: BRANDING */}
          <div className="space-y-8 lg:col-span-3 lg:pr-8">
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

            <p className="text-subheading text-sm font-medium leading-relaxed max-w-sm">
              {tagline}
            </p>

            <FooterSocials links={socialLinks} />
          </div>

          {/* COLUMN 2: ABOUT US + RETURN POLICY */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <h3 className="text-heading font-bold mb-6 text-sm uppercase tracking-widest">
                About Us
              </h3>
              <Link
                href="/about-us"
                className="inline-flex items-center gap-2 text-subheading hover:text-primary text-sm font-medium transition-colors group"
              >
                <span>Read our story</span>
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>

            <div>
              <h3 className="text-heading font-bold mb-6 text-sm uppercase tracking-widest">
                Return Policy
              </h3>
              <div className="space-y-3 text-xs text-muted-foreground leading-relaxed font-medium">
                <p>
                  All GG Purse Decor products are custom-made especially for you.
                  Due to the personalized nature of our items, we do not accept
                  returns or exchanges unless the item arrives damaged.
                </p>
                <p>
                  If your item is damaged during delivery, please contact us
                  within <span className="text-foreground font-bold">48 hours</span>{" "}
                  of receiving your order and include a photo of the damage. Once
                  verified, we will gladly replace the item.
                </p>
              </div>
            </div>
          </div>

          {/* COLUMN 3: CONTACT US */}
          <div className="lg:col-span-3">
            <h3 className="text-heading font-bold mb-6 text-sm uppercase tracking-widest">
              Contact Us
            </h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-4 text-sm text-subheading">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <span className="mt-2 font-medium leading-relaxed">
                  Gina A. Greenlee
                </span>
              </li>
              <li className="flex items-start gap-4 text-sm text-subheading">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <a
                  href="mailto:alexgreeng@att.net"
                  className="mt-2 font-medium leading-relaxed hover:text-primary transition-colors break-all"
                >
                  alexgreeng@att.net
                </a>
              </li>
              <li className="flex items-start gap-4 text-sm text-subheading">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <a
                  href="tel:6152022317"
                  className="mt-2 font-medium leading-relaxed hover:text-primary transition-colors"
                >
                  615-202-2317
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* COPYRIGHT */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground font-medium text-center md:text-left">
            © {new Date().getFullYear()} {storeName}. All rights reserved.
          </p>
          <Link href="/order-now" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-widest">Custom Orders Welcome</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
