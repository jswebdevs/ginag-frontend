"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Search, Loader2, Users } from "lucide-react";
import UserTable from "../../super-admin/_components/UserTable";
import Swal from "sweetalert2";

export default function AdminCustomersPage() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchCustomers = async () => {
        try {
            const res = await api.get('users/role/customer');
            setCustomers(res.data.data || []);
        } catch (error) {
            console.error("Failed to fetch customers", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This customer account will be permanently removed.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Yes, delete!',
            background: "hsl(var(--card))",
            color: "hsl(var(--foreground))",
            customClass: {
                popup: 'border border-border rounded-2xl shadow-theme-lg',
                htmlContainer: 'text-muted-foreground'
            }
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/users/${id}`);
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Customer account has been removed.',
                    icon: 'success',
                    background: "hsl(var(--card))",
                    color: "hsl(var(--foreground))",
                    customClass: {
                        popup: 'border border-border rounded-2xl shadow-theme-lg'
                    }
                });
                fetchCustomers();
            } catch (error: any) {
                Swal.fire({
                    title: 'Error',
                    text: error.response?.data?.message || 'Delete failed',
                    icon: 'error',
                    background: "hsl(var(--card))",
                    color: "hsl(var(--foreground))",
                    customClass: {
                        popup: 'border border-border rounded-2xl shadow-theme-lg'
                    }
                });
            }
        }
    };

    const filteredCustomers = customers.filter(c =>
        c.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        c.lastName?.toLowerCase().includes(search.toLowerCase()) ||
        c.username?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase()) ||
        c.phone?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto animate-in fade-in duration-500 pb-24">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
                        <Users className="w-8 h-8 text-primary" />
                        Customer Management
                    </h1>
                    <p className="text-sm text-muted-foreground">View and manage registered customers.</p>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
                    <div className="relative w-full md:w-72">
                        <input
                            type="text" placeholder="Search customers..."
                            value={search} onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary shadow-theme-sm"
                        />
                        <Search className="absolute left-3.5 top-3 text-muted-foreground" size={16} />
                    </div>
                </div>
            </div>

            <div className="bg-card border border-border rounded-3xl shadow-theme-sm overflow-hidden min-h-[50vh]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Loading Customers...</p>
                    </div>
                ) : (
                    <UserTable users={filteredCustomers} onDelete={handleDelete} basePath="/dashboard/admin/customers" />
                )}
            </div>
        </div>
    );
}
