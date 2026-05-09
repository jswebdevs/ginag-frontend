"use client";

import Link from "next/link";
import { ClipboardList, Sparkles } from "lucide-react";

const formatRange = (min: number | null, max: number | null) => {
  if (min == null && max == null) return null;
  if (min != null && max != null && min !== max) return `$${min.toLocaleString()} – $${max.toLocaleString()}`;
  const v = (min ?? max)!;
  return `$${v.toLocaleString()}`;
};

export default function ProductInfo({ product }: { product: any }) {
  const min = product?.priceMin != null ? Number(product.priceMin) : null;
  const max = product?.priceMax != null ? Number(product.priceMax) : null;
  const priceLabel = formatRange(min, max);

  const renderShortDesc = () => {
    if (!product.shortDesc) return null;
    const lines = product.shortDesc.split('\n').filter((line: string) => line.trim() !== '');

    if (lines.length > 1) {
      return (
        <ul className="space-y-2 mb-8">
          {lines.map((line: string, i: number) => (
            <li key={i} className="flex items-start gap-2 text-sm sm:text-base text-subheading">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <span>{line.replace(/^-\s*/, '')}</span>
            </li>
          ))}
        </ul>
      );
    }
    return <p className="text-sm sm:text-base text-subheading mb-8 leading-relaxed">{product.shortDesc}</p>;
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-heading leading-[1.1] mb-4 tracking-tight uppercase">
        {product.name}
      </h1>

      <div className="flex flex-wrap items-end gap-3 sm:gap-4 mb-6 bg-muted/20 p-4 rounded-2xl border border-border">
        {priceLabel ? (
          <div className="flex flex-col gap-1">
            <span className="text-4xl font-black text-primary tracking-tight">{priceLabel}</span>
            <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
              {min != null && max != null && min !== max ? 'Range pricing — final price varies by choice' : 'Per piece'}
            </span>
            {product.priceNote && (
              <span className="text-xs text-muted-foreground italic mt-1">{product.priceNote}</span>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <span className="inline-flex items-center gap-2 text-amber-600 bg-amber-500/10 px-3 py-1 rounded-lg text-[11px] font-black uppercase tracking-widest w-fit">
              <Sparkles className="w-3.5 h-3.5" /> Custom
            </span>
            <span className="text-2xl sm:text-3xl font-black text-heading">
              {product.priceNote || 'Quote on request'}
            </span>
            <span className="text-xs text-muted-foreground">Made just for you — submit the order form to confirm.</span>
          </div>
        )}
      </div>

      {renderShortDesc()}

      <div className="w-full h-px bg-border mb-8"></div>

      {/* In Stock pill (always — catalog model has no stock counting) */}
      <div className="mb-6">
        <span className="inline-flex items-center gap-2 text-green-600 bg-green-500/10 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> In Stock
        </span>
      </div>

      <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 mb-10">
        <Link
          href="/order-now"
          className="flex-grow h-14 flex items-center justify-center gap-3 bg-primary text-primary-foreground font-black uppercase tracking-widest text-sm rounded-2xl hover:shadow-theme-lg hover:-translate-y-1 transition-all"
        >
          <ClipboardList className="w-5 h-5" /> Order Now
        </Link>
      </div>
    </div>
  );
}
