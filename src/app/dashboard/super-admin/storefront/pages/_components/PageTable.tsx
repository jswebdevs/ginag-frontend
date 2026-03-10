"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Edit, Trash2, ExternalLink, FileText } from "lucide-react";
import api from "@/lib/axios";

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

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this page? This cannot be undone.")) return;

        try {
            await api.delete(`/pages/${id}`);
            fetchPages(); // Refresh the list
        } catch (error) {
            console.error("Failed to delete page:", error);
            alert("Failed to delete page. Check console.");
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
                        className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-muted-foreground/50"
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
                                        <td className="px-6 py-5"><div className="h-5 w-32 bg-muted rounded"></div></td>
                                        <td className="px-6 py-5"><div className="h-4 w-24 bg-muted rounded"></div></td>
                                        <td className="px-6 py-5"><div className="h-6 w-20 bg-muted rounded-full"></div></td>
                                        <td className="px-6 py-5"><div className="h-4 w-24 bg-muted rounded"></div></td>
                                        <td className="px-6 py-5 flex justify-end"><div className="h-8 w-8 bg-muted rounded-lg"></div></td>
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
                                            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">/{page.slug}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${page.status === "PUBLISHED" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                                }`}>
                                                {page.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-sm font-medium text-muted-foreground whitespace-nowrap">
                                            {formatDate(page.updatedAt)}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/${page.slug}`} target="_blank" className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-heading transition-colors">
                                                    <ExternalLink className="w-4 h-4" />
                                                </Link>
                                                <Link href={`/dashboard/super-admin/storefront/pages/edit/${page.slug}`} className="w-8 h-8 rounded-lg flex items-center justify-center text-blue-500 hover:bg-blue-500/10 transition-colors">
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button onClick={() => handleDelete(page.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-500/10 transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                                            <FileText className="w-8 h-8 mb-4" />
                                            <h3 className="text-lg font-black text-heading uppercase tracking-tight mb-1">No Pages Found</h3>
                                            <p className="text-sm font-medium max-w-sm">Create your first dynamic page to see it here.</p>
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