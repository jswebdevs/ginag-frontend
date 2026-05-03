import GinaGHero from "@/components/home/hero/GinaGHero";
import FeaturedProducts from "@/components/home/products/FeaturedProducts";
import StorySection from "@/components/home/sections/StorySection";
import HowItWorks from "@/components/home/sections/HowItWorks";
import FAQSection from "@/components/home/sections/FAQSection";
import StickyBanner from "@/components/home/sections/StickyBanner";
import { getHomepageConfig } from "@/lib/getSettings";

// ── Fallback content (shown before admin saves anything) ───────────────────

const DEFAULT_STORY = {
  title: "Made Just for You",
  paragraphs: [
    "Every charm we create tells a story — your story.",
    "We don't sell mass-produced products. Each piece is handcrafted after your order, based on your personal style, favorite colors, and unique ideas.",
    "From choosing beads to final design, we carefully craft something that feels truly yours.",
  ],
  tagline: "Because your accessories should be as unique as you.",
  highlights: [
    { icon: "Heart",    label: "Made with Love" },
    { icon: "Star",     label: "Unique & One-of-a-Kind" },
    { icon: "Sparkles", label: "Your Vision, Our Craft" },
  ],
};

const DEFAULT_HOW_IT_WORKS = {
  title: "How It Works",
  subtitle: "Simple steps to your perfect charm",
  ctaLine: "For faster communication, connect with us on WhatsApp anytime",
  ctaBtnText: "Chat on WhatsApp",
  steps: [
    { icon: "LuShoppingBag",   number: "01", title: "Place Your Order",       description: "Choose your favorite design and place your order on our store." },
    { icon: "LuMessageCircle", number: "02", title: "We Contact You",          description: "We reach out on WhatsApp for customization details." },
    { icon: "LuPalette",       number: "03", title: "Customize Your Design",   description: "Select colors, beads, initials, and your personal style." },
    { icon: "LuPackage",       number: "04", title: "We Create & Deliver",     description: "Your handmade charm is carefully crafted and shipped to you." },
  ],
};

const DEFAULT_FAQ = {
  title: "Frequently Asked Questions",
  subtitle: "Everything you need to know before ordering",
  faqs: [
    { question: "Is this product ready-made?",       answer: "No, all products are handmade after your order. Each charm is uniquely crafted especially for you." },
    { question: "How do I customize my charm?",      answer: "We will contact you on WhatsApp after your order to discuss colors, initials, style, and any preferences." },
    { question: "How long does it take?",            answer: "Production takes 2–5 business days. Delivery typically takes 3–15 days depending on your location." },
    { question: "Can I choose colors and initials?", answer: "Yes! Full customization is available — colors, initials, bead styles, and more." },
    { question: "Do you offer bulk orders?",         answer: "Yes, we offer bulk orders with special pricing. Contact us via WhatsApp for details." },
  ],
};

// ──────────────────────────────────────────────────────────────────────────────

function hasData(obj: unknown): boolean {
  return !!obj && typeof obj === "object" && Object.keys(obj).length > 0;
}

export default async function Home() {
  const hp = await getHomepageConfig();

  const whatsappLink: string  = (hp.ginaGHero as any)?.whatsappLink || "";
  const heroConfig             = hasData(hp.ginaGHero)  ? hp.ginaGHero  : {};
  const storyData              = hasData(hp.story)       ? hp.story       : DEFAULT_STORY;
  const howItWorksData         = hasData(hp.howItWorks)  ? hp.howItWorks  : DEFAULT_HOW_IT_WORKS;
  const faqData                = hasData(hp.faq)         ? hp.faq         : DEFAULT_FAQ;

  return (
    <main className="min-h-screen">
      <StickyBanner data={hp.stickyBanner} whatsappLink={whatsappLink} />
      {/* heroConfig passed as SSR prop — eliminates client-side API fetch, fixes LCP */}
      <GinaGHero heroConfig={heroConfig} />
      <FeaturedProducts />
      <StorySection data={storyData} />
      <HowItWorks data={howItWorksData} whatsappLink={whatsappLink} />
      <FAQSection data={faqData} />
    </main>
  );
}
