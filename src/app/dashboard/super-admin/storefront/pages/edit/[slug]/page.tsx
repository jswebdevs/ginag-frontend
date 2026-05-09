"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import api from "@/lib/axios";
import PageCreationForm from "../../_components/PageCreationForm";

export default function EditStorefrontPage() {
    const params = useParams();
    const [initialData, setInitialData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Prevent fetching if slug is missing
        if (!params.slug) return;

        // Fetch the existing page by its slug
        api.get(`/pages/${params.slug}`)
            .then((res) => {
                setInitialData(res.data.data);
            })
            .catch((err) => {
                console.error("Error fetching page:", err);
            })
            .finally(() => setLoading(false));
    }, [params.slug]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-primary">
                <Loader2 className="w-10 h-10 animate-spin mb-4" />
                <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">Loading Page Data...</p>
            </div>
        );
    }

    if (!initialData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <h2 className="text-2xl font-black text-heading uppercase tracking-tighter mb-2">Page Not Found</h2>
                <p className="text-muted-foreground font-medium">The page you are trying to edit does not exist.</p>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl md:text-3xl font-black text-heading uppercase">
                    Edit <span className="text-primary italic">Page</span>
                </h1>
                <p className="text-muted-foreground text-sm font-medium mt-1">
                    Update your dynamic layout blocks for <span className="font-bold">/{initialData.slug}</span>
                </p>
            </div>

            {/* key forces full remount when switching between different pages */}
            <PageCreationForm key={initialData.id} initialData={initialData} />
        </div>
    );
}