import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/getSettings";
import TermsOfServiceTemplate from "@/components/templates/TermsOfServiceTemplate";
import PageLoader from "@/components/shared/PageLoader";

export async function generateMetadata(): Promise<Metadata> {
    const page = await getPageBySlug("terms-of-service");
    return {
        title: page?.metaTitle || page?.title || "Terms of Service",
        description: page?.metaDescription || "Terms and conditions for using our services.",
    };
}

async function TermsContent() {
    const page = await getPageBySlug("terms-of-service");
    if (!page) notFound();
    return <TermsOfServiceTemplate data={page} />;
}

export default function TermsOfServicePage() {
    return (
        <Suspense fallback={<PageLoader label="Loading Terms of Service..." />}>
            <TermsContent />
        </Suspense>
    );
}
