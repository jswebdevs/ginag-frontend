"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import api from "@/lib/axios";
import { LuLoader } from "react-icons/lu";

// --- 1. The Alternating Split-Screen Block (Hero) ---
const SplitBlock = ({ data, alignLeft }: { data: any; alignLeft: boolean }) => (
    <section className="py-16 md:py-24 overflow-hidden bg-background">
        <div className={`container mx-auto px-4 flex flex-col gap-12 lg:gap-20 items-center ${alignLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}>

            {/* Text Content Half */}
            <div className="w-full md:w-1/2 space-y-6">
                {data.heading && (
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-heading leading-tight">
                        {data.heading}
                    </h2>
                )}
                {data.subheading && (
                    <p className="text-lg md:text-xl text-muted-foreground font-medium leading-relaxed">
                        {data.subheading}
                    </p>
                )}
            </div>

            {/* Media Half */}
            <div className="w-full md:w-1/2 relative aspect-[4/3] md:aspect-square lg:aspect-[4/3] rounded-3xl overflow-hidden shadow-theme-2xl border border-border group">
                {data.mediaType === "VIDEO" && data.mediaUrl ? (
                    <video
                        src={data.mediaUrl}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : data.mediaUrl ? (
                    <Image
                        src={data.mediaUrl}
                        alt={data.heading || "Section Media"}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground font-bold uppercase tracking-widest text-xs">
                        No Media Selected
                    </div>
                )}
            </div>

        </div>
    </section>
);

// --- 2. The Full-Width Text Block (Rich Text) ---
const RichTextBlock = ({ data }: { data: any }) => (
    <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
            <div
                className="prose prose-lg dark:prose-invert max-w-none 
          prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-headings:text-heading
          prose-p:text-muted-foreground prose-p:font-medium prose-p:leading-relaxed
          prose-a:text-primary prose-a:font-bold hover:prose-a:text-primary/80
          prose-li:text-muted-foreground prose-li:font-medium"
                dangerouslySetInnerHTML={{ __html: data.content }}
            />
        </div>
    </section>
);

// --- 3. The Main Client Component ---

type PageProps = {
    params: Promise<{ slug: string }>;
};

export default function DynamicStorefrontPage({ params }: PageProps) {
    // 1. Unwrap the Next.js 15 Promise safely using React.use()
    const { slug } = use(params);

    const [pageData, setPageData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchPageData = async () => {
            try {
                // 2. Fetch using your authenticated Axios instance
                const res = await api.get(`/pages/${slug}`);

                if (res.data && res.data.data) {
                    setPageData(res.data.data);
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error("Failed to fetch dynamic page:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchPageData();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-background">
                <LuLoader className="w-10 h-10 animate-spin text-primary" />
                <p className="mt-4 text-sm font-bold text-muted-foreground uppercase tracking-widest animate-pulse">
                    Loading Page...
                </p>
            </div>
        );
    }

    if (error || !pageData || !pageData.content) {
        return notFound();
    }

    // Variable to track alternating image alignment
    let splitBlockCount = 0;

    return (
        <main className="flex flex-col w-full min-h-screen pb-24 bg-background pt-8 animate-in fade-in duration-500">

            {/* Top Header for Page Title */}
            <div className="container mx-auto px-4 pb-8 mb-8 border-b border-border">
                <h1 className="text-3xl md:text-4xl font-black uppercase tracking-widest text-muted-foreground/50">
                    {pageData.title}
                </h1>
            </div>

            {/* Map through the dynamic blocks */}
            {pageData.content.map((block: any, index: number) => {
                if (block.type === "hero") {
                    // Determine if the image should be on the left (even) or right (odd)
                    const alignLeft = splitBlockCount % 2 === 0;
                    splitBlockCount++;

                    return <SplitBlock key={block.id || index} data={block.data} alignLeft={alignLeft} />;
                }

                if (block.type === "rich-text") {
                    return <RichTextBlock key={block.id || index} data={block.data} />;
                }

                return null; // Ignore unknown block types
            })}
        </main>
    );
}