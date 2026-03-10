"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Edit, Trash2, ExternalLink, Image as ImageIcon, Eye, FileText } from "lucide-react";
import api from "@/lib/axios";
import Swal from "sweetalert2";

interface Blog {
    id: string;
    title: string;
    slug: string;
    featuredImage?: { thumbUrl?: string; originalUrl?: string } | null;
    category?: { name: string; slug: string } | null;
    author?: { fullName: string } | null;
    isPublished: boolean;
    views: number;
    createdAt: string;
}

export default function BlogTable() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const res = await api.get("/blogs");
            // Your backend returns { success: true, data: blogs, total, page }
            setBlogs(res.data.data || []);
        } catch (error) {
            console.error("Error fetching blogs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This article will be permanently deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            confirmButtonText: "Yes, delete it!"
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/blogs/${id}`);
                Swal.fire("Deleted!", "The blog has been removed.", "success");
                fetchBlogs(); // Refresh list
            } catch (error: any) {
                Swal.fire("Error", error.response?.data?.message || "Failed to delete blog.", "error");
            }
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric",
        });
    };

    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <div className="bg-card border border-border rounded-2xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-center shadow-sm">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search blogs by title or category..."
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
                                <th className="px-6 py-4 text-xs font-black text-muted-foreground uppercase tracking-widest whitespace-nowrap">Article</th>
                                <th className="px-6 py-4 text-xs font-black text-muted-foreground uppercase tracking-widest whitespace-nowrap">Category</th>
                                <th className="px-6 py-4 text-xs font-black text-muted-foreground uppercase tracking-widest whitespace-nowrap text-center">Stats</th>
                                <th className="px-6 py-4 text-xs font-black text-muted-foreground uppercase tracking-widest whitespace-nowrap">Status</th>
                                <th className="px-6 py-4 text-xs font-black text-muted-foreground uppercase tracking-widest whitespace-nowrap">Date</th>
                                <th className="px-6 py-4 text-xs font-black text-muted-foreground uppercase tracking-widest whitespace-nowrap text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-border">
                            {loading ? (
                                [...Array(4)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-5 flex items-center gap-4">
                                            <div className="w-12 h-12 bg-muted rounded-xl"></div>
                                            <div className="h-4 w-48 bg-muted rounded"></div>
                                        </td>
                                        <td className="px-6 py-5"><div className="h-4 w-24 bg-muted rounded"></div></td>
                                        <td className="px-6 py-5"><div className="h-4 w-16 bg-muted rounded mx-auto"></div></td>
                                        <td className="px-6 py-5"><div className="h-6 w-20 bg-muted rounded-full"></div></td>
                                        <td className="px-6 py-5"><div className="h-4 w-24 bg-muted rounded"></div></td>
                                        <td className="px-6 py-5 flex justify-end"><div className="h-8 w-16 bg-muted rounded-lg"></div></td>
                                    </tr>
                                ))
                            ) : filteredBlogs.length > 0 ? (
                                filteredBlogs.map((blog) => {
                                    const imageUrl = blog.featuredImage?.thumbUrl || blog.featuredImage?.originalUrl;

                                    return (
                                        <tr key={blog.id} className="hover:bg-muted/10 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-muted overflow-hidden flex items-center justify-center shrink-0 border border-border/50">
                                                        {imageUrl ? (
                                                            <img src={imageUrl} alt={blog.title} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <ImageIcon className="w-5 h-5 text-muted-foreground/50" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-heading text-sm line-clamp-1 max-w-[250px]">{blog.title}</span>
                                                        <span className="text-xs font-medium text-muted-foreground block mt-0.5">/{blog.slug}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-bold text-muted-foreground whitespace-nowrap">
                                                    {blog.category?.name || "Uncategorized"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-1 text-muted-foreground">
                                                    <Eye className="w-3.5 h-3.5" />
                                                    <span className="text-sm font-bold">{blog.views}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${blog.isPublished ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                                    }`}>
                                                    {blog.isPublished ? "PUBLISHED" : "DRAFT"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-muted-foreground whitespace-nowrap">
                                                {formatDate(blog.createdAt)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Link href={`/blogs/${blog.slug}`} target="_blank" className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-heading transition-colors" title="View Article">
                                                        <ExternalLink className="w-4 h-4" />
                                                    </Link>
                                                    <Link href={`/dashboard/super-admin/blogs/blog/edit/${blog.slug}`} className="w-8 h-8 rounded-lg flex items-center justify-center text-blue-500 hover:bg-blue-500/10 transition-colors" title="Edit Article">
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                    <button onClick={() => handleDelete(blog.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-500/10 transition-colors" title="Delete Article">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                                            <FileText className="w-8 h-8 mb-4 opacity-50" />
                                            <h3 className="text-lg font-black text-heading uppercase tracking-tight mb-1">No Blogs Found</h3>
                                            <p className="text-sm font-medium max-w-sm">Start writing your first post to see it here.</p>
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