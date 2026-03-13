"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import OrderForms from "@/components/dashboard/shared/orders/OrderForms";

export default function CreateOrderPage() {
  return (
    <div className="p-4 md:p-6 max-w-400 mx-auto animate-in fade-in duration-500 pb-24">
      <div className="flex items-center gap-4 mb-8 border border-border p-4 rounded-2xl shadow-sm bg-card">
        <Link href="/dashboard/super-admin/orders" className="p-2 hidden md:flex bg-card border border-border rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground" title="Back to Orders">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex flex-col items-center w-full md:items-start">
          <h1 className="text-2xl font-black text-foreground tracking-tight">Create Manual Order</h1>
          <p className="text-sm text-muted-foreground mt-1 text-center md:text-left">Input walk-in or external orders to sync inventory.</p>
        </div>
      </div>

      {/* Load the form in Create Mode (no initialData) */}
      <OrderForms />
    </div>
  );
}