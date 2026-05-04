"use client";

import React from 'react';
import { DollarSign, ShoppingCart, Users, AlertCircle } from 'lucide-react';
import { useCurrency } from '@/context/SettingsContext';


interface KPIData {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  totalCustomers: number;
}

export default function KPICards({ kpis }: { kpis: KPIData }) {
  const { symbol } = useCurrency();
  if (!kpis) return null;


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

      <StatCard
        title="Exact Revenue"
        value={`${symbol}${kpis.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}

        icon={<DollarSign className="w-6 h-6" />}
        colorClass="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      />

      <StatCard
        title="Total Orders"
        value={kpis.totalOrders.toLocaleString()}
        icon={<ShoppingCart className="w-6 h-6" />}
        colorClass="bg-blue-500/10 text-blue-600 dark:text-blue-400"
      />

      <StatCard
        title="Pending Orders"
        value={kpis.pendingOrders.toLocaleString()}
        icon={<AlertCircle className="w-6 h-6" />}
        colorClass="bg-orange-500/10 text-orange-600 dark:text-orange-400"
      />

      <StatCard
        title="Total Customers"
        value={kpis.totalCustomers.toLocaleString()}
        icon={<Users className="w-6 h-6" />}
        colorClass="bg-purple-500/10 text-purple-600 dark:text-purple-400"
      />

    </div>
  );
}

function StatCard({ title, value, icon, colorClass }: { title: string, value: string | number, icon: React.ReactNode, colorClass: string }) {
  return (
    <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-5 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
      <div className={`p-3.5 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
        {icon}
      </div>
      <div className="truncate">
        <p className="text-sm text-muted-foreground font-semibold mb-1 truncate">{title}</p>
        <h4 className="text-2xl font-black text-foreground tracking-tight truncate">{value}</h4>
      </div>
    </div>
  );
}