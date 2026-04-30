"use client";

import { useEffect, useState } from "react";
import { Loader2, ShoppingCart, AlertCircle } from "lucide-react";
import api from "@/lib/axios";
import Swal from "sweetalert2";

export default function AdminCartAnalytics() {
    const [carts, setCarts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllCarts();
    }, []);

    const fetchAllCarts = async () => {
        try {
            const res = await api.get('/cart/all');
            setCarts(res.data.data || []);
        } catch (error) {
            console.error("Failed to fetch carts", error);
        } finally {
            setLoading(false);
        }
    };

    const handleExportReport = () => {
        if (carts.length === 0) {
            return Swal.fire("No Data", "There is no cart data to export.", "info");
        }

        // Filter carts that haven't been touched in 2 hours (Likely Abandoned)
        const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
        const abandonedCarts = carts.filter(c => new Date(c.updatedAt) < twoHoursAgo && c.items.length > 0);

        if (abandonedCarts.length === 0) {
            return Swal.fire("No Abandoned Carts", "No carts meet the criteria for abandonment (inactive for 2+ hours).", "info");
        }

        // Generate CSV content
        const headers = ["Identifier", "Type", "Items Count", "Last Activity", "Items List"];
        const rows = abandonedCarts.map(c => [
            c.userId || c.sessionId,
            c.userId ? "Registered" : "Guest",
            c.items.length,
            new Date(c.updatedAt).toLocaleString(),
            c.items.map((i: any) => `${i.variation?.product?.name} (x${i.quantity})`).join(" | ")
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(r => r.map(cell => `"${cell}"`).join(","))
        ].join("\n");

        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `abandoned_carts_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        Swal.fire({
            icon: 'success',
            title: 'Report Exported',
            text: `${abandonedCarts.length} abandoned carts have been exported to CSV.`,
            timer: 2000,
            showConfirmButton: false,
            background: 'hsl(var(--card))',
            color: 'hsl(var(--foreground))',
        });
    };

    if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    const totalActiveCarts = carts.filter(c => c.items.length > 0).length;
    const guestCarts = carts.filter(c => !c.userId).length;

    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-black text-foreground">Cart Abandonment</h1>
                    <p className="text-sm text-muted-foreground mt-1">Monitor active and abandoned shopping carts in real-time.</p>
                </div>
                <button
                    onClick={handleExportReport}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-theme-sm active:scale-95"
                >
                    <AlertCircle className="w-4 h-4" />
                    Export Abandoned Carts
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-card border border-border p-6 rounded-3xl">
                    <div className="flex items-center gap-3 text-primary mb-2">
                        <ShoppingCart className="w-5 h-5" />
                        <h3 className="font-bold">Total Carts w/ Items</h3>
                    </div>
                    <p className="text-3xl font-black">{totalActiveCarts}</p>
                </div>
                <div className="bg-card border border-border p-6 rounded-3xl">
                    <div className="flex items-center gap-3 text-amber-500 mb-2">
                        <AlertCircle className="w-5 h-5" />
                        <h3 className="font-bold">Guest Carts (Unregistered)</h3>
                    </div>
                    <p className="text-3xl font-black">{guestCarts}</p>
                </div>
            </div>

            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-theme-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-muted/50 border-b border-border">
                            <tr>
                                <th className="px-6 py-4 font-bold text-muted-foreground">Identifier</th>
                                <th className="px-6 py-4 font-bold text-muted-foreground">Type</th>
                                <th className="px-6 py-4 font-bold text-muted-foreground">Items in Cart</th>
                                <th className="px-6 py-4 font-bold text-muted-foreground">Last Activity</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {carts.filter(c => c.items.length > 0).map((c: any) => (
                                <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-4 font-medium font-mono text-xs">
                                        {c.userId ? c.userId.substring(0, 8) : c.sessionId?.substring(0, 8)}...
                                    </td>
                                    <td className="px-6 py-4">
                                        {c.userId
                                            ? <span className="bg-blue-500/10 text-blue-500 px-2 py-1 rounded-md font-bold text-xs">Registered</span>
                                            : <span className="bg-amber-500/10 text-amber-500 px-2 py-1 rounded-md font-bold text-xs">Guest</span>
                                        }
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-bold">{c.items.length}</span> items
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">
                                        {new Date(c.updatedAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                            {totalActiveCarts === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                                        No active carts found right now.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}