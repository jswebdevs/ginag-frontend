"use client";

import Link from "next/link";
import {
  X,
  ClipboardList,
  Sparkles,
  House,
  Phone,
  Mail,
  Info,
  PackageSearch,
} from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

interface MobileCategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_LINKS = [
  { name: "Home", href: "/", Icon: House },
  { name: "Catalog", href: "/products", Icon: PackageSearch },
  { name: "About", href: "/about-us", Icon: Info },
];

export default function MobileCategoryDrawer({ isOpen, onClose }: MobileCategoryDrawerProps) {
  const { settings } = useSettings();

  const storeName = settings?.storeName || "GinaG";
  const supportEmail = settings?.supportEmail || settings?.contactEmail;
  const supportPhone = settings?.supportPhone || settings?.contactPhone;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-card z-[101] transform transition-transform duration-300 ease-in-out md:hidden flex flex-col shadow-theme-lg border-r border-border ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border bg-gradient-theme">
          <div className="flex flex-col">
            <span className="font-black text-xl text-primary tracking-tight leading-none">
              {storeName}
            </span>
            {settings?.tagline && (
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                {settings.tagline}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-xl hover:bg-muted border border-transparent hover:border-border"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Now CTA */}
        <div className="p-4 border-b border-border bg-muted/10">
          <Link
            href="/order-now"
            onClick={onClose}
            className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-2xl font-black uppercase tracking-widest text-xs shadow-theme-sm hover:shadow-theme-md transition-all"
          >
            <ClipboardList className="w-4 h-4" />
            Order Now
          </Link>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Quick links */}
          <div className="px-2 py-3">
            <div className="px-3 pb-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              Browse
            </div>
            <div className="flex flex-col">
              {QUICK_LINKS.map(({ name, href, Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-foreground hover:bg-primary/5 hover:text-primary transition-colors"
                >
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  {name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/5 space-y-2">
          {supportPhone && (
            <a
              href={`tel:${supportPhone}`}
              className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
            >
              <Phone className="w-3 h-3" /> {supportPhone}
            </a>
          )}
          {supportEmail && (
            <a
              href={`mailto:${supportEmail}`}
              className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail className="w-3 h-3" /> {supportEmail}
            </a>
          )}
          <p className="text-[10px] font-black text-center text-muted-foreground uppercase tracking-[0.2em] pt-2 border-t border-border/40 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3 h-3 text-primary" />
            {storeName} · Custom Charms
          </p>
        </div>
      </div>
    </>
  );
}
