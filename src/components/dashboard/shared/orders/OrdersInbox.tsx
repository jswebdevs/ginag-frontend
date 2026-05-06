"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import {
  ClipboardList,
  Loader2,
  Search,
  Phone,
  Mail,
  MapPin,
  Truck,
  Sparkles,
  ChevronDown,
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

const STATUSES: OrderStatus[] = ["PENDING", "CONTACTED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

export default function OrdersInbox() {
  const [orders, setOrders] = useState<CustomOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/custom-orders", {
        params: {
          limit: 100,
          ...(statusFilter !== "ALL" ? { status: statusFilter } : {}),
          ...(search ? { search } : {}),
        },
      });
      setOrders(res.data?.data || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  useEffect(() => {
    const t = setTimeout(fetchOrders, 300);
    return () => clearTimeout(t);
  }, [search]);

  const updateStatus = async (id: string, status: OrderStatus) => {
    try {
      await api.patch(`/custom-orders/${id}`, { status });
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
      toast.success(`Marked ${status.toLowerCase()}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const counts = useMemo(() => {
    const m: Record<string, number> = { ALL: orders.length };
    for (const s of STATUSES) m[s] = orders.filter((o) => o.status === s).length;
    return m;
  }, [orders]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-heading uppercase tracking-tight flex items-center gap-3">
            <ClipboardList className="w-7 h-7 text-primary" />
            Custom Orders
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Submissions from the customer order form. Update status as you work each one.
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, phone, order #…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-card border border-border outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        {(["ALL", ...STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border transition-all ${
              statusFilter === s
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:border-primary/40"
            }`}
          >
            {s.replace("_", " ")} <span className="opacity-60">({counts[s] ?? 0})</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-card border border-border rounded-3xl p-16 text-center text-muted-foreground">
          No orders yet.
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
                    <div className="text-base font-bold text-foreground truncate">{o.customerName}</div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
                      <span className="inline-flex items-center gap-1.5">
                        <Phone className="w-3 h-3" /> {o.customerPhone}
                      </span>
                      {o.customerEmail && (
                        <span className="inline-flex items-center gap-1.5">
                          <Mail className="w-3 h-3" /> {o.customerEmail}
                        </span>
                      )}
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
                    {new Date(o.createdAt).toLocaleString()}
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`}
                  />
                </button>

                {expanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-border bg-muted/10 space-y-4">
                    <div>
                      <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                        Charm Color & Style
                      </div>
                      <p className="text-sm text-foreground whitespace-pre-wrap">{o.charmColorAndStyle}</p>
                    </div>

                    {o.deliveryMethod === "MAILING" && o.mailingAddress && (
                      <div>
                        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                          Mailing Address
                        </div>
                        <p className="text-sm text-foreground whitespace-pre-wrap">{o.mailingAddress}</p>
                      </div>
                    )}

                    {o.notes && (
                      <div>
                        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                          Notes
                        </div>
                        <p className="text-sm text-foreground whitespace-pre-wrap">{o.notes}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 pt-2">
                      {STATUSES.map((s) => (
                        <button
                          key={s}
                          onClick={() => updateStatus(o.id, s)}
                          disabled={s === o.status}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                            s === o.status
                              ? `${STATUS_STYLE[s]}`
                              : "bg-card border-border text-muted-foreground hover:border-primary hover:text-primary"
                          }`}
                        >
                          {s.replace("_", " ")}
                        </button>
                      ))}
                    </div>
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
