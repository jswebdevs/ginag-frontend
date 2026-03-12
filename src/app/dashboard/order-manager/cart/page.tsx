"use client";

import { useEffect, useState } from "react";
import { Loader2, Sparkles, ShoppingCart, AlertCircle } from "lucide-react";
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

    const handleAIAnalysis = () => {
        if (carts.length === 0) return;

        // Filter carts that haven't been touched in 2 hours (Likely Abandoned)
        const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
        const abandonedCarts = carts.filter(c => new Date(c.updatedAt) < twoHoursAgo && c.items.length > 0);

        const abandonedItems = abandonedCarts.flatMap(c => c.items.map((i: any) => ({
            product: i.variation.product.name,
            quantity: i.quantity,
            price: i.variation.basePrice
        })));

        const prompt = `Act as an e-commerce conversion expert. We have ${abandonedCarts.length} abandoned carts. Here is the raw JSON array of the items left behind: ${JSON.stringify(abandonedItems)}. What are the most commonly abandoned items, and what email marketing or discount strategies should we use to recover these specific sales?`;

        navigator.clipboard.writeText(prompt);
        Swal.fire({
            icon: 'success',
            title: 'Data Packaged!',
            text: 'Cart abandonment data copied! Open your Admin Chatbox and paste this to DreamBot for strategies.',
            confirmButtonText: 'Understood'
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
                    onClick={handleAIAnalysis}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors shadow-theme-sm"
                >
                    <Sparkles className="w-4 h-4" />
                    AI Recovery Strategy
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