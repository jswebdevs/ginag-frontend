import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, ChevronLeft, ChevronRight, User, Hash } from "lucide-react";

// Strict Next.js 15+ Type Definition
type PageProps = {
    searchParams: Promise<{ page?: string; category?: string }>;
};

async function getBlogs(page: number, category?: string) {
    const query = new URLSearchParams({
        page: page.toString(),
        limit: "9",
        isPublished: "true",
    });
    if (category) query.append("category", category);

    const res = await fetch(`http://localhost:5000/api/v1/blogs?${query.toString()}`, {
        cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
}

async function getCategories() {
    const res = await fetch("http://localhost:5000/api/v1/blog-categories", { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
}

export default async function BlogIndexPage({ searchParams }: PageProps) {
    const { page, category } = await searchParams;
    const currentPage = parseInt(page || "1");

    // Fetch data in parallel
    const [blogsData, categories] = await Promise.all([
        getBlogs(currentPage, category),
        getCategories(),
    ]);

    if (!blogsData) return notFound();

    const blogs = blogsData.data;
    const totalPages = Math.ceil(blogsData.total / 9);

    return (
        <div className="min-h-screen bg-background pb-24 pt-12">
            <div className="container mx-auto px-4 space-y-12">

                {/* 1. Header Section */}
                <header className="max-w-3xl space-y-4">
                    <h1 className="text-4xl md:text-6xl font-black text-heading uppercase tracking-tighter">
                        The <span className="text-primary italic">Dream</span> Journal
                    </h1>
                    <p className="text-lg text-muted-foreground font-medium">
                        Insights, guides, and stories from the forefront of modern e-commerce and lifestyle.
                    </p>
                </header>

                {/* 2. Category Filter Bar */}
                <nav className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar border-b border-border">
                    <Link
                        href="/blogs"
                        className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${!category ? "bg-primary text-primary-foreground shadow-theme-md" : "bg-muted text-muted-foreground hover:bg-muted/80"
                            }`}
                    >
                        All Stories
                    </Link>
                    {categories.map((cat: any) => (
                        <Link
                            key={cat.id}
                            href={`/blogs?category=${cat.id}`}
                            className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${category === cat.id ? "bg-primary text-primary-foreground shadow-theme-md" : "bg-muted text-muted-foreground hover:bg-muted/80"
                                }`}
                        >
                            {cat.name}
                        </Link>
                    ))}
                </nav>

                {/* 3. Blog Grid */}
                {blogs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.map((blog: any) => {
                            const imageUrl = blog.featuredImage?.thumbUrl || blog.featuredImage?.originalUrl;
                            return (
                                <Link
                                    key={blog.id}
                                    href={`/blogs/${blog.slug}`}
                                    className="group flex flex-col bg-card border border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-theme-xl hover:-translate-y-1 transition-all duration-300"
                                >
                                    {/* Card Media */}
                                    <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                                        {imageUrl ? (
                                            <Image
                                                src={imageUrl}
                                                alt={blog.title}
                                                fill
                                                unoptimized
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20">
                                                <Hash size={48} />
                                            </div>
                                        )}
                                        {blog.category && (
                                            <div className="absolute top-4 left-4 z-10">
                                                <span className="px-3 py-1 bg-background/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest border border-border shadow-sm">
                                                    {blog.category.name}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-6 flex-1 flex flex-col space-y-4">
                                        <div className="flex items-center gap-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={12} className="text-primary" />
                                                {new Date(blog.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <User size={12} className="text-primary" />
                                                {blog.author?.fullName?.split(' ')[0] || "Team"}
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-black text-heading leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                            {blog.title}
                                        </h3>

                                        <p className="text-sm text-muted-foreground font-medium line-clamp-3 leading-relaxed">
                                            {blog.excerpt || "Dive into the details of this story and discover what makes it a DreamShop favorite."}
                                        </p>

                                        <div className="pt-4 mt-auto">
                                            <span className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2 group-hover:gap-3 transition-all">
                                                Read Full Story <ChevronRight size={14} />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-24 text-center space-y-4">
                        <div className="text-6xl">📭</div>
                        <h3 className="text-2xl font-black uppercase tracking-tight text-heading">No articles found</h3>
                        <p className="text-muted-foreground font-medium max-w-sm mx-auto">
                            We couldn't find any stories in this category yet. Check back soon for fresh content!
                        </p>
                    </div>
                )}

                {/* 4. Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 pt-12">
                        <Link
                            href={`/blogs?page=${currentPage - 1}${category ? `&category=${category}` : ""}`}
                            className={`p-3 rounded-2xl border border-border transition-all ${currentPage <= 1 ? "pointer-events-none opacity-20" : "hover:bg-primary hover:text-white"
                                }`}
                        >
                            <ChevronLeft size={20} />
                        </Link>

                        <div className="text-sm font-black uppercase tracking-widest">
                            Page <span className="text-primary">{currentPage}</span> of {totalPages}
                        </div>

                        <Link
                            href={`/blogs?page=${currentPage + 1}${category ? `&category=${category}` : ""}`}
                            className={`p-3 rounded-2xl border border-border transition-all ${currentPage >= totalPages ? "pointer-events-none opacity-20" : "hover:bg-primary hover:text-white"
                                }`}
                        >
                            <ChevronRight size={20} />
                        </Link>
                    </div>
                )}

            </div>
        </div>
    );
}