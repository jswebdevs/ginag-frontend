"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag, ImageIcon, Loader2, ChevronDown } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export default function CartPage() {
  // Extract global state and actions from Zustand
  const { cart, fetchCart, updateQuantity, removeItem, updateVariation } = useCartStore() as any;

  const [initialLoad, setInitialLoad] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null); // State for custom dropdown

  useEffect(() => {
    // Fetch cart on mount and then disable initial loading spinner
    fetchCart().finally(() => {
      setInitialLoad(false);
    });
  }, [fetchCart]);

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

  // Show full-page spinner only on the very first load
  if (initialLoad) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  // EMPTY STATE
  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 bg-background">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-primary" />
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-4">Your cart is empty</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          Looks like you haven't added anything to your cart yet. Let's change that!
        </p>
        <Link
          href="/shop"
          className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-10 md:py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl md:text-4xl font-black text-foreground mb-10">Shopping Cart</h1>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

          {/* --- LEFT: Cart Items List --- */}
          <div className="grow space-y-6">
            {cart.items.map((item: any) => {
              const imageUrl = item.variation.product.featuredImage?.originalUrl;
              const price = Number(item.variation.salePrice || item.variation.basePrice);
              const isUpdating = updatingId === item.id;
              const productVariations = item.variation.product.variations || [];
              const isDropdownOpen = openDropdownId === item.id;

              return (
                <div
                  key={item.id}
                  className={`bg-card border border-border rounded-3xl p-4 sm:p-6 flex gap-4 sm:gap-6 shadow-sm transition-opacity ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  {/* Item Image */}
                  <Link href={`/products/${item.variation.product.slug}`} className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-muted rounded-2xl overflow-hidden relative flex items-center justify-center border border-border">
                    {imageUrl ? (
                      <img src={imageUrl} alt={item.variation.product.name} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-muted-foreground/30" />
                    )}
                  </Link>

                  {/* Item Details */}
                  <div className="flex flex-col grow justify-between py-1">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-2 relative">
                        <Link href={`/products/${item.variation.product.slug}`} className="font-bold text-foreground text-lg hover:text-primary transition-colors line-clamp-2 pr-4">
                          {item.variation.product.name}
                        </Link>

                        {/* Custom Variation Selector */}
                        {productVariations.length > 1 ? (
                          <div className="flex items-center gap-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase">Variant:</label>

                            <div className="relative">
                              <button
                                onClick={() => setOpenDropdownId(isDropdownOpen ? null : item.id)}
                                className="flex items-center justify-between gap-2 text-sm bg-background border border-border text-foreground rounded-lg px-3 py-1.5 outline-none hover:border-primary/50 transition-colors w-max min-w-[120px]"
                              >
                                <span className="truncate max-w-[150px] font-medium">{item.variation.name}</span>
                                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                              </button>

                              {/* Custom Dropdown Menu */}
                              {isDropdownOpen && (
                                <>
                                  {/* Invisible overlay to close dropdown when clicking outside */}
                                  <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setOpenDropdownId(null)}
                                  />
                                  <div className="absolute left-0 top-full mt-1 w-max min-w-full bg-card border border-border rounded-xl shadow-lg z-20 overflow-hidden">
                                    {/* max-h-[180px] allows ~5 items before scrolling (assuming ~36px per item) */}
                                    <div className="max-h-[180px] overflow-y-auto custom-scrollbar p-1.5 flex flex-col gap-0.5">
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
                                            className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors flex justify-between items-center ${isSelected
                                              ? 'bg-primary/10 text-primary font-bold'
                                              : v.stock < 1
                                                ? 'opacity-50 cursor-not-allowed text-muted-foreground'
                                                : 'hover:bg-muted text-foreground'
                                              }`}
                                          >
                                            <span>{v.name}</span>
                                            {v.stock < 1 && <span className="text-[10px] uppercase ml-2">Out of Stock</span>}
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
                          <p className="text-sm text-muted-foreground font-medium">
                            Variant: <span className="text-foreground">{item.variation.name}</span>
                          </p>
                        )}
                      </div>
                      <span className="font-black text-xl text-primary whitespace-nowrap">USD {price.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                      {/* Quantity Controller */}
                      <div className="flex items-center bg-background border border-border rounded-xl p-1 shadow-sm">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-muted rounded-lg transition-colors disabled:opacity-30"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-10 text-center font-bold text-sm text-foreground">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.variation.stock}
                          className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-muted rounded-lg transition-colors disabled:opacity-30"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors px-3 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* --- RIGHT: Order Summary --- */}
          <div className="w-full lg:w-[400px] flex-shrink-0">
            <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 lg:sticky lg:top-24 shadow-sm">
              <h2 className="text-xl font-bold text-foreground mb-6">Order Summary</h2>

              <div className="space-y-4 text-sm font-medium mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal ({cart.totalItems} items)</span>
                  <span className="text-foreground">USD {cart.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping estimate</span>
                  <span className="text-foreground">Calculated at checkout</span>
                </div>
              </div>

              <div className="w-full h-px bg-border mb-6"></div>

              <div className="flex justify-between items-end mb-8 bg-muted/50 p-4 rounded-2xl border border-border/50">
                <span className="font-bold text-foreground">Total</span>
                <span className="text-3xl font-black text-primary">USD {cart.totalAmount.toFixed(2)}</span>
              </div>

              <Link
                href="/checkout"
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 rounded-2xl font-bold text-lg hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}