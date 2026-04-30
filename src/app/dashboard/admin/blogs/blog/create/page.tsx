import BlogForm from "@/components/dashboard/shared/blogs/BlogForm";

export default function CreateBlogPage() {
    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-black text-heading uppercase tracking-tight">
                    Write <span className="text-primary italic">Article</span>
                </h1>
                <p className="text-muted-foreground text-sm font-medium mt-1">
                    Publish a new post to your storefront.
                </p>
            </div>

            {/* Renders the empty form */}
            <BlogForm />
        </div>
    );
}