"use client";

import Link from "next/link";
import { useUserStore } from "@/store/useUserStore";
import { ClipboardList, Sparkles, ArrowRight } from "lucide-react";

export default function UserDashboardPage() {
  const { user } = useUserStore();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Hello, <span className="text-primary">{user?.firstName || "there"}</span>! 👋
          </h1>
          <p className="text-muted-foreground mt-2">
            Browse the catalog or place a custom order — we'll be in touch shortly.
          </p>
        </div>
        <Link
          href="/order-now"
          className="shrink-0 inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold shadow-md shadow-primary/20 hover:opacity-90 transition-opacity"
        >
          <ClipboardList className="w-4 h-4" /> Order Now
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <Link
          href="/products"
          className="group bg-card border border-border rounded-2xl p-6 shadow-sm flex items-center gap-4 hover:border-primary/40 transition-all"
        >
          <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">Browse</p>
            <h3 className="text-xl font-bold text-foreground">Our Catalog</h3>
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          href="/dashboard/customer/profile"
          className="group bg-card border border-border rounded-2xl p-6 shadow-sm flex items-center gap-4 hover:border-primary/40 transition-all"
        >
          <div className="h-14 w-14 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">Manage</p>
            <h3 className="text-xl font-bold text-foreground">My Profile</h3>
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </Link>
      </div>
    </div>
  );
}
