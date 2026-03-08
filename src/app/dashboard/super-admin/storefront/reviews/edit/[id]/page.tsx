"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/axios";
import Swal from "sweetalert2";
import ReviewForm from "@/components/dashboard/shared/reviews/ReviewForm";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function EditReviewPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [initialData, setInitialData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchReview = async () => {
            try {
                // Adjust endpoint if needed. Assuming an endpoint to fetch a single review exists
                const res = await api.get(`/reviews/site/${id}`);
                const review = res.data.data;

                setInitialData({
                    name: review.name,
                    rating: review.rating,
                    comment: review.comment || "",
                    status: review.status || "APPROVED"
                });
            } catch (error) {
                console.error("Failed to fetch review", error);
                Swal.fire({ title: "Error", text: "Testimonial not found", icon: "error", background: "hsl(var(--card))", color: "hsl(var(--foreground))" });
                router.push("/dashboard/super-admin/storefront/reviews");
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchReview();
    }, [id, router]);

    const handleSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            await api.patch(`/reviews/site/${id}`, data);

            Swal.fire({
                icon: "success", title: "Updated!", toast: true, position: 'top-end', timer: 2000, showConfirmButton: false,
                background: "hsl(var(--card))", color: "hsl(var(--foreground))"
            });

            router.push("/dashboard/super-admin/storefront/reviews");
        } catch (error) {
            console.error(error);
            Swal.fire({ title: "Error", text: "Failed to update testimonial", icon: "error", background: "hsl(var(--card))", color: "hsl(var(--foreground))" });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center h-64 space-y-4 text-primary">
                <Loader2 className="w-10 h-10 animate-spin" />
                <p className="text-sm font-bold text-muted-foreground animate-pulse">Loading Testimonial Data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/super-admin/storefront/reviews" className="p-2 border border-border rounded-xl hover:bg-muted transition-colors text-muted-foreground">
                    <ChevronLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-black text-foreground tracking-tight">Edit Testimonial</h1>
                    <p className="text-sm text-muted-foreground">Update review content or change display status.</p>
                </div>
            </div>

            <ReviewForm initialData={initialData} onSubmit={handleSubmit} isLoading={isSubmitting} />
        </div>
    );
}