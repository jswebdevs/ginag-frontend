"use client";

import CouponForm from "@/components/dashboard/shared/coupons/CouponForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CreateCouponPage() {
    return (
        <div className="p-4 md:p-6 max-w-400 mx-auto animate-in fade-in duration-500 pb-24">
            <div className="mb-8">
                <Link href="/dashboard/admin/coupons" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-4">
                    <ArrowLeft size={16} /> Back to Coupons
                </Link>
                <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">Create New Coupon</h1>
                <p className="text-sm text-muted-foreground">Set up a new discount code and define its rules.</p>
            </div>
            <CouponForm />
        </div>
    );
}