import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import AboutTemplate from "@/components/templates/AboutTemplate";
import ProcessTemplate from "@/components/templates/ProcessTemplate";
import FAQTemplate from "@/components/templates/FAQTemplate";
import ContactTemplate from "@/components/templates/ContactTemplate";
import PolicyTemplate from "@/components/templates/PolicyTemplate";
import { getPageBySlug } from "@/lib/getSettings";

export const revalidate = 120;

// Reserved root-level routes — never let /[slug] catch these.
const RESERVED = new Set([
  "products",
  "categories",
  "shop",
  "search",
  "order-now",
  "login",
  "register",
  "dashboard",
  "blogs",
  "cart",
  "wishlist",
  "checkout",
]);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (RESERVED.has(slug)) return { title: "Page Not Found" };

  const page = await getPageBySlug(slug);
  if (!page) return { title: "Page Not Found" };

  const description =
    page.metaDescription ||
    page.content?.find((b: any) => b.type === "rich-text")?.data?.content?.replace(/<[^>]+>/g, "").slice(0, 160) ||
    page.title;

  return {
    title: page.metaTitle || page.title,
    description,
    openGraph: {
      title: page.metaTitle || page.title,
      description,
      type: "article",
      ...(page.featuredImage ? { images: [{ url: page.featuredImage, alt: page.title }] } : {}),
    },
    alternates: { canonical: `/${slug}` },
  };
}

const SplitBlock = ({ data, alignLeft }: { data: any; alignLeft: boolean }) => (
  <section className="py-16 md:py-24 overflow-hidden bg-background">
    <div
      className={`container mx-auto px-4 flex flex-col gap-12 lg:gap-20 items-center ${
        alignLeft ? "md:flex-row" : "md:flex-row-reverse"
      }`}
    >
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

      <div className="w-full md:w-1/2 relative aspect-[4/3] md:aspect-square lg:aspect-[4/3] rounded-3xl overflow-hidden shadow-theme-lg border border-border group">
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
            alt={data.heading || "Section media"}
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

export default async function DynamicStorefrontPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (RESERVED.has(slug)) notFound();

  const pageData = await getPageBySlug(slug);
  if (!pageData || !pageData.content) notFound();

  if (pageData.template === "ABOUT") return <AboutTemplate data={pageData} />;
  if (pageData.template === "PROCESS") return <ProcessTemplate data={pageData} />;
  if (pageData.template === "FAQ") return <FAQTemplate data={pageData} />;
  if (pageData.template === "CONTACT") return <ContactTemplate data={pageData} />;
  if (pageData.template === "POLICY") return <PolicyTemplate data={pageData} />;

  let splitBlockCount = 0;

  return (
    <main className="flex flex-col w-full min-h-screen pb-24 bg-background pt-8 animate-in fade-in duration-500">
      <div className="container mx-auto px-4 pb-8 mb-8 border-b border-border">
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-widest text-muted-foreground/50">
          {pageData.title}
        </h1>
      </div>

      {pageData.content.map((block: any, index: number) => {
        if (block.type === "hero") {
          const alignLeft = splitBlockCount % 2 === 0;
          splitBlockCount++;
          return <SplitBlock key={block.id || index} data={block.data} alignLeft={alignLeft} />;
        }
        if (block.type === "rich-text") {
          return <RichTextBlock key={block.id || index} data={block.data} />;
        }
        return null;
      })}
    </main>
  );
}
