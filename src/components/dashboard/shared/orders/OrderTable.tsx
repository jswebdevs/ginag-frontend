"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface OrderTableProps {
  orders: any[];
}

type SortKey = "orderNumber" | "customer" | "total" | "date" | null;

export default function OrderTable({ orders }: OrderTableProps) {
  // Default to newest first
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: "asc" | "desc" } | null>({ key: "date", direction: "desc" });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "CONFIRMED": return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "PROCESSING": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "SHIPPED": return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      case "DELIVERED": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "COMPLETED": return "bg-green-500/10 text-green-600 border-green-500/20";
      case "CANCELLED":
      case "RETURNED":
      case "REFUNDED": return "bg-red-500/10 text-red-600 border-red-500/20";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const getPaymentColor = (status: string) => {
    switch (status) {
      case "PAID": return "bg-emerald-500/10 text-emerald-600";
      case "PARTIAL": return "bg-orange-500/10 text-orange-600";
      case "UNPAID": return "bg-red-500/10 text-red-600";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const handleSort = (key: SortKey) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedOrders = [...orders].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    let aValue: any, bValue: any;

    if (key === "orderNumber") {
      aValue = a.orderNumber; bValue = b.orderNumber;
    } else if (key === "customer") {
      aValue = a.customerName.toLowerCase(); bValue = b.customerName.toLowerCase();
    } else if (key === "total") {
      aValue = Number(a.finalAmount); bValue = Number(b.finalAmount);
    } else if (key === "date") {
      aValue = new Date(a.createdAt).getTime(); bValue = new Date(b.createdAt).getTime();
    }

    if (aValue < bValue) return direction === "asc" ? -1 : 1;
    if (aValue > bValue) return direction === "asc" ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortConfig?.key !== columnKey) return <ArrowUpDown className="w-3 h-3 opacity-30" />;
    return sortConfig.direction === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />;
  };

  return (
    <div className="flex flex-col w-full">

      {/* ======================================================= */}
      {/* MOBILE SORTING DROPDOWN (Visible only on < md screens)  */}
      {/* ======================================================= */}
      <div className="md:hidden mb-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">
          Sort Orders By
        </label>
        <div className="relative">
          <select
            value={`${sortConfig?.key}-${sortConfig?.direction}`}
            onChange={(e) => {
              const [key, direction] = e.target.value.split("-");
              setSortConfig({ key: key as SortKey, direction: direction as "asc" | "desc" });
            }}
            className="w-full appearance-none bg-muted border border-border rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="total-desc">Highest Amount</option>
            <option value="total-asc">Lowest Amount</option>
            <option value="customer-asc">Customer Name (A-Z)</option>
            <option value="orderNumber-asc">Order ID (A-Z)</option>
          </select>
          <ArrowUpDown className="absolute right-4 top-3.5 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* ======================================================= */}
      {/* MOBILE CARD LAYOUT (Visible only on < md screens)       */}
      {/* ======================================================= */}
      <div className="flex flex-col gap-4 md:hidden">
        {sortedOrders.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-8 text-center shadow-sm">
            <p className="text-muted-foreground font-medium italic">No orders match your criteria.</p>
          </div>
        ) : (
          sortedOrders.map((order) => (
            <div key={order.id} className="bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-col gap-4 relative overflow-hidden">

              {/* Header: ID, Date & Action Button */}
              <div className="flex justify-between items-start border-b border-border/50 pb-3">
                <div>
                  <h3 className="font-black text-foreground text-sm leading-tight">{order.orderNumber}</h3>
                  <p className="text-[11px] text-muted-foreground font-semibold mt-1">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <Link
                  href={`/dashboard/super-admin/orders/${order.id}`}
                  className="p-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl transition-colors"
                >
                  <Eye size={18} />
                </Link>
              </div>

              {/* Body: Customer & Pricing */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-foreground text-sm">{order.customerName}</p>
                  <p className="text-xs text-muted-foreground font-medium">{order.customerPhone}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-foreground text-base leading-tight">৳{Number(order.finalAmount).toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase mt-0.5">{String(order.paymentMethod).replace(/_/g, ' ')}</p>
                </div>
              </div>

              {/* Footer: Badges */}
              <div className="flex justify-between items-center bg-muted/30 -mx-4 -mb-4 p-4 mt-2">
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${getPaymentColor(order.paymentStatus)}`}>
                  {order.paymentStatus}
                </span>
                <span className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ======================================================= */}
      {/* DESKTOP TABLE LAYOUT (Hidden on < md screens)           */}
      {/* ======================================================= */}
      <div className="hidden md:block overflow-x-auto bg-card rounded-2xl border border-border shadow-sm">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-muted/30 border-b border-border">
            <tr>
              <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider cursor-pointer select-none hover:bg-muted/50 transition-colors" onClick={() => handleSort("orderNumber")}>
                <div className="flex items-center gap-1.5">Order ID <SortIcon columnKey="orderNumber" /></div>
              </th>
              <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider cursor-pointer select-none hover:bg-muted/50 transition-colors" onClick={() => handleSort("date")}>
                <div className="flex items-center gap-1.5">Date <SortIcon columnKey="date" /></div>
              </th>
              <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider cursor-pointer select-none hover:bg-muted/50 transition-colors" onClick={() => handleSort("customer")}>
                <div className="flex items-center gap-1.5">Customer <SortIcon columnKey="customer" /></div>
              </th>
              <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider cursor-pointer select-none hover:bg-muted/50 text-right transition-colors" onClick={() => handleSort("total")}>
                <div className="flex items-center justify-end gap-1.5">Total <SortIcon columnKey="total" /></div>
              </th>
              <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-center">Payment</th>
              <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-center">Status</th>
              <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-muted-foreground font-medium italic">
                  No orders match your criteria.
                </td>
              </tr>
            ) : (
              sortedOrders.map(order => (
                <tr key={order.id} className="hover:bg-muted/10 transition-colors">
                  <td className="p-4 font-bold text-foreground text-sm">{order.orderNumber}</td>
                  <td className="p-4 text-xs text-muted-foreground font-medium">{new Date(order.createdAt).toLocaleString()}</td>
                  <td className="p-4">
                    <p className="font-semibold text-foreground text-sm">{order.customerName}</p>
                    <p className="text-xs text-muted-foreground font-medium mt-0.5">{order.customerPhone}</p>
                  </td>
                  <td className="p-4 text-right">
                    <p className="font-black text-foreground text-sm">৳{Number(order.finalAmount).toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase mt-0.5">{String(order.paymentMethod).replace(/_/g, ' ')}</p>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider ${getPaymentColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <Link
                      href={`/dashboard/super-admin/orders/${order.id}`}
                      className="inline-flex p-2 bg-background border border-border rounded-lg text-muted-foreground hover:text-primary hover:border-primary transition-colors shadow-sm"
                      title="Manage Order"
                    >
                      <Eye size={16} />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}