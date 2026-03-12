import Link from "next/link";
import { Plus } from "lucide-react";
import BlogTable from "@/components/dashboard/shared/blogs/BlogTable";

export default function BlogDashboard() {
    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">

            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-heading uppercase tracking-tight">
                        Storefront <span className="text-primary italic">Blogs</span>
                    </h1>
                    <p className="text-muted-foreground text-sm font-medium mt-1">
                        Manage your articles, news, and SEO-optimized publications.
                    </p>
                </div>

                <Link
                    href="/dashboard/super-admin/blogs/blog/create"
                    className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-theme-md w-full sm:w-auto"
                >
                    <Plus className="w-4 h-4" /> Add New Blog
                </Link>
            </div>

            {/* The Data Table */}
            <BlogTable />

        </div>
    );
}