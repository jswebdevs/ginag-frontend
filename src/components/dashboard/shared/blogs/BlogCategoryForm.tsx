"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import api from "@/lib/axios";
import Swal from "sweetalert2";

interface BlogCategoryFormProps {
    initialData?: any;
}

export default function BlogCategoryForm({ initialData }: BlogCategoryFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState(initialData?.name || "");
    const [slug, setSlug] = useState(initialData?.slug || "");
    const [description, setDescription] = useState(initialData?.description || "");

    const generateSlug = (text: string) => {
        return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = { name, slug: slug || generateSlug(name), description };

            if (initialData?.id) {
                await api.put(`/blog-categories/${initialData.id}`, payload);
                Swal.fire("Updated!", "Category has been updated.", "success");
            } else {
                await api.post("/blog-categories", payload);
                Swal.fire("Created!", "New category created.", "success");
            }

            router.push("/dashboard/super-admin/blogs/blog-category");
            router.refresh();
        } catch (error: any) {
            Swal.fire("Error", error.response?.data?.message || "Something went wrong", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Top Bar Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-card p-4 rounded-2xl border border-border shadow-sm gap-4">
                <button type="button" onClick={() => router.back()} className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                    type="submit"
                    disabled={loading || !name}
                    className="w-full sm:w-auto bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-opacity flex justify-center items-center gap-2 shadow-theme-md disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {initialData ? "Update Category" : "Save Category"}
                </button>
            </div>

            <div className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-sm space-y-6 max-w-3xl">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Category Name *</label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            if (!initialData) setSlug(generateSlug(e.target.value));
                        }}
                        placeholder="e.g. Technology"
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">URL Slug</label>
                    <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(generateSlug(e.target.value))}
                        placeholder="e.g. technology"
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        placeholder="Brief description of this category..."
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                </div>
            </div>
        </form>
    );
}