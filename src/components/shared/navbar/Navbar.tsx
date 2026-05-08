"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useThemeStore } from "@/store/themeStore";
import { useUserStore } from "@/store/useUserStore";
import { useEffect, useState, useRef } from "react";
import MobileCategoryDrawer from "./MobileCategoryDrawer";
import api from "@/lib/axios";


// 🔥 Import Chat Components for Mobile Overlay
import ChatLogin from "@/components/shared/chatbox/ChatLogin";
import CustomerChatBox from "@/components/shared/chatbox/CustomerChatBox";
// 🔥 Clean, specific imports for static UI elements
import {
  LuMenu,
  LuUser,
  LuSearch,
  LuLogOut,
  LuX,
  LuHouse,
  LuMessageSquare,
  LuClipboardList,
} from "react-icons/lu";

interface NavbarProps {
  initialSettings?: any;
}

export default function Navbar({ initialSettings }: NavbarProps) {
  const router = useRouter();

  const pathname = usePathname();
  const { user, isAuthenticated } = useUserStore();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // 🔥 Mobile Chat State
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [chatToken, setChatToken] = useState<string | null>(null);

  // --- DYNAMIC SETTINGS STATE ---
  const [storeName, setStoreName] = useState(initialSettings?.storeName || "");
  const [storeTagline, setStoreTagline] = useState(initialSettings?.tagline || "");
  const [storeLogo, setStoreLogo] = useState<string | null>(
    initialSettings?.logo?.thumbUrl || 
    initialSettings?.logo?.originalUrl || 
    null
  );
  const [loadingSettings, setLoadingSettings] = useState(!initialSettings);

  // States for Real-Time Search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isDashboard = pathname.includes('/dashboard');

  useEffect(() => {
    if (!initialSettings) {
      const fetchSettings = async () => {
        try {
          const res = await api.get('/settings');
          if (res.data?.data) {
            setStoreName(res.data.data.storeName);
            setStoreTagline(res.data.data.tagline || "");
            setStoreLogo(
              res.data.data.logo?.thumbUrl ||
              res.data.data.logo?.originalUrl ||
              null
            );
          }
        } catch (error) {
          console.error("Failed to load navbar settings", error);
        } finally {
          setLoadingSettings(false);
        }
      };
      fetchSettings();
    }
  }, [initialSettings]);

  // Check Chat Token when Mobile Chat Opens
  useEffect(() => {
    if (isMobileChatOpen) {
      const storedToken = localStorage.getItem("token") ||
        document.cookie.split('; ').find(row => row.startsWith('auth_token='))?.split('=')[1] ||
        document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      if (storedToken) setChatToken(storedToken);
    }
  }, [isMobileChatOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
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

    const ROLE_HIERARCHY = ['SUPER_ADMIN', 'ADMIN', 'CUSTOMER'];

    let primaryRole = 'CUSTOMER';
    for (const rank of ROLE_HIERARCHY) {
      if (rolesArray.includes(rank)) {
        primaryRole = rank;
        break;
      }
    }
    if (primaryRole === 'CUSTOMER') return '/dashboard/customer';
    return `/dashboard/${primaryRole.toLowerCase().replace('_', '-')}`;
  };

  const dashboardLink = getDashboardLink();

  const handleMobileSearchToggle = () => {
    setShowMobileSearch(!showMobileSearch);
    setIsMobileChatOpen(false);
    if (!showMobileSearch) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => searchInputRef.current?.focus(), 300);
    }
  };

  const handleMobileChatToggle = () => {
    setIsMobileChatOpen(!isMobileChatOpen);
    setShowMobileSearch(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-40 w-full bg-gradient-theme border-b border-border shadow-theme-sm">
        <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between gap-4">

          <div className="flex items-center gap-3">
            <button onClick={() => setIsDrawerOpen(true)} className="md:hidden p-1 -ml-1 text-foreground hover:text-primary transition-colors" aria-label="Open menu" title="Menu">
              <LuMenu className="w-6 h-6" />
            </button>

            <Link href="/" className="relative flex items-center gap-2">
              {loadingSettings && !storeName && !storeLogo ? (
                <div className="h-8 md:h-10 w-32 bg-muted/40 rounded-lg animate-pulse" />
              ) : storeLogo ? (
                <img
                  src={storeLogo}
                  alt={`${storeName} Logo`}
                  className="h-8 md:h-10 w-auto max-w-40 object-contain"
                />
              ) : (
                <div className="flex items-center gap-2 text-primary">
                  <div className="flex flex-col">
                    <span className="font-black text-xl tracking-tight leading-none">{storeName}</span>
                    {storeTagline && <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">{storeTagline}</span>}
                  </div>
                </div>
              )}
            </Link>
          </div>

          {/* Desktop Search Bar */}
          <div ref={searchRef} className="hidden md:flex flex-1 max-w-xl relative mx-4">
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="relative">
                <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search products, categories, tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.length > 2 && setShowResults(true)}
                  className="w-full pl-9 pr-10 py-2.5 border border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(""); setShowResults(false); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <LuX className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>

            {/* Dropdown Results */}
            {showResults && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-card border border-border rounded-xl shadow-theme-lg z-50 overflow-hidden max-h-96 overflow-y-auto">
                {isSearching ? (
                  <div className="flex items-center justify-center gap-2 py-6 text-muted-foreground">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm">Searching...</span>
                  </div>
                ) : searchResults.length > 0 ? (
                  <>
                    {/* Products */}
                    {searchResults.filter(r => r.type === 'product' || r.priceMin !== undefined).length > 0 && (
                      <div>
                        <div className="px-4 py-2 bg-muted/50 border-b border-border">
                          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Products</span>
                        </div>
                        {searchResults.filter(r => r.type === 'product' || r.priceMin !== undefined).map((item, idx) => {
                          const imgSrc = item.featuredImage?.thumbUrl || item.featuredImage?.originalUrl;
                          const min = item.priceMin != null ? Number(item.priceMin) : null;
                          const max = item.priceMax != null ? Number(item.priceMax) : null;
                          return (
                            <Link
                              key={item.id || idx}
                              href={`/products/${item.slug || item.id}`}
                              onClick={() => { setShowResults(false); setSearchQuery(""); }}
                              className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors border-b border-border/50 last:border-0"
                            >
                              <div className="w-10 h-10 rounded-lg bg-muted border border-border flex items-center justify-center overflow-hidden flex-shrink-0">
                                {imgSrc ? (
                                  <img src={imgSrc} alt={item.name} className="w-full h-full object-contain" />
                                ) : (
                                  <LuSearch className="w-4 h-4 text-muted-foreground/50" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-foreground truncate">{item.name}</p>
                                {min != null && (
                                  <p className="text-xs font-bold text-primary">
                                    ${min.toLocaleString()}{max != null && max !== min ? ` – $${max.toLocaleString()}` : ''}
                                  </p>
                                )}
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}

                    {/* Categories */}
                    {searchResults.filter(r => r.type === 'category' && r.priceMin === undefined).length > 0 && (
                      <div>
                        <div className="px-4 py-2 bg-muted/50 border-b border-border">
                          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Categories</span>
                        </div>
                        {searchResults.filter(r => r.type === 'category' && r.priceMin === undefined).map((item, idx) => (
                          <Link
                            key={item.id || idx}
                            href={`/categories/${item.slug || item.id}`}
                            onClick={() => { setShowResults(false); setSearchQuery(""); }}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors border-b border-border/50 last:border-0"
                          >
                            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                              <LuSearch className="w-4 h-4 text-primary/70" />
                            </div>
                            <p className="text-sm font-semibold text-foreground">{item.name}</p>
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* View all results */}
                    <button
                      onClick={() => {
                        setShowResults(false);
                        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                      }}
                      className="w-full px-4 py-3 text-sm font-bold text-primary hover:bg-primary/5 transition-colors border-t border-border text-center"
                    >
                      View all results for "{searchQuery}"
                    </button>
                  </>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-sm text-muted-foreground">No results found for "{searchQuery}"</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            <Link
              href="/order-now"
              className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-bold text-sm tracking-tight shadow-theme-sm hover:shadow-theme-md hover:scale-105 transition-all"
            >
              <LuClipboardList className="w-4 h-4" />
              Order Now
            </Link>

            <Link href={dashboardLink} className="hidden md:flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors ml-2">
              <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center border border-border hover:border-primary transition-colors">
                <LuUser className="w-5 h-5" />
              </div>
            </Link>
          </div>
        </div>

        {/* Mobile Search */}
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
                <LuSearch className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}
      </nav>

      <MobileCategoryDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      {/* Mobile Chat Overlay */}
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
                  <LuLogOut size={16} />
                </button>
              )}
              <button onClick={() => setIsMobileChatOpen(false)} className="p-1.5 hover:bg-black/10 rounded-lg transition-colors">
                <LuX size={20} />
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
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-60 bg-gradient-theme border-t border-border pb-safe shadow-theme-md">
        <div className="flex justify-around items-center h-16 px-2">

          <Link href="/order-now" className={`flex flex-col items-center justify-center w-full h-full gap-1 ${pathname === '/order-now' && !isMobileChatOpen && !showMobileSearch ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
            <LuClipboardList className="w-5 h-5" />
            <span className="text-10px font-medium">Order</span>
          </Link>

          <Link href="/" onClick={() => { setIsMobileChatOpen(false); setShowMobileSearch(false); }} className={`flex flex-col items-center justify-center w-full h-full gap-1 ${pathname === '/' && !isMobileChatOpen && !showMobileSearch ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
            <LuHouse className="w-5 h-5" />
            <span className="text-10px font-medium">Home</span>
          </Link>

          <button onClick={handleMobileSearchToggle} className="flex flex-col items-center justify-center w-full h-full gap-1 -mt-4 relative z-10">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-theme-sm border-4 border-background transition-colors ${showMobileSearch ? 'bg-muted text-primary' : 'bg-primary text-primary-foreground'}`}>
              <LuSearch className="w-6 h-6" />
            </div>
            <span className={`text-10px font-medium mt-0.5 ${showMobileSearch ? 'text-primary' : 'text-muted-foreground'}`}>Search</span>
          </button>

          <button onClick={handleMobileChatToggle} className={`flex flex-col items-center justify-center w-full h-full gap-1 ${isMobileChatOpen ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
            <LuMessageSquare className="w-5 h-5" />
            <span className="text-10px font-medium">Chat</span>
          </button>

          <Link href={dashboardLink} onClick={() => { setIsMobileChatOpen(false); setShowMobileSearch(false); }} className={`flex flex-col items-center justify-center w-full h-full gap-1 ${isDashboard || pathname === '/login' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
            <LuUser className="w-5 h-5" />
            <span className="text-10px font-medium">{isAuthenticated ? "Account" : "Login"}</span>
          </Link>

        </div>
      </div>
    </>
  );
}