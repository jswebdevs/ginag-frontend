"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import CouponForm from "@/components/dashboard/shared/coupons/CouponForm";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function EditCouponPage() {
    const params = useParams();
    const [initialData, setInitialData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Safely grab the id parameter
    const id = params.id;

    useEffect(() => {
        const fetchCoupon = async () => {
            try {
                const res = await api.get(`/coupons/${id}`);
                setInitialData(res.data.data);
            } catch (error) {
                console.error("Failed to fetch coupon details");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCoupon();
        } else {
            setLoading(false);
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!initialData) {
        return (
            <div className="p-8 text-center">
                <p className="font-bold text-muted-foreground">Coupon not found or has been deleted.</p>
                <Link href="/dashboard/admin/coupons" className="text-primary hover:underline mt-4 inline-block">
                    Return to Coupons
                </Link>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 max-w-400 mx-auto animate-in fade-in duration-500 pb-24">
            <div className="mb-8">
                <Link href="/dashboard/admin/coupons" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-4">
                    <ArrowLeft size={16} /> Back to Coupons
                </Link>
                <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">Edit: {initialData.code}</h1>
                <p className="text-sm text-muted-foreground">Modify the rules and expiration of this coupon.</p>
            </div>
            <CouponForm initialData={initialData} />
        </div>
    );
}