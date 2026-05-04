import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/getSettings";
import AboutTemplate from "@/components/templates/AboutTemplate";
import PageLoader from "@/components/shared/PageLoader";

export async function generateMetadata(): Promise<Metadata> {
    const page = await getPageBySlug("about-us");
    return {
        title: page?.metaTitle || page?.title || "About Us",
        description: page?.metaDescription || "Learn about our handmade bag charm shop and our story.",
    };
}

async function AboutContent() {
    const page = await getPageBySlug("about-us");
    if (!page) notFound();
    return <AboutTemplate data={page} />;
}

export default function AboutUsPage() {
    return (
        <Suspense fallback={<PageLoader label="Loading About Us..." />}>
            <AboutContent />
        </Suspense>
    );
}
