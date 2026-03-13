"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import { ArrowLeft, Loader2 } from "lucide-react";
import OrderForms from "@/components/dashboard/shared/orders/OrderForms";

export default function EditOrderPage() {
  const params = useParams();
  const id = params.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data.data);
    } catch (err) {
      console.error("Failed to load order", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-20">
      <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
      <p className="font-medium text-muted-foreground">Loading order details...</p>
    </div>
  );

  if (!order) return <div className="p-10 text-center font-bold text-destructive">Order not found.</div>;

  return (
    <div className="p-4 md:p-6 max-w-[1600px] mx-auto animate-in fade-in duration-500 pb-24">

      {/* Header Area */}
      {/* 🔥 Mobile: Card Styling | PC: Transparent & No Border */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6 md:mb-8 bg-card md:bg-transparent border border-border md:border-none p-4 md:p-0 rounded-2xl md:rounded-none shadow-sm md:shadow-none">

        {/* Back Button - 🔥 Hidden on mobile */}
        <Link
          href="/dashboard/super-admin/orders"
          className="hidden md:flex p-2 bg-card border border-border rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        {/* Order Info */}
        <div className="flex flex-col gap-1 w-full">
          {/* 🔥 Mobile: Space between Title and Badge | PC: Grouped together */}
          <div className="flex items-center justify-between md:justify-start gap-3 w-full">
            <h1 className="text-xl md:text-2xl font-black text-foreground tracking-tight">
              Order {order.orderNumber}
            </h1>
            <span className="bg-primary/10 text-primary text-[10px] md:text-xs font-bold px-2.5 py-1.5 rounded-md uppercase tracking-widest shrink-0">
              {order.status}
            </span>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground font-medium">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Passing the fetched data and the refresh function down to the form */}
      <OrderForms initialData={order} onUpdateSuccess={fetchOrder} />
    </div>
  );
}