"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import Swal from "sweetalert2";
import { LayoutGrid, MessageSquare, Plus, Loader2 } from "lucide-react";
import ReviewTable from "@/components/dashboard/shared/reviews/ReviewTable";

export default function ReviewsManagerPage() {
    const [activeTab, setActiveTab] = useState<"PRODUCT" | "SITE">("PRODUCT");
    const [loading, setLoading] = useState(true);

    const [productReviews, setProductReviews] = useState<any[]>([]);
    const [siteReviews, setSiteReviews] = useState<any[]>([]);

    useEffect(() => {
        fetchReviews();
    }, [activeTab]);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            // Assuming your express routes are setup at /api/v1/reviews/...
            const endpoint = activeTab === "PRODUCT" ? "/reviews/product/all" : "/reviews/site/all";
            const res = await api.get(endpoint);

            if (activeTab === "PRODUCT") {
                setProductReviews(res.data.data || []);
            } else {
                setSiteReviews(res.data.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch reviews", error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === "APPROVED" ? "PENDING" : "APPROVED";
        const endpoint = activeTab === "PRODUCT" ? `/reviews/product/${id}/status` : `/reviews/site/${id}`; // Adjust based on your routes

        try {
            if (activeTab === "PRODUCT") {
                await api.patch(endpoint, { status: newStatus });
            } else {
                await api.patch(endpoint, { status: newStatus });
            }

            // Optimistically update UI
            if (activeTab === "PRODUCT") {
                setProductReviews(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
            } else {
                setSiteReviews(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
            }

            Swal.fire({ icon: "success", title: "Status Updated!", toast: true, position: 'top-end', timer: 1500, showConfirmButton: false, background: "hsl(var(--card))", color: "hsl(var(--foreground))" });
        } catch (err) {
            Swal.fire({ title: "Error", text: "Could not update status", icon: "error", background: "hsl(var(--card))", color: "hsl(var(--foreground))" });
        }
    };

    const handleDelete = async (id: string) => {
        const res = await Swal.fire({
            title: "Delete Review?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            background: "hsl(var(--card))",
            color: "hsl(var(--foreground))",
            customClass: { popup: 'border border-border rounded-2xl shadow-theme-lg' }
        });

        if (res.isConfirmed) {
            const endpoint = activeTab === "PRODUCT" ? `/reviews/product/${id}` : `/reviews/site/${id}`;
            try {
                await api.delete(endpoint);

                if (activeTab === "PRODUCT") {
                    setProductReviews(prev => prev.filter(r => r.id !== id));
                } else {
                    setSiteReviews(prev => prev.filter(r => r.id !== id));
                }
            } catch (err) {
                Swal.fire({ title: "Error", text: "Failed to delete review", icon: "error", background: "hsl(var(--card))", color: "hsl(var(--foreground))" });
            }
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* HEADER & TABS */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-foreground tracking-tight">Reviews & Testimonials</h1>
                    <p className="text-sm text-muted-foreground">Manage product feedback and site reputation.</p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    {/* TABS */}
                    <div className="flex bg-card border border-border rounded-xl p-1 shadow-sm flex-1 md:flex-none">
                        <button
                            onClick={() => setActiveTab("PRODUCT")}
                            className={`flex-1 md:w-36 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-bold transition-all ${activeTab === "PRODUCT" ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:bg-muted'}`}
                        >
                            <LayoutGrid size={16} /> Products
                        </button>
                        <button
                            onClick={() => setActiveTab("SITE")}
                            className={`flex-1 md:w-36 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-bold transition-all ${activeTab === "SITE" ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:bg-muted'}`}
                        >
                            <MessageSquare size={16} /> Site
                        </button>
                    </div>

                    {/* ADD BUTTON (Only visible on SITE tab) */}
                    {activeTab === "SITE" && (
                        <Link
                            href="/dashboard/super-admin/storefront/reviews/create"
                            className="bg-primary text-primary-foreground h-10 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-theme-sm whitespace-nowrap"
                        >
                            <Plus size={16} /> <span className="hidden sm:inline">Add Testimonial</span>
                        </Link>
                    )}
                </div>
            </div>

            {/* RENDER SHARED TABLE */}
            {loading ? (
                <div className="flex justify-center items-center h-64 text-primary">
                    <Loader2 className="w-8 h-8 animate-spin" />
                </div>
            ) : (
                <ReviewTable
                    type={activeTab}
                    reviews={activeTab === "PRODUCT" ? productReviews : siteReviews}
                    onToggleStatus={handleToggleStatus}
                    onDelete={handleDelete}
                />
            )}

        </div>
    );
}