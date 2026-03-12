import BlogCategoryForm from "@/components/dashboard/shared/blogs/BlogCategoryForm";

export default function CreateCategoryPage() {
    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-black text-heading uppercase tracking-tight">Create <span className="text-primary italic">Category</span></h1>
            </div>
            <BlogCategoryForm />
        </div>
    );
}