"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Edit, Trash2, ExternalLink, FileText, Loader2 } from "lucide-react";
import api from "@/lib/axios";
import Swal from "sweetalert2"; // 🔥 Import SweetAlert2

interface StorefrontPage {
    id: string;
    title: string;
    slug: string;
    status: "PUBLISHED" | "DRAFT";
    updatedAt: string;
}

export default function PageTable() {
    const [pages, setPages] = useState<StorefrontPage[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchPages = () => {
        setLoading(true);
        api.get("/pages")
            .then((res) => setPages(res.data?.data || []))
            .catch((err) => console.error("Error fetching pages:", err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchPages();
    }, []);

    // 🔥 UPDATED: Beautiful Swal confirmation and error handling
    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This storefront page will be permanently deleted. This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444", // Destructive red
            cancelButtonColor: "#64748b", // Slate muted
            confirmButtonText: "Yes, delete it!",
            reverseButtons: true,
            background: 'hsl(var(--card))',
            color: 'hsl(var(--foreground))',
        });

        if (!result.isConfirmed) return;

        try {
            await api.delete(`/pages/${id}`);

            Swal.fire({
                title: "Deleted!",
                text: "The page has been successfully removed.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
                background: 'hsl(var(--card))',
                color: 'hsl(var(--foreground))',
            });

            fetchPages();
        } catch (error: any) {
            console.error("Failed to delete page:", error);

            Swal.fire({
                title: "Error!",
                text: error.response?.data?.message || "Failed to delete page.",
                icon: "error",
                confirmButtonColor: "hsl(var(--primary))",
                background: 'hsl(var(--card))',
                color: 'hsl(var(--foreground))',
            });
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric",
        });
    };

    const filteredPages = pages.filter(page =>
        page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        page.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <div className="bg-card border border-border rounded-2xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-center shadow-sm">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search pages by title or slug..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-muted-foreground/50"
                    />
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/30 border-b border-border">
                                <th className="px-6 py-4 text-xs font-black text-muted-foreground uppercase tracking-widest whitespace-nowrap">Page Title</th>
                                <th className="px-6 py-4 text-xs font-black text-muted-foreground uppercase tracking-widest whitespace-nowrap">URL Slug</th>
                                <th className="px-6 py-4 text-xs font-black text-muted-foreground uppercase tracking-widest whitespace-nowrap">Status</th>
                                <th className="px-6 py-4 text-xs font-black text-muted-foreground uppercase tracking-widest whitespace-nowrap">Last Updated</th>
                                <th className="px-6 py-4 text-xs font-black text-muted-foreground uppercase tracking-widest whitespace-nowrap text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-border">
                            {loading ? (
                                [...Array(3)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-5 flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-muted shrink-0"></div>
                                            <div className="h-4 w-32 bg-muted rounded"></div>
                                        </td>
                                        <td className="px-6 py-5"><div className="h-4 w-24 bg-muted rounded"></div></td>
                                        <td className="px-6 py-5"><div className="h-6 w-20 bg-muted rounded-full"></div></td>
                                        <td className="px-6 py-5"><div className="h-4 w-24 bg-muted rounded"></div></td>
                                        <td className="px-6 py-5 flex justify-end"><div className="h-8 w-24 bg-muted rounded-lg"></div></td>
                                    </tr>
                                ))
                            ) : filteredPages.length > 0 ? (
                                filteredPages.map((page) => (
                                    <tr key={page.id} className="hover:bg-muted/10 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <span className="font-bold text-heading text-sm whitespace-nowrap">{page.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-bold text-muted-foreground whitespace-nowrap">/{page.slug}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${page.status === "PUBLISHED"
                                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                                                }`}>
                                                {page.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-sm font-medium text-muted-foreground whitespace-nowrap">
                                            {formatDate(page.updatedAt)}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center justify-end gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    href={`/${page.slug}`}
                                                    target="_blank"
                                                    className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-heading border border-transparent hover:border-border transition-all"
                                                    title="View Page"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={`/dashboard/super-admin/storefront/pages/edit/${page.slug}`}
                                                    className="w-9 h-9 rounded-xl flex items-center justify-center text-blue-500 hover:bg-blue-500/10 border border-transparent hover:border-blue-500/20 transition-all"
                                                    title="Edit Layout"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(page.id)}
                                                    className="w-9 h-9 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
                                                    title="Delete Page"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                                            <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4">
                                                <FileText className="w-8 h-8 opacity-20" />
                                            </div>
                                            <h3 className="text-lg font-black text-heading uppercase tracking-tight mb-1">No Dynamic Pages</h3>
                                            <p className="text-sm font-medium max-w-sm opacity-60 uppercase tracking-widest text-[10px]">Your storefront content will appear here.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}