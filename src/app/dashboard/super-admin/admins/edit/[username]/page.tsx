"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import AdminForm from "../../_components/AdminForm";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function EditAdminPage() {
    const params = useParams();
    const [initialData, setInitialData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                // FIXED: Changed from /admins/ to /users/admins/
                const res = await api.get(`/users/admins/${params.username}`);
                setInitialData(res.data.data);
            } catch (error) {
                console.error("Failed to fetch admin details");
            } finally {
                setLoading(false);
            }
        };
        if (params.username) fetchAdmin();
    }, [params.username]);

    if (loading) {
        return <div className="flex justify-center items-center h-[50vh]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    }

    if (!initialData) {
        return <div className="text-center p-8 font-bold text-muted-foreground">Admin not found.</div>;
    }

    return (
        <div className="p-4 md:p-6 max-w-400 mx-auto animate-in fade-in duration-500 pb-24">
            <div className="mb-8">
                <Link href="/dashboard/super-admin/admins" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-4">
                    <ArrowLeft size={16} /> Back to Staff
                </Link>
                <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">Edit: @{initialData?.username}</h1>
                <p className="text-sm text-muted-foreground">Update permissions, status, and financial details.</p>
            </div>
            {initialData && <AdminForm initialData={initialData} />}
        </div>
    );
}