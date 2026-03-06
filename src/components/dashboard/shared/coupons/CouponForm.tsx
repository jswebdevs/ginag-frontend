"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import Swal from "sweetalert2";
import { Save, Loader2 } from "lucide-react";

// Sub-components (We will build the rules component next)
import FormCouponDetails from "./FormCouponDetails";
import FormCouponRules from "./FormCouponRules";

export default function CouponForm({ initialData }: { initialData?: any }) {
    const router = useRouter();
    const isEdit = !!initialData;

    // Helper to format ISO date to datetime-local input string
    const formatDateTimeForInput = (isoString?: string) => {
        if (!isoString) return "";
        return new Date(isoString).toISOString().slice(0, 16);
    };

    const [couponData, setCouponData] = useState({
        code: "",
        description: "",
        discountType: "PERCENTAGE",
        discountValue: "",
        minPurchase: "0",
        maxDiscount: "",
        validFrom: formatDateTimeForInput(new Date().toISOString()),
        validUntil: "",
        isActive: true,
        usageLimit: ""
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setCouponData({
                ...initialData,
                discountValue: initialData.discountValue?.toString() || "",
                minPurchase: initialData.minPurchase?.toString() || "0",
                maxDiscount: initialData.maxDiscount?.toString() || "",
                usageLimit: initialData.usageLimit?.toString() || "",
                validFrom: formatDateTimeForInput(initialData.validFrom),
                validUntil: formatDateTimeForInput(initialData.validUntil)
            });
        }
    }, [initialData]);

    const updateData = (fields: Partial<typeof couponData>) => {
        setCouponData((prev) => ({ ...prev, ...fields }));
    };

    const handleSave = async () => {
        if (!couponData.code || !couponData.discountValue || !couponData.validFrom || !couponData.validUntil) {
            return Swal.fire("Error", "Code, Discount Value, and Validity Dates are required", "error");
        }

        setLoading(true);
        try {
            // Format payload for Prisma Decimal/Int fields
            const payload = {
                ...couponData,
                discountValue: parseFloat(couponData.discountValue),
                minPurchase: parseFloat(couponData.minPurchase) || 0,
                maxDiscount: couponData.maxDiscount ? parseFloat(couponData.maxDiscount) : null,
                usageLimit: couponData.usageLimit ? parseInt(couponData.usageLimit) : null,
                validFrom: new Date(couponData.validFrom).toISOString(),
                validUntil: new Date(couponData.validUntil).toISOString(),
            };

            if (isEdit) {
                await api.patch(`/coupons/${initialData.id}`, payload);
            } else {
                await api.post("/coupons", payload);
            }

            Swal.fire("Success", `Coupon ${isEdit ? 'updated' : 'created'} successfully`, "success");
            router.push("/dashboard/super-admin/coupons");
        } catch (err: any) {
            Swal.fire("Error", err.response?.data?.message || "Internal Server Error", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col xl:flex-row gap-8 items-start">

            {/* LEFT SIDE: Core Details */}
            <div className="flex-1 w-full space-y-8">
                <FormCouponDetails data={couponData} update={updateData} />
                <FormCouponRules data={couponData} update={updateData} /> 
            </div>

            {/* RIGHT SIDE: Status & Save */}
            <div className="w-full xl:w-[350px] space-y-8 xl:sticky xl:top-24">

                <div className="bg-card border border-border rounded-3xl p-6 shadow-theme-sm space-y-4">
                    <label className="flex items-center justify-between cursor-pointer">
                        <span className="text-sm font-bold text-foreground">Coupon is Active</span>
                        <input
                            type="checkbox"
                            checked={couponData.isActive}
                            onChange={(e) => updateData({ isActive: e.target.checked })}
                            className="w-5 h-5 accent-primary rounded cursor-pointer"
                        />
                    </label>
                    <p className="text-xs text-muted-foreground">Turn this off to immediately prevent customers from using this code, regardless of dates.</p>
                </div>

                <div className="bg-card border border-border rounded-3xl p-6 shadow-theme-sm">
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full py-4 bg-primary text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:shadow-theme-md hover:scale-[1.02] transition-all disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                        {isEdit ? "Update Coupon" : "Create Coupon"}
                    </button>
                </div>
            </div>

        </div>
    );
}