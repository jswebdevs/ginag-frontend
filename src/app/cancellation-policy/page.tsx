import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/getSettings";
import CancellationTemplate from "@/components/templates/CancellationTemplate";
import PageLoader from "@/components/shared/PageLoader";

export async function generateMetadata(): Promise<Metadata> {
    const page = await getPageBySlug("cancellation-policy");
    return {
        title: page?.metaTitle || page?.title || "Cancellation Policy",
        description: page?.metaDescription || "Learn about our 6-hour order cancellation window.",
    };
}

async function CancellationContent() {
    const page = await getPageBySlug("cancellation-policy");
    if (!page) notFound();
    return <CancellationTemplate data={page} />;
}

export default function CancellationPolicyPage() {
    return (
        <Suspense fallback={<PageLoader label="Loading Cancellation Policy..." />}>
            <CancellationContent />
        </Suspense>
    );
}
