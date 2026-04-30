"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, BookOpen, ImageIcon } from "lucide-react";
import api from "@/lib/axios";

interface Blog {
    id: string;
    slug: string;
    title: string;
    excerpt?: string;
    featuredImage?: {
        originalUrl: string;
        thumbUrl: string;
    };
    createdAt: string;
    category?: string | { name: string };
}

export default function HomeBlogs() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch only the 3 most recent blogs for the homepage
        api.get("/blogs?limit=3")
            .then((res) => {
                const data = res.data?.data || res.data || [];
                setBlogs(data);
            })
            .catch((err) => console.error("Failed to fetch blogs:", err))
            .finally(() => setLoading(false));
    }, []);

    // Format date helper
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <section className="py-16 md:py-24 bg-background border-t border-border">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                        <div>
                            <div className="h-10 w-48 md:w-64 bg-muted rounded-xl animate-pulse mb-3"></div>
                            <div className="h-5 w-56 md:w-80 bg-muted rounded animate-pulse"></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex flex-col gap-4 animate-pulse">
                                <div className="w-full aspect-[4/3] bg-muted rounded-3xl"></div>
                                <div className="flex gap-2 mt-2">
                                    <div className="h-4 w-20 bg-muted rounded-full"></div>
                                    <div className="h-4 w-24 bg-muted rounded-full"></div>
                                </div>
                                <div className="h-6 w-full bg-muted rounded mt-2"></div>
                                <div className="h-6 w-3/4 bg-muted rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // If no blogs exist yet, hide the section seamlessly
    if (blogs.length === 0) return null;

    return (
        <section className="py-16 md:py-24 bg-background border-t border-border">
            <div className="container mx-auto px-4">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 md:mb-12">
                    <div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-heading uppercase tracking-tighter italic">
                            The <span className="text-primary">Journal</span>
                        </h2>
                        <p className="text-muted-foreground font-medium mt-2 text-sm md:text-base max-w-lg">
                            Expert guides, styling tips, and the latest trends delivered straight from our editors.
                        </p>
                    </div>
                    <Link
                        href="/blogs"
                        title="Read all articles"
                        className="group flex items-center gap-2 text-primary font-black text-xs md:text-sm uppercase tracking-widest hover:opacity-80 transition-all w-fit"
                    >
                        View All Articles
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>

                {/* Editorial Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                    {blogs.map((blog) => {
                        const imageUrl = blog.featuredImage?.originalUrl || blog.featuredImage?.thumbUrl;
                        // Handle if category is a string or a populated object
                        const categoryName = typeof blog.category === 'object' ? blog.category?.name : blog.category;

                        return (
                            <article key={blog.id} className="group flex flex-col">

                                {/* Image Box */}
                                <Link
                                    href={`/blogs/${blog.slug}`}
                                    title={blog.title}
                                    className="block relative w-full aspect-[4/3] rounded-3xl overflow-hidden mb-6 bg-muted/20 shadow-theme-sm"
                                >
                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500 z-10" />

                                    {imageUrl ? (
                                        <Image
                                            src={imageUrl}
                                            alt={blog.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <ImageIcon className="w-12 h-12 text-muted-foreground/30" />
                                        </div>
                                    )}

                                    {/* Floating Category Badge */}
                                    {categoryName && (
                                        <div className="absolute top-4 left-4 z-20 bg-background/90 backdrop-blur-md text-foreground text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-sm">
                                            {categoryName}
                                        </div>
                                    )}
                                </Link>

                                {/* Content */}
                                <div className="flex flex-col flex-1">
                                    <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-4 h-4 text-primary" />
                                            {formatDate(blog.createdAt)}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <BookOpen className="w-4 h-4 text-primary" />
                                            5 Min Read
                                        </div>
                                    </div>

                                    <Link href={`/blogs/${blog.slug}`} title={blog.title} className="block group-hover:text-primary transition-colors">
                                        <h3 className="text-xl md:text-2xl font-black text-heading leading-tight mb-3 line-clamp-2">
                                            {blog.title}
                                        </h3>
                                    </Link>

                                    <p className="text-muted-foreground text-sm md:text-base line-clamp-3 mb-6 flex-1">
                                        {blog.excerpt || "Discover the latest insights, trends, and stories in our newest article update."}
                                    </p>

                                    <Link
                                        href={`/blogs/${blog.slug}`}
                                        title={`Read ${blog.title}`}
                                        className="inline-flex items-center gap-2 text-heading font-black text-xs uppercase tracking-widest hover:text-primary transition-colors mt-auto w-fit pb-1 border-b-2 border-primary/30 hover:border-primary"
                                    >
                                        Read Article
                                    </Link>
                                </div>
                            </article>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}