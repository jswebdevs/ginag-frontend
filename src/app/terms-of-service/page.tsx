import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/getSettings";
import TermsOfServiceTemplate from "@/components/templates/TermsOfServiceTemplate";

export async function generateMetadata(): Promise<Metadata> {
    const page = await getPageBySlug("terms-of-service");
    return {
        title: page?.metaTitle || page?.title || "Terms of Service",
        description: page?.metaDescription || "Terms and conditions for using our services.",
    };
}

export default async function TermsOfServicePage() {
    const page = await getPageBySlug("terms-of-service");
    if (!page) notFound();
    return <TermsOfServiceTemplate data={page} />;
}
