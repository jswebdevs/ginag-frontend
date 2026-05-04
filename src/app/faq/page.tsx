import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/getSettings";
import FAQTemplate from "@/components/templates/FAQTemplate";

export async function generateMetadata(): Promise<Metadata> {
    const page = await getPageBySlug("faq");
    return {
        title: page?.metaTitle || page?.title || "FAQ",
        description: page?.metaDescription || "Frequently asked questions about our handmade products.",
    };
}

export default async function FAQPage() {
    const page = await getPageBySlug("faq");
    if (!page) notFound();
    return <FAQTemplate data={page} />;
}
