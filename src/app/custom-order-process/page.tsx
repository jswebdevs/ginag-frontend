import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/getSettings";
import ProcessTemplate from "@/components/templates/ProcessTemplate";
import PageLoader from "@/components/shared/PageLoader";

export async function generateMetadata(): Promise<Metadata> {
    const page = await getPageBySlug("custom-order-process");
    return {
        title: page?.metaTitle || page?.title || "Custom Order Process",
        description: page?.metaDescription || "Learn how our custom order process works step by step.",
    };
}

async function ProcessContent() {
    const page = await getPageBySlug("custom-order-process");
    if (!page) notFound();
    return <ProcessTemplate data={page} />;
}

export default function CustomOrderProcessPage() {
    return (
        <Suspense fallback={<PageLoader label="Loading Custom Order Process..." />}>
            <ProcessContent />
        </Suspense>
    );
}
