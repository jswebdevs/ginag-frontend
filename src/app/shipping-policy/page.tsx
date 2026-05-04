import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/getSettings";
import ShippingPolicyTemplate from "@/components/templates/ShippingPolicyTemplate";

export async function generateMetadata(): Promise<Metadata> {
    const page = await getPageBySlug("shipping-policy");
    return {
        title: page?.metaTitle || page?.title || "Shipping Policy",
        description: page?.metaDescription || "Delivery times, processing, and shipping information.",
    };
}

export default async function ShippingPolicyPage() {
    const page = await getPageBySlug("shipping-policy");
    if (!page) notFound();
    return <ShippingPolicyTemplate data={page} />;
}
