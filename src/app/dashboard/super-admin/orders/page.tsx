"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Loader2, Package, Search, Plus, ChevronDown } from "lucide-react";
import OrderTable from "@/components/dashboard/shared/orders/OrderTable";
import Link from "next/link";

const TABS = ["ALL", "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "COMPLETED", "CANCELLED"];

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("ALL");
    const [search, setSearch] = useState("");

    const fetchOrders = async (statusFilter: string) => {
        setLoading(true);
        try {
            const query = statusFilter === "ALL" ? "?limit=100" : `?limit=100&status=${statusFilter}`;
            const res = await api.get(`/orders/all${query}`);
            setOrders(res.data.data || []);
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(activeTab);
    }, [activeTab]);

    const filteredOrders = orders.filter(o =>
        o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
        o.customerName?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-4 md:p-6 max-w-[1600px] mx-auto animate-in fade-in duration-500 pb-24">

            {/* Header Area with Search and Create Button */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                {/* 🔥 Mobile: Centered text | PC: Left aligned */}
                <div className="text-center md:text-left">
                    <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">Order Management</h1>
                    <p className="text-sm text-muted-foreground mt-1">Track, process, and update customer orders.</p>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
                    {/* Search Bar */}
                    <div className="relative w-full md:w-72">
                        <input
                            type="text" placeholder="Search Order # or Name..."
                            value={search} onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary shadow-theme-sm"
                        />
                        <Search className="absolute left-3.5 top-3 text-muted-foreground" size={16} />
                    </div>

                    {/* Table Toolbar / Actions */}
                    {/* 🔥 Mobile: Full width | PC: Auto width */}
                    <Link
                        href="/dashboard/super-admin/orders/create"
                        className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold hover:shadow-theme-md hover:scale-105 transition-all text-sm cursor-pointer w-full md:w-auto shrink-0"
                        title="Create a Manual Order"
                    >
                        <Plus size={18} />
                        Create Order
                    </Link>
                </div>
            </div>

            {/* ======================================================= */}
            {/* 🔥 MOBILE TABS DROPDOWN (Visible only on < md screens)  */}
            {/* ======================================================= */}
            <div className="md:hidden relative w-full mb-6">
                <select
                    value={activeTab}
                    onChange={(e) => setActiveTab(e.target.value)}
                    className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-primary shadow-theme-sm appearance-none cursor-pointer"
                >
                    {TABS.map(tab => (
                        <option key={tab} value={tab}>{tab.replace('_', ' ')}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-4 top-3.5 w-5 h-5 text-muted-foreground pointer-events-none" />
            </div>

            {/* ======================================================= */}
            {/* 💻 PC TABS BUTTONS (Visible only on >= md screens)      */}
            {/* ======================================================= */}
            <div className="hidden md:flex overflow-x-auto custom-scrollbar gap-2 mb-6 pb-2">
                {TABS.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all border ${activeTab === tab
                            ? 'bg-primary text-white border-primary shadow-theme-sm'
                            : 'bg-card text-muted-foreground border-border hover:border-primary/50'
                            }`}
                    >
                        {tab.replace('_', ' ')}
                    </button>
                ))}
            </div>

            {/* Data Container */}
            <div className="bg-card border border-border rounded-3xl shadow-theme-sm overflow-hidden min-h-[50vh]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                        <p className="text-muted-foreground font-medium">Loading orders...</p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64">
                        <Package className="w-12 h-12 text-muted-foreground/30 mb-4" />
                        <p className="text-muted-foreground font-bold">No orders found.</p>
                    </div>
                ) : (
                    <OrderTable orders={filteredOrders} />
                )}
            </div>
        </div>
    );
}