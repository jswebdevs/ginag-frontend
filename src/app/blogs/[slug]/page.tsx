import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, User, Eye, Tag } from "lucide-react";
import api from "@/lib/axios";

// Strict Turbopack / Next.js 15+ Type Definition
type PageProps = {
    params: Promise<{ slug: string }>;
};

export default async function SingleBlogPage({ params }: PageProps) {
    // 1. Await the params
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    try {
        // 2. Fetch the specific blog post from your backend
        const res = await fetch(`${api}/blogs/${slug}`, {
            cache: 'no-store' // Use 'no-store' during dev so edits show up instantly
        });

        if (!res.ok) {
            if (res.status === 404) return notFound();
            throw new Error("Failed to fetch blog post");
        }

        const json = await res.json();
        const blog = json.data;

        if (!blog) return notFound();

        // Safely extract the image URL
        const imageUrl = blog.featuredImage?.originalUrl || blog.featuredImage?.thumbUrl;

        // Format the date beautifully
        const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });

        return (
            <main className="min-h-screen bg-background pb-24">

                {/* Top Navigation Bar */}
                <div className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-40">
                    <div className="max-w-4xl mx-auto px-4 py-4">
                        <Link
                            href="/blogs"
                            className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back to Articles
                        </Link>
                    </div>
                </div>

                <article className="max-w-4xl mx-auto px-4 py-8 md:py-12 space-y-12">

                    {/* 1. Article Header */}
                    <header className="space-y-6 text-center">
                        {blog.category && (
                            <Link
                                href={`/blogs?category=${blog.category.slug}`}
                                className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-colors"
                            >
                                {blog.category.name}
                            </Link>
                        )}

                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-heading leading-[1.1] tracking-tight">
                            {blog.title}
                        </h1>

                        {blog.excerpt && (
                            <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-3xl mx-auto leading-relaxed">
                                {blog.excerpt}
                            </p>
                        )}

                        {/* Meta Data Row */}
                        <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-bold text-muted-foreground pt-4">
                            {blog.author && (
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    <span>{blog.author.fullName || "DreamShop Team"}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <time>{formattedDate}</time>
                            </div>
                            <div className="flex items-center gap-2">
                                <Eye className="w-4 h-4" />
                                <span>{blog.views} Views</span>
                            </div>
                        </div>
                    </header>

                    {/* 2. Featured Image */}
                    {imageUrl && (
                        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden shadow-theme-2xl border border-border">
                            <Image
                                src={imageUrl}
                                alt={blog.title}
                                fill
                                unoptimized // Bypasses Next.js optimization to prevent Supabase timeouts!
                                priority
                                className="object-cover"
                            />
                        </div>
                    )}

                    {/* 3. The Rich Text Content */}
                    {/* We use the Tailwind Typography 'prose' plugin to make the raw HTML look gorgeous automatically */}
                    <div className="bg-card p-6 md:p-12 rounded-3xl border border-border shadow-sm">
                        <div
                            className="prose prose-lg dark:prose-invert max-w-none 
                prose-headings:font-black prose-headings:tracking-tight prose-headings:text-heading
                prose-p:text-muted-foreground prose-p:font-medium prose-p:leading-relaxed
                prose-a:text-primary prose-a:font-bold hover:prose-a:text-primary/80 transition-colors
                prose-img:rounded-2xl prose-img:border prose-img:border-border prose-img:shadow-md
                prose-li:text-muted-foreground prose-li:font-medium
                prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:text-heading prose-blockquote:font-bold"
                            dangerouslySetInnerHTML={{ __html: blog.content }}
                        />
                    </div>

                    {/* 4. Tags Footer */}
                    {blog.tags && blog.tags.length > 0 && (
                        <footer className="pt-8 border-t border-border flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <span className="flex items-center gap-2 text-sm font-black text-heading uppercase tracking-widest">
                                <Tag className="w-4 h-4" /> Tags:
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {blog.tags.map((tag: string) => (
                                    <Link
                                        key={tag}
                                        href={`/blogs?tag=${tag}`}
                                        className="px-4 py-2 rounded-xl bg-muted text-muted-foreground text-xs font-bold hover:bg-primary hover:text-white transition-colors"
                                    >
                                        #{tag}
                                    </Link>
                                ))}
                            </div>
                        </footer>
                    )}

                </article>
            </main>
        );
    } catch (error) {
        console.error("Storefront Single Blog Error:", error);
        return notFound();
    }
}