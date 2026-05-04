"use client";

import { ShieldAlert, CalendarClock, ShoppingCart, Users } from "lucide-react";
import { useCurrency } from "@/context/SettingsContext";


export default function FormCouponRules({ data, update }: any) {
    const { symbol } = useCurrency();
    const isPercentage = data.discountType === "PERCENTAGE";


    return (
        <div className="bg-card border border-border rounded-3xl p-8 shadow-theme-sm space-y-8 mt-8">

            <div className="border-b border-border pb-4">
                <h2 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2">
                    <ShieldAlert className="text-primary" /> Rules & Restrictions
                </h2>
                <p className="text-xs text-muted-foreground mt-1">Define when and how this coupon can be applied.</p>
            </div>

            <div className="space-y-8">

                {/* TIME LIMITS */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-widest flex items-center gap-2 bg-muted/30 p-3 rounded-xl border border-border">
                        <CalendarClock size={16} className="text-muted-foreground" /> Time Limits
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Valid From *</label>
                            <input
                                type="datetime-local"
                                value={data.validFrom}
                                onChange={(e) => update({ validFrom: e.target.value })}
                                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-all font-mono"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Valid Until *</label>
                            <input
                                type="datetime-local"
                                value={data.validUntil}
                                onChange={(e) => update({ validUntil: e.target.value })}
                                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-all font-mono"
                            />
                        </div>
                    </div>
                </div>

                {/* FINANCIAL RULES */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-widest flex items-center gap-2 bg-muted/30 p-3 rounded-xl border border-border">
                        <ShoppingCart size={16} className="text-muted-foreground" /> Order Requirements
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Minimum Purchase ({symbol})</label>

                            <input
                                type="number" min="0" step="0.01"
                                value={data.minPurchase}
                                onChange={(e) => update({ minPurchase: e.target.value })}
                                placeholder="e.g. 1000"
                                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-all font-mono"
                            />
                            <p className="text-[10px] text-muted-foreground font-medium">Cart total must exceed this amount.</p>
                        </div>

                        <div className={`space-y-2 transition-opacity ${!isPercentage ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Maximum Discount ({symbol})</label>

                            <input
                                type="number" min="0" step="0.01"
                                value={data.maxDiscount}
                                onChange={(e) => update({ maxDiscount: e.target.value })}
                                placeholder={isPercentage ? "e.g. 500" : "N/A for Fixed"}
                                disabled={!isPercentage}
                                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-all font-mono"
                            />
                            <p className="text-[10px] text-muted-foreground font-medium">Caps the total amount saved on percentages.</p>
                        </div>
                    </div>
                </div>

                {/* USAGE LIMITS */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-widest flex items-center gap-2 bg-muted/30 p-3 rounded-xl border border-border">
                        <Users size={16} className="text-muted-foreground" /> Global Usage Limit
                    </h3>
                    <div className="space-y-2">
                        <input
                            type="number" min="1" step="1"
                            value={data.usageLimit || ""}
                            onChange={(e) => update({ usageLimit: e.target.value })}
                            placeholder="Leave blank for unlimited"
                            className="w-full md:w-1/2 bg-background border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-all font-mono"
                        />
                        <p className="text-[10px] text-muted-foreground font-medium">Total number of times this coupon can be redeemed across your entire store.</p>
                    </div>
                </div>

            </div>
        </div>
    );
}