"use client";

import Image from "next/image";
import { Phone, Mail, Sparkles } from "lucide-react";

interface GinaGHeroProps {
  heroConfig?: any;
}

// Brand-card hero — black + gold aesthetic. The image is the full brand
// artwork (e.g. wordmark + charm icons); text and contact lines are stacked
// below for accessibility/SEO. Everything below is admin-editable from
// /dashboard/super-admin/storefront/homepage.
export default function GinaGHero({ heroConfig = {} }: GinaGHeroProps) {
  const headline =
    heroConfig.headline || "PURSE CHARMS AND CHAINS";
  const subheadline =
    heroConfig.subheadline || "GINA ALEXANDER-GREENLEE";
  const tagline =
    heroConfig.tagline ||
    "Handmade custom charms, designed just for you.";
  const imageUrl = heroConfig.imageUrl || "";
  const brandName = heroConfig.brandName || "GinaG";
  const contactPhone = heroConfig.contactPhone || "";
  const contactEmail = heroConfig.contactEmail || "";

  // Telephone link strips non-digits. Empty if no number is configured.
  const telHref = contactPhone ? `tel:${contactPhone.replace(/[^\d+]/g, "")}` : "+615-202-2317";
  const mailHref = contactEmail ? `mailto:${contactEmail}` : "alexgreeng@att.net";

  console.log(headline);

  return (
    <section
      className="relative w-full min-h-[70vh] flex items-center overflow-hidden bg-[#0a0705]"
      aria-label="Hero"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at top, #1a1105 0%, #0a0705 60%)",
      }}
    >
      {/* Gold glow accents */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[60vh] bg-amber-500/[0.08] rounded-full blur-[140px]" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-500/[0.05] rounded-full blur-[100px]" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500/[0.05] rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10 py-20 md:py-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Brand image (LCP candidate — no opacity animation).
              The radial mask softly fades the image edges into the section
              background so it blends instead of sitting on a hard rectangle. */}
          <div
            className="relative mx-auto w-full max-w-3xl aspect-[16/9] sm:aspect-[2/1] mb-8"
            style={{
              WebkitMaskImage:
                "radial-gradient(ellipse at center, #000 55%, rgba(0,0,0,0.85) 70%, rgba(0,0,0,0.4) 85%, transparent 100%)",
              maskImage:
                "radial-gradient(ellipse at center, #000 55%, rgba(0,0,0,0.85) 70%, rgba(0,0,0,0.4) 85%, transparent 100%)",
            }}
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={`${brandName} — ${headline}`}
                fill
                priority
                sizes="(max-width: 640px) 100vw, 768px"
                className="object-contain"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 border border-amber-500/20 rounded-3xl">
                <Sparkles
                  className="w-12 h-12 text-amber-500/40"
                  aria-hidden="true"
                />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500/50">
                  Add hero image in admin
                </p>
                <p className="text-5xl font-black text-amber-400 tracking-tight italic">
                  {brandName}
                </p>
              </div>
            )}
          </div>


          {/* Headline (LCP) */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-[0.05em] uppercase mb-3">
            {headline}
          </h1>

          {/* Subheadline — "GINA ALEXANDER-GREENLEE" */}
          {subheadline && (
            <p className="text-sm md:text-base font-bold text-amber-300/90 uppercase tracking-[0.3em] mb-3">
              {subheadline}
            </p>
          )}
           {/* Contact lines — phone + email rendered if configured */}
          {(contactPhone || contactEmail) && (
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-amber-200/80 mb-8">
              {contactPhone && (
                <a
                  href={telHref}
                  className="inline-flex items-center gap-2 hover:text-amber-300 transition-colors"
                  aria-label={`Call ${contactPhone}`}
                >
                  <Phone className="w-4 h-4" aria-hidden="true" />
                  <span className="font-bold tracking-wider">{contactPhone}</span>
                </a>
              )}
              {contactEmail && (
                <a
                  href={mailHref}
                  className="inline-flex items-center gap-2 hover:text-amber-300 transition-colors"
                  aria-label={`Email ${contactEmail}`}
                >
                  <Mail className="w-4 h-4" aria-hidden="true" />
                  <span className="font-bold tracking-wider">{contactEmail}</span>
                </a>
              )}
            </div>
          )}

          {/* Tagline */}
          {tagline && (
            <p className="text-sm md:text-base text-white/70 max-w-xl mx-auto leading-relaxed mb-6">
              {tagline}
            </p>
          )}

         


        </div>
      </div>
    </section>
  );
}
