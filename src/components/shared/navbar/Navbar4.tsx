"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Search, User, Moon, Sun, LayoutGrid } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

export default function Navbar4() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, isDark, toggleDark } = useThemeStore();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 flex justify-center p-4 ${isScrolled ? 'pt-2' : 'pt-6'}`}>
      <div className={`
        flex items-center justify-between w-full max-w-4xl px-6 py-3 rounded-2xl border transition-all duration-500
        ${isScrolled 
          ? 'bg-gradient-theme shadow-theme-lg border-border/50 scale-95 md:scale-100' 
          : 'bg-transparent border-transparent'}
      `}>
        {/* LOGO */}
        <Link href="/" className="text-xl font-bold tracking-tighter text-primary">
          D<span className={isScrolled ? 'text-foreground' : 'text-heading'}>REAM</span>
        </Link>

        {/* NAVIGATION LINKS */}
        <div className="hidden md:flex items-center gap-8">
          {['Shop', 'Categories', 'Deals', 'New'].map((item) => (
            <Link 
              key={item} 
              href={`/${item.toLowerCase()}`} 
              className={`text-sm font-medium transition-colors hover:text-primary ${isScrolled ? 'text-muted-foreground' : 'text-subheading'}`}
            >
              {item}
            </Link>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-4">
          <button className={`hover:text-primary transition-colors ${isScrolled ? 'text-foreground' : 'text-heading'}`}>
            <Search className="w-5 h-5" />
          </button>
          
          <button onClick={toggleDark} className={`hover:text-primary transition-colors ${isScrolled ? 'text-foreground' : 'text-heading'}`}>
            {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          <div className="w-[1px] h-4 bg-border/50" />

          <Link href="/cart" className="relative group">
            <ShoppingCart className={`w-5 h-5 group-hover:text-primary transition-colors ${isScrolled ? 'text-foreground' : 'text-heading'}`} />
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-theme-sm">0</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}