"use client";

import { usePathname } from "next/navigation";
import { Hammer, Settings } from "lucide-react";

interface MaintenanceGuardProps {
    isMaintenanceMode: boolean;
    message: string;
    children: React.ReactNode;
}

export default function MaintenanceGuard({ isMaintenanceMode, message, children }: MaintenanceGuardProps) {
    const pathname = usePathname();

    // 1. ALWAYS allow access to the login page and the admin dashboards
    const isSafeRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/login");

    // 2. If maintenance is ON, and they are NOT on a safe route, show the lock screen
    if (isMaintenanceMode && !isSafeRoute) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">

                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                    <div className="w-24 h-24 bg-card border border-border rounded-3xl shadow-theme-2xl flex items-center justify-center relative z-10">
                        <Hammer className="w-10 h-10 text-primary animate-pulse" />
                    </div>
                    <Settings className="w-8 h-8 text-muted-foreground absolute -bottom-2 -right-2 animate-[spin_4s_linear_infinite]" />
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter mb-4">
                    We'll be right back.
                </h1>

                <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
                    {message || "We are currently performing scheduled maintenance to upgrade your shopping experience. Please check back in a few minutes!"}
                </p>

            </div>
        );
    }

    // 3. Otherwise, render the website normally!
    return <>{children}</>;
}