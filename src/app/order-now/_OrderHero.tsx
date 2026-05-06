import Image from "next/image";

const GOLD = "#d4af37";

interface HeroData {
  title: string;
  subtitle?: string;
  personName?: string;
  phone?: string;
  email?: string;
  badgeText?: string;
  imageUrl?: string | null;
  bottomImageUrl?: string | null;
  instructions?: string;
}

export default function OrderHero({ hero }: { hero: HeroData }) {
  return (
    <section className="relative h-full bg-black text-white overflow-hidden flex flex-col px-6 md:pl-8 md:pr-4 py-6 md:py-8">
      {/* Subtle gold dust corners */}
      <div
        className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
        style={{ background: `radial-gradient(circle at 80% 20%, ${GOLD}33, transparent 60%)` }}
      />
      <div
        className="absolute bottom-0 left-0 w-64 h-64 pointer-events-none"
        style={{ background: `radial-gradient(circle at 20% 80%, ${GOLD}22, transparent 60%)` }}
      />

      {/* TOP: Logo image (or fallback script title) */}
      <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left">
        {hero.imageUrl ? (
          <div className="relative w-48 md:w-64 h-28 md:h-32">
            <Image
              src={hero.imageUrl}
              alt={hero.title}
              fill
              sizes="(max-width: 768px) 192px, 256px"
              className="object-contain object-left"
              priority
            />
          </div>
        ) : (
          <h1
            className="text-5xl md:text-6xl italic font-black tracking-tight"
            style={{ color: GOLD, fontFamily: "'Brush Script MT', cursive" }}
          >
            {hero.title}
          </h1>
        )}

        {hero.subtitle && (
          <p
            className="mt-2 text-xs md:text-sm font-black uppercase tracking-[0.3em] text-white"
          >
            {hero.subtitle}
          </p>
        )}
      </div>

      {/* MIDDLE: Person + contact + "To order" instructions */}
      <div className="relative z-10 flex-1 flex flex-col justify-center text-center md:text-left py-6 md:py-8 space-y-4">
        {hero.personName && (
          <p
            className="text-sm md:text-base font-black uppercase tracking-[0.18em]"
            style={{ color: GOLD }}
          >
            {hero.personName}
          </p>
        )}

        {(hero.phone || hero.email) && (
          <div className="space-y-1">
            {hero.phone && (
              <div
                className="flex items-center justify-center md:justify-start gap-2 text-xs md:text-sm"
                style={{ color: GOLD }}
              >
                <span>✦</span>
                <a href={`tel:${hero.phone.replace(/\s/g, "")}`} className="hover:underline">
                  {hero.phone}
                </a>
                <span>✦</span>
              </div>
            )}
            {hero.email && (
              <a
                href={`mailto:${hero.email}`}
                className="block text-xs md:text-sm hover:underline"
                style={{ color: GOLD }}
              >
                {hero.email}
              </a>
            )}
          </div>
        )}

        {hero.instructions && (
          <div className="pt-4">
            <p
              className="text-2xl md:text-3xl italic font-black mb-2"
              style={{ color: GOLD, fontFamily: "'Brush Script MT', cursive" }}
            >
              To order
            </p>
            <p className="text-[11px] md:text-xs text-white/80 whitespace-pre-line max-w-xs mx-auto md:mx-0 leading-relaxed">
              {hero.instructions}
            </p>
          </div>
        )}
      </div>

      {/* BOTTOM ROW: bottom image (circular, 3/4 clipped off bottom-left) + badge (right) */}
      <div className="relative z-10 flex items-end justify-end">
        {hero.bottomImageUrl && (
          <div
            className="absolute pointer-events-none"
            style={{
              // Push 3/4 of the circle past the bottom-left edge so only the top-right quarter shows.
              left: "calc(-1 * var(--bottom-img-size) / 2)",
              bottom: "calc(-1 * var(--bottom-img-size) / 2)",
              width: "var(--bottom-img-size)",
              height: "var(--bottom-img-size)",
              ["--bottom-img-size" as any]: "min(20rem, 50vw)",
            }}
          >
            <div
              className="relative w-full h-full rounded-full overflow-hidden border-2 shadow-2xl"
              style={{ borderColor: GOLD }}
            >
              <Image
                src={hero.bottomImageUrl}
                alt=""
                fill
                sizes="20rem"
                className="object-cover"
              />
            </div>
          </div>
        )}

        {hero.badgeText && (
          <div
            className="relative w-28 h-28 md:w-32 md:h-32 rounded-full border-2 flex items-center justify-center text-center px-3 shrink-0"
            style={{ borderColor: GOLD, color: GOLD }}
          >
            <p
              className="text-[9px] md:text-[10px] font-black uppercase leading-tight tracking-[0.08em]"
              style={{ fontFamily: "serif" }}
            >
              {hero.badgeText}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
