"use client";

import Link from "next/link";
import { Star, ShoppingCart, Heart, Minus, Plus, Loader2 } from "lucide-react";

export default function ProductInfo({
    product,
    currentVariation,
    selectedOptions,
    handleOptionSelect,
    quantity,
    setQuantity,
    handleAddToCart,
    isAdding
}: any) {

    const displayBasePrice = Number(currentVariation?.basePrice || product.basePrice || 0);
    const displaySalePrice = currentVariation?.salePrice ? Number(currentVariation.salePrice) : product.salePrice ? Number(product.salePrice) : null;
    const currentPrice = displaySalePrice || displayBasePrice;
    const originalPrice = displaySalePrice ? displayBasePrice : null;
    const currentStock = currentVariation ? currentVariation.stock : 0;

    // Format short description dynamically
    const renderShortDesc = () => {
        if (!product.shortDesc) return null;
        const lines = product.shortDesc.split('\n').filter((line: string) => line.trim() !== '');

        if (lines.length > 1) {
            return (
                <ul className="space-y-2 mb-8">
                    {lines.map((line: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm sm:text-base text-subheading">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                            <span>{line.replace(/^-\s*/, '')}</span> {/* Cleans up if admin typed dashes */}
                        </li>
                    ))}
                </ul>
            );
        }
        return <p className="text-sm sm:text-base text-subheading mb-8 leading-relaxed">{product.shortDesc}</p>;
    };

    return (
        <div className="flex flex-col">

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-heading leading-[1.1] mb-4 tracking-tight uppercase">
                {product.name}
            </h1>

            {/* Reviews (Aggregate placeholder for now, mapping to real reviews array length) */}
            <div className="flex items-center gap-2 mb-6">
                <div className="flex text-yellow-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`w-4 h-4 ${star <= (product.rating || 5) ? 'fill-current' : 'text-muted/30'}`} />
                    ))}
                </div>
                <span className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                    ({product.reviews?.length || 0} Reviews)
                </span>
            </div>

            {/* Price & SKU */}
            <div className="flex flex-wrap items-end gap-3 sm:gap-4 mb-6 bg-muted/20 p-4 rounded-2xl border border-border">
                <span className="text-4xl font-black text-primary tracking-tighter">৳{currentPrice.toLocaleString()}</span>
                {originalPrice && (
                    <span className="text-xl font-bold text-muted-foreground line-through mb-1">৳{originalPrice.toLocaleString()}</span>
                )}
                {currentVariation?.sku && (
                    <span className="text-xs font-black text-muted-foreground bg-background border border-border px-3 py-1 rounded-lg w-full sm:w-auto sm:ml-auto mb-1 font-mono uppercase tracking-widest">
                        SKU: {currentVariation.sku}
                    </span>
                )}
            </div>

            {/* Description */}
            {renderShortDesc()}

            <div className="w-full h-px bg-border mb-8"></div>

            {/* Variations */}
            {product.attributes && product.attributes.length > 0 && (
                <div className="space-y-6 mb-8">
                    {product.attributes.map((attr: any) => (
                        <div key={attr.name}>
                            <h3 className="text-xs font-black text-muted-foreground mb-3 uppercase tracking-widest">{attr.name}</h3>
                            <div className="flex flex-wrap gap-3">
                                {attr.values.map((val: string) => {
                                    const isSelected = selectedOptions[attr.name] === val;
                                    return (
                                        <button
                                            key={val}
                                            onClick={() => handleOptionSelect(attr.name, val)}
                                            className={`px-5 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${isSelected ? 'border-primary bg-primary/10 text-primary shadow-sm scale-105' : 'border-border text-foreground hover:border-primary/50'
                                                }`}
                                        >
                                            {val}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Stock Status */}
            <div className="mb-6">
                {currentStock > 0 ? (
                    <span className="inline-flex items-center gap-2 text-green-600 bg-green-500/10 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> In Stock ({currentStock})
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-2 text-destructive bg-destructive/10 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest">
                        <span className="w-2 h-2 rounded-full bg-destructive"></span> Out of Stock
                    </span>
                )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 mb-10">
                <div className="flex items-center bg-card border border-border rounded-2xl p-1 h-14 shadow-sm">
                    <button onClick={() => setQuantity((q: number) => Math.max(1, q - 1))} className="w-12 h-full flex items-center justify-center hover:bg-muted rounded-xl transition-colors">
                        <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-black text-lg">{quantity}</span>
                    <button onClick={() => setQuantity((q: number) => Math.min(currentStock, q + 1))} disabled={quantity >= currentStock} className="w-12 h-full flex items-center justify-center hover:bg-muted rounded-xl transition-colors disabled:opacity-30">
                        <Plus className="w-4 h-4" />
                    </button>
                </div>

                <button className="w-14 h-14 flex-shrink-0 flex items-center justify-center bg-card border border-border rounded-2xl text-muted-foreground hover:text-red-500 hover:border-red-200 hover:bg-red-50 hover:shadow-sm transition-all">
                    <Heart className="w-6 h-6" />
                </button>

                <button
                    onClick={handleAddToCart}
                    disabled={currentStock === 0 || !currentVariation || isAdding}
                    className="flex-grow h-14 flex items-center justify-center gap-3 bg-primary text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:shadow-theme-xl hover:-translate-y-1 transition-all disabled:opacity-50 disabled:pointer-events-none disabled:transform-none"
                >
                    {isAdding ? <><Loader2 className="w-5 h-5 animate-spin" /> Adding...</> : <><ShoppingCart className="w-5 h-5" /> {currentStock === 0 ? 'Out of Stock' : 'Add to Cart'}</>}
                </button>
            </div>
        </div>
    );
}