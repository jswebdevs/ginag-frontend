"use client";

import { useEffect, useState } from "react";
import { Loader2, Sparkles, TrendingUp, Search } from "lucide-react";
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
            // NOTE: Ensure you create an admin backend route for this!
            const res = await api.get('/wishlist/all');
            setWishlists(res.data.data || []);
        } catch (error) {
            console.error("Failed to fetch wishlists", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAIAnalysis = () => {
        if (wishlists.length === 0) return;

        // Flatten the data to extract the most commonly wished-for items
        const allItems = wishlists.flatMap(w => w.items.map((i: any) => i.variation.product.name));

        const prompt = `Act as an e-commerce data analyst. Here is a raw array of items currently sitting in user wishlists across our platform: ${JSON.stringify(allItems)}. Identify the top 3 trends and suggest marketing strategies to convert these wishlists into sales.`;

        navigator.clipboard.writeText(prompt);
        Swal.fire({
            icon: 'success',
            title: 'Data Packaged!',
            text: 'The wishlist analytics payload has been copied to your clipboard. Open your Admin Chatbox to DreamBot and paste it to generate the report.',
            confirmButtonText: 'Understood'
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
                    onClick={handleAIAnalysis}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors shadow-theme-sm"
                >
                    <Sparkles className="w-4 h-4" />
                    Generate AI Trend Report
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
                {/* You can add more metric cards here based on the data */}
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