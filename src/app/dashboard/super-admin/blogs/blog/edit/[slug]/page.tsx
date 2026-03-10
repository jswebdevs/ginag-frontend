import { notFound } from "next/navigation";
import BlogForm from "@/components/dashboard/shared/blogs/BlogForm";

// Strict Turbopack / Next.js 15+ Type Definition
type PageProps = {
    params: Promise<{ slug: string }>;
};

export default async function EditBlogPage({ params }: PageProps) {
    // 1. Await the params first!
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    try {
        // 2. Fetch existing blog data from your API
        const res = await fetch(`http://localhost:5000/api/v1/blogs/${slug}`, {
            cache: "no-store" // Ensures you always get the freshest data when editing
        });

        if (!res.ok) {
            if (res.status === 404) return notFound();
            throw new Error("Failed to fetch blog");
        }

        const json = await res.json();
        const blogData = json.data;

        if (!blogData) return notFound();

        return (
            <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
                <div>
                    <h1 className="text-2xl font-black text-heading uppercase tracking-tight">
                        Edit <span className="text-primary italic">Article</span>
                    </h1>
                    <p className="text-muted-foreground text-sm font-medium mt-1">
                        Updating: <span className="font-bold">/{blogData.slug}</span>
                    </p>
                </div>

                {/* Passes the fetched data into the form to pre-fill it */}
                <BlogForm initialData={blogData} />
            </div>
        );
    } catch (error) {
        console.error("Edit Blog Fetch Error:", error);
        return notFound();
    }
}