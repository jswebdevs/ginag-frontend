"use client";

import React from 'react';
import { Package, Layers, Store } from 'lucide-react';

interface KPIData {
  totalProducts: number;
  totalCategories: number;
}

export default function KPICards({ kpis }: { kpis: KPIData }) {
  if (!kpis) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">

      <StatCard
        title="Total Products"
        value={kpis.totalProducts.toLocaleString()}
        icon={<Package className="w-6 h-6" />}
        colorClass="bg-primary/10 text-primary"
      />

      <StatCard
        title="Total Categories"
        value={kpis.totalCategories.toLocaleString()}
        icon={<Layers className="w-6 h-6" />}
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