"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";

interface StickyBannerProps {
  data?: any;
  whatsappLink?: string;
}

export default function StickyBanner({ data, whatsappLink }: StickyBannerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("ginag-banner-dismissed");
    if (!dismissed) setVisible(true);
  }, []);

  const dismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setVisible(false);
    sessionStorage.setItem("ginag-banner-dismissed", "1");
  };

  const text    = data?.text    || "Order now – We will contact you on WhatsApp for full customization";
  const btnText = data?.btnText || "Order Now";
  const link    = whatsappLink  || "";

  if (!visible) return null;

  // The whole banner row is a link to /order-now. The WhatsApp button (if a
  // link is configured) and the close (X) need stopPropagation so they don't
  // bubble up to the parent navigation.
  return (
    <Link
      href="/order-now"
      className="sticky top-0 z-50 w-full bg-primary text-primary-foreground py-2.5 px-4 cursor-pointer hover:opacity-95 transition-opacity"
    >
      <div className="container mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <MessageCircle className="w-4 h-4 shrink-0" />
          <p className="text-sm font-bold truncate">👉 {text}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 bg-primary-foreground text-primary rounded-full text-xs font-black uppercase tracking-widest hover:opacity-90 transition-opacity cursor-pointer"
            >
              {btnText}
            </a>
          )}
          <button
            type="button"
            onClick={dismiss}
            className="p-1 rounded-full hover:bg-primary-foreground/20 transition-colors cursor-pointer"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Link>
  );
}
