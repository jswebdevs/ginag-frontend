"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, User, Search, Menu, X, Monitor, Smartphone, Watch, Headphones, Moon, Sun, Tag, Zap, Heart, Home, Settings, LayoutGrid } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { useUserStore } from "@/store/useUserStore";
import { useEffect, useState } from "react";

const previewColors: Record<string, string> = {
  sapphire: '#2563eb', emerald: '#16a34a', ruby: '#dc2626', amber: '#d97706',
  amethyst: '#7c3aed', rose: '#db2777', ocean: '#0891b2', slate: '#0f172a'
};

const palettes = ['sapphire', 'emerald', 'ruby', 'amber', 'amethyst', 'rose', 'ocean', 'slate'] as const;

export default function Navbar3() {
  const { theme, setTheme, isDark, toggleDark } = useThemeStore();
  const { user, isAuthenticated } = useUserStore();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  const dashboardLink = isAuthenticated && user?.role 
    ? (user.role.toLowerCase() === 'customer' ? '/dashboard' : `/dashboard/${user.role.toLowerCase().replace('_', '-')}`) 
    : "/login";

  if (!mounted) return null;

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="fixed left-0 top-0 h-screen w-20 lg:w-64 bg-gradient-theme border-r border-border hidden md:flex flex-col z-50 transition-all duration-500">
        <div className="p-6">
          <Link href="/" className="text-xl font-black tracking-tighter text-primary italic">
            D<span className="hidden lg:inline text-foreground">REAM</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {[
            { name: "Home", icon: Home, href: "/" },
            { name: "Shop", icon: LayoutGrid, href: "/shop" },
            { name: "Deals", icon: Zap, href: "/deals" },
            { name: "Wishlist", icon: Heart, href: "/wishlist" },
          ].map((item) => (
            <Link key={item.name} href={item.href} className={`flex items-center gap-4 p-3 rounded-xl transition-all ${pathname === item.href ? 'bg-primary text-primary-foreground shadow-theme-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
              <item.icon className="w-5 h-5" />
              <span className="hidden lg:block font-semibold">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border space-y-4">
           {/* Theme Selection in Sidebar */}
           <div className="hidden lg:grid grid-cols-4 gap-2 mb-4">
              {palettes.map(p => (
                <button key={p} onClick={() => setTheme(p)} className={`w-8 h-8 rounded-full border-2 transition-all ${theme === p ? 'border-primary' : 'border-transparent'}`} style={{ backgroundColor: previewColors[p] }} />
              ))}
           </div>
           
           <button onClick={toggleDark} className="w-full flex items-center gap-4 p-3 text-muted-foreground hover:text-foreground transition-all">
              {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              <span className="hidden lg:block font-medium">Appearance</span>
           </button>

           <Link href={dashboardLink} className="flex items-center gap-4 p-3 bg-muted rounded-xl hover:bg-primary/10 transition-all">
              <User className="w-5 h-5 text-primary" />
              <div className="hidden lg:block overflow-hidden">
                <p className="text-xs font-bold truncate text-foreground">{isAuthenticated ? user?.firstName : "Guest"}</p>
                <p className="text-[10px] text-muted-foreground">View Profile</p>
              </div>
           </Link>
        </div>
      </aside>

      {/* MOBILE TOP BAR */}
      <nav className="md:hidden sticky top-0 z-40 w-full bg-gradient-theme border-b border-border px-4 h-16 flex items-center justify-between shadow-theme-sm">
         <button onClick={() => setIsDrawerOpen(true)} className="p-2 text-foreground"><Menu className="w-6 h-6" /></button>
         <Link href="/" className="text-xl font-black text-primary italic">DREAM</Link>
         <Link href="/cart" className="relative p-2 text-foreground">
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] rounded-full w-4 h-4 flex items-center justify-center">0</span>
         </Link>
      </nav>

      {/* Spacing for content */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (min-width: 768px) { body { padding-left: 5rem; } }
        @media (min-width: 1024px) { body { padding-left: 16rem; } }
        @media (max-width: 767px) { body { padding-bottom: 5rem; } }
      `}} />

      {/* MOBILE BOTTOM NAV */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-gradient-theme border-t border-border flex justify-around items-center h-16 shadow-theme-md">
        <Link href="/" className="flex flex-col items-center gap-1 text-muted-foreground"><Home className="w-5 h-5" /><span className="text-[9px] uppercase font-bold">Home</span></Link>
        <Link href="/shop" className="flex flex-col items-center gap-1 text-muted-foreground"><Search className="w-5 h-5" /><span className="text-[9px] uppercase font-bold">Search</span></Link>
        <Link href="/cart" className="flex flex-col items-center gap-1 -mt-6"><div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-theme-md"><ShoppingCart className="w-6 h-6" /></div></Link>
        <Link href="/wishlist" className="flex flex-col items-center gap-1 text-muted-foreground"><Heart className="w-5 h-5" /><span className="text-[9px] uppercase font-bold">Wishlist</span></Link>
        <Link href={dashboardLink} className="flex flex-col items-center gap-1 text-muted-foreground"><User className="w-5 h-5" /><span className="text-[9px] uppercase font-bold">Account</span></Link>
      </div>
    </>
  );
}