import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/getSettings";
import ExchangePolicyTemplate from "@/components/templates/ExchangePolicyTemplate";

export async function generateMetadata(): Promise<Metadata> {
    const page = await getPageBySlug("exchange-policy");
    return {
        title: page?.metaTitle || page?.title || "Exchange Policy",
        description: page?.metaDescription || "Our exchange policy for damaged or incorrect handmade orders.",
    };
}

export default async function ExchangePolicyPage() {
    const page = await getPageBySlug("exchange-policy");
    if (!page) notFound();
    return <ExchangePolicyTemplate data={page} />;
}
