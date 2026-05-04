import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/getSettings";
import PrivacyPolicyTemplate from "@/components/templates/PrivacyPolicyTemplate";
import PageLoader from "@/components/shared/PageLoader";

export async function generateMetadata(): Promise<Metadata> {
    const page = await getPageBySlug("privacy-policy");
    return {
        title: page?.metaTitle || page?.title || "Privacy Policy",
        description: page?.metaDescription || "How we collect, use, and protect your personal information.",
    };
}

async function PrivacyContent() {
    const page = await getPageBySlug("privacy-policy");
    if (!page) notFound();
    return <PrivacyPolicyTemplate data={page} />;
}

export default function PrivacyPolicyPage() {
    return (
        <Suspense fallback={<PageLoader label="Loading Privacy Policy..." />}>
            <PrivacyContent />
        </Suspense>
    );
}
