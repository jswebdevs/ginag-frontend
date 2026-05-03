"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { MessageCircle, X } from "lucide-react";

export default function StickyBanner({ data }: { data?: any }) {
  const [visible, setVisible] = useState(true);
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const dismissed = sessionStorage.getItem("ginag-banner-dismissed");
    if (dismissed) setVisible(false);

    api.get("/settings").then(res => {
      if (res.data.success) setPhone(res.data.data?.contactPhone || "");
    }).catch(() => {});
  }, []);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem("ginag-banner-dismissed", "1");
  };

  const content = data || {
    text: "Order now – We will contact you on WhatsApp for full customization",
    btnText: "Order Now",
  };

  const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, "")}`;

  if (!visible) return null;

  return (
    <div className="sticky top-0 z-50 w-full bg-primary text-primary-foreground py-2.5 px-4">
      <div className="container mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <MessageCircle className="w-4 h-4 shrink-0" />
          <p className="text-sm font-bold truncate">
            👉 {content.text}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 bg-primary-foreground text-primary rounded-full text-xs font-black uppercase tracking-widest hover:opacity-90 transition-opacity"
          >
            {content.btnText}
          </a>
          <button
            onClick={dismiss}
            className="p-1 rounded-full hover:bg-primary-foreground/20 transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
