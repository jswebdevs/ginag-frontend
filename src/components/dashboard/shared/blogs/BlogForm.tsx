"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import api from "@/lib/axios";
import Swal from "sweetalert2";
import BlogFormMedia from "./BlogFormMedia";

// 🔥 Use stable static icons from React Icons
import { LuSave, LuArrowLeft, LuLoader, LuX } from "react-icons/lu";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

interface BlogFormProps {
    initialData?: any;
}

export default function BlogForm({ initialData }: BlogFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);

    // Form State
    const [title, setTitle] = useState(initialData?.title || "");
    const [slug, setSlug] = useState(initialData?.slug || "");
    const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
    const [content, setContent] = useState(initialData?.content || "");
    const [categoryId, setCategoryId] = useState(initialData?.categoryId || "");
    const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? true);
    const [featuredImage, setFeaturedImage] = useState<any>(initialData?.featuredImage || null);

    // SEO & Tags State
    const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || "");
    const [metaDesc, setMetaDesc] = useState(initialData?.metaDesc || "");
    const [tags, setTags] = useState<string[]>(initialData?.tags || []);
    const [tagInput, setTagInput] = useState("");

    // React Quill Settings
    const quillModules = {
        toolbar: [
            [{ 'header': [2, 3, 4, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'clean']
        ],
    };
    const quillFormats = ['header', 'bold', 'italic', 'underline', 'strike', 'list', 'align', 'link'];

    useEffect(() => {
        // Fetch categories for the dropdown
        api.get("/blog-categories")
            .then(res => setCategories(res.data.data || []))
            .catch(err => console.error("Failed to load categories:", err));
    }, []);

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const newTag = tagInput.trim().toLowerCase();
            if (newTag && !tags.includes(newTag)) {
                setTags([...tags, newTag]);
            }
            setTagInput("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const generateSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                title,
                slug: slug || generateSlug(title),
                excerpt,
                content,
                categoryId: categoryId || null,
                isPublished,
                featuredImage,
                metaTitle,
                metaDesc,
                tags
            };

            if (initialData?.id) {
                await api.patch(`/blogs/${initialData.id}`, payload);
                Swal.fire({ icon: "success", title: "Updated", toast: true, position: 'top-end', timer: 2000, showConfirmButton: false });
            } else {
                await api.post("/blogs", payload);
                Swal.fire({ icon: "success", title: "Created", toast: true, position: 'top-end', timer: 2000, showConfirmButton: false });
            }

            router.push("/dashboard/super-admin/blogs/blog");
            router.refresh();
        } catch (error: any) {
            Swal.fire("Error", error.response?.data?.message || "Failed to save blog.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Top Action Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-card p-4 rounded-3xl border border-border shadow-theme-sm gap-4 sticky top-4 z-40 backdrop-blur-md bg-card/90">
                <button type="button" onClick={() => router.back()} className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors px-2">
                    <LuArrowLeft className="w-4 h-4" /> Back
                </button>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <select
                        value={isPublished ? "true" : "false"}
                        onChange={(e) => setIsPublished(e.target.value === "true")}
                        className="bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                    >
                        <option value="false">Draft</option>
                        <option value="true">Published</option>
                    </select>
                    <button type="submit" disabled={loading || !title || !content} className="w-full sm:w-auto bg-primary text-primary-foreground px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-opacity flex justify-center items-center gap-2 shadow-theme-md disabled:opacity-50">
                        {loading ? <LuLoader className="w-4 h-4 animate-spin" /> : <LuSave className="w-4 h-4" />}
                        Save Post
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* LEFT COLUMN: Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-theme-sm space-y-6">
                        <h2 className="text-xl font-black text-heading uppercase tracking-tight mb-4 border-b border-border pb-4">Article Content</h2>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Title *</label>
                            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="How to build a SaaS in 2026..." className="w-full bg-background border border-border rounded-2xl px-5 py-4 text-lg font-black focus:outline-none focus:ring-2 focus:ring-primary transition-all" />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Article Body *</label>
                            </div>
                            <div className="rounded-2xl overflow-hidden border border-border pb-10 transition-all focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent
                                [&_.ql-toolbar]:bg-muted/50 [&_.ql-toolbar]:border-border [&_.ql-toolbar]:border-x-0 [&_.ql-toolbar]:border-t-0
                                [&_.ql-container]:border-transparent 
                                [&_.ql-editor]:text-foreground [&_.ql-editor]:min-h-[400px] [&_.ql-editor]:text-base [&_.ql-editor]:leading-relaxed
                                [&_.ql-stroke]:!stroke-foreground [&_.ql-fill]:!fill-foreground"
                            >
                                <ReactQuill theme="snow" value={content} onChange={setContent} modules={quillModules} formats={quillFormats} placeholder="Start writing your masterpiece..." />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Short Excerpt (Teaser)</label>
                            </div>
                            <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} placeholder="A short summary for the blog cards..." className="w-full bg-background border border-border rounded-2xl px-5 py-4 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none transition-all leading-relaxed" />
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Settings & Metadata */}
                <div className="space-y-6">
                    <div className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-theme-sm space-y-6">

                        {/* Featured Image Block */}
                        <BlogFormMedia featuredImage={featuredImage} onChange={setFeaturedImage} />

                        <hr className="border-border/50" />

                        {/* General Settings */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-black text-heading uppercase tracking-tight">Organization</h3>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between ml-1">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Category</label>
                                </div>
                                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all">
                                    <option value="">Select a Category...</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between ml-1">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Tags (Press Enter)</label>
                                </div>
                                <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleAddTag} placeholder="Add a tag..." className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all" />

                                {/* Tag Badges */}
                                {tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {tags.map(tag => (
                                            <span key={tag} className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest animate-in zoom-in">
                                                {tag} <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive transition-colors"><LuX size={12} /></button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <hr className="border-border/50" />

                        {/* SEO Optimization */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-black text-heading uppercase tracking-tight">SEO Details</h3>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">URL Slug</label>
                                <input type="text" value={slug} onChange={(e) => setSlug(generateSlug(e.target.value))} placeholder="auto-generated" className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Meta Title</label>
                                <input type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="SEO Title" className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Meta Description</label>
                                <textarea value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} rows={4} placeholder="SEO Description" className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary resize-none transition-all leading-relaxed" />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </form>
    );
}