"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";
import { Plus, Search, Loader2 } from "lucide-react";
import CouponTable from "@/components/dashboard/shared/coupons/CouponTable";
import Swal from "sweetalert2";

export default function CouponsPage() {
    const [coupons, setCoupons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchCoupons = async () => {
        try {
            const res = await api.get('/coupons');
            setCoupons(res.data.data || []);
        } catch (error) {
            console.error("Failed to fetch coupons", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "Customers will no longer be able to use this coupon.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/coupons/${id}`);
                Swal.fire('Deleted!', 'Coupon has been permanently removed.', 'success');
                fetchCoupons(); // Refresh the table
            } catch (error: any) {
                Swal.fire('Error', error.response?.data?.message || 'Delete failed', 'error');
            }
        }
    };

    const filteredCoupons = coupons.filter(c =>
        c.code?.toLowerCase().includes(search.toLowerCase()) ||
        c.description?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-4 md:p-6 max-w-400 mx-auto animate-in fade-in duration-500 pb-24">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">Coupons & Discounts</h1>
                    <p className="text-sm text-muted-foreground">Create promotional codes to boost sales.</p>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
                    <div className="relative w-full md:w-72">
                        <input
                            type="text" placeholder="Search code or description..."
                            value={search} onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary shadow-theme-sm"
                        />
                        <Search className="absolute left-3.5 top-3 text-muted-foreground" size={16} />
                    </div>
                    <Link
                        href="/dashboard/super-admin/coupons/create"
                        className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold hover:shadow-theme-md hover:scale-105 transition-all text-sm whitespace-nowrap"
                    >
                        <Plus size={18} /> Create Coupon
                    </Link>
                </div>
            </div>

            <div className="bg-card border border-border rounded-3xl shadow-theme-sm overflow-hidden min-h-[50vh]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                    </div>
                ) : (
                    <CouponTable coupons={filteredCoupons} onDelete={handleDelete} />
                )}
            </div>
        </div>
    );
}