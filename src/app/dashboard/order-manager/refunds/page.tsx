"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Loader2, RefreshCcw, Search } from "lucide-react";
import OrderTable from "@/components/dashboard/shared/orders/OrderTable";

const TABS = ["ALL REFUNDS", "CANCELLED", "RETURNED", "REFUNDED"];

export default function RefundsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL REFUNDS");
  const [search, setSearch] = useState("");

  const fetchRefundOrders = async (tab: string) => {
    setLoading(true);
    try {
      if (tab === "ALL REFUNDS") {
        // FIXED: Using the correct /orders/all endpoint
        const [returned, refunded, cancelled] = await Promise.all([
          api.get(`/orders/all?limit=50&status=RETURNED`),
          api.get(`/orders/all?limit=50&status=REFUNDED`),
          api.get(`/orders/all?limit=50&status=CANCELLED`)
        ]);

        const combined = [
          ...(returned.data?.data || []),
          ...(refunded.data?.data || []),
          ...(cancelled.data?.data || [])
        ];

        // Sort newest first
        combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrders(combined);
      } else {
        // Fetch specific tab status using the correct endpoint
        const res = await api.get(`/orders/all?limit=100&status=${tab}`);
        setOrders(res.data?.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch refund orders", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefundOrders(activeTab);
  }, [activeTab]);

  // Local Search Filter
  const filteredOrders = orders.filter(o =>
    o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
    o.customerName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 max-w-400 mx-auto animate-in fade-in duration-500 pb-24">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight text-red-500">Refunds & Returns</h1>
          <p className="text-sm text-muted-foreground">Manage order cancellations, returns, and process refunds.</p>
        </div>

        <div className="relative w-full md:w-80">
          <input
            type="text" placeholder="Search Order # or Name..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-red-500 shadow-theme-sm transition-all"
          />
          <Search className="absolute left-3.5 top-3 text-muted-foreground" size={16} />
        </div>
      </div>

      <div className="flex overflow-x-auto custom-scrollbar gap-2 mb-6 pb-2">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all border ${activeTab === tab
                ? 'bg-red-500 text-white border-red-500 shadow-theme-sm'
                : 'bg-card text-muted-foreground border-border hover:border-red-500/50 hover:text-red-500'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-3xl shadow-theme-sm overflow-hidden min-h-[50vh]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-red-500 mb-4" />
            <p className="text-muted-foreground font-medium">Loading records...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <RefreshCcw className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground font-bold">No records found for this status.</p>
          </div>
        ) : (
          <OrderTable orders={filteredOrders} />
        )}
      </div>

    </div>
  );
}