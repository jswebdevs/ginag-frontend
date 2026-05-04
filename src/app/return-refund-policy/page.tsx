import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/getSettings";
import ReturnRefundTemplate from "@/components/templates/ReturnRefundTemplate";

export async function generateMetadata(): Promise<Metadata> {
    const page = await getPageBySlug("return-refund-policy");
    return {
        title: page?.metaTitle || page?.title || "Return & Refund Policy",
        description: page?.metaDescription || "Our return and refund policy for handmade custom products.",
    };
}

export default async function ReturnRefundPolicyPage() {
    const page = await getPageBySlug("return-refund-policy");
    if (!page) notFound();
    return <ReturnRefundTemplate data={page} />;
}
