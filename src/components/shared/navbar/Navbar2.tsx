"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, User, Search, Menu, X, Monitor, Smartphone, Watch, Headphones, Moon, Sun, ChevronDown, Tag, Zap, Heart, Home } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { useUserStore } from "@/store/useUserStore";
import { useEffect, useState, useRef } from "react";

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

const categories = [
  { name: "Desktop", icon: Monitor, href: "/category/desktop" },
  { name: "Laptop", icon: Monitor, href: "/category/laptop" },
  { name: "Mobile", icon: Smartphone, href: "/category/mobile" },
  { name: "Smart Watch", icon: Watch, href: "/category/smart-watch" },
  { name: "Accessories", icon: Headphones, href: "/category/accessories" },
];

export default function Navbar2() {
  const { theme, setTheme, isDark, toggleDark } = useThemeStore();
  const { user, isAuthenticated } = useUserStore();
  const pathname = usePathname();
  
  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  // FIX: Safely extract role to bypass TS error
  const getDashboardLink = () => {
    const userRole = (user as any)?.role || (user as any)?.roles?.[0] || (user as any)?.roles;
    if (!isAuthenticated || !userRole) return "/login";
    
    const rolePath = String(userRole).toLowerCase().replace('_', '-');
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
    if (!mounted) return <div className="w-10 h-10 bg-muted animate-pulse rounded-full" />;
    return (
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-muted transition-all"
        >
          <div 
            className="w-4 h-4 rounded-full border border-white/40 shadow-sm" 
            style={{ backgroundColor: previewColors[theme] }} 
          />
        </button>
        {isDropdownOpen && (
          <div className="absolute right-0 mt-3 w-52 py-3 bg-popover border border-border rounded-2xl shadow-theme-lg z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-4 pb-2 mb-2 border-b border-border flex justify-between items-center">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Select Gem</span>
              <button onClick={toggleDark} className="p-1.5 text-muted-foreground hover:text-primary hover:bg-muted rounded-full transition-colors">
                {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3 px-4">
              {palettes.map((p) => (
                <button
                  key={p}
                  onClick={() => { setTheme(p); setIsDropdownOpen(false); }}
                  className={`flex justify-center items-center w-8 h-8 rounded-full border-2 transition-all ${theme === p ? 'border-primary scale-110' : 'border-transparent hover:scale-110'}`}
                >
                  <div className="w-5 h-5 rounded-full" style={{ backgroundColor: previewColors[p] }} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Desktop Floating Pill Navbar */}
      <div className="fixed top-0 left-0 right-0 z-40 p-5 pointer-events-none md:flex justify-center hidden">
        <nav 
          key={theme} // Force re-render on theme change
          className="pointer-events-auto bg-gradient-theme border border-border shadow-theme-lg rounded-full px-8 py-3 flex items-center gap-10 w-full max-w-5xl transition-all duration-500"
        >
          <Link href="/" className="text-xl font-black tracking-tighter text-primary shrink-0">
            DREAM<span className="text-foreground">SHOP</span>
          </Link>

          {!pathname.includes('/dashboard') ? (
            <div className="flex-1 flex justify-center gap-8">
              {categories.slice(0, 4).map((cat) => (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
              <Link href="/categories" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
                Explore
              </Link>
            </div>
          ) : (
            <div className="flex-1" />
          )}

          <div className="flex items-center gap-3 shrink-0">
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-primary transition-all">
              <Search className="w-5 h-5" />
            </button>
            <ThemeSwitcherUI />
            <Link href={dashboardLink} className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-primary transition-all">
              <User className="w-5 h-5" />
            </Link>
            <Link href="/cart" className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-primary transition-all relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute top-1 right-1 bg-primary text-primary-foreground text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold border-2 border-background">0</span>
            </Link>
          </div>
        </nav>
      </div>

      {/* Mobile Sticky Navbar */}
      <nav className="md:hidden sticky top-0 z-40 w-full bg-gradient-theme border-b border-border shadow-theme-sm transition-all duration-500">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsDrawerOpen(true)} className="p-1 -ml-1 text-foreground hover:text-primary">
              <Menu className="w-6 h-6" />
            </button>
            <Link href="/" className="text-xl font-bold tracking-tighter text-primary">
              DREAM<span className="text-foreground">SHOP</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <ThemeSwitcherUI />
            <Link href="/cart" className="relative p-2 hover:text-primary">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">0</span>
            </Link>
          </div>
        </div>

        {/* Mobile Search Input (Moved inside nav) */}
        {showMobileSearch && (
          <div className="px-4 pb-4 animate-in slide-in-from-top duration-300">
            <div className="relative">
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Search premium products..." 
                className="w-full border border-border rounded-xl py-2.5 px-4 outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              />
              <Search className="absolute right-3 top-3 text-muted-foreground w-4 h-4" />
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden" onClick={() => setIsDrawerOpen(false)} />
      )}
      
      <div className={`fixed top-0 left-0 h-full w-80 bg-gradient-theme z-50 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col shadow-theme-lg border-r border-border ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between p-5 border-b border-border">
          <span className="font-black text-xl text-primary tracking-tighter italic">DREAM MENU</span>
          <button onClick={() => setIsDrawerOpen(false)} className="p-2 text-muted-foreground hover:text-destructive transition-colors bg-muted rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              onClick={() => setIsDrawerOpen(false)}
              className="group flex items-center gap-4 px-6 py-4 border-b border-border/30 text-foreground hover:bg-primary/5 transition-all"
            >
              <div className="p-2 bg-muted rounded-lg group-hover:bg-primary/10 transition-colors">
                <cat.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="font-semibold tracking-tight">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 767px) {
          body { padding-bottom: 5rem; }
        }
        @media (min-width: 768px) {
          body { padding-top: 6.5rem; }
        }
      `}} />

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-gradient-theme border-t border-border pb-safe shadow-theme-md transition-all duration-500">
        <div className="flex justify-around items-center h-16 px-4">
          <Link href="/offers" className={`flex flex-col items-center gap-1 ${pathname === '/offers' ? 'text-primary' : 'text-muted-foreground'}`}>
            <Tag className="w-5 h-5" />
            <span className="text-[9px] font-bold uppercase">Offers</span>
          </Link>
          <Link href="/deals" className={`flex flex-col items-center gap-1 ${pathname === '/deals' ? 'text-primary' : 'text-muted-foreground'}`}>
            <Zap className="w-5 h-5" />
            <span className="text-[9px] font-bold uppercase">Deals</span>
          </Link>
          <Link href="/" className="flex flex-col items-center gap-1 -mt-5">
            <div className="w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-theme-md border-4 border-background">
              <Home className="w-7 h-7" />
            </div>
          </Link>
          <button onClick={handleMobileSearchToggle} className={`flex flex-col items-center gap-1 ${showMobileSearch ? 'text-primary' : 'text-muted-foreground'}`}>
            <Search className="w-5 h-5" />
            <span className="text-[9px] font-bold uppercase">Search</span>
          </button>
          <Link href={dashboardLink} className={`flex flex-col items-center gap-1 ${pathname.includes('/dashboard') ? 'text-primary' : 'text-muted-foreground'}`}>
            <User className="w-5 h-5" />
            <span className="text-[9px] font-bold uppercase">Profile</span>
          </Link>
        </div>
      </div>
    </>
  );
}