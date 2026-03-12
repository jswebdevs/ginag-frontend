"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2, ShoppingCart, Image as ImageIcon, Heart } from "lucide-react";
import api from "@/lib/axios";
import { useCartStore } from "@/store/useCartStore";
import Swal from "sweetalert2";

export default function WishlistPage() {
    const [wishlistItems, setWishlistItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState<string | null>(null);

    const addToCart = useCartStore((state) => state.addToCart);

    // Fetch Wishlist Items
    const fetchWishlist = async () => {
        try {
            const response = await api.get("/wishlist");
            // Extract the nested items array from your API response
            const items = response.data.data?.items || [];
            setWishlistItems(items);
        } catch (error) {
            console.error("Error fetching wishlist:", error);
            Swal.fire({
                toast: true,
                position: "bottom-end",
                icon: "error",
                title: "Failed to load wishlist",
                showConfirmButton: false,
                timer: 3000,
                background: "hsl(var(--card))",
                color: "hsl(var(--foreground))",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    // Handle Remove from Wishlist
    const handleRemove = async (variationId: string) => {
        try {
            // Optimistic UI update
            setWishlistItems((prev) => prev.filter((item) => item.variationId !== variationId));

            await api.delete(`/wishlist/${variationId}`);

            Swal.fire({
                toast: true,
                position: "bottom-end",
                icon: "success",
                title: "Removed from wishlist",
                showConfirmButton: false,
                timer: 2000,
                background: "hsl(var(--card))",
                color: "hsl(var(--foreground))",
            });
        } catch (error) {
            // Revert if failed
            fetchWishlist();
            Swal.fire({
                toast: true,
                position: "bottom-end",
                icon: "error",
                title: "Failed to remove item",
                showConfirmButton: false,
                timer: 3000,
                background: "hsl(var(--card))",
                color: "hsl(var(--foreground))",
            });
        }
    };

    // Handle Move to Cart (Add to cart, then remove from wishlist)
    const handleAddToCart = async (variationId: string) => {
        setAddingToCart(variationId);
        try {
            // 1. Add the item to the cart first
            await addToCart(variationId, 1);

            // 2. If successful, remove it from the wishlist in the backend
            await api.delete(`/wishlist/${variationId}`);

            // 3. Instantly remove it from the screen
            setWishlistItems((prev) => prev.filter((item) => item.variationId !== variationId));

            Swal.fire({
                toast: true,
                position: "bottom-end",
                icon: "success",
                title: "Moved to cart!",
                showConfirmButton: false,
                timer: 2000,
                background: "hsl(var(--card))",
                color: "hsl(var(--foreground))",
            });
        } catch (error: any) {
            Swal.fire({
                title: "Error",
                text: error.response?.data?.message || "Failed to move item to cart.",
                icon: "error",
                confirmButtonColor: "var(--primary)",
                background: "hsl(var(--card))",
                color: "hsl(var(--foreground))",
                customClass: {
                    popup: "border border-border rounded-2xl shadow-theme-lg",
                    htmlContainer: "text-muted-foreground",
                },
            });
        } finally {
            setAddingToCart(null);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col space-y-4 animate-in fade-in duration-500">
                <div className="h-10 w-48 bg-muted rounded-lg animate-pulse mb-4"></div>
                <div className="w-full h-64 bg-card border border-border rounded-2xl animate-pulse"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">My Wishlist</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved for later
                    </p>
                </div>
            </div>

            {/* Empty State */}
            {wishlistItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 bg-card rounded-2xl border border-border shadow-sm px-4 text-center">
                    <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-4">
                        <Heart className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Your wishlist is empty</h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                        Save items you love to your wishlist and easily add them to your cart later.
                    </p>
                    <Link
                        href="/shop"
                        className="mt-6 inline-flex items-center justify-center px-6 py-3 text-sm font-bold rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                    >
                        Explore Products
                    </Link>
                </div>
            ) : (
                /* Data Table */
                <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-muted/50 border-b border-border text-sm text-muted-foreground">
                                    <th className="px-6 py-4 font-semibold">Product</th>
                                    <th className="px-6 py-4 font-semibold">Price</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {wishlistItems.map((item) => {
                                    const variation = item.variation;
                                    const product = variation?.product;

                                    // Handle potential nested structures based on Prisma include depth
                                    const productName = product?.name || "Unknown Product";
                                    const productSlug = product?.slug || "#";
                                    const variationName = variation?.name || "Default Variation";

                                    // Safely parse price
                                    const currentPrice = Number(variation?.salePrice || variation?.basePrice || 0);
                                    const originalPrice = variation?.salePrice ? Number(variation?.basePrice) : null;

                                    // If featuredImage isn't directly joined, fallback gracefully
                                    const imageUrl = product?.featuredImage?.thumbUrl || product?.featuredImage?.originalUrl;

                                    return (
                                        <tr key={item.id} className="hover:bg-muted/30 transition-colors group">

                                            {/* Product Info Column */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <Link href={`/products/${productSlug}`} className="shrink-0 h-16 w-16 rounded-xl border border-border bg-muted flex items-center justify-center overflow-hidden">
                                                        {imageUrl ? (
                                                            <img src={imageUrl} alt={productName} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                                        ) : (
                                                            <ImageIcon className="w-6 h-6 text-muted-foreground/30" />
                                                        )}
                                                    </Link>
                                                    <div className="min-w-0">
                                                        <Link href={`/products/${productSlug}`} className="font-bold text-foreground hover:text-primary transition-colors line-clamp-1">
                                                            {productName}
                                                        </Link>
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            Variant: <span className="font-medium text-foreground/80">{variationName}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Price Column */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-foreground">৳{currentPrice.toLocaleString()}</span>
                                                    {originalPrice && (
                                                        <span className="text-xs text-muted-foreground line-through">
                                                            ৳{originalPrice.toLocaleString()}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Actions Column */}
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex items-center justify-end gap-2">

                                                    {/* Add to Cart Button */}
                                                    <button
                                                        onClick={() => handleAddToCart(item.variationId)}
                                                        disabled={addingToCart === item.variationId}
                                                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed"
                                                    >
                                                        <ShoppingCart className="w-4 h-4" />
                                                        <span className="hidden sm:inline">
                                                            {addingToCart === item.variationId ? "Adding..." : "Add to Cart"}
                                                        </span>
                                                    </button>

                                                    {/* Remove Button */}
                                                    <button
                                                        onClick={() => handleRemove(item.variationId)}
                                                        className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                                                        title="Remove from Wishlist"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>

                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}