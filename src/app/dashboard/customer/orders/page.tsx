"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import {
  ClipboardList,
  Loader2,
  Phone,
  MapPin,
  Truck,
  Sparkles,
  ChevronDown,
  ArrowRight,
} from "lucide-react";

type OrderStatus = "PENDING" | "CONTACTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

interface CustomOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  charmColorAndStyle: string;
  addInitial: boolean;
  initial: string | null;
  deliveryMethod: "PICKUP" | "MAILING";
  mailingAddress: string | null;
  notes: string | null;
  status: OrderStatus;
  createdAt: string;
}

const STATUS_STYLE: Record<OrderStatus, string> = {
  PENDING: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  CONTACTED: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  IN_PROGRESS: "bg-violet-500/10 text-violet-600 border-violet-500/20",
  COMPLETED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  CANCELLED: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<CustomOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/custom-orders/mine");
        setOrders(res.data?.data || []);
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-heading uppercase tracking-tight flex items-center gap-3">
            <ClipboardList className="w-7 h-7 text-primary" />
            My Orders
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Custom orders you've submitted (matched by your email).
          </p>
        </div>
        <Link
          href="/order-now"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold text-sm hover:scale-105 transition-transform"
        >
          New Order <ArrowRight className="w-4 h-4" />
        </Link>
      </header>

      {orders.length === 0 ? (
        <div className="bg-card border border-dashed border-border rounded-3xl p-16 text-center">
          <ClipboardList className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
          <h3 className="font-bold text-foreground mb-1">No orders yet</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Submit your first custom charm order to see it here.
          </p>
          <Link
            href="/order-now"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:scale-105 transition-transform"
          >
            Place an order
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => {
            const expanded = expandedId === o.id;
            return (
              <div
                key={o.id}
                className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-colors"
              >
                <button
                  onClick={() => setExpandedId(expanded ? null : o.id)}
                  className="w-full text-left p-5 flex flex-wrap items-center gap-4 hover:bg-muted/20 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-sm font-mono font-black text-primary">{o.orderNumber}</span>
                      <span
                        className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${STATUS_STYLE[o.status]}`}
                      >
                        {o.status.replace("_", " ")}
                      </span>
                    </div>
                    <div className="text-sm text-foreground truncate">{o.charmColorAndStyle}</div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
                      <span className="inline-flex items-center gap-1.5">
                        {o.deliveryMethod === "PICKUP" ? (
                          <>
                            <MapPin className="w-3 h-3" /> Pick up
                          </>
                        ) : (
                          <>
                            <Truck className="w-3 h-3" /> Mailing
                          </>
                        )}
                      </span>
                      {o.addInitial && (
                        <span className="inline-flex items-center gap-1.5 text-amber-600">
                          <Sparkles className="w-3 h-3" /> Initial: {o.initial}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`}
                  />
                </button>

                {expanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-border bg-muted/10 space-y-3">
                    <DetailRow label="Phone" value={o.customerPhone} icon={<Phone className="w-3 h-3" />} />
                    {o.deliveryMethod === "MAILING" && o.mailingAddress && (
                      <div>
                        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                          Mailing Address
                        </div>
                        <p className="text-sm text-foreground whitespace-pre-wrap">{o.mailingAddress}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-muted-foreground inline-flex items-center gap-1.5 min-w-[80px]">
        {icon} {label}:
      </span>
      <span className="text-foreground font-medium">{value}</span>
    </div>
  );
}
