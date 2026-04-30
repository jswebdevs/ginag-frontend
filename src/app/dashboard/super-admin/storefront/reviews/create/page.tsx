"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import Swal from "sweetalert2";
import ReviewForm from "@/components/dashboard/shared/reviews/ReviewForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function CreateReviewPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            await api.post("/reviews/site", data); // Your express endpoint

            Swal.fire({
                icon: "success",
                title: "Testimonial Published!",
                toast: true, position: 'top-end', timer: 2000, showConfirmButton: false,
                background: "hsl(var(--card))", color: "hsl(var(--foreground))"
            });

            router.push("/dashboard/super-admin/storefornt/reviews");
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: "Error", text: "Failed to save testimonial", icon: "error",
                background: "hsl(var(--card))", color: "hsl(var(--foreground))"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/super-admin/storefront/reviews" className="p-2 border border-border rounded-xl hover:bg-muted transition-colors text-muted-foreground">
                    <ChevronLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-black text-foreground tracking-tight">Add Testimonial</h1>
                    <p className="text-sm text-muted-foreground">Manually add a site review from a customer.</p>
                </div>
            </div>

            <ReviewForm onSubmit={handleSubmit} isLoading={isSubmitting} />
        </div>
    );
}