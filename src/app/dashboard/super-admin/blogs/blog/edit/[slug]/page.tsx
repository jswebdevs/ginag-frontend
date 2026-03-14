"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import api from "@/lib/axios";
import BlogForm from "@/components/dashboard/shared/blogs/BlogForm";
import { LuLoader } from "react-icons/lu";

// Strict Turbopack / Next.js 15+ Type Definition
type PageProps = {
    params: Promise<{ slug: string }>;
};

export default function EditBlogPage({ params }: PageProps) {
    // 1. Unwrap the Next.js 15 Promise safely
    const { slug } = use(params);

    const [blogData, setBlogData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                // 2. Fetch strictly using your Axios instance
                const res = await api.get(`/blogs/${slug}`, {
                    headers: {
                        'Cache-Control': 'no-cache', // Prevent stale data when editing
                        'Pragma': 'no-cache',
                        'Expires': '0',
                    }
                });

                if (res.data && res.data.data) {
                    setBlogData(res.data.data);
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error("Edit Blog Fetch Error:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <LuLoader className="w-8 h-8 animate-spin text-primary" />
                <p className="mt-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest animate-pulse">
                    Loading Article Data...
                </p>
            </div>
        );
    }

    if (error || !blogData) {
        return notFound();
    }

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            <div className="bg-card p-6 rounded-3xl border border-border shadow-theme-sm">
                <h1 className="text-2xl font-black text-heading uppercase tracking-tight">
                    Edit <span className="text-primary italic">Article</span>
                </h1>
                <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mt-2">
                    Updating: <span className="text-primary">/{blogData.slug}</span>
                </p>
            </div>

            {/* Passes the fetched data into the form to pre-fill it */}
            <BlogForm initialData={blogData} />

        </div>
    );
}