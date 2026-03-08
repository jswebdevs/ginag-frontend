"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as LucideIcons from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { useUserStore } from "@/store/useUserStore";
import { useEffect, useState, useRef } from "react";
import MobileCategoryDrawer from "./MobileCategoryDrawer";
import api from "@/lib/axios";

// You can keep the local logo as a strict fallback if the API fails
import Image from "next/image";
import fallbackLogo from "./logo.png";

const previewColors: Record<string, string> = {
  sapphire: '#2563eb',
  emerald: '#16a34a',
  ruby: '#dc2626',
  amber: '#d97706',
  amethyst: '#7c3aed',
  rose: '#db2777',
  ocean: '#0891b2',
  slate: '#0f172a'
};

const palettes = ['sapphire', 'emerald', 'ruby', 'amber', 'amethyst', 'rose', 'ocean', 'slate'] as const;

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme, isDark, toggleDark } = useThemeStore();
  const { user, isAuthenticated } = useUserStore();

  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  // --- DYNAMIC SETTINGS STATE ---
  const [storeName, setStoreName] = useState("DreamShop");
  const [storeLogo, setStoreLogo] = useState<string | null>(null);

  // States for Real-Time Search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isDashboard = pathname.includes('/dashboard');

  useEffect(() => {
    setMounted(true);

    // FETCH DYNAMIC LOGO & STORE NAME
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        if (res.data?.data) {
          setStoreName(res.data.data.storeName || "DreamShop");
          setStoreLogo(
            res.data.data.logo?.thumbUrl ||
            res.data.data.logo?.originalUrl ||
            null
          );
        }
      } catch (error) {
        console.error("Failed to load navbar settings", error);
      }
    };

    fetchSettings();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // REAL-TIME SEARCH LOGIC
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 2) {
        setIsSearching(true);
        try {
          const res = await api.get(`/search?q=${searchQuery}&limit=6`);
          const data = res.data.data || res.data.results || res.data || [];

          setSearchResults(Array.isArray(data) ? data : []);
          setShowResults(true);
        } catch (err) {
          console.error("Search failed", err);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowResults(false);
      setShowMobileSearch(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // --- SMART DASHBOARD LINK GENERATOR ---
  const getDashboardLink = () => {
    if (!isAuthenticated || !user) return "/login";

    const rawRoles = (user as any)?.roles || (user as any)?.role;
    const rolesArray = Array.isArray(rawRoles) ? rawRoles : [rawRoles].filter(Boolean);

    if (rolesArray.length === 0) return "/dashboard";

    const ROLE_HIERARCHY = [
      'SUPER_ADMIN', 'ADMIN', 'PRODUCT_MANAGER', 'ORDER_MANAGER',
      'DELIVERY_MANAGER', 'MARKETING_SPECIALIST', 'SUPPORT_AGENT', 'CUSTOMER'
    ];

    let primaryRole = 'CUSTOMER';
    for (const rank of ROLE_HIERARCHY) {
      if (rolesArray.includes(rank)) {
        primaryRole = rank;
        break;
      }
    }

    if (primaryRole === 'CUSTOMER') return '/dashboard';
    return `/dashboard/${primaryRole.toLowerCase().replace('_', '-')}`;
  };

  const dashboardLink = getDashboardLink();

  const handleMobileSearchToggle = () => {
    setShowMobileSearch(!showMobileSearch);
    if (!showMobileSearch) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => searchInputRef.current?.focus(), 300);
    }
  };

  const ThemeSwitcherUI = () => {
    if (!mounted) return <div className="w-20 h-8 bg-muted animate-pulse rounded-full" />;

    return (
      <div className="flex items-center gap-1 md:gap-2 p-1 border border-border rounded-full bg-background/50 backdrop-blur-sm transition-colors">
        <button onClick={toggleDark} className="p-1 md:p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors">
          {isDark ? <LucideIcons.Moon className="w-3.5 h-3.5 md:w-4 md:h-4" /> : <LucideIcons.Sun className="w-3.5 h-3.5 md:w-4 md:h-4" />}
        </button>
        <div className="h-4 w-[1px] bg-border" />
        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-1 md:gap-2 p-1 md:p-1.5 pl-2 pr-1 text-sm font-medium rounded-full hover:bg-muted transition-colors">
            <div className="w-3 h-3 md:w-4 md:h-4 rounded-full border border-border" style={{ backgroundColor: previewColors[theme] || previewColors.sapphire }} />
            <LucideIcons.ChevronDown className="w-3 h-3 opacity-50" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 py-2 bg-popover border border-border rounded-xl shadow-theme-lg z-50">
              <div className="grid grid-cols-4 gap-2 px-3">
                {palettes.map((p) => (
                  <button
                    key={p}
                    onClick={() => { setTheme(p); setIsDropdownOpen(false); }}
                    className={`flex justify-center w-8 h-8 rounded-full border transition-all ${theme === p ? 'border-primary ring-2 ring-primary/30 ring-offset-2 ring-offset-background' : 'border-transparent hover:scale-110'}`}
                  >
                    <div className="w-5 h-5 rounded-full border border-black/10 dark:border-white/10 m-auto" style={{ backgroundColor: previewColors[p] }} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <nav className="sticky top-0 z-40 w-full bg-gradient-theme border-b border-border shadow-theme-sm">
        <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between gap-4">

          <div className="flex items-center gap-3">
            <button onClick={() => setIsDrawerOpen(true)} className="md:hidden p-1 -ml-1 text-foreground hover:text-primary transition-colors" aria-label="Open menu" title="Menu">
              <LucideIcons.Menu className="w-6 h-6" />
            </button>

            {/* DYNAMIC LOGO / STORE NAME RENDERING */}
            <Link href="/" className="relative flex items-center gap-2">
              {storeLogo ? (
                <img
                  src={storeLogo}
                  alt={`${storeName} Logo`}
                  className="h-8 md:h-10 w-auto max-w-[160px] object-contain"
                />
              ) : fallbackLogo ? (
                <Image
                  src={fallbackLogo}
                  alt={`${storeName} Logo`}
                  width={160}
                  height={40}
                  priority
                  className="object-contain"
                />
              ) : (
                <div className="flex items-center gap-2 text-primary">
                  <LucideIcons.Store size={28} />
                  <span className="font-black text-xl tracking-tight hidden sm:block">{storeName}</span>
                </div>
              )}
            </Link>
          </div>

          {/* DESKTOP SEARCH BAR */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8 relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input
                type="text"
                placeholder="Search products, brands, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length > 2 && setShowResults(true)}
                className="w-full border border-border rounded-full py-2.5 px-5 outline-none focus:ring-2 focus:ring-primary bg-background/50 backdrop-blur-sm transition-all text-foreground"
              />
              <button type="submit" className="absolute right-4 top-3 text-muted-foreground hover:text-primary transition-colors">
                {isSearching ? <LucideIcons.Loader2 className="w-5 h-5 animate-spin" /> : <LucideIcons.Search className="w-5 h-5" />}
              </button>
            </form>

            {/* GENERIC RESULTS OVERLAY */}
            {showResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-2xl shadow-theme-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                {searchResults.length > 0 ? (
                  <div className="py-2">
                    {searchResults.map((item, index) => {
                      const itemName = item.name || item.title || "Unknown Result";
                      const itemSlug = item.slug || item.id || "";

                      let itemLink = `/products/${itemSlug}`;
                      if (item.type === 'category' || item.parentId === null) itemLink = `/category/${itemSlug}`;
                      if (item.type === 'brand') itemLink = `/brand/${itemSlug}`;

                      let secondaryText = "Result";
                      if (item.basePrice) secondaryText = `৳${item.basePrice}`;
                      else if (item.type) secondaryText = String(item.type).toUpperCase();
                      else if (item.description) secondaryText = item.description.substring(0, 30) + '...';

                      const imageSrc = item.featuredImage?.thumbUrl || item.image || item.iconUrl;

                      return (
                        <Link
                          key={item.id || index}
                          href={itemLink}
                          onClick={() => setShowResults(false)}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors"
                        >
                          <div className="w-10 h-10 rounded bg-muted overflow-hidden flex-shrink-0 flex items-center justify-center border border-border/50">
                            {imageSrc ? (
                              <img src={imageSrc} alt={itemName} className="w-full h-full object-cover" />
                            ) : (
                              <LucideIcons.Search className="w-4 h-4 text-muted-foreground/50" />
                            )}
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-semibold truncate text-foreground">{itemName}</p>
                            <p className="text-xs text-primary font-bold tracking-wide">{secondaryText}</p>
                          </div>
                        </Link>
                      );
                    })}
                    <button
                      onClick={handleSearchSubmit}
                      className="w-full py-3 bg-primary/5 text-primary text-xs font-bold hover:bg-primary/10 transition-colors border-t border-border mt-1"
                    >
                      See all results for "{searchQuery}"
                    </button>
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">No matches found.</div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            <ThemeSwitcherUI />

            <Link href="/wishlist" className="hidden md:flex relative p-2 text-muted-foreground hover:text-primary transition-colors">
              <LucideIcons.Heart className="w-6 h-6" />
              <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {wishlistCount}
              </span>
            </Link>

            <Link href="/cart" className="relative p-2 text-muted-foreground hover:text-primary transition-colors">
              <LucideIcons.ShoppingCart className="w-6 h-6" />
              <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {cartCount}
              </span>
            </Link>

            <Link href={dashboardLink} className="hidden md:flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors ml-2">
              <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center border border-border hover:border-primary transition-colors">
                <LucideIcons.User className="w-5 h-5" />
              </div>
            </Link>
          </div>
        </div>

        {/* MOBILE SEARCH BAR */}
        {showMobileSearch && (
          <div className="md:hidden px-4 pb-3 animate-in slide-in-from-top duration-300">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-border rounded-xl py-2 px-4 outline-none focus:ring-2 focus:ring-primary bg-background transition-all text-foreground"
              />
              <button type="submit" className="absolute right-3 top-2.5 text-muted-foreground">
                <LucideIcons.Search className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}
      </nav>

      <MobileCategoryDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      <style dangerouslySetInnerHTML={{
        __html: `
        @media (max-width: 767px) {
          body { padding-bottom: 5rem; }
        }
      `}} />

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-gradient-theme border-t border-border pb-safe shadow-theme-md">
        <div className="flex justify-around items-center h-16 px-2">
          <Link href="/wishlist" className={`flex flex-col items-center justify-center w-full h-full gap-1 relative ${pathname === '/wishlist' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
            <LucideIcons.Heart className="w-5 h-5" />
            <span className="text-[10px] font-medium">Wishlist</span>
            {wishlistCount > 0 && <span className="absolute top-2 right-4 bg-primary text-white text-[8px] font-bold px-1.5 rounded-full">{wishlistCount}</span>}
          </Link>

          <Link href="/deals" className={`flex flex-col items-center justify-center w-full h-full gap-1 ${pathname === '/deals' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
            <LucideIcons.Zap className="w-5 h-5" />
            <span className="text-[10px] font-medium">Deals</span>
          </Link>

          <Link href="/" className="flex flex-col items-center justify-center w-full h-full gap-1 -mt-4 relative z-10">
            <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-theme-sm border-4 border-background">
              <LucideIcons.Home className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-medium text-muted-foreground mt-0.5">Home</span>
          </Link>

          <button onClick={handleMobileSearchToggle} className={`flex flex-col items-center justify-center w-full h-full gap-1 ${showMobileSearch ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
            <LucideIcons.Search className="w-5 h-5" />
            <span className="text-[10px] font-medium">Search</span>
          </button>

          <Link href={dashboardLink} className={`flex flex-col items-center justify-center w-full h-full gap-1 ${isDashboard || pathname === '/login' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
            <LucideIcons.User className="w-5 h-5" />
            <span className="text-[10px] font-medium">{isAuthenticated ? "Account" : "Login"}</span>
          </Link>
        </div>
      </div>
    </>
  );
}