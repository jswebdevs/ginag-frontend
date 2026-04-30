"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Loader2, Package, Search, Truck, X, ArrowUpRight } from "lucide-react";
import Swal from "sweetalert2";

export default function DeliveryManagerPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [trackingNumber, setTrackingNumber] = useState("");
    const [deliveryProvider, setDeliveryProvider] = useState("");
    const [trackingLink, setTrackingLink] = useState("");

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/orders/all?limit=100`);
            // the delivery manager probably only needs to see "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"
            const relevantStatuses = ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];
            const allOrders = res.data.data || [];
            setOrders(allOrders.filter((o: any) => relevantStatuses.includes(o.status)));
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const filteredOrders = orders.filter(o =>
        o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
        o.customerName?.toLowerCase().includes(search.toLowerCase())
    );

    const openModal = (order: any) => {
        setSelectedOrder(order);
        setTrackingNumber(order.trackingNumber || "");
        setDeliveryProvider(order.deliveryProvider || "");
        setTrackingLink(order.trackingLink || "");
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    const handleProcessCourier = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.patch(`/orders/${selectedOrder.id}/delivery`, {
                trackingNumber,
                deliveryProvider,
                trackingLink
            });
            Swal.fire({
                icon: "success",
                title: "Tracking Updated",
                text: "The order status has been updated to SHIPPED.",
                timer: 2000,
                showConfirmButton: false
            });
            closeModal();
            fetchOrders();
        } catch (error: any) {
            Swal.fire({
                icon: "error",
                title: "Failed to Update",
                text: error.response?.data?.message || "There was an error updating the order.",
            });
        }
    };

    return (
        <div className="p-4 md:p-6 max-w-[1600px] mx-auto animate-in fade-in duration-500 pb-24">

            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">Delivery Management</h1>
                    <p className="text-sm text-muted-foreground">Process orders into couriers and track shipping.</p>
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
                </div>
            </div>

            <div className="bg-card border border-border rounded-3xl shadow-theme-sm overflow-hidden min-h-[50vh]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                        <p className="text-muted-foreground font-medium">Loading deliveries...</p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64">
                        <Truck className="w-12 h-12 text-muted-foreground/30 mb-4" />
                        <p className="text-muted-foreground font-bold">No orders need delivery processing right now.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left whitespace-nowrap">
                            <thead className="bg-muted/30 border-b border-border">
                                <tr>
                                    <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Order ID</th>
                                    <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Customer</th>
                                    <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                                    <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Courier Info</th>
                                    <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredOrders.map(order => (
                                    <tr key={order.id} className="hover:bg-muted/10 transition-colors">
                                        <td className="p-4 font-bold text-foreground text-sm">{order.orderNumber}</td>
                                        <td className="p-4">
                                            <p className="font-semibold text-foreground text-sm">{order.customerName}</p>
                                            <p className="text-xs text-muted-foreground font-medium mt-0.5">{order.customerPhone}</p>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border 
                                                ${order.status === 'SHIPPED' ? 'bg-purple-500/10 text-purple-600 border-purple-500/20' : ''}
                                                ${order.status === 'PROCESSING' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' : ''}
                                                ${order.status === 'CONFIRMED' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' : ''}
                                                ${order.status === 'DELIVERED' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : ''}
                                            `}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-muted-foreground">
                                            {order.trackingNumber ? (
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-foreground">{order.deliveryProvider}</span>
                                                    <span className="text-xs">{order.trackingNumber}</span>
                                                </div>
                                            ) : (
                                                <span className="italic opacity-50">Not Shipped</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => openModal(order)}
                                                className="inline-flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary hover:text-white px-4 py-2 rounded-xl transition-all font-bold text-xs shadow-sm"
                                            >
                                                <Truck size={14} />
                                                Courier Process
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Courier Processing Modal */}
            {isModalOpen && selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-card w-full max-w-md rounded-3xl border border-border overflow-hidden shadow-theme-2xl animate-in zoom-in-95 duration-200 relative">
                        <button
                            onClick={closeModal}
                            className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors bg-muted/50 p-2 rounded-full cursor-pointer z-10"
                        >
                            <X size={20} />
                        </button>
                        
                        <div className="p-6 md:p-8">
                            <h2 className="text-2xl font-black text-foreground mb-1">Process Courier</h2>
                            <p className="text-sm text-muted-foreground mb-6">Attach tracking info for {selectedOrder.orderNumber}</p>

                            <form onSubmit={handleProcessCourier} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">Delivery Provider</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="e.g. RedX, Pathao, Steadfast"
                                        className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                        value={deliveryProvider}
                                        onChange={e => setDeliveryProvider(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">Tracking Number</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="e.g. RDX12345678"
                                        className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                        value={trackingNumber}
                                        onChange={e => setTrackingNumber(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">Tracking URL Link (Optional)</label>
                                    <input 
                                        type="url" 
                                        placeholder="https://tracker.com/xyz123"
                                        className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                        value={trackingLink}
                                        onChange={e => setTrackingLink(e.target.value)}
                                    />
                                </div>
                                
                                <button type="submit" className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl px-6 py-3.5 font-bold hover:shadow-theme-md transition-all mt-4">
                                    <ArrowUpRight size={18} />
                                    Confirm & Ship Order
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
