"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import api from "@/lib/axios";
import BlogCategoryForm from "@/components/dashboard/shared/blogs/BlogCategoryForm";
import { LuLoader } from "react-icons/lu";

type PageProps = {
    params: Promise<{ slug: string }>;
};

export default function EditCategoryPage({ params }: PageProps) {
    // 1. Safely unwrap the Next.js 15 Promise
    const { slug } = use(params);

    const [categoryData, setCategoryData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                // 2. Fetch using your secure Axios instance
                const res = await api.get(`/blog-categories/${slug}`, {
                    headers: {
                        'Cache-Control': 'no-cache', // Bypass cache so you edit the latest data
                        'Pragma': 'no-cache',
                        'Expires': '0',
                    }
                });

                if (res.data && res.data.data) {
                    setCategoryData(res.data.data);
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error("Edit Category Fetch Error:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchCategory();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <LuLoader className="w-8 h-8 animate-spin text-primary" />
                <p className="mt-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest animate-pulse">
                    Loading Category Data...
                </p>
            </div>
        );
    }

    if (error || !categoryData) {
        return notFound();
    }

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            <div className="bg-card p-6 rounded-3xl border border-border shadow-theme-sm">
                <h1 className="text-2xl font-black text-heading uppercase tracking-tight">
                    Edit <span className="text-primary italic">Category</span>
                </h1>
                <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mt-2">
                    Updating: <span className="text-primary">/{categoryData.slug}</span>
                </p>
            </div>

            {/* Pass the dynamically fetched data to your form */}
            <BlogCategoryForm initialData={categoryData} />

        </div>
    );
}