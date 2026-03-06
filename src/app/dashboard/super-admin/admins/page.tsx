"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";
import { Plus, Search, Loader2 } from "lucide-react";
import AdminTable from "./_components/AdminTable";
import Swal from "sweetalert2";

export default function AdminsPage() {
    const [admins, setAdmins] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchAdmins = async () => {
        try {
            // Create this route in your express router!
            const res = await api.get('users/admins');
            setAdmins(res.data.data || []);
        } catch (error) {
            console.error("Failed to fetch admins", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This staff member will lose all access immediately.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Yes, delete!'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/users/${id}`); // Using your existing delete route
                Swal.fire('Deleted!', 'Admin account has been removed.', 'success');
                fetchAdmins(); // Refresh
            } catch (error: any) {
                Swal.fire('Error', error.response?.data?.message || 'Delete failed', 'error');
            }
        }
    };

    const filteredAdmins = admins.filter(a =>
        a.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        a.username?.toLowerCase().includes(search.toLowerCase()) ||
        a.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-4 md:p-6 max-w-400 mx-auto animate-in fade-in duration-500 pb-24">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">Admin Management</h1>
                    <p className="text-sm text-muted-foreground">Manage administrative accounts and permissions.</p>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
                    <div className="relative w-full md:w-72">
                        <input
                            type="text" placeholder="Search name or username..."
                            value={search} onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary shadow-theme-sm"
                        />
                        <Search className="absolute left-3.5 top-3 text-muted-foreground" size={16} />
                    </div>
                    <Link
                        href="/dashboard/super-admin/admins/create"
                        className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold hover:shadow-theme-md hover:scale-105 transition-all text-sm whitespace-nowrap"
                    >
                        <Plus size={18} /> Add Staff
                    </Link>
                </div>
            </div>

            <div className="bg-card border border-border rounded-3xl shadow-theme-sm overflow-hidden min-h-[50vh]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                    </div>
                ) : (
                    <AdminTable admins={filteredAdmins} onDelete={handleDelete} />
                )}
            </div>
        </div>
    );
}