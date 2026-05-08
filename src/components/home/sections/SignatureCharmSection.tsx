"use client";

import { Sparkles } from "lucide-react";

// Sits directly under the hero. Headline + three editorial paragraphs that
// describe the signature multi-strand charm. The middle paragraph uses a
// bold-emphasis fragment (the brief asks for "<b>handcrafted multi-strand
// purse charm</b>"), which is rendered with a styled <strong> for accessibility.
export default function SignatureCharmSection() {
  return (
    <section
      className="relative w-full bg-[#0a0705] overflow-hidden"
      aria-label="Signature multi-strand charm"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at top, #16100a 0%, #0a0705 70%)",
      }}
    >
      {/* Soft gold glows so the section visually flows from the hero */}
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 -left-32 -translate-y-1/2 w-80 h-80 bg-amber-500/[0.06] rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-amber-500/[0.05] rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 bg-amber-500/10 border border-amber-500/30 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-300">
              Signature Piece
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight uppercase mb-4">
            The Multi-Strand
            <br />
            <span className="text-amber-400 italic font-serif normal-case tracking-wide">
              Statement Charm
            </span>
          </h2>

          {/* Divider */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400/60" />
            <span className="text-amber-400/70 text-xs">✦</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400/60" />
          </div>

          {/* Description — three editorial paragraphs */}
          <div className="space-y-6 text-left sm:text-center text-white/75 text-base md:text-lg leading-relaxed">
            <p>
              Turn your everyday bag into a statement of style with this{" "}
              <strong className="text-amber-300 font-bold">
                handcrafted multi-strand purse charm,
              </strong>{" "}
              designed to add elegance, movement, and personality to your look.
            </p>
            <p>
              These one-of-a-kind pieces flow with intention — bringing together
              sophistication and bold expression in one beautiful accessory.
            </p>
            <p>
              Finished with a durable gold-tone clasp and ring, this charm easily
              attaches to your favorite handbag, tote, or key set — instantly
              elevating your style from simple to standout.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom hairline so the section visually closes */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
    </section>
  );
}
