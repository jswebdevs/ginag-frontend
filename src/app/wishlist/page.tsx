"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2, ShoppingCart, Loader2, HeartCrack } from "lucide-react";
import api from "@/lib/axios";
import Swal from "sweetalert2";
import { useUserStore } from "@/store/useUserStore";
import { useCurrency } from "@/context/SettingsContext";


export default function WishlistPage() {
    const { symbol } = useCurrency();
    const { isAuthenticated } = useUserStore();

    const [wishlist, setWishlist] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [removing, setRemoving] = useState<string | null>(null);

    useEffect(() => {
        if (isAuthenticated) fetchWishlist();
        else setLoading(false);
    }, [isAuthenticated]);

    const fetchWishlist = async () => {
        try {
            const res = await api.get('/wishlist'); // Assuming your router is mounted at /api/v1/wishlist
            setWishlist(res.data.data);
        } catch (error) {
            console.error("Failed to fetch wishlist", error);
        } finally {
            setLoading(false);
        }
    };

    const removeFromWishlist = async (variationId: string) => {
        setRemoving(variationId);
        try {
            await api.delete(`/wishlist/${variationId}`);
            setWishlist((prev: any) => ({
                ...prev,
                items: prev.items.filter((item: any) => item.variationId !== variationId)
            }));
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Removed from wishlist', showConfirmButton: false, timer: 1500 });
        } catch (error) {
            Swal.fire("Error", "Failed to remove item", "error");
        } finally {
            setRemoving(null);
        }
    };



    if (!isAuthenticated) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <HeartCrack className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <h2 className="text-2xl font-black tracking-tight mb-2">Please Log In</h2>
                <p className="text-muted-foreground mb-6">You need to be logged in to view your wishlist.</p>
                <Link href="/login?returnUrl=/wishlist" className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold">
                    Log In
                </Link>
            </div>
        );
    }

    if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground">My Wishlist</h1>
                    <p className="text-muted-foreground mt-1">
                        {wishlist?.items?.length || 0} {wishlist?.items?.length === 1 ? 'item' : 'items'} saved
                    </p>
                </div>

                {/* Wishlist item list... */}

            </div>

            {!wishlist || wishlist.items.length === 0 ? (
                <div className="bg-card border border-border rounded-3xl p-12 text-center flex flex-col items-center">
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                        <HeartCrack className="w-10 h-10 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Your wishlist is empty</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">Looks like you haven't added anything to your wishlist yet. Start exploring our products!</p>
                    <Link href="/products" className="bg-foreground text-background px-8 py-3 rounded-xl font-bold hover:bg-foreground/90 transition-colors">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {wishlist.items.map((item: any) => {
                        const product = item.variation.product;
                        const variation = item.variation;
                        const price = variation.salePrice || variation.basePrice;

                        return (
                            <div key={item.id} className="bg-card border border-border rounded-3xl overflow-hidden hover:shadow-theme-md transition-shadow group relative flex flex-col">
                                <div className="aspect-square bg-muted relative">
                                    {/* Fallback image if featuredImageId is null */}
                                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground font-bold uppercase text-xs">
                                        {product.name.substring(0, 2)} Image
                                    </div>

                                    <button
                                        onClick={() => removeFromWishlist(item.variationId)}
                                        disabled={removing === item.variationId}
                                        className="absolute top-3 right-3 w-10 h-10 bg-background/80 backdrop-blur border border-border rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors z-10 disabled:opacity-50"
                                    >
                                        {removing === item.variationId ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                                    </button>
                                </div>

                                <div className="p-5 flex flex-col flex-1">
                                    <Link href={`/products/${product.slug}`} className="font-bold text-foreground line-clamp-2 hover:text-primary transition-colors">
                                        {product.name}
                                    </Link>
                                    <p className="text-xs text-muted-foreground mt-1 mb-3 bg-muted w-fit px-2 py-0.5 rounded-md border border-border/50">
                                        Variant: {variation.name || 'Default'}
                                    </p>

                                    <div className="mt-auto pt-4 flex items-center justify-between">
                                        <span className="font-black text-lg text-primary">{symbol}{price}</span>

                                        <button className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                                            <ShoppingCart className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}