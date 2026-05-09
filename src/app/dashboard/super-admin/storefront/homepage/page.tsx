"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save, Loader2, Home, Heart, Workflow, HelpCircle, MessageSquare,
  Plus, Trash2, GripVertical, Image as ImageIcon, Type,
  ChevronDown, ChevronUp, ExternalLink, Link as LinkIcon,
} from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";
import IconRenderer from "@/components/shared/IconRenderer";
import IconPickerModal from "@/components/dashboard/shared/icon/IconPickerModal";
import PageMediaAddin from "@/app/dashboard/super-admin/storefront/pages/_components/PageMediaAddin";

// ─── Types ────────────────────────────────────────────────────────────────────

type TabId = "hero" | "story" | "howItWorks" | "faq" | "banner";
type IconComp = React.FC<{ className?: string }>;

const TABS: { id: TabId; label: string; icon: IconComp }[] = [
  { id: "hero",        label: "Hero Section",   icon: Home        as IconComp },
  { id: "story",       label: "Our Story",      icon: Heart       as IconComp },
  { id: "howItWorks",  label: "How It Works",   icon: Workflow    as IconComp },
  { id: "faq",         label: "FAQ",            icon: HelpCircle  as IconComp },
  { id: "banner",      label: "Sticky Banner",  icon: MessageSquare as IconComp },
];

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULTS: Record<TabId, any> = {
  hero: {
    brandName: "GinaG",
    headline: "PURSE CHARMS AND CHAINS",
    subheadline: "GINA ALEXANDER-GREENLEE",
    tagline: "Handmade custom charms, designed just for you.",
    imageUrl: "",
    contactPhone: "",
    contactEmail: "",
    whatsappLink: "",
    shopBtnText: "Shop Now",
    whatsappBtnText: "Customize via WhatsApp",
    trustItems: ["Handmade", "Custom Design", "Fast Delivery"],
  },
  story: {
    title: "Made Just for You",
    paragraphs: [
      "Every charm we create tells a story — your story.",
      "We don't sell mass-produced products. Each piece is handcrafted after your order, based on your personal style, favorite colors, and unique ideas.",
      "From choosing beads to final design, we carefully craft something that feels truly yours.",
    ],
    tagline: "Because your accessories should be as unique as you.",
    highlights: [
      { icon: "Heart", label: "Made with Love" },
      { icon: "Star",  label: "Unique & One-of-a-Kind" },
      { icon: "Sparkles", label: "Your Vision, Our Craft" },
    ],
  },
  howItWorks: {
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
  },
  faq: {
    title: "Frequently Asked Questions",
    subtitle: "Everything you need to know before ordering",
    faqs: [
      { question: "Is this product ready-made?",      answer: "No, all products are handmade after your order. Each charm is uniquely crafted especially for you." },
      { question: "How do I customize my charm?",     answer: "We will contact you on WhatsApp after your order to discuss colors, initials, style, and any preferences." },
      { question: "How long does it take?",           answer: "Production takes 2–5 business days. Delivery typically takes 3–15 days depending on your location." },
      { question: "Can I choose colors and initials?",answer: "Yes! Full customization is available. You can choose your favorite colors, initials, bead styles, and more." },
      { question: "Do you offer bulk orders?",        answer: "Yes, we offer bulk orders with special pricing. Contact us via WhatsApp for details." },
    ],
  },
  banner: {
    text: "Order now – We will contact you on WhatsApp for full customization",
    btnText: "Order Now",
  },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomepageAdminPage() {
  const [activeTab, setActiveTab] = useState<TabId>("hero");
  const [saving, setSaving]       = useState<TabId | null>(null);
  const [configs, setConfigs]     = useState<Record<TabId, any>>({ ...DEFAULTS });

  const fetchAll = useCallback(async () => {
    try {
      const { data } = await api.get("/settings/homepage");
      if (data.success && data.data) {
        setConfigs(prev => ({
          hero:       data.data.ginaGHero    ?? prev.hero,
          story:      data.data.story        ?? prev.story,
          howItWorks: data.data.howItWorks   ?? prev.howItWorks,
          faq:        data.data.faq          ?? prev.faq,
          banner:     data.data.stickyBanner ?? prev.banner,
        }));
      }
    } catch {
      toast.error("Failed to load homepage config");
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const update = (tab: TabId, field: string, value: any) =>
    setConfigs(prev => ({ ...prev, [tab]: { ...prev[tab], [field]: value } }));

  const save = async (tab: TabId) => {
    setSaving(tab);
    const sectionKey = tab === "hero" ? "ginaGHero" : tab === "banner" ? "stickyBanner" : tab;
    try {
      await api.patch(`/settings/homepage/${sectionKey}`, configs[tab]);
      toast.success("Section saved successfully");
    } catch {
      toast.error("Failed to save section");
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-8 rounded-[2rem] border border-border shadow-theme-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="relative z-10">
          <h1 className="text-3xl font-black tracking-tighter uppercase">Homepage Sections</h1>
          <p className="text-muted-foreground font-medium mt-1">Edit each homepage section independently — changes save per section</p>
        </div>
        <button
          onClick={() => save(activeTab)}
          disabled={saving !== null}
          className="relative z-10 flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold uppercase tracking-tight hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-primary/25 group shrink-0"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />}
          {saving ? "Saving…" : `Save ${TABS.find(t => t.id === activeTab)?.label}`}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-muted/50 rounded-2xl border border-border">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.id
                ? "bg-background text-primary shadow-theme-sm border border-border/50"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Panel */}
      <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-theme-sm">
        <AnimatePresence mode="wait">

          {/* ── HERO ── */}
          {activeTab === "hero" && (
            <SectionPanel key="hero">
              <SectionGrid>
                {/* Left: text fields */}
                <FieldGroup title="Text Content" icon={<Type className="w-5 h-5 text-primary" />}>
                  <Field label="Brand Name" hint="Shown as a fallback wordmark when no hero image is set.">
                    <Input value={configs.hero.brandName || ""} onChange={v => update("hero", "brandName", v)} />
                  </Field>
                  <Field label="Headline" hint="The big uppercase title under the image. e.g. 'PURSE CHARMS AND CHAINS'.">
                    <Input value={configs.hero.headline} onChange={v => update("hero", "headline", v)} />
                  </Field>
                  <Field label="Subheadline" hint="Smaller tracked-out line under the headline. e.g. 'GINA ALEXANDER-GREENLEE'.">
                    <Input value={configs.hero.subheadline} onChange={v => update("hero", "subheadline", v)} />
                  </Field>
                  <Field label="Tagline" hint="One-sentence description shown under the subheadline.">
                    <Textarea value={configs.hero.tagline || ""} onChange={v => update("hero", "tagline", v)} rows={2} />
                  </Field>
                  <Field label="Contact Phone" hint="Rendered as a tap-to-call link in the hero. Leave blank to hide.">
                    <Input value={configs.hero.contactPhone || ""} onChange={v => update("hero", "contactPhone", v)} />
                  </Field>
                  <Field label="Contact Email" hint="Rendered as a mailto link in the hero. Leave blank to hide.">
                    <Input value={configs.hero.contactEmail || ""} onChange={v => update("hero", "contactEmail", v)} />
                  </Field>
                  <Field label="Shop Button Text">
                    <Input value={configs.hero.shopBtnText} onChange={v => update("hero", "shopBtnText", v)} />
                  </Field>
                  <Field label="WhatsApp Button Text">
                    <Input value={configs.hero.whatsappBtnText} onChange={v => update("hero", "whatsappBtnText", v)} />
                  </Field>
                  <Field label="WhatsApp Link" hint="Full URL used for both hero button and the 'Chat on WhatsApp' CTA before FAQ">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="url"
                          value={configs.hero.whatsappLink || ""}
                          onChange={e => update("hero", "whatsappLink", e.target.value)}
                          placeholder="https://wa.me/1234567890?text=Hi"
                          className="w-full bg-muted/30 border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium focus:border-primary outline-none transition-all"
                        />
                      </div>
                      {configs.hero.whatsappLink && (
                        <a
                          href={configs.hero.whatsappLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-3 py-2 border border-border rounded-xl text-xs font-bold text-muted-foreground hover:text-primary hover:border-primary transition-all shrink-0"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Test
                        </a>
                      )}
                    </div>
                  </Field>
                </FieldGroup>

                {/* Right: image picker */}
                <FieldGroup title="Hero Image" icon={<ImageIcon className="w-5 h-5 text-primary" />}>
                  <HeroImagePicker
                    imageUrl={configs.hero.imageUrl || ""}
                    onChange={url => update("hero", "imageUrl", url)}
                  />
                </FieldGroup>
              </SectionGrid>

              <div className="mt-10">
                <StringList
                  label="Trust Items  (✔ badges shown below the CTA buttons)"
                  items={configs.hero.trustItems || []}
                  onChange={items => update("hero", "trustItems", items)}
                  placeholder="e.g. Handmade"
                />
              </div>
            </SectionPanel>
          )}

          {/* ── STORY ── */}
          {activeTab === "story" && (
            <SectionPanel key="story">
              <SectionGrid>
                <FieldGroup title="Section Header" icon={<Type className="w-5 h-5 text-primary" />}>
                  <Field label="Section Title">
                    <Input value={configs.story.title} onChange={v => update("story", "title", v)} />
                  </Field>
                  <Field label="Tagline  (bottom quote)">
                    <Input value={configs.story.tagline} onChange={v => update("story", "tagline", v)} />
                  </Field>
                </FieldGroup>
              </SectionGrid>

              <div className="mt-8 space-y-8">
                <StringList
                  label="Paragraphs  (each becomes its own paragraph block)"
                  items={configs.story.paragraphs || []}
                  onChange={items => update("story", "paragraphs", items)}
                  placeholder="Type a paragraph…"
                  multiline
                />
                <IconLabelList
                  label="Highlight Pills  (shown below the content card)"
                  items={configs.story.highlights || []}
                  onChange={items => update("story", "highlights", items)}
                />
              </div>
            </SectionPanel>
          )}

          {/* ── HOW IT WORKS ── */}
          {activeTab === "howItWorks" && (
            <SectionPanel key="howItWorks">
              <SectionGrid>
                <FieldGroup title="Section Header" icon={<Type className="w-5 h-5 text-primary" />}>
                  <Field label="Section Title">
                    <Input value={configs.howItWorks.title} onChange={v => update("howItWorks", "title", v)} />
                  </Field>
                  <Field label="Subtitle">
                    <Input value={configs.howItWorks.subtitle} onChange={v => update("howItWorks", "subtitle", v)} />
                  </Field>
                </FieldGroup>
                <FieldGroup title="WhatsApp CTA  (uses the link set in Hero tab)" icon={<MessageSquare className="w-5 h-5 text-primary" />}>
                  <Field label="CTA Line">
                    <Input value={configs.howItWorks.ctaLine} onChange={v => update("howItWorks", "ctaLine", v)} />
                  </Field>
                  <Field label="Button Text">
                    <Input value={configs.howItWorks.ctaBtnText} onChange={v => update("howItWorks", "ctaBtnText", v)} />
                  </Field>
                  <div className="mt-2 p-3 bg-primary/5 border border-primary/20 rounded-xl text-[11px] text-primary font-bold">
                    ℹ️ The WhatsApp link is taken from the Hero Section → WhatsApp Link field.
                  </div>
                </FieldGroup>
              </SectionGrid>

              <div className="mt-10">
                <StepList
                  steps={configs.howItWorks.steps || []}
                  onChange={steps => update("howItWorks", "steps", steps)}
                />
              </div>
            </SectionPanel>
          )}

          {/* ── FAQ ── */}
          {activeTab === "faq" && (
            <SectionPanel key="faq">
              <SectionGrid>
                <FieldGroup title="Section Header" icon={<Type className="w-5 h-5 text-primary" />}>
                  <Field label="Section Title">
                    <Input value={configs.faq.title} onChange={v => update("faq", "title", v)} />
                  </Field>
                  <Field label="Subtitle">
                    <Input value={configs.faq.subtitle} onChange={v => update("faq", "subtitle", v)} />
                  </Field>
                </FieldGroup>
              </SectionGrid>

              <div className="mt-10">
                <FAQList
                  faqs={configs.faq.faqs || []}
                  onChange={faqs => update("faq", "faqs", faqs)}
                />
              </div>
            </SectionPanel>
          )}

          {/* ── BANNER ── */}
          {activeTab === "banner" && (
            <SectionPanel key="banner">
              <div className="max-w-2xl space-y-6">
                <FieldGroup title="Sticky Banner Content" icon={<MessageSquare className="w-5 h-5 text-primary" />}>
                  <Field label="Banner Text" hint="Shown in the sticky bar at the top of the homepage">
                    <Input value={configs.banner.text} onChange={v => update("banner", "text", v)} />
                  </Field>
                  <Field label="Button Text">
                    <Input value={configs.banner.btnText} onChange={v => update("banner", "btnText", v)} />
                  </Field>
                </FieldGroup>

                {/* Live preview */}
                <div className="rounded-2xl overflow-hidden border border-border">
                  <div className="bg-primary text-primary-foreground py-2.5 px-4 flex items-center justify-between gap-3">
                    <p className="text-sm font-bold truncate">👉 {configs.banner.text}</p>
                    <span className="shrink-0 px-4 py-1.5 bg-primary-foreground text-primary rounded-full text-xs font-black uppercase">
                      {configs.banner.btnText}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground text-center py-2 bg-muted/30">
                    Live preview — clicking links to Hero Section WhatsApp Link
                  </p>
                </div>
              </div>
            </SectionPanel>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Hero Image Picker ────────────────────────────────────────────────────────

function HeroImagePicker({ imageUrl, onChange }: { imageUrl: string; onChange: (url: string) => void }) {
  const [mediaOpen, setMediaOpen] = useState(false);

  return (
    <div className="space-y-3">
      {/* Preview */}
      <div
        onClick={() => setMediaOpen(true)}
        className="relative w-full aspect-square rounded-2xl border-2 border-dashed border-border hover:border-primary cursor-pointer overflow-hidden group transition-all bg-muted/20"
      >
        {imageUrl ? (
          <>
            <img src={imageUrl} alt="Hero" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="bg-background/90 rounded-xl px-4 py-2 text-sm font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-primary" />
                Change Image
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted-foreground group-hover:text-primary transition-colors">
            <ImageIcon className="w-10 h-10" />
            <span className="text-sm font-bold uppercase tracking-widest">Select from Media Library</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setMediaOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary/10 border border-primary/30 text-primary rounded-xl text-sm font-bold hover:bg-primary hover:text-primary-foreground transition-all"
        >
          <ImageIcon className="w-4 h-4" />
          {imageUrl ? "Change Image" : "Select Image"}
        </button>
        {imageUrl && (
          <button
            onClick={() => onChange("")}
            className="px-4 py-2.5 border border-border rounded-xl text-sm font-bold text-muted-foreground hover:text-destructive hover:border-destructive transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <PageMediaAddin
        isOpen={mediaOpen}
        onClose={() => setMediaOpen(false)}
        onSelect={(medias) => {
          if (medias[0]?.url) onChange(medias[0].url);
          setMediaOpen(false);
        }}
      />
    </div>
  );
}

// ─── Layout helpers ───────────────────────────────────────────────────────────

function SectionPanel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="p-8 md:p-12"
    >
      {children}
    </motion.div>
  );
}

function SectionGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">{children}</div>;
}

function FieldGroup({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-5">
      <h3 className="text-base font-black uppercase tracking-tight flex items-center gap-2">{icon}{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">{label}</label>
      {children}
      {hint && <p className="text-[10px] text-muted-foreground/70 ml-1">{hint}</p>}
    </div>
  );
}

function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="text"
      value={value || ""}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm font-medium focus:border-primary outline-none transition-all"
    />
  );
}

function Textarea({ value, onChange, rows = 3 }: { value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <textarea
      value={value || ""}
      onChange={e => onChange(e.target.value)}
      rows={rows}
      className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm font-medium focus:border-primary outline-none transition-all resize-none"
    />
  );
}

// ─── String List ─────────────────────────────────────────────────────────────

function StringList({ label, items, onChange, placeholder, multiline }: {
  label: string; items: string[]; onChange: (items: string[]) => void;
  placeholder?: string; multiline?: boolean;
}) {
  const add    = ()           => onChange([...items, ""]);
  const remove = (i: number)  => onChange(items.filter((_, idx) => idx !== i));
  const edit   = (i: number, v: string) => { const n = [...items]; n[i] = v; onChange(n); };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">{label}</label>
        <button onClick={add} className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-primary hover:opacity-80 transition-opacity">
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <GripVertical className="w-4 h-4 text-muted-foreground/40 mt-2.5 shrink-0" />
            {multiline ? (
              <textarea value={item} onChange={e => edit(i, e.target.value)} rows={2} placeholder={placeholder}
                className="flex-1 bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm font-medium focus:border-primary outline-none transition-all resize-none" />
            ) : (
              <input type="text" value={item} onChange={e => edit(i, e.target.value)} placeholder={placeholder}
                className="flex-1 bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm font-medium focus:border-primary outline-none transition-all" />
            )}
            <button onClick={() => remove(i)} className="mt-2 p-1.5 text-muted-foreground hover:text-destructive transition-colors shrink-0">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-muted-foreground italic py-2">No items — click Add</p>}
      </div>
    </div>
  );
}

// ─── Icon + Label List (story highlights) ────────────────────────────────────

function IconLabelList({ label, items, onChange }: {
  label: string; items: { icon: string; label: string }[];
  onChange: (items: { icon: string; label: string }[]) => void;
}) {
  const [picker, setPicker] = useState<number | null>(null);
  const add    = ()           => onChange([...items, { icon: "Sparkles", label: "New Highlight" }]);
  const remove = (i: number)  => onChange(items.filter((_, idx) => idx !== i));
  const edit   = (i: number, field: string, v: string) => { const n = [...items]; n[i] = { ...n[i], [field]: v }; onChange(n); };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">{label}</label>
        <button onClick={add} className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-primary hover:opacity-80 transition-opacity">
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-muted/20 border border-border rounded-xl group">
            <div className="flex flex-col items-center gap-1 shrink-0">
              <button onClick={() => setPicker(i)}
                className="w-9 h-9 bg-card border border-border rounded-lg flex items-center justify-center hover:border-primary transition-all">
                <IconRenderer name={item.icon} className="w-4 h-4 text-primary" />
              </button>
              <span className="text-[8px] text-muted-foreground font-bold uppercase truncate w-9 text-center">{item.icon}</span>
            </div>
            <input type="text" value={item.label} onChange={e => edit(i, "label", e.target.value)}
              className="flex-1 bg-transparent text-sm font-bold outline-none border-b border-border/50 focus:border-primary transition-all py-1" placeholder="Label" />
            <button onClick={() => remove(i)} className="p-1.5 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all shrink-0">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-muted-foreground italic py-2">No highlights — click Add</p>}
      </div>
      {picker !== null && (
        <IconPickerModal isOpen onClose={() => setPicker(null)}
          onSelect={(icon: string) => { edit(picker, "icon", icon); setPicker(null); }} />
      )}
    </div>
  );
}

// ─── Step List (How It Works) — full icon CRUD ────────────────────────────────

function StepList({ steps, onChange }: { steps: any[]; onChange: (s: any[]) => void }) {
  const [picker, setPicker] = useState<number | null>(null);

  const add    = ()           => onChange([...steps, { icon: "LuStar", number: String(steps.length + 1).padStart(2, "0"), title: "New Step", description: "" }]);
  const remove = (i: number)  => onChange(steps.filter((_, idx) => idx !== i));
  const edit   = (i: number, field: string, v: string) => { const n = [...steps]; n[i] = { ...n[i], [field]: v }; onChange(n); };
  const resetIcon = (i: number) => edit(i, "icon", "LuStar");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-black uppercase tracking-tight">Process Steps</h3>
        <button onClick={add} className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-primary hover:opacity-80 transition-opacity">
          <Plus className="w-3.5 h-3.5" /> Add Step
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {steps.map((step, i) => (
          <div key={i} className="relative bg-muted/20 border border-border rounded-2xl p-6 space-y-4 group">
            <button onClick={() => remove(i)}
              className="absolute top-4 right-4 p-1.5 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all">
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Icon CRUD row */}
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center gap-1.5 shrink-0">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Icon</label>
                {/* READ: display icon */}
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                  <IconRenderer name={step.icon} className="w-6 h-6 text-primary" />
                </div>
                <span className="text-[9px] text-muted-foreground font-bold max-w-[48px] text-center truncate">{step.icon}</span>
                {/* UPDATE: change icon */}
                <button onClick={() => setPicker(i)}
                  className="text-[9px] font-black text-primary hover:underline uppercase tracking-wider">
                  Change
                </button>
                {/* DELETE: reset to default */}
                <button onClick={() => resetIcon(i)}
                  className="text-[9px] font-black text-muted-foreground hover:text-destructive uppercase tracking-wider">
                  Reset
                </button>
              </div>

              <div className="flex-1 space-y-3 min-w-0">
                <div className="flex gap-2 items-center">
                  <div className="space-y-1 w-14 shrink-0">
                    <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">Step #</label>
                    <input type="text" value={step.number || ""} onChange={e => edit(i, "number", e.target.value)}
                      className="w-full bg-muted/30 border border-border rounded-lg px-2 py-1.5 text-sm font-black text-center outline-none focus:border-primary transition-all" />
                  </div>
                  <div className="flex-1 space-y-1 min-w-0">
                    <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">Title</label>
                    <input type="text" value={step.title} onChange={e => edit(i, "title", e.target.value)}
                      className="w-full bg-muted/30 border border-border rounded-lg px-3 py-1.5 text-sm font-bold outline-none focus:border-primary transition-all" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">Description</label>
                  <textarea value={step.description} onChange={e => edit(i, "description", e.target.value)} rows={2}
                    className="w-full bg-muted/30 border border-border rounded-lg px-3 py-1.5 text-sm font-medium outline-none focus:border-primary transition-all resize-none" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {steps.length === 0 && <p className="text-sm text-muted-foreground italic py-4 text-center">No steps — click Add Step</p>}

      {/* Icon picker modal */}
      {picker !== null && (
        <IconPickerModal isOpen onClose={() => setPicker(null)}
          onSelect={(icon: string) => { edit(picker, "icon", icon); setPicker(null); }} />
      )}
    </div>
  );
}

// ─── FAQ List ─────────────────────────────────────────────────────────────────

function FAQList({ faqs, onChange }: { faqs: any[]; onChange: (f: any[]) => void }) {
  const [expanded, setExpanded] = useState<number | null>(0);

  const add    = ()           => { onChange([...faqs, { question: "New Question?", answer: "" }]); setExpanded(faqs.length); };
  const remove = (i: number)  => { onChange(faqs.filter((_, idx) => idx !== i)); setExpanded(null); };
  const edit   = (i: number, field: string, v: string) => { const n = [...faqs]; n[i] = { ...n[i], [field]: v }; onChange(n); };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-black uppercase tracking-tight">Questions & Answers</h3>
        <button onClick={add} className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-primary hover:opacity-80 transition-opacity">
          <Plus className="w-3.5 h-3.5" /> Add FAQ
        </button>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className={`border rounded-2xl overflow-hidden transition-all ${expanded === i ? "border-primary/40 bg-primary/5" : "border-border bg-muted/10"}`}>
            <div className="flex items-center gap-3 p-4">
              <button onClick={() => setExpanded(expanded === i ? null : i)} className="flex-1 flex items-center gap-3 text-left">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-[10px] font-black flex items-center justify-center shrink-0">{i + 1}</span>
                <span className="text-sm font-bold truncate">{faq.question || "Untitled question"}</span>
              </button>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => setExpanded(expanded === i ? null : i)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                  {expanded === i ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                <button onClick={() => remove(i)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <AnimatePresence>
              {expanded === i && (
                <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                  <div className="px-4 pb-4 space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Question</label>
                      <input type="text" value={faq.question} onChange={e => edit(i, "question", e.target.value)}
                        className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-primary transition-all" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Answer</label>
                      <textarea value={faq.answer} onChange={e => edit(i, "answer", e.target.value)} rows={3}
                        className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:border-primary transition-all resize-none" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
        {faqs.length === 0 && <p className="text-sm text-muted-foreground italic py-4 text-center">No FAQs — click Add FAQ</p>}
      </div>
    </div>
  );
}
