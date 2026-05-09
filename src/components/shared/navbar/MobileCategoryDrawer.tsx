"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import {
  X,
  Loader2,
  ChevronDown,
  ClipboardList,
  Sparkles,
  House,
  Phone,
  Mail,
  HelpCircle,
  Info,
  PackageSearch,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useSettings } from "@/context/SettingsContext";

const IconRenderer = dynamic(() => import("@/components/shared/IconRenderer"), {
  ssr: false,
  loading: () => <span className="w-4 h-4 inline-block" aria-hidden="true" />,
});

interface MobileCategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_LINKS = [
  { name: "Home", href: "/", Icon: House },
  { name: "Catalog", href: "/products", Icon: PackageSearch },
  { name: "About", href: "/about-us", Icon: Info },
  { name: "FAQ", href: "/faq", Icon: HelpCircle },
  { name: "Contact", href: "/contact-us", Icon: Phone },
];

export default function MobileCategoryDrawer({ isOpen, onClose }: MobileCategoryDrawerProps) {
  const { settings } = useSettings();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({});

  const storeName = settings?.storeName || "GinaG";
  const supportEmail = settings?.supportEmail || settings?.contactEmail;
  const supportPhone = settings?.supportPhone || settings?.contactPhone;

  useEffect(() => {
    if (!isOpen) return;
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await api.get("/categories");
        const allCats = res.data.data || [];
        const parents = allCats.filter((c: any) => !c.parentId);
        const nested = parents.map((parent: any) => ({
          ...parent,
          children: allCats.filter((c: any) => c.parentId === parent.id),
        }));
        setCategories(nested);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [isOpen]);

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedCats((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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

          {/* Categories */}
          <div className="px-2 pb-4">
            <div className="px-3 py-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              Categories
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-8 text-primary">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            ) : categories.length === 0 ? (
              <div className="px-4 py-8 text-xs text-muted-foreground text-center italic">
                No categories yet.
              </div>
            ) : (
              <div className="flex flex-col">
                {categories.map((cat) => {
                  const hasChildren = cat.children && cat.children.length > 0;
                  const isExpanded = expandedCats[cat.id];
                  return (
                    <div key={cat.id} className="border-b border-border/40 last:border-0">
                      <div className="flex items-center justify-between group">
                        <Link
                          href={`/categories/${cat.slug}`}
                          onClick={onClose}
                          className="flex-1 flex items-center gap-3 px-3 py-3 text-foreground hover:bg-primary/5 transition-colors rounded-l-xl"
                        >
                          <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                            <IconRenderer name={cat.icon} className="w-4 h-4" />
                          </div>
                          <span className="font-bold text-sm tracking-tight">{cat.name}</span>
                        </Link>
                        {hasChildren && (
                          <button
                            onClick={(e) => toggleExpand(cat.id, e)}
                            aria-label={isExpanded ? "Collapse" : "Expand"}
                            className="p-3 text-muted-foreground hover:text-primary transition-colors"
                          >
                            <ChevronDown
                              className={`w-4 h-4 transition-transform duration-300 ${
                                isExpanded ? "rotate-180 text-primary" : ""
                              }`}
                            />
                          </button>
                        )}
                      </div>

                      {hasChildren && (
                        <div
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="py-1 pl-12 pr-3 flex flex-col">
                            {cat.children.map((child: any) => (
                              <Link
                                key={child.id}
                                href={`/categories/${child.slug}`}
                                onClick={onClose}
                                className="py-2 text-xs text-muted-foreground hover:text-primary font-bold transition-colors flex items-center gap-2"
                              >
                                <IconRenderer
                                  name={child.icon}
                                  className="w-3 h-3 text-muted-foreground/60"
                                />
                                <span>{child.name}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
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
