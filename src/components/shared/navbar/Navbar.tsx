"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as LucideIcons from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { useUserStore } from "@/store/useUserStore"; 
import { useEffect, useState, useRef } from "react";
import MobileCategoryDrawer from "./MobileCategoryDrawer"; // Adjust path if needed

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
  const { theme, setTheme, isDark, toggleDark } = useThemeStore();
  const { user, isAuthenticated } = useUserStore(); 
  
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); 
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  
  const [cartCount, setCartCount] = useState(0); 
  const [wishlistCount, setWishlistCount] = useState(0);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isDashboard = pathname.includes('/dashboard');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getDashboardLink = () => {
    if (!isAuthenticated || !user?.role) return "/login";
    const rolePath = user.role.toLowerCase().replace('_', '-');
    return rolePath === 'customer' ? '/dashboard' : `/dashboard/${rolePath}`;
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
            <button onClick={() => setIsDrawerOpen(true)} className="md:hidden p-1 -ml-1 text-foreground hover:text-primary transition-colors">
              <LucideIcons.Menu className="w-6 h-6" />
            </button>
            <Link href="/" className="text-xl md:text-2xl font-black tracking-tighter text-primary">
              DREAM<span className="text-foreground">SHOP</span>
            </Link>
          </div>

          <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
            <input 
              type="text" placeholder="Search products..." 
              className="w-full border border-border rounded-full py-2.5 px-5 outline-none focus:ring-2 focus:ring-primary bg-background/50 backdrop-blur-sm transition-all text-foreground"
            />
            <LucideIcons.Search className="absolute right-4 top-3 text-muted-foreground w-5 h-5" />
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
            <div className="relative">
              <input 
                ref={searchInputRef}
                type="text" placeholder="Search products..." 
                className="w-full border border-border rounded-xl py-2 px-4 outline-none focus:ring-2 focus:ring-primary bg-background transition-all text-foreground"
              />
              <LucideIcons.Search className="absolute right-3 top-2.5 text-muted-foreground w-5 h-5" />
            </div>
          </div>
        )}
      </nav>

      {/* NEW: Extracted Mobile Drawer Component */}
      <MobileCategoryDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      <style dangerouslySetInnerHTML={{ __html: `
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