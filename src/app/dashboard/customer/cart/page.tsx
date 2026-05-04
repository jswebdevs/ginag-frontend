"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, ShoppingCart, Image as ImageIcon, Plus, Minus, CreditCard, ArrowRight, ChevronDown } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useCurrency } from "@/context/SettingsContext";


export default function DashboardCartPage() {
    const { symbol } = useCurrency();
    const router = useRouter();


    // Extract global state and actions from Zustand
    const { cart, fetchCart, updateQuantity, removeItem, updateVariation } = useCartStore() as any;

    const [initialLoad, setInitialLoad] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null); // State for custom variation dropdown

    useEffect(() => {
        // Fetch cart on mount and disable initial loader
        fetchCart().finally(() => {
            setInitialLoad(false);
        });
    }, [fetchCart]);

    // Handlers tied to your Zustand store
    const handleUpdateQuantity = async (cartItemId: string, newQuantity: number) => {
        if (newQuantity < 1) return;
        setUpdatingId(cartItemId);
        try {
            await updateQuantity(cartItemId, newQuantity);
        } catch (error) {
            console.error("Failed to update quantity:", error);
        } finally {
            setUpdatingId(null);
        }
    };

    const handleRemoveItem = async (cartItemId: string) => {
        setUpdatingId(cartItemId);
        try {
            await removeItem(cartItemId);
        } catch (error) {
            console.error("Failed to remove item:", error);
        } finally {
            setUpdatingId(null);
        }
    };

    const handleUpdateVariation = async (cartItemId: string, newVariationId: string) => {
        setUpdatingId(cartItemId);
        try {
            if (updateVariation) {
                await updateVariation(cartItemId, newVariationId);
            } else {
                console.warn("updateVariation action is missing in useCartStore");
            }
        } catch (error) {
            console.error("Failed to update variation:", error);
        } finally {
            setUpdatingId(null);
        }
    };

    // Loading Skeleton matching the table layout
    if (initialLoad) {
        return (
            <div className="flex flex-col space-y-4 animate-in fade-in duration-500 max-w-6xl mx-auto px-4 py-8">
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
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Shopping Cart</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {cart?.totalItems || 0} {(cart?.totalItems || 0) === 1 ? "item" : "items"} in your cart
                    </p>
                </div>
            </div>

            {/* Empty State */}
            {!cart || cart.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 bg-card rounded-2xl border border-border shadow-sm px-4 text-center">
                    <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-4">
                        <ShoppingCart className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Your cart is empty</h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                        Looks like you haven't added anything to your cart yet.
                    </p>
                    <Link
                        href="/shop"
                        className="mt-6 inline-flex items-center justify-center px-6 py-3 text-sm font-bold rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-theme-sm hover:-translate-y-0.5"
                    >
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Main Cart Table */}
                    <div className="flex-1 bg-card border border-border rounded-2xl shadow-sm overflow-hidden h-fit">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-muted/50 border-b border-border text-sm text-muted-foreground">
                                        <th className="px-6 py-4 font-semibold">Product</th>
                                        <th className="px-6 py-4 font-semibold text-center">Quantity</th>
                                        <th className="px-6 py-4 font-semibold text-right">Total</th>
                                        <th className="px-6 py-4 font-semibold text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {cart.items.map((item: any) => {
                                        const product = item.variation.product;
                                        const imageUrl = product.featuredImage?.thumbUrl || product.featuredImage?.originalUrl;
                                        const price = Number(item.variation.salePrice || item.variation.basePrice || 0);
                                        const originalPrice = item.variation.salePrice ? Number(item.variation.basePrice) : null;
                                        const subtotal = price * item.quantity;

                                        const isUpdating = updatingId === item.id;
                                        const productVariations = product.variations || [];
                                        const isDropdownOpen = openDropdownId === item.id;

                                        return (
                                            <tr key={item.id} className={`hover:bg-muted/30 transition-colors group ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}>

                                                {/* Product Info Column */}
                                                <td className="px-6 py-4 min-w-[300px]">
                                                    <div className="flex items-center gap-4">
                                                        <Link href={`/products/${product.slug}`} className="shrink-0 h-16 w-16 rounded-xl border border-border bg-muted flex items-center justify-center overflow-hidden relative">
                                                            {imageUrl ? (
                                                                <img src={imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                                            ) : (
                                                                <ImageIcon className="w-6 h-6 text-muted-foreground/30" />
                                                            )}
                                                        </Link>

                                                        <div className="min-w-0 flex flex-col justify-center">
                                                            <Link href={`/products/${product.slug}`} className="font-bold text-foreground hover:text-primary transition-colors line-clamp-1 pb-1">
                                                                {product.name}
                                                            </Link>

                                                            {/* Variation Selector (From your global cart) */}
                                                            {productVariations.length > 1 ? (
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <label className="text-xs font-semibold text-muted-foreground uppercase">Variant:</label>
                                                                    <div className="relative">
                                                                        <button
                                                                            onClick={() => setOpenDropdownId(isDropdownOpen ? null : item.id)}
                                                                            className="flex items-center justify-between gap-2 text-xs bg-background border border-border text-foreground rounded-md px-2 py-1 outline-none hover:border-primary/50 transition-colors w-max min-w-[100px]"
                                                                        >
                                                                            <span className="truncate max-w-[120px] font-medium">{item.variation.name}</span>
                                                                            <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                                                        </button>

                                                                        {isDropdownOpen && (
                                                                            <>
                                                                                <div className="fixed inset-0 z-10" onClick={() => setOpenDropdownId(null)} />
                                                                                <div className="absolute left-0 top-full mt-1 w-max min-w-full bg-card border border-border rounded-lg shadow-lg z-20 overflow-hidden">
                                                                                    <div className="max-h-[150px] overflow-y-auto custom-scrollbar p-1 flex flex-col gap-0.5">
                                                                                        {productVariations.map((v: any) => {
                                                                                            const isSelected = item.variation.id === v.id;
                                                                                            return (
                                                                                                <button
                                                                                                    key={v.id}
                                                                                                    disabled={v.stock < 1}
                                                                                                    onClick={() => {
                                                                                                        if (!isSelected) handleUpdateVariation(item.id, v.id);
                                                                                                        setOpenDropdownId(null);
                                                                                                    }}
                                                                                                    className={`w-full text-left px-2 py-1.5 text-xs rounded-md transition-colors flex justify-between items-center ${isSelected
                                                                                                            ? 'bg-primary/10 text-primary font-bold'
                                                                                                            : v.stock < 1
                                                                                                                ? 'opacity-50 cursor-not-allowed text-muted-foreground'
                                                                                                                : 'hover:bg-muted text-foreground'
                                                                                                        }`}
                                                                                                >
                                                                                                    <span>{v.name}</span>
                                                                                                    {v.stock < 1 && <span className="text-[9px] uppercase ml-2">Out</span>}
                                                                                                </button>
                                                                                            );
                                                                                        })}
                                                                                    </div>
                                                                                </div>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <p className="text-sm text-muted-foreground mt-1">
                                                                    Variant: <span className="font-medium text-foreground/80">{item.variation.name}</span>
                                                                </p>
                                                            )}

                                                            <div className="mt-1 flex items-center gap-2">
                                                                <span className="font-bold text-primary text-sm">{symbol}{price.toLocaleString()}</span>

                                                                {originalPrice && (
                                                                    <span className="text-xs text-muted-foreground line-through">
                                                                        {symbol}{originalPrice.toLocaleString()}

                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Quantity Column */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center justify-center">
                                                        <div className="flex items-center bg-background border border-border rounded-lg overflow-hidden h-9 shadow-sm">
                                                            <button
                                                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                                disabled={item.quantity <= 1}
                                                                className="w-9 h-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-30"
                                                            >
                                                                <Minus className="w-3 h-3" />
                                                            </button>
                                                            <div className="w-10 h-full flex items-center justify-center font-bold text-sm text-foreground bg-transparent border-x border-border">
                                                                {item.quantity}
                                                            </div>
                                                            <button
                                                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                                disabled={item.quantity >= item.variation.stock}
                                                                className="w-9 h-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-30"
                                                            >
                                                                <Plus className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Subtotal Column */}
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <span className="font-black text-foreground text-lg">{symbol}{subtotal.toLocaleString()}</span>

                                                </td>

                                                {/* Actions Column */}
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <button
                                                        onClick={() => handleRemoveItem(item.id)}
                                                        className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20 inline-flex items-center justify-center"
                                                        title="Remove from Cart"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Checkout Summary Panel */}
                    <div className="w-full lg:w-[360px] shrink-0">
                        <div className="bg-card border border-border rounded-2xl shadow-sm p-6 sticky top-24">
                            <h2 className="text-xl font-bold text-foreground mb-6">Order Summary</h2>

                            <div className="space-y-4 text-sm mb-6">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Subtotal ({cart.totalItems} items)</span>
                                    <span className="font-semibold text-foreground">{symbol}{cart.totalAmount.toLocaleString()}</span>

                                </div>
                                <div className="flex justify-between text-muted-foreground pb-4 border-b border-border">
                                    <span>Delivery Fee</span>
                                    <span className="text-xs italic">Calculated at checkout</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-base font-bold text-foreground">Total Amount</span>
                                    <span className="text-2xl font-black text-primary">{symbol}{cart.totalAmount.toLocaleString()}</span>

                                </div>
                            </div>

                            <Link
                                href="/checkout"
                                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 px-4 rounded-xl font-bold text-base hover:opacity-90 transition-all shadow-theme-md hover:-translate-y-0.5 group"
                            >
                                <CreditCard className="w-5 h-5" />
                                Proceed to Checkout
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}