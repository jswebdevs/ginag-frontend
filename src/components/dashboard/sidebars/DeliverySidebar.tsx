"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard, Truck,
    Power, Menu, X, ChevronLeft, ChevronRight, UserCircle
} from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

export default function DeliverySidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useUserStore();

    const [isOpen, setIsOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: "Confirm Logout?",
            text: "Are you sure you want to end your session?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#64748b",
            confirmButtonText: "Yes, logout",
            customClass: {
                popup: 'bg-card border border-border rounded-2xl shadow-theme-lg',
                title: 'text-foreground font-bold tracking-tight',
                htmlContainer: 'text-muted-foreground text-sm'
            },
            background: 'transparent',
        });

        if (result.isConfirmed) {
            Cookies.remove("auth_token");
            Cookies.remove("user_role");
            logout();
            router.push("/login");
        }
    };

    const menuItems = [
        { name: "Deliveries", href: "/dashboard/delivery-manager", icon: Truck }
    ];

    return (
        <>
            {/* MOBILE TOP BAR */}
            <div className="md:hidden fixed top-16 left-0 right-0 z-30 bg-card border-b border-border h-14 px-4 flex justify-between items-center shadow-sm">
                <button onClick={() => setIsOpen(true)} className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                    <Menu className="w-6 h-6" />
                    <span className="font-bold text-sm">Delivery Panel</span>
                </button>
                <button onClick={handleLogout} className="text-red-600 hover:text-red-700 transition-colors">
                    <Power className="w-5 h-5" />
                </button>
            </div>

            {/* MOBILE OVERLAY */}
            {isOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] md:hidden transition-opacity" onClick={() => setIsOpen(false)} />}

            {/* THE SIDEBAR */}
            <aside
                className={`fixed inset-y-0 left-0 bg-card border-r border-border flex flex-col transition-all duration-300 ease-in-out 
        md:sticky md:top-20 md:h-[calc(100vh-5rem)]
        ${isOpen ? "translate-x-0 z-50" : "-translate-x-full z-30"} md:translate-x-0 md:z-30
        ${isCollapsed ? "md:w-20" : "md:w-64"} w-64`}
            >

                {/* DESKTOP TOGGLE */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden md:flex absolute -right-3.5 top-8 w-7 h-7 bg-background border border-border rounded-full items-center justify-center text-muted-foreground hover:text-primary z-50 transition-colors shadow-sm"
                >
                    {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>

                {/* PROFILE SECTION */}
                <div className={`py-6 border-b border-border flex items-center transition-all duration-300 ${isCollapsed ? "md:px-0 md:justify-center" : "px-6 justify-between"}`}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex-shrink-0 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-sm overflow-hidden">
                            {user?.avatar ? (
                                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <UserCircle className="w-6 h-6" />
                            )}
                        </div>
                        {!isCollapsed && (
                            <div className="flex flex-col whitespace-nowrap overflow-hidden">
                                <span className="text-sm font-bold text-foreground">
                                    {user?.firstName || "Manager"}
                                </span>
                                <span className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter">Delivery Access</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* NAVIGATION */}
                <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto custom-scrollbar">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || pathname === `${item.href}/`;

                        return (
                            <Link
                                key={item.name} href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`group flex items-center rounded-lg font-medium transition-all duration-200 ${isActive ? "bg-primary text-primary-foreground shadow-md shadow-primary/25" : "text-muted-foreground hover:bg-muted hover:text-primary"
                                    } ${isCollapsed ? "md:justify-center px-0 py-3" : "px-3 py-2.5 gap-3"}`}
                            >
                                <Icon className="w-5 h-5 flex-shrink-0" />
                                {!isCollapsed && <span className="text-sm">{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* BOTTOM FOOTER */}
                <div className="p-4 border-t border-border">
                    <button
                        onClick={handleLogout}
                        className={`flex items-center justify-center rounded-xl font-bold text-red-500 hover:bg-red-500/10 transition-all ${isCollapsed ? "py-3 w-full" : "gap-3 px-3 py-3 w-full"}`}
                    >
                        <Power className="w-5 h-5" />
                        {!isCollapsed && <span className="text-sm">Sign Out</span>}
                    </button>
                </div>
            </aside>
        </>
    );
}
