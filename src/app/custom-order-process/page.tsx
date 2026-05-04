import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/getSettings";
import ProcessTemplate from "@/components/templates/ProcessTemplate";

export async function generateMetadata(): Promise<Metadata> {
    const page = await getPageBySlug("custom-order-process");
    return {
        title: page?.metaTitle || page?.title || "Custom Order Process",
        description: page?.metaDescription || "Learn how our custom order process works from start to finish.",
    };
}

export default async function CustomOrderProcessPage() {
    const page = await getPageBySlug("custom-order-process");
    if (!page) notFound();
    return <ProcessTemplate data={page} />;
}
