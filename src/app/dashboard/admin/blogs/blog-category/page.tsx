import Link from "next/link";
import { Plus } from "lucide-react";
import BlogCategoryTable from "@/components/dashboard/shared/blogs/BlogCategoryTable";

export default function BlogCategoryDashboard() {
    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-heading uppercase tracking-tight">Blog <span className="text-primary italic">Categories</span></h1>
                </div>
                <Link href="/dashboard/admin/blogs/blog-category/create" className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-theme-md w-full sm:w-auto justify-center">
                    <Plus className="w-4 h-4" /> Add Category
                </Link>
            </div>
            <BlogCategoryTable />
        </div>
    );
}