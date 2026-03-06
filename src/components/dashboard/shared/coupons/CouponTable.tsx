"use client";

import Link from "next/link";
import { Edit, Trash2, Ticket, CalendarX2 } from "lucide-react";

interface CouponTableProps {
    coupons: any[];
    onDelete?: (id: string) => void;
}

export default function CouponTable({ coupons, onDelete }: CouponTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-muted/30 border-b border-border">
                    <tr>
                        <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Coupon Code</th>
                        <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Discount</th>
                        <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Usage</th>
                        <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Validity</th>
                        <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-center">Status</th>
                        <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {coupons.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="p-8 text-center text-muted-foreground font-medium italic">
                                No active coupons found.
                            </td>
                        </tr>
                    ) : (
                        coupons.map(coupon => {
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
                                            {coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}% OFF` : `৳${coupon.discountValue} OFF`}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            Min: ৳{coupon.minPurchase} {coupon.maxDiscount ? `| Max: ৳${coupon.maxDiscount}` : ""}
                                        </p>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center justify-between text-xs font-bold">
                                                <span>{coupon.usedCount} used</span>
                                                <span className="text-muted-foreground">{coupon.usageLimit ? `/ ${coupon.usageLimit}` : '∞'}</span>
                                            </div>
                                            {coupon.usageLimit && (
                                                <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
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
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}