"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import Link from "next/link";
import { ArrowLeft, Edit, Mail, Phone, Calendar, Landmark, MapPin, Loader2 } from "lucide-react";
import Image from "next/image";

export default function ViewAdminPage() {
    const params = useParams();
    const [admin, setAdmin] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                // FIXED: Added leading slash and changed to params.username
                const res = await api.get(`/users/admins/${params.username}`);
                setAdmin(res.data.data);
            } catch (error) {
                console.error("Failed to fetch admin details");
            } finally {
                setLoading(false);
            }
        };

        // FIXED: Changed to params.username
        if (params.username) fetchAdmin();
    }, [params.username]);

    if (loading) return <div className="flex justify-center items-center h-[50vh]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    if (!admin) return <div className="text-center p-8 font-bold">Admin not found.</div>;

    return (
        <div className="p-4 md:p-6 max-w-[1000px] mx-auto animate-in fade-in duration-500 pb-24 space-y-8">

            <div className="flex items-center justify-between">
                <Link href="/dashboard/super-admin/admins" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft size={16} /> Back to Admins
                </Link>
                <Link href={`/dashboard/super-admin/admins/edit/${admin.username}`} className="bg-primary/10 text-primary px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-primary hover:text-white transition-all">
                    <Edit size={16} /> Edit Profile
                </Link>
            </div>

            {/* HEADER CARD */}
            <div className="bg-card border border-border rounded-3xl p-8 shadow-theme-sm flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
                <div className="w-32 h-32 rounded-full border-4 border-muted overflow-hidden relative bg-background shrink-0">
                    {admin.avatar ? <Image src={admin.avatar} alt="Avatar" fill className="object-cover" /> : <div className="w-full h-full bg-muted flex items-center justify-center font-black text-2xl text-muted-foreground">{admin.firstName?.charAt(0)}</div>}
                </div>

                <div className="flex-1 text-center md:text-left space-y-2">
                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                        <h1 className="text-3xl font-black text-foreground tracking-tight">{admin.firstName} {admin.lastName}</h1>
                        <span className="px-3 py-1 bg-muted border border-border rounded-lg text-xs font-black uppercase tracking-wider text-muted-foreground mx-auto md:mx-0">
                            {admin.status}
                        </span>
                    </div>
                    <p className="text-sm font-bold text-primary">@{admin.username}</p>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
                        {(admin.roles || []).map((r: string) => (
                            <span key={r} className="px-2.5 py-1 bg-primary/10 text-primary rounded text-[10px] font-black uppercase tracking-wider">
                                {r.replace('_', ' ')}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* CONTACT INFO */}
                <div className="bg-card border border-border rounded-3xl p-8 shadow-theme-sm space-y-6">
                    <h3 className="font-black text-foreground uppercase tracking-widest text-sm border-b border-border pb-3">Contact Information</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 text-sm font-medium">
                            <Mail className="text-muted-foreground shrink-0" size={18} />
                            <span className="text-foreground">{admin.email}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm font-medium">
                            <Phone className="text-muted-foreground shrink-0" size={18} />
                            <span className="text-foreground">{admin.phone || "Not provided"}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm font-medium">
                            <Calendar className="text-muted-foreground shrink-0" size={18} />
                            <span className="text-foreground">{admin.dob ? new Date(admin.dob).toLocaleDateString() : "Not provided"}</span>
                        </div>
                    </div>
                </div>

                {/* FINANCIAL INFO */}
                <div className="bg-card border border-border rounded-3xl p-8 shadow-theme-sm space-y-6">
                    <h3 className="font-black text-foreground uppercase tracking-widest text-sm border-b border-border pb-3">Financial Routing</h3>

                    <div className="space-y-4">
                        <div className="bg-muted/20 p-4 rounded-xl border border-border">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 mb-2"><Landmark size={12} /> Bank Account</p>
                            {admin.bankDetails?.bankName ? (
                                <div>
                                    <p className="text-sm font-bold text-foreground">{admin.bankDetails.bankName}</p>
                                    <p className="text-xs text-muted-foreground">A/C: {admin.bankDetails.accNo} • Rtg: {admin.bankDetails.routingNo}</p>
                                </div>
                            ) : <p className="text-xs italic text-muted-foreground">Not configured</p>}
                        </div>

                        <div className="bg-muted/20 p-4 rounded-xl border border-border">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 mb-2"><Phone size={12} /> Mobile Banking</p>
                            {admin.mobileBanking?.provider ? (
                                <div>
                                    <p className="text-sm font-bold text-foreground capitalize">{admin.mobileBanking.provider}</p>
                                    <p className="text-xs text-muted-foreground font-mono">{admin.mobileBanking.number}</p>
                                </div>
                            ) : <p className="text-xs italic text-muted-foreground">Not configured</p>}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}