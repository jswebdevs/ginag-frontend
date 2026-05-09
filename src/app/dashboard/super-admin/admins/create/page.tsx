"use client";

import AdminForm from "../_components/AdminForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CreateAdminPage() {
    return (
        <div className="p-4 md:p-6 max-w-400 mx-auto animate-in fade-in duration-500 pb-24">
            <div className="mb-8">
                <Link href="/dashboard/super-admin/admins" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-4">
                    <ArrowLeft size={16} /> Back to Admin
                </Link>
                <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">Create an Admin</h1>
                <p className="text-sm text-muted-foreground">Provision a new administrative account with specific roles.</p>
            </div>
            <AdminForm />
        </div>
    );
}