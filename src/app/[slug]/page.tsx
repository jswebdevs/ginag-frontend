import Image from "next/image";
import { notFound } from "next/navigation";

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
                        unoptimized
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

// --- 3. The Main Server Component ---

// Strict Turbopack / Next.js 15+ Type Definition
type PageProps = {
    params: Promise<{ slug: string }>;
};

// Must be export default async function
export default async function DynamicStorefrontPage({ params }: PageProps) {
    // 1. Await the params first!
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    try {
        // 2. Fetch the page data
        const res = await fetch(`http://localhost:5000/api/v1/pages/${slug}`, {
            cache: 'no-store' // Use 'no-store' so edits show up instantly during development
        });

        if (!res.ok) {
            if (res.status === 404) return notFound();
            throw new Error(`Failed to fetch page: ${res.statusText}`);
        }

        const json = await res.json();
        const pageData = json.data;

        if (!pageData || !pageData.content) return notFound();

        // Variable to track alternating image alignment
        let splitBlockCount = 0;

        return (
            <main className="flex flex-col w-full min-h-screen pb-24 bg-background pt-8">

                {/* Optional: Add a top header for the page title itself */}
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
                        splitBlockCount++; // Increment only for split blocks

                        return <SplitBlock key={block.id || index} data={block.data} alignLeft={alignLeft} />;
                    }

                    if (block.type === "rich-text") {
                        return <RichTextBlock key={block.id || index} data={block.data} />;
                    }

                    return null; // Ignore unknown block types
                })}
            </main>
        );
    } catch (error) {
        console.error("Storefront Page Fetch Error:", error);
        return notFound();
    }
}