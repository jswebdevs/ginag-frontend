import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/getSettings";
import FAQTemplate from "@/components/templates/FAQTemplate";
import PageLoader from "@/components/shared/PageLoader";

export async function generateMetadata(): Promise<Metadata> {
    const page = await getPageBySlug("faq");
    return {
        title: page?.metaTitle || page?.title || "FAQ",
        description: page?.metaDescription || "Frequently asked questions about our handmade products.",
    };
}

async function FAQContent() {
    const page = await getPageBySlug("faq");
    if (!page) notFound();
    return <FAQTemplate data={page} />;
}

export default function FAQPage() {
    return (
        <Suspense fallback={<PageLoader label="Loading FAQ..." />}>
            <FAQContent />
        </Suspense>
    );
}
