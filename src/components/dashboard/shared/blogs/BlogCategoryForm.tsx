"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import Swal from "sweetalert2";
import { generateAIContent } from "@/services/ai.service";

// 🔥 Use stable static icons from React Icons
import { LuSave, LuArrowLeft, LuLoader, LuSparkles } from "react-icons/lu";

interface BlogCategoryFormProps {
    initialData?: any;
}

export default function BlogCategoryForm({ initialData }: BlogCategoryFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);

    const [name, setName] = useState(initialData?.name || "");
    const [slug, setSlug] = useState(initialData?.slug || "");
    const [description, setDescription] = useState(initialData?.description || "");

    const generateSlug = (text: string) => {
        return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    };

    // --- AI GENERATION: DESCRIPTION ---
    const generateDescription = async () => {
        if (!name) {
            return Swal.fire({
                icon: "warning",
                title: "Name Required",
                text: "Please enter a category name first.",
                background: 'hsl(var(--card))',
                color: 'hsl(var(--foreground))'
            });
        }

        setIsGeneratingDesc(true);
        const prompt = `Write a professional, SEO-friendly 2-sentence description for a blog category named "${name}". Return ONLY the description text.`;

        try {
            const aiResponse = await generateAIContent(prompt, "You are an expert blog copywriter and SEO specialist.");
            if (aiResponse) {
                setDescription(aiResponse.trim());
            }
        } catch (err: any) {
            console.error("AI Description Error:", err);
            Swal.fire({
                icon: "error",
                title: "Generation Failed",
                text: "Could not generate description at this time.",
                background: 'hsl(var(--card))',
                color: 'hsl(var(--foreground))'
            });
        } finally {
            setIsGeneratingDesc(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = { name, slug: slug || generateSlug(name), description };

            if (initialData?.id) {
                await api.put(`/blog-categories/${initialData.id}`, payload);
                Swal.fire({ icon: "success", title: "Updated", toast: true, position: 'top-end', timer: 2000, showConfirmButton: false });
            } else {
                await api.post("/blog-categories", payload);
                Swal.fire({ icon: "success", title: "Created", toast: true, position: 'top-end', timer: 2000, showConfirmButton: false });
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
        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Top Bar Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-card p-4 rounded-3xl border border-border shadow-theme-sm gap-4">
                <button type="button" onClick={() => router.back()} className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors px-2">
                    <LuArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                    type="submit"
                    disabled={loading || !name}
                    className="w-full sm:w-auto bg-primary text-primary-foreground px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-opacity flex justify-center items-center gap-2 shadow-theme-md disabled:opacity-50"
                >
                    {loading ? <LuLoader className="w-4 h-4 animate-spin" /> : <LuSave className="w-4 h-4" />}
                    {initialData ? "Update Category" : "Save Category"}
                </button>
            </div>

            <div className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-theme-sm space-y-6 max-w-3xl">

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Category Name *</label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            if (!initialData) setSlug(generateSlug(e.target.value));
                        }}
                        placeholder="e.g. Technology"
                        className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">URL Slug</label>
                    <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(generateSlug(e.target.value))}
                        placeholder="e.g. technology"
                        className="w-full bg-background border border-border rounded-2xl px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between ml-1">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Description</label>
                        <button
                            type="button"
                            onClick={generateDescription}
                            disabled={isGeneratingDesc}
                            className="flex items-center gap-1.5 text-[10px] font-black text-primary uppercase tracking-widest hover:opacity-70 disabled:opacity-50 transition-all"
                        >
                            {isGeneratingDesc ? <LuLoader className="w-3 h-3 animate-spin" /> : <LuSparkles className="w-3 h-3" />}
                            AI Description
                        </button>
                    </div>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        placeholder="Brief description of this category..."
                        className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none transition-all leading-relaxed"
                    />
                </div>

            </div>
        </form>
    );
}