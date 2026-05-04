import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPageBySlug, getGlobalSettings } from "@/lib/getSettings";
import ContactTemplate from "@/components/templates/ContactTemplate";
import PageLoader from "@/components/shared/PageLoader";

export async function generateMetadata(): Promise<Metadata> {
    const page = await getPageBySlug("contact-us");
    return {
        title: page?.metaTitle || page?.title || "Contact Us",
        description: page?.metaDescription || "Get in touch with us for custom orders and inquiries.",
    };
}

async function ContactContent() {
    const [page, settings] = await Promise.all([
        getPageBySlug("contact-us"),
        getGlobalSettings(),
    ]);
    if (!page) notFound();
    return <ContactTemplate data={page} settings={settings} />;
}

export default function ContactPage() {
    return (
        <Suspense fallback={<PageLoader label="Loading Contact Us..." />}>
            <ContactContent />
        </Suspense>
    );
}
