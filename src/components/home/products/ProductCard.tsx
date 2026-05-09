import Image from "next/image";
import Link from "next/link";
import { Layers, ArrowUpRight, ClipboardList } from "lucide-react";

interface ProductCardProps {
  product: any;
}

const formatRange = (min: number | null, max: number | null) => {
  if (min == null && max == null) return null;
  if (min != null && max != null && min !== max) return `$${min.toLocaleString()} – $${max.toLocaleString()}`;
  const v = (min ?? max)!;
  return `$${v.toLocaleString()}`;
};

// Pure server component now — no client JS, no framer-motion. Animation handled by Tailwind.
export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.featuredImage?.originalUrl;
  const material = product.material;

  const min = product.priceMin != null ? Number(product.priceMin) : null;
  const max = product.priceMax != null ? Number(product.priceMax) : null;
  const priceLabel = formatRange(min, max);

  return (
    <article
      className="group relative bg-card border border-border rounded-[2rem] overflow-hidden hover:border-primary/40 transition-all duration-500 w-full animate-in fade-in slide-in-from-bottom-3 duration-400"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-muted/20">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30">
            <Layers className="w-20 h-20" />
          </div>
        )}

        {material && (
          <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-background/70 backdrop-blur-md border border-border rounded-full">
            <span className="text-[10px] font-bold text-foreground/80 uppercase tracking-tighter">
              {material}
            </span>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black/90 to-transparent flex gap-3">
          <Link
            href={`/products/${product.slug}`}
            className="flex-1 bg-background text-foreground py-3 rounded-full font-bold text-[10px] flex items-center justify-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors tracking-widest"
          >
            DISCOVER DETAILS
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="p-8 space-y-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {product.tags?.slice(0, 2).map((tag: string) => (
                <span key={tag} className="text-[8px] text-muted-foreground border border-border px-1.5 py-0.5 rounded uppercase">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <h3 className="text-xl font-bold text-foreground tracking-tight leading-tight group-hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
        </div>

        <div className="flex items-end justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-primary">
              {priceLabel || product.priceNote || 'Quote on request'}
            </span>
            <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-medium">
              {priceLabel ? 'Range pricing' : 'Custom quote'}
            </span>
          </div>

          <Link
            href="/order-now"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-black uppercase tracking-tighter hover:scale-105 transition-transform whitespace-nowrap"
          >
            <ClipboardList className="w-3.5 h-3.5" />
            Order Now
          </Link>
        </div>
      </div>

      <div className="absolute top-0 right-0 p-4 pointer-events-none opacity-20">
        <div className="w-8 h-8 border-t border-r border-foreground/40 rounded-tr-lg" />
      </div>
      <div className="absolute bottom-0 left-0 p-4 pointer-events-none opacity-20">
        <div className="w-8 h-8 border-b border-l border-foreground/40 rounded-bl-lg" />
      </div>
    </article>
  );
}
