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
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/admin/orders" className="p-2 bg-card border border-border rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tight flex items-center gap-3">
            Order {order.orderNumber}
            <span className="bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-md uppercase tracking-widest">{order.status}</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Placed on {new Date(order.createdAt).toLocaleString()}</p>
        </div>
      </div>

      {/* Passing the fetched data and the refresh function down to the form */}
      <OrderForms initialData={order} onUpdateSuccess={fetchOrder} />
    </div>
  );
}