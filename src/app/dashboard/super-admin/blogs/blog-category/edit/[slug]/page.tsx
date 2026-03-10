import { notFound } from "next/navigation";
import BlogCategoryForm from "@/components/dashboard/shared/blogs/BlogCategoryForm";

export default async function EditCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;

    // Fetch from your backend
    const res = await fetch(`http://localhost:5000/api/v1/blog-categories/${resolvedParams.slug}`, { cache: "no-store" });
    if (!res.ok) return notFound();

    const json = await res.json();

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-black text-heading uppercase tracking-tight">Edit <span className="text-primary italic">Category</span></h1>
            </div>
            <BlogCategoryForm initialData={json.data} />
        </div>
    );
}