import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/getSettings";
import ReturnRefundTemplate from "@/components/templates/ReturnRefundTemplate";
import PageLoader from "@/components/shared/PageLoader";

export async function generateMetadata(): Promise<Metadata> {
    const page = await getPageBySlug("return-refund-policy");
    return {
        title: page?.metaTitle || page?.title || "Return & Refund Policy",
        description: page?.metaDescription || "Our return and refund policy for handmade custom products.",
    };
}

async function ReturnRefundContent() {
    const page = await getPageBySlug("return-refund-policy");
    if (!page) notFound();
    return <ReturnRefundTemplate data={page} />;
}

export default function ReturnRefundPolicyPage() {
    return (
        <Suspense fallback={<PageLoader label="Loading Return & Refund Policy..." />}>
            <ReturnRefundContent />
        </Suspense>
    );
}
