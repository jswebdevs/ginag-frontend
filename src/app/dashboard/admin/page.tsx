"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";
import { ClipboardList, Users, Package, FolderTree, Loader2 } from "lucide-react";

interface Overview {
  totalOrders: number;
  pendingOrders: number;
  inProgressOrders: number;
  completedOrders: number;
  totalCustomers: number;
  totalProducts: number;
  totalCategories: number;
}

const KPI = ({ label, value, Icon, tone = "primary" }: { label: string; value: number | string; Icon: any; tone?: string }) => {
  const tones: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    amber: "bg-amber-500/10 text-amber-600",
    emerald: "bg-emerald-500/10 text-emerald-600",
    violet: "bg-violet-500/10 text-violet-600",
  };
  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tones[tone]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{label}</p>
        <h3 className="text-2xl font-black text-foreground">{value}</h3>
      </div>
    </div>
  );
};

export default function AdminDashboardPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/analytics/overview");
        setOverview(res.data?.data || null);
      } catch (err) {
        console.error("Admin dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground uppercase tracking-tight">Admin</h1>
          <p className="text-muted-foreground mt-1">Catalog and custom-order overview.</p>
        </div>
        <Link
          href="/dashboard/admin/orders"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold text-sm hover:scale-105 transition-transform"
        >
          <ClipboardList className="w-4 h-4" /> View Orders
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI label="Total Orders" value={overview?.totalOrders ?? 0} Icon={ClipboardList} />
        <KPI label="Pending" value={overview?.pendingOrders ?? 0} Icon={ClipboardList} tone="amber" />
        <KPI label="In Progress" value={overview?.inProgressOrders ?? 0} Icon={ClipboardList} tone="violet" />
        <KPI label="Completed" value={overview?.completedOrders ?? 0} Icon={ClipboardList} tone="emerald" />
        <KPI label="Customers" value={overview?.totalCustomers ?? 0} Icon={Users} />
        <KPI label="Products" value={overview?.totalProducts ?? 0} Icon={Package} />
        <KPI label="Categories" value={overview?.totalCategories ?? 0} Icon={FolderTree} />
      </div>
    </div>
  );
}
