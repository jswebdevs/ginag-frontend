"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
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

interface ChartPoint {
  date: string;
  totalOrders: number;
  completedOrders: number;
}

const KPI = ({
  label,
  value,
  Icon,
  tone = "primary",
}: {
  label: string;
  value: number | string;
  Icon: any;
  tone?: "primary" | "amber" | "emerald" | "violet";
}) => {
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

export default function SuperadminDashboardPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [chart, setChart] = useState<ChartPoint[]>([]);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [ov, ch] = await Promise.all([
          api.get("/analytics/overview"),
          api.get(`/analytics/chart-data?days=${days}`),
        ]);
        setOverview(ov.data?.data || null);
        setChart(ch.data?.data || []);
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [days]);

  if (loading && !overview) {
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
          <h1 className="text-2xl sm:text-3xl font-black text-foreground uppercase tracking-tight">Super Admin</h1>
          <p className="text-muted-foreground mt-1">Overview of catalog and custom-order activity.</p>
        </div>
        <Link
          href="/dashboard/super-admin/orders"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold text-sm hover:scale-105 transition-transform"
        >
          <ClipboardList className="w-4 h-4" /> View Orders
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI label="Total Orders" value={overview?.totalOrders ?? 0} Icon={ClipboardList} tone="primary" />
        <KPI label="Pending" value={overview?.pendingOrders ?? 0} Icon={ClipboardList} tone="amber" />
        <KPI label="In Progress" value={overview?.inProgressOrders ?? 0} Icon={ClipboardList} tone="violet" />
        <KPI label="Completed" value={overview?.completedOrders ?? 0} Icon={ClipboardList} tone="emerald" />
        <KPI label="Customers" value={overview?.totalCustomers ?? 0} Icon={Users} tone="primary" />
        <KPI label="Products" value={overview?.totalProducts ?? 0} Icon={Package} tone="primary" />
        <KPI label="Categories" value={overview?.totalCategories ?? 0} Icon={FolderTree} tone="primary" />
      </div>

      <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h3 className="text-xl font-black text-foreground">Order activity</h3>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="bg-background border border-border text-foreground font-semibold text-sm rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-primary"
          >
            <option value={7}>Last 7 Days</option>
            <option value={30}>Last 30 Days</option>
            <option value={90}>Last 90 Days</option>
          </select>
        </div>

        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="orderGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-muted-foreground/20" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} dy={10} fontSize={11} stroke="currentColor" className="text-muted-foreground" minTickGap={30} />
              <YAxis axisLine={false} tickLine={false} fontSize={11} stroke="currentColor" className="text-muted-foreground" allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  color: "hsl(var(--foreground))",
                  borderRadius: "12px",
                  fontWeight: "bold",
                }}
              />
              <Area type="monotone" dataKey="totalOrders" stroke="hsl(var(--primary))" strokeWidth={3} fill="url(#orderGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
