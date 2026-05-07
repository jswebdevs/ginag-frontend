import Image from "next/image";
import { Heart } from "lucide-react";

const GOLD = "#d4af37";

interface HeroData {
  imageUrl?: string | null;
  bottomImageUrl?: string | null;
}

// Top-left gold-dust cluster — heart sits above the swarm.
const TOP_LEFT_DOTS: Array<{ top: string; left: string; size: number; delay: string }> = [
  { top: "10px", left: "12px", size: 3,   delay: "0s"   },
  { top: "26px", left: "26px", size: 1.5, delay: "0.4s" },
  { top: "16px", left: "46px", size: 2,   delay: "0.8s" },
  { top: "36px", left: "14px", size: 1,   delay: "1.2s" },
  { top: "44px", left: "34px", size: 2,   delay: "0.6s" },
  { top: "30px", left: "66px", size: 1,   delay: "1.0s" },
  { top: "56px", left: "20px", size: 2.5, delay: "0.2s" },
  { top: "52px", left: "52px", size: 1.5, delay: "1.4s" },
  { top: "66px", left: "38px", size: 1,   delay: "1.7s" },
  { top: "74px", left: "12px", size: 1.5, delay: "0.9s" },
  { top: "20px", left: "82px", size: 1,   delay: "1.5s" },
  { top: "8px",  left: "60px", size: 1.5, delay: "1.9s" },
  { top: "44px", left: "78px", size: 1,   delay: "1.1s" },
];

function HeartDivider({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative flex items-center justify-center gap-3 ${className}`}
      aria-hidden="true"
    >
      <span className="h-px flex-1" style={{ background: GOLD, opacity: 0.45 }} />
      <Heart className="w-3 h-3" style={{ color: GOLD, fill: GOLD }} />
      <span className="h-px flex-1" style={{ background: GOLD, opacity: 0.45 }} />
    </div>
  );
}

function DiamondDivider({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative flex items-center justify-center gap-3 ${className}`}
      aria-hidden="true"
    >
      <span className="h-px flex-1" style={{ background: GOLD, opacity: 0.45 }} />
      <span className="text-[11px] leading-none tracking-normal" style={{ color: GOLD }}>
        ◆
      </span>
      <span className="h-px flex-1" style={{ background: GOLD, opacity: 0.45 }} />
    </div>
  );
}

export default function OrderHero({ hero }: { hero: HeroData }) {
  return (
    <section className="relative bg-black text-white overflow-hidden flex flex-col justify-around p-2">
      {/* S-1 — top-left love icon + gold-dust cluster */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <Heart
          className="absolute top-2 left-2.5 w-6 h-6 animate-float-slow"
          style={{ color: GOLD, fill: GOLD }}
          aria-hidden="true"
        />
        {TOP_LEFT_DOTS.map((s, i) => (
          <span
            key={`tl-${i}`}
            className="absolute rounded-full animate-twinkle"
            style={{
              top: s.top,
              left: s.left,
              width: `${s.size}px`,
              height: `${s.size}px`,
              background: GOLD,
              boxShadow: `0 0 ${s.size * 2.5}px ${GOLD}`,
              animationDelay: s.delay,
            }}
          />
        ))}
      </div>

      {/* S-2 — central content: logo, PURSE DECOR, diamond, tagline, cursive, heart divider */}
      <div className="relative z-10 flex flex-col items-center text-center px-3 pt-3">
        {/* Logo: full width, height auto — preserves aspect ratio at the column's width */}
        {hero.imageUrl ? (
          <Image
            src={hero.imageUrl}
            alt="GinaG Purse Decor"
            width={800}
            height={300}
            sizes="(max-width: 768px) 100vw, 400px"
            className="w-full h-auto max-h-44 object-contain"
            priority
          />
        ) : (
          <h1
            className="text-5xl md:text-6xl italic font-black tracking-tight"
            style={{ color: GOLD, fontFamily: "'Brush Script MT', cursive" }}
          >
            GinaG
          </h1>
        )}

        {/* PURSE DECOR — gold */}
        <p
          className="mt-2 text-xl md:text-2xl font-black uppercase tracking-[0.3em]"
          style={{ color: GOLD, fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
        >
          Purse Decor
        </p>

        {/* Diamond divider */}
        <DiamondDivider className="mt-2 w-full max-w-[260px]" />

        {/* CUSTOM CHARMS. TIMELESS STYLE. — gold */}
        <p
          className="mt-2 text-[11px] md:text-sm font-black uppercase tracking-[0.18em]"
          style={{ color: GOLD }}
        >
          Custom Charms. Timeless Style.
        </p>

        {/* Decorate. Personalize. Shine. — cursive, white */}
        <p
          className="mt-1 text-lg md:text-xl italic text-white"
          style={{ fontFamily: "'Brush Script MT', 'Pinyon Script', cursive" }}
        >
          Decorate. Personalize. Shine.
        </p>

        {/* Heart divider */}
        <HeartDivider className="mt-2 w-full max-w-[260px]" />
      </div>

      {/* S-3 — bottom: image as background on left, To order + badge stacked on right (allowed to overlap the image) */}
      <div className="relative flex-1 mt-2 min-h-[260px]">
        {/* Bottom image — full height, 60% width, anchored at bottom-left, with a soft radial mask that fades the top and right edges into the black background */}
        {hero.bottomImageUrl && (
          <div
            className="absolute left-0 bottom-0 w-[60%] h-full z-0"
            style={{
              WebkitMaskImage:
                "radial-gradient(ellipse 110% 110% at 0% 100%, black 55%, transparent 100%)",
              maskImage:
                "radial-gradient(ellipse 110% 110% at 0% 100%, black 55%, transparent 100%)",
            }}
          >
            <Image
              src={hero.bottomImageUrl}
              alt=""
              fill
              sizes="(max-width: 768px) 60vw, 250px"
              className="object-cover object-left-bottom"
            />
          </div>
        )}

        {/* Right column — z-10 above the image so they can overlap. Centered vertically with a wider gap between blocks. */}
        <div className="relative z-10 h-full flex flex-col items-end justify-center gap-8 md:gap-10 pr-3">
          {/* Row 1: To order + contact */}
          <div className="text-center max-w-[60%]">
            <p
              className="text-4xl md:text-5xl italic font-black mb-2 leading-none"
              style={{ color: GOLD, fontFamily: "'Brush Script MT', 'Pinyon Script', cursive" }}
            >
              To order
            </p>
            <div className="text-sm md:text-lg text-white/90 leading-snug space-y-1">
              <a href="tel:6152022317" className="block hover:underline">
                Text or call 615-202-2317
              </a>
              <a href="mailto:alexgreeng@att.net" className="block hover:underline">
                or email alexgreeng@att.net
              </a>
            </div>
          </div>

          {/* Row 2: Badge — bigger, double gold border (outer 5px, inner 2px), bg at 60% opacity */}
          <div
            className="relative shrink-0 rounded-full p-1.5"
            style={{ border: `5px solid ${GOLD}` }}
          >
            <div
              className="w-28 h-28 md:w-36 md:h-36 rounded-full border-2 flex items-center justify-center text-center px-3 bg-black/60"
              style={{ borderColor: GOLD, color: GOLD }}
            >
              <p
                className="text-[10px] md:text-[11px] font-black uppercase leading-tight tracking-[0.08em]"
                style={{ fontFamily: "serif" }}
              >
                Custom Purse Decor Made Just For You!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
