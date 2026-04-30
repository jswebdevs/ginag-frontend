"use client";

import { useEffect, useState } from "react";
import { Loader2, TrendingUp, Search } from "lucide-react";
import api from "@/lib/axios";
import Swal from "sweetalert2";

export default function AdminWishlistAnalytics() {
    const [wishlists, setWishlists] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllWishlists();
    }, []);

    const fetchAllWishlists = async () => {
        try {
            const res = await api.get('/wishlist/all');
            setWishlists(res.data.data || []);
        } catch (error) {
            console.error("Failed to fetch wishlists", error);
        } finally {
            setLoading(false);
        }
    };

    const handleExportReport = () => {
        if (wishlists.length === 0) {
            return Swal.fire("No Data", "There is no wishlist data to export.", "info");
        }

        const headers = ["User ID", "Total Items", "Items List"];
        const rows = wishlists.map(w => [
            w.userId,
            w.items.length,
            w.items.map((i: any) => i.variation?.product?.name).join(" | ")
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(r => r.map(cell => `"${cell}"`).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `wishlist_trends_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        Swal.fire({
            icon: 'success',
            title: 'Report Generated',
            text: 'Your wishlist trend report has been downloaded as a CSV file.',
            timer: 2000,
            showConfirmButton: false,
            background: 'hsl(var(--card))',
            color: 'hsl(var(--foreground))',
        });
    };

    if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-black text-foreground">Wishlist Analytics</h1>
                    <p className="text-sm text-muted-foreground mt-1">Monitor what your customers want to buy.</p>
                </div>
                <button
                    onClick={handleExportReport}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-theme-sm active:scale-95"
                >
                    <TrendingUp className="w-4 h-4" />
                    Export Trend Report
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-card border border-border p-6 rounded-3xl">
                    <div className="flex items-center gap-3 text-primary mb-2">
                        <TrendingUp className="w-5 h-5" />
                        <h3 className="font-bold">Total Wishlists</h3>
                    </div>
                    <p className="text-3xl font-black">{wishlists.length}</p>
                </div>
            </div>

            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-theme-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-muted/50 border-b border-border">
                            <tr>
                                <th className="px-6 py-4 font-bold text-muted-foreground">User ID</th>
                                <th className="px-6 py-4 font-bold text-muted-foreground">Total Items Saved</th>
                                <th className="px-6 py-4 font-bold text-muted-foreground">Latest Item Added</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {wishlists.map((w: any) => (
                                <tr key={w.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-4 font-medium">{w.userId.substring(0, 8)}...</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-primary/10 text-primary px-2 py-1 rounded-md font-bold">
                                            {w.items.length} items
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground truncate max-w-[200px]">
                                        {w.items[0]?.variation?.product?.name || 'N/A'}
                                    </td>
                                </tr>
                            ))}
                            {wishlists.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">
                                        No wishlist data found.
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