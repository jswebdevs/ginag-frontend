"use client";

import Link from "next/link";
import { Edit, Trash2, Ticket, CalendarX2, Percent, Tag } from "lucide-react";
import { useCurrency } from "@/context/SettingsContext";


interface CouponTableProps {
    coupons: any[];
    onDelete?: (id: string) => void;
}

export default function CouponTable({ coupons, onDelete }: CouponTableProps) {
    const { symbol } = useCurrency();

    if (coupons.length === 0) {
        return (
            <div className="p-8 text-center text-muted-foreground font-medium italic border border-border rounded-2xl bg-card">
                No active coupons found.
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* ======================================================= */}
            {/* MOBILE CARD LAYOUT (Visible only on < md screens)       */}
            {/* ======================================================= */}
            <div className="flex flex-col gap-4 md:hidden">
                {coupons.map(coupon => {
                    const isExpired = new Date(coupon.validUntil) < new Date();
                    const isExhausted = coupon.usageLimit && coupon.usedCount >= coupon.usageLimit;
                    const isActuallyActive = coupon.isActive && !isExpired && !isExhausted;

                    return (
                        <div key={coupon.id} className="bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-col relative overflow-hidden">
                            {/* Top row: Code, Icon, Status */}
                            <div className="flex justify-between items-start gap-3">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                                        <Ticket size={18} />
                                    </div>
                                    <div>
                                        <p className="font-black text-foreground text-lg tracking-wider uppercase leading-tight">
                                            {coupon.code}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                            {coupon.description || "No description provided"}
                                        </p>
                                    </div>
                                </div>
                                <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border shrink-0 ${isActuallyActive
                                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                                    : 'bg-muted text-muted-foreground border-border'
                                    }`}>
                                    {isActuallyActive ? "Active" : isExpired ? "Expired" : isExhausted ? "Exhausted" : "Inactive"}
                                </span>
                            </div>

                            <hr className="border-border border-dashed my-4" />

                            {/* Middle row: Discount & Validity Grid */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-1">
                                        <Tag size={10} /> Discount
                                    </p>
                                    <p className="font-bold text-foreground text-sm">
                                        {coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}% OFF` : `${symbol}${coupon.discountValue} OFF`}

                                    </p>
                                    <p className="text-[10px] text-muted-foreground mt-0.5">
                                        Min: {symbol}{coupon.minPurchase} {coupon.maxDiscount ? `| Max: ${symbol}${coupon.maxDiscount}` : ""}

                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-1">
                                        <CalendarX2 size={10} /> Validity
                                    </p>
                                    <p className="text-xs font-medium text-foreground">
                                        {new Date(coupon.validFrom).toLocaleDateString()}
                                    </p>
                                    <p className={`text-xs mt-0.5 font-medium ${isExpired ? 'text-destructive' : 'text-muted-foreground'}`}>
                                        to {new Date(coupon.validUntil).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            {/* Usage Progress */}
                            <div className="bg-muted/30 rounded-xl p-3 border border-border mb-4">
                                <div className="flex items-center justify-between text-xs font-bold mb-2">
                                    <span>{coupon.usedCount} used</span>
                                    <span className="text-muted-foreground">{coupon.usageLimit ? `/ ${coupon.usageLimit}` : 'Unlimited'}</span>
                                </div>
                                {coupon.usageLimit && (
                                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary"
                                            style={{ width: `${Math.min((coupon.usedCount / coupon.usageLimit) * 100, 100)}%` }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 mt-auto">
                                <Link
                                    href={`/dashboard/super-admin/coupons/edit/${coupon.id}`}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-muted hover:bg-muted/80 border border-transparent hover:border-border rounded-xl text-sm font-bold transition-all"
                                >
                                    <Edit size={16} className="text-muted-foreground" /> Edit
                                </Link>
                                {onDelete && (
                                    <button
                                        onClick={() => onDelete(coupon.id)}
                                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-destructive/10 hover:bg-destructive/20 text-destructive border border-transparent hover:border-destructive/30 rounded-xl text-sm font-bold transition-all"
                                    >
                                        <Trash2 size={16} /> Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ======================================================= */}
            {/* DESKTOP TABLE LAYOUT (Hidden on < md screens)           */}
            {/* ======================================================= */}
            <div className="hidden md:block overflow-x-auto bg-card rounded-2xl border border-border shadow-sm">
                <table className="w-full text-left whitespace-nowrap">
                    <thead className="bg-muted/30 border-b border-border">
                        <tr>
                            <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Coupon Code</th>
                            <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Discount</th>
                            <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider w-[200px]">Usage</th>
                            <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Validity</th>
                            <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-center">Status</th>
                            <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {coupons.map(coupon => {
                            const isExpired = new Date(coupon.validUntil) < new Date();
                            const isExhausted = coupon.usageLimit && coupon.usedCount >= coupon.usageLimit;
                            const isActuallyActive = coupon.isActive && !isExpired && !isExhausted;

                            return (
                                <tr key={coupon.id} className="hover:bg-muted/10 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                                <Ticket size={18} />
                                            </div>
                                            <div>
                                                <p className="font-black text-foreground text-sm tracking-wider uppercase">{coupon.code}</p>
                                                <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[200px]">{coupon.description || "No description"}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <p className="font-bold text-foreground text-sm">
                                            {coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}% OFF` : `${symbol}${coupon.discountValue} OFF`}

                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            Min: {symbol}{coupon.minPurchase} {coupon.maxDiscount ? `| Max: ${symbol}${coupon.maxDiscount}` : ""}

                                        </p>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col gap-1.5 w-full pr-4">
                                            <div className="flex items-center justify-between text-xs font-bold">
                                                <span>{coupon.usedCount} used</span>
                                                <span className="text-muted-foreground">{coupon.usageLimit ? `/ ${coupon.usageLimit}` : '∞'}</span>
                                            </div>
                                            {coupon.usageLimit && (
                                                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary"
                                                        style={{ width: `${Math.min((coupon.usedCount / coupon.usageLimit) * 100, 100)}%` }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <p className="text-xs font-medium text-foreground">
                                            From: {new Date(coupon.validFrom).toLocaleDateString()}
                                        </p>
                                        <p className={`text-xs mt-0.5 font-medium ${isExpired ? 'text-destructive' : 'text-muted-foreground'}`}>
                                            To: {new Date(coupon.validUntil).toLocaleDateString()}
                                        </p>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${isActuallyActive
                                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                                            : 'bg-muted text-muted-foreground border-border'
                                            }`}>
                                            {isActuallyActive ? "Active" : isExpired ? "Expired" : isExhausted ? "Exhausted" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/dashboard/super-admin/coupons/edit/${coupon.id}`}
                                                className="p-2 bg-background border border-border rounded-lg text-muted-foreground hover:text-orange-500 hover:border-orange-500 transition-colors"
                                                title="Edit Coupon"
                                            >
                                                <Edit size={16} />
                                            </Link>
                                            {onDelete && (
                                                <button
                                                    onClick={() => onDelete(coupon.id)}
                                                    className="p-2 bg-background border border-border rounded-lg text-muted-foreground hover:text-destructive hover:border-destructive transition-colors"
                                                    title="Delete Coupon"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}