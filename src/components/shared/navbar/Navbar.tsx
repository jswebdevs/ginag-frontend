"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as LucideIcons from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { useUserStore } from "@/store/useUserStore";
import { useEffect, useState, useRef } from "react";
import MobileCategoryDrawer from "./MobileCategoryDrawer";
import api from "@/lib/axios";
import Image from "next/image";
import fallbackLogo from "./logo.png";

// 🔥 Import Chat Components for Mobile Overlay
import ChatLogin from "@/components/shared/chatbox/ChatLogin";
import CustomerChatBox from "@/components/shared/chatbox/CustomerChatBox";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { userTheme, setTheme, isDark, toggleDark } = useThemeStore();
  const [availableThemes, setAvailableThemes] = useState<any[]>([]);
  const { user, isAuthenticated } = useUserStore();

  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // 🔥 Mobile Chat State
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [chatToken, setChatToken] = useState<string | null>(null);

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
    const fetchThemes = async () => {
      try {
        const res = await api.get('/themes/list');
        setAvailableThemes(res.data.data || []);
      } catch (error) {
        console.error("Failed to load themes", error);
      }
    };
    fetchThemes();
    fetchSettings();
  }, []);

  // Check Chat Token when Mobile Chat Opens
  useEffect(() => {
    if (isMobileChatOpen) {
      const storedToken = localStorage.getItem("token") || document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      if (storedToken) setChatToken(storedToken);
    }
  }, [isMobileChatOpen]);

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
    setIsMobileChatOpen(false); // Close chat if opening search
    if (!showMobileSearch) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => searchInputRef.current?.focus(), 300);
    }
  };

  const handleMobileChatToggle = () => {
    setIsMobileChatOpen(!isMobileChatOpen);
    setShowMobileSearch(false); // Close search if opening chat
  };

  const ThemeSwitcherUI = () => {
    if (!mounted) return <div className="w-20 h-8 bg-muted animate-pulse rounded-full" />;
    const activePreviewColor = userTheme?.lightVariables?.primary
      ? `hsl(${userTheme.lightVariables.primary})`
      : 'var(--color-primary)';

    return (
      <div className="flex items-center gap-1 md:gap-2 p-1 border border-border rounded-full bg-background/50 backdrop-blur-sm transition-colors">
        <button onClick={toggleDark} className="p-1 md:p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors">
          {isDark ? <LucideIcons.Moon className="w-3.5 h-3.5 md:w-4 md:h-4" /> : <LucideIcons.Sun className="w-3.5 h-3.5 md:w-4 md:h-4" />}
        </button>
        <div className="h-4 w-[1px] bg-border" />
        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-1 md:gap-2 p-1 md:p-1.5 pl-2 pr-1 text-sm font-medium rounded-full hover:bg-muted transition-colors">
            <div className="w-3 h-3 md:w-4 md:h-4 rounded-full border border-black/10" style={{ backgroundColor: activePreviewColor }} />
            <LucideIcons.ChevronDown className="w-3 h-3 opacity-50" />
          </button>
          {isDropdownOpen && availableThemes.length > 0 && (
            <div className="absolute right-0 mt-3 w-56 py-3 bg-popover border border-border rounded-2xl shadow-theme-xl z-50 animate-in fade-in zoom-in-95 duration-200">
              <p className="px-4 pb-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Select Mood</p>
              <div className="grid grid-cols-4 gap-3 px-4">
                {availableThemes.map((t) => (
                  <button
                    key={t.id}
                    title={t.name}
                    onClick={() => { setTheme(t); setIsDropdownOpen(false); }}
                    className={`group relative flex justify-center w-9 h-9 rounded-xl border transition-all ${userTheme?.id === t.id ? 'border-primary bg-primary/10' : 'border-transparent hover:bg-muted'}`}
                  >
                    <div
                      className="w-6 h-6 rounded-lg border border-black/5 shadow-sm m-auto transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `hsl(${t.lightVariables.primary})` }}
                    />
                    {userTheme?.id === t.id && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-background flex items-center justify-center">
                        <LucideIcons.Check className="text-white w-2 h-2" strokeWidth={4} />
                      </div>
                    )}
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

      {/* 🔥 FULL SCREEN MOBILE CHAT OVERLAY (Sits exactly above the navbar) */}
      {isMobileChatOpen && (
        <div className="md:hidden fixed top-0 left-0 right-0 bottom-16 z-50 bg-background flex flex-col animate-in slide-in-from-bottom-5 duration-300" style={{ bottom: "calc(4rem + env(safe-area-inset-bottom))" }}>
          <div className="p-4 bg-primary text-primary-foreground flex justify-between items-center z-10 shadow-md">
            <div>
              <h3 className="font-black text-lg tracking-tight leading-none">Live Support</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mt-1">We typically reply instantly</p>
            </div>
            <div className="flex gap-2">
              {chatToken && (
                <button onClick={() => {
                  localStorage.removeItem("token");
                  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                  setChatToken(null);
                }} className="p-1.5 hover:bg-black/10 rounded-lg transition-colors">
                  <LucideIcons.LogOut size={16} />
                </button>
              )}
              <button onClick={() => setIsMobileChatOpen(false)} className="p-1.5 hover:bg-black/10 rounded-lg transition-colors">
                <LucideIcons.X size={20} />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden relative">
            {!chatToken ? (
              <ChatLogin onLoginSuccess={(newToken) => setChatToken(newToken)} />
            ) : (
              <CustomerChatBox token={chatToken} />
            )}
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM NAV */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[60] bg-gradient-theme border-t border-border pb-safe shadow-theme-md">
        <div className="flex justify-around items-center h-16 px-2">

          <Link href="/wishlist" className={`flex flex-col items-center justify-center w-full h-full gap-1 relative ${pathname === '/wishlist' && !isMobileChatOpen && !showMobileSearch ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
            <LucideIcons.Heart className="w-5 h-5" />
            <span className="text-[10px] font-medium">Wishlist</span>
            {wishlistCount > 0 && <span className="absolute top-2 right-4 bg-primary text-white text-[8px] font-bold px-1.5 rounded-full">{wishlistCount}</span>}
          </Link>

          {/* Home button moved here (Replacing Deals) */}
          <Link href="/" onClick={() => { setIsMobileChatOpen(false); setShowMobileSearch(false); }} className={`flex flex-col items-center justify-center w-full h-full gap-1 ${pathname === '/' && !isMobileChatOpen && !showMobileSearch ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
            <LucideIcons.Home className="w-5 h-5" />
            <span className="text-[10px] font-medium">Home</span>
          </Link>

          {/* Center Prominent Item: Search (Replacing Home) */}
          <button onClick={handleMobileSearchToggle} className="flex flex-col items-center justify-center w-full h-full gap-1 -mt-4 relative z-10">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-theme-sm border-4 border-background transition-colors ${showMobileSearch ? 'bg-muted text-primary' : 'bg-primary text-primary-foreground'}`}>
              <LucideIcons.Search className="w-6 h-6" />
            </div>
            <span className={`text-[10px] font-medium mt-0.5 ${showMobileSearch ? 'text-primary' : 'text-muted-foreground'}`}>Search</span>
          </button>

          {/* 4th Item: Chat (Replacing Search) */}
          <button onClick={handleMobileChatToggle} className={`flex flex-col items-center justify-center w-full h-full gap-1 ${isMobileChatOpen ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
            <LucideIcons.MessageSquare className="w-5 h-5" />
            <span className="text-[10px] font-medium">Chat</span>
          </button>

          <Link href={dashboardLink} onClick={() => { setIsMobileChatOpen(false); setShowMobileSearch(false); }} className={`flex flex-col items-center justify-center w-full h-full gap-1 ${isDashboard || pathname === '/login' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
            <LucideIcons.User className="w-5 h-5" />
            <span className="text-[10px] font-medium">{isAuthenticated ? "Account" : "Login"}</span>
          </Link>

        </div>
      </div>
    </>
  );
}