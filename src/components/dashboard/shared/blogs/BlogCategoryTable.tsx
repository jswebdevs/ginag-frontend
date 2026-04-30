"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Edit, Trash2, FolderOpen, Loader2 } from "lucide-react";
import api from "@/lib/axios";
import Swal from "sweetalert2";

export default function BlogCategoryTable() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCategories = async () => {
        try {
            const res = await api.get("/blog-categories");
            setCategories(res.data.data || []);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "Deleting this category might affect associated blogs.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            confirmButtonText: "Yes, delete it!"
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/blog-categories/${id}`);
                Swal.fire("Deleted!", "Category removed.", "success");
                fetchCategories();
            } catch (error) {
                Swal.fire("Error", "Failed to delete category.", "error");
            }
        }
    };

    if (loading) {
        return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    }

    if (categories.length === 0) {
        return (
            <div className="p-8 text-center text-muted-foreground font-medium italic border border-border rounded-2xl bg-card">
                No blog categories found.
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* ======================================================= */}
            {/* MOBILE CARD LAYOUT (Visible only on < md screens)       */}
            {/* ======================================================= */}
            <div className="flex flex-col gap-4 md:hidden">
                {categories.map((cat) => (
                    <div key={cat.id} className="bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-col gap-4 relative overflow-hidden">
                        {/* Top row: Icon, Name, Slug */}
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <FolderOpen className="w-6 h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-heading text-lg leading-tight truncate">
                                    {cat.name}
                                </h3>
                                <p className="text-sm font-medium text-muted-foreground mt-0.5 truncate">
                                    /{cat.slug}
                                </p>
                            </div>
                        </div>

                        {/* Middle row: Stats */}
                        <div className="flex justify-between items-center bg-muted/30 p-3 rounded-xl border border-border/50">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Associated Blogs</span>
                            <span className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black">
                                {cat._count?.blogs || 0}
                            </span>
                        </div>

                        {/* Bottom row: Actions */}
                        <div className="flex items-center gap-2 mt-auto">
                            <Link
                                href={`/dashboard/super-admin/blogs/blog-category/edit/${cat.slug}`}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-muted hover:bg-muted/80 border border-transparent hover:border-border rounded-xl text-sm font-bold transition-all text-blue-500"
                            >
                                <Edit size={16} /> Edit
                            </Link>
                            <button
                                onClick={() => handleDelete(cat.id)}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-destructive/10 hover:bg-destructive/20 text-destructive border border-transparent hover:border-destructive/30 rounded-xl text-sm font-bold transition-all"
                            >
                                <Trash2 size={16} /> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* ======================================================= */}
            {/* DESKTOP TABLE LAYOUT (Hidden on < md screens)           */}
            {/* ======================================================= */}
            <div className="hidden md:block bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/30 border-b border-border">
                                <th className="px-6 py-4 text-xs font-black text-muted-foreground uppercase tracking-widest">Name</th>
                                <th className="px-6 py-4 text-xs font-black text-muted-foreground uppercase tracking-widest">Slug</th>
                                <th className="px-6 py-4 text-xs font-black text-muted-foreground uppercase tracking-widest text-center">Blogs</th>
                                <th className="px-6 py-4 text-xs font-black text-muted-foreground uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {categories.map((cat) => (
                                <tr key={cat.id} className="hover:bg-muted/10 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                                <FolderOpen className="w-5 h-5" />
                                            </div>
                                            <span className="font-bold text-heading text-sm">{cat.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm font-medium text-muted-foreground">/{cat.slug}</td>
                                    <td className="px-6 py-5 text-center">
                                        <span className="inline-flex px-3 py-1 rounded-full bg-muted text-xs font-black">
                                            {cat._count?.blogs || 0}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/dashboard/super-admin/blogs/blog-category/edit/${cat.slug}`}
                                                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 transition-colors"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(cat.id)}
                                                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}