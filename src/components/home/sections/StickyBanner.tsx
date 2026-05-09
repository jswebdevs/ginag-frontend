"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";

interface StickyBannerProps {
  data?: any;
  whatsappLink?: string;
}

// Top promo banner. Renders ABOVE the navbar in normal document flow (so it
// can never overlap the sticky header), with a CSS-only marquee for the
// message text — no JS animation, pauses on hover so users can read.
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

  const text = data?.text || "Order now – We will contact you on WhatsApp for full customization";
  const btnText = data?.btnText || "Order Now";
  const link = whatsappLink || "";

  if (!visible) return null;

  // The whole bar is a Link to /order-now. The marquee uses two duplicates of
  // the text in a row that translates -50%, giving an infinite seamless loop.
  return (
    <Link
      href="/order-now"
      className="block w-full bg-primary text-primary-foreground py-2.5 cursor-pointer hover:opacity-95 transition-opacity overflow-hidden relative"
      aria-label={text}
    >
      <div className="container mx-auto px-4 flex items-center gap-3">
        <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />

        {/* Marquee — a single text span that enters from the left, travels
            to the right, then restarts from the left after one full pass.
            No duplicates so the message never appears twice on screen. */}
        <div className="relative flex-1 min-w-0 overflow-hidden h-5">
          <span className="ginag-marquee-track absolute top-0 whitespace-nowrap text-sm font-bold will-change-transform">
            👉 {text}
          </span>
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
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Link>
  );
}
