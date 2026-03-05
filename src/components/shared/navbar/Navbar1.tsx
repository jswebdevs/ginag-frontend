"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, User, Search, Menu, X, Monitor, Smartphone, Watch, Headphones, Moon, Sun, ChevronDown, Tag, Zap, Heart, Phone, Home } from "lucide-react";
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

export default function Navbar1() {
  const { theme, setTheme, isDark, toggleDark } = useThemeStore();
  const { user, isAuthenticated } = useUserStore();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const ThemeSwitcherUI = () => {
    if (!mounted) return <div className="w-20 h-8 md:w-24 bg-muted animate-pulse rounded-full" />;
    return (
      <div className="flex items-center gap-1 md:gap-2 p-1 border border-border rounded-full bg-background/50 backdrop-blur-sm transition-colors">
        <button onClick={toggleDark} className="p-1 md:p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors">
          {isDark ? <Moon className="w-3.5 h-3.5 md:w-4 md:h-4" /> : <Sun className="w-3.5 h-3.5 md:w-4 md:h-4" />}
        </button>
        <div className="h-4 w-[1px] bg-border" />
        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-1 md:gap-2 p-1 md:p-1.5 pl-2 pr-1 text-sm font-medium rounded-full hover:bg-muted transition-colors">
            <div className="w-3 h-3 md:w-4 md:h-4 rounded-full border border-border" style={{ backgroundColor: previewColors[theme] || previewColors.sapphire }} />
            <ChevronDown className="w-3 h-3 opacity-50" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 py-2 bg-popover border border-border rounded-xl shadow-theme-lg z-50">
              <div className="grid grid-cols-4 gap-2 px-3">
                {palettes.map((p) => (
                  <button
                    key={p}
                    onClick={() => { setTheme(p); setIsDropdownOpen(false); }}
                    title={p.charAt(0).toUpperCase() + p.slice(1)}
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
      {/* Top Banner (Desktop Only) */}
      <div className="hidden md:flex bg-muted/50 border-b border-border text-xs py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-muted-foreground">
          <p>Welcome to Dream Shop - Premium E-commerce</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> +880 1700 000000</span>
            <Link href="/track" className="hover:text-primary transition-colors">Track Order</Link>
            <Link href="/help" className="hover:text-primary transition-colors">Help Center</Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="sticky top-0 z-40 w-full bg-gradient-theme border-b border-border shadow-theme-sm">
        <div className="container mx-auto px-4 py-3 md:py-4 flex flex-col md:flex-row items-center gap-3 md:gap-8">
          
          {/* Top Row on Mobile / Left Column on Desktop */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center gap-2 md:gap-3">
              <button onClick={() => setIsDrawerOpen(true)} className="md:hidden p-1 -ml-1 text-foreground hover:text-primary transition-colors">
                <Menu className="w-6 h-6" />
              </button>
              <Link href="/" className="text-xl md:text-2xl font-black tracking-tighter text-primary">
                DREAM<span className="text-foreground">SHOP</span>
              </Link>
            </div>
            
            {/* Right Icons (Mobile Only) */}
            <div className="flex items-center gap-2 md:hidden">
              <ThemeSwitcherUI />
              <Link href="/cart" className="relative p-2 hover:text-primary transition-colors">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">0</span>
              </Link>
            </div>
          </div>

          {/* Search Bar - Full Width on Mobile, Flexible on Desktop */}
          <div className="flex-1 w-full max-w-2xl relative order-last md:order-none">
            <input
              type="text" placeholder="Search products, brands..."
              className="w-full border-2 border-primary/20 hover:border-primary/50 rounded-xl py-2.5 px-4 md:py-3 md:px-5 outline-none focus:border-primary bg-background/80 backdrop-blur-sm transition-all text-sm md:text-base text-foreground"
            />
            <button className="absolute right-1.5 top-1.5 md:right-2 md:top-2 bg-primary text-primary-foreground p-1.5 md:p-2 rounded-lg hover:opacity-90 transition-opacity">
              <Search className="w-4 h-4 md:w-4 md:h-4" />
            </button>
          </div>

          {/* Right Icons (Desktop Only) */}
          <div className="hidden md:flex items-center gap-6 shrink-0">
            <ThemeSwitcherUI />
            <Link href={dashboardLink} className="flex flex-col items-center gap-1 hover:text-primary transition-colors">
              <User className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">{isAuthenticated ? "Account" : "Sign In"}</span>
            </Link>
            <Link href="/cart" className="relative flex flex-col items-center gap-1 hover:text-primary transition-colors">
              <ShoppingCart className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Cart</span>
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">0</span>
            </Link>
          </div>
        </div>

        {/* Desktop Category Ribbon */}
        {!pathname.includes('/dashboard') && (
          <div className="hidden md:flex items-center h-12 border-t border-border bg-background/30">
            <div className="container mx-auto px-4 flex gap-8">
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className="group flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors py-3 border-b-2 border-transparent hover:border-primary"
                >
                  <cat.icon className="w-4 h-4 text-primary opacity-80 group-hover:opacity-100 transition-all duration-300" />
                  <span>{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Drawer Overlay & Panel */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 md:hidden" onClick={() => setIsDrawerOpen(false)} />
      )}
      
      <div className={`fixed top-0 left-0 h-full w-72 bg-gradient-theme z-50 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col shadow-theme-lg border-r border-border ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between p-4 border-b border-border bg-transparent">
          <span className="font-bold text-lg text-primary">Categories</span>
          <button onClick={() => setIsDrawerOpen(false)} className="p-1 text-muted-foreground hover:text-destructive transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              onClick={() => setIsDrawerOpen(false)}
              className="group flex items-center gap-4 px-6 py-4 border-b border-border/50 text-foreground hover:bg-muted/50 transition-colors"
            >
              <cat.icon className="w-5 h-5 text-primary opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
              <span className="font-medium">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Prevents footer from being hidden behind bottom mobile nav */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 767px) {
          body { padding-bottom: 5rem; }
        }
      `}} />

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-gradient-theme border-t border-border pb-safe shadow-theme-md">
        <div className="flex justify-around items-center h-16 px-2">
          <Link href="/offers" className={`flex flex-col items-center justify-center w-full h-full gap-1 ${pathname === '/offers' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
            <Tag className="w-5 h-5" />
            <span className="text-[10px] font-medium">Offers</span>
          </Link>
          
          <Link href="/deals" className={`flex flex-col items-center justify-center w-full h-full gap-1 ${pathname === '/deals' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
            <Zap className="w-5 h-5" />
            <span className="text-[10px] font-medium">Deals</span>
          </Link>
          
          <Link href="/" className="flex flex-col items-center justify-center w-full h-full gap-1 -mt-4 relative z-10">
            <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-theme-sm">
              <Home className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-medium text-muted-foreground">Home</span>
          </Link>
          
          <Link href="/wishlist" className={`flex flex-col items-center justify-center w-full h-full gap-1 ${pathname === '/wishlist' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
            <Heart className="w-5 h-5" />
            <span className="text-[10px] font-medium">Wishlist</span>
          </Link>
          
          <Link href={dashboardLink} className={`flex flex-col items-center justify-center w-full h-full gap-1 ${pathname.includes('/dashboard') || pathname === '/login' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
            <User className="w-5 h-5" />
            <span className="text-[10px] font-medium">{isAuthenticated ? "Account" : "Login"}</span>
          </Link>
        </div>
      </div>
    </>
  );
}