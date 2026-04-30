"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, PackageSearch, 
  Power, Menu, X, ChevronLeft, ChevronRight, ChevronDown, UserCircle,
  User, Award, Layers, Package, Image
} from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

export default function ProductManagerSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useUserStore();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    "Catalog": true // Keep catalog open by default for PMs
  });

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Log Out?",
      text: "Are you sure you want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, log me out",
      background: "hsl(var(--card))",
      color: "hsl(var(--foreground))",
      customClass: {
        popup: 'border border-border rounded-2xl shadow-theme-lg',
        htmlContainer: 'text-muted-foreground'
      }
    });

    if (result.isConfirmed) {
      Cookies.remove("auth_token");
      Cookies.remove("user_role");
      logout();
      router.push("/login");
    }
  };

  const toggleMenu = (menuName: string) => {
    if (isCollapsed) setIsCollapsed(false);
    setOpenMenus((prev) => ({ ...prev, [menuName]: !prev[menuName] }));
  };

  const menuItems = [
    { name: "Dashboard", href: "/dashboard/product-manager", icon: LayoutDashboard },
    {
      name: "Catalog",
      icon: PackageSearch,
      subItems: [
        { name: "Categories", href: "/dashboard/product-manager/categories", icon: Layers },
        { name: "Products", href: "/dashboard/product-manager/products", icon: Package },
        { name: "Media", href: "/dashboard/product-manager/media", icon: Image }
      ]
    },
    {
      name: "Profile",
      icon: User,
      subItems: [
        { name: "My Profile", href: "/dashboard/product-manager/profile"}
      ]
    }
  ];

  return (
    <>
      <div className="md:hidden fixed top-16 left-0 right-0 z-30 bg-card border-b border-border h-14 px-4 flex justify-between items-center shadow-sm">
        <button onClick={() => setIsOpen(true)} className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
          <Menu className="w-6 h-6" />
          <span className="font-bold text-sm">PM Menu</span>
        </button>
        <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors font-bold">
          <span className="text-sm">Logout</span>
          <Power className="w-5 h-5" />
        </button>
      </div>

      {isOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] md:hidden transition-opacity" onClick={() => setIsOpen(false)} />}

      <aside 
        className={`fixed inset-y-0 left-0 bg-card border-r border-border flex flex-col transition-all duration-300 ease-in-out 
        md:sticky md:top-20 md:h-[calc(100vh-5rem)]
        ${isOpen ? "translate-x-0 z-50" : "-translate-x-full z-30"} md:translate-x-0 md:z-30
        ${isCollapsed ? "md:w-20" : "md:w-64"} w-64`}
      >
        
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex absolute -right-3.5 top-8 w-7 h-7 bg-background border border-border rounded-full items-center justify-center text-muted-foreground hover:text-primary z-50 transition-colors shadow-sm"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        <div className={`py-6 border-b border-border flex items-center transition-all duration-300 ${isCollapsed ? "md:px-0 md:justify-center" : "px-6 justify-between"}`}>
          <div className={`flex items-center transition-all duration-300 ${isCollapsed ? "md:gap-0" : "gap-3"}`}>
            <div className="w-10 h-10 flex-shrink-0 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/30 overflow-hidden border-2 border-primary/20 transition-colors">
              {user?.avatar ? (
                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <UserCircle className="w-6 h-6" />
              )}
            </div>
            <div className={`flex flex-col justify-center whitespace-nowrap overflow-hidden transition-all duration-300 h-10 ${isCollapsed ? "md:w-0 md:opacity-0" : "w-auto opacity-100"}`}>
              <span className="text-sm font-bold text-foreground transition-colors truncate max-w-[120px]">
                {user?.firstName || "Product"}
              </span>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">PM Portal</span>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className={`md:hidden p-1 text-muted-foreground hover:text-red-500 transition-colors ${isCollapsed ? "hidden" : "block"}`}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isSubMenuOpen = openMenus[item.name];
            
            if (!item.subItems) {
              const isActive = pathname === item.href || pathname === `${item.href}/`;
              return (
                <Link
                  key={item.name} href={item.href!} title={isCollapsed ? item.name : undefined}
                  onClick={() => setIsOpen(false)}
                  className={`group flex items-center rounded-lg font-medium transition-all duration-200 overflow-hidden mb-1 ${
                    isActive ? "bg-primary text-primary-foreground shadow-md shadow-primary/25" : "text-muted-foreground hover:bg-muted hover:text-primary"
                  } ${isCollapsed ? "md:justify-center md:px-0 md:py-3" : "px-3 py-2.5 gap-3"}`}
                >
                  <Icon className={`w-5 h-5 shrink-0 transition-all duration-300 ${isActive ? "text-primary-foreground" : "text-primary opacity-70 group-hover:opacity-100"}`} />
                  <span className={`whitespace-nowrap transition-all duration-300 ${isCollapsed ? "md:w-0 md:opacity-0" : "w-auto opacity-100"}`}>{item.name}</span>
                </Link>
              );
            }

            const isAnyChildActive = item.subItems.some(sub => pathname === sub.href || pathname === `${sub.href}/`);
            return (
              <div key={item.name} className="mb-1">
                <button
                  onClick={() => toggleMenu(item.name)}
                  title={isCollapsed ? item.name : undefined}
                  className={`w-full group flex items-center rounded-lg font-medium transition-all duration-200 overflow-hidden ${
                    isAnyChildActive ? "text-primary font-bold" : "text-muted-foreground hover:bg-muted"
                  } ${isCollapsed ? "md:justify-center md:px-0 md:py-3" : "px-3 py-2.5 gap-3 justify-between"}`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 shrink-0 transition-all duration-300 ${isAnyChildActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`} />
                    <span className={`whitespace-nowrap transition-all duration-300 ${isCollapsed ? "md:w-0 md:opacity-0" : "w-auto opacity-100"}`}>{item.name}</span>
                  </div>
                  {!isCollapsed && (
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isSubMenuOpen ? "rotate-180 text-primary" : "text-muted-foreground"}`} />
                  )}
                </button>

                {isSubMenuOpen && !isCollapsed && (
                  <div className="mt-1 ml-4 pl-4 border-l-2 border-border space-y-1 animate-in slide-in-from-top-2 fade-in duration-200">
                    {item.subItems.map((sub) => {
                      const isSubActive = pathname === sub.href || pathname === `${sub.href}/`;
                      return (
                        <Link
                          key={sub.name} href={sub.href}
                          onClick={() => setIsOpen(false)}
                          className={`block py-2 px-3 rounded-md text-sm transition-colors ${
                            isSubActive ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-primary hover:bg-muted"
                          }`}
                        >
                          {sub.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <button 
            onClick={handleLogout} title={isCollapsed ? "Power Off" : undefined}
            className={`group flex items-center justify-center rounded-xl font-bold text-red-500 hover:bg-red-500/10 hover:text-red-600 transition-all border border-transparent hover:border-red-500/20 cursor-pointer ${isCollapsed ? "md:w-full md:px-0 md:py-3" : "gap-3 px-3 py-3 w-full"}`}
          >
            <Power className="w-5 h-5 flex-shrink-0 group-hover:animate-pulse" />
            <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? "md:w-0 md:opacity-0" : "w-auto opacity-100"}`}>
              Log Out
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
