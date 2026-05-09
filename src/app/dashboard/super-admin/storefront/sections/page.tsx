"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save as SaveIcon,
  Loader2 as LoaderIcon,
  Sparkles as SparklesIcon,
  Shield as ShieldIcon,
  Gift as GiftIcon,
  Plus as PlusIcon,
  Trash2 as TrashIcon,
  ChevronDown as ChevronDownIcon,
  ChevronUp as ChevronUpIcon,
  Image as ImageIcon,
  Type as TypeIcon,
  Layout as LayoutIcon,
  MousePointer2 as MousePointerIcon,
  Home as HomeIcon,
  Heart as HeartIcon,
  HelpCircle as HelpCircleIcon,
  Workflow as WorkflowIcon,
  MessageSquare as MessageSquareIcon,
} from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";
import IconRenderer from "@/components/shared/IconRenderer";
import IconPickerModal from "@/components/dashboard/shared/icon/IconPickerModal";

export default function HomepageSectionsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"hero" | "story" | "howItWorks" | "faq" | "banner" | "material" | "technical" | "gift">("hero");
  const [config, setConfig] = useState<any>({
    ginaGHero: {
      headline: "Handmade Custom Bag Charms – Designed Just for You",
      subheadline: "Create your own unique style with personalized, handcrafted charms made after you order.",
      imageUrl: "",
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
        { icon: "Star", label: "Unique & One-of-a-Kind" },
        { icon: "Sparkles", label: "Your Vision, Our Craft" },
      ],
    },
    howItWorks: {
      title: "How It Works",
      subtitle: "Simple steps to your perfect charm",
      ctaLine: "For faster communication, connect with us on WhatsApp anytime",
      ctaBtnText: "Chat on WhatsApp",
      steps: [
        { icon: "ShoppingBag", number: "01", title: "Place Your Order", description: "Choose your favorite design and place your order on our store." },
        { icon: "MessageCircle", number: "02", title: "We Contact You", description: "We reach out on WhatsApp for customization details." },
        { icon: "Palette", number: "03", title: "Customize Your Design", description: "Select colors, beads, initials, and your personal style." },
        { icon: "Package", number: "04", title: "We Create & Deliver", description: "Your handmade charm is carefully crafted and shipped to you." },
      ],
    },
    faq: {
      title: "Frequently Asked Questions",
      subtitle: "Everything you need to know before ordering",
      faqs: [
        { question: "Is this product ready-made?", answer: "No, all products are handmade after your order." },
        { question: "How do I customize my charm?", answer: "We will contact you on WhatsApp after your order." },
        { question: "How long does it take?", answer: "Production: 2–5 days. Delivery: 3–15 days." },
        { question: "Can I choose colors and initials?", answer: "Yes, full customization is available." },
        { question: "Do you offer bulk orders?", answer: "Yes, contact us for special pricing." },
      ],
    },
    stickyBanner: {
      text: "Order now – We will contact you on WhatsApp for full customization",
      btnText: "Order Now",
    },
    materialTechnology: {
      badge: "Material Library",
      title: "The Architecture",
      titleHighlight: "of Refraction",
      description: "Our curated selection of glossy beads and crystal accents aren't just decorative.",
      imageText: "Crystalline Substructure",
      imageSubtext: "Microscope Focus",
      features: []
    },
    technicalIntegrity: {
      title: "Built to",
      titleHighlight: "Endure.",
      specs: [],
      boxTitle: "Zero Fatigue Engineering",
      boxDesc: "Structural integrity maintained across 10,000+ cycle stress tests."
    },
    giftCuration: {
      title: "A Masterpiece",
      titleHighlight: "of Thoughtful Intent",
      description: "Designed for birthdays, holidays, or those \"just because\" moments.",
      features: []
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get("/settings");
      if (data.success && data.data.homepageConfig) {
        // Merge with defaults to ensure all fields exist
        setConfig((prev: any) => ({
          ...prev,
          ...data.data.homepageConfig
        }));
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.patch("/settings", {
        homepageConfig: config
      });
      if (data.success) {
        toast.success("Homepage sections updated successfully");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const updateSection = (section: string, field: string, value: any) => {
    setConfig((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoaderIcon className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-8 rounded-[2rem] border border-border shadow-theme-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="relative z-10">
          <h1 className="text-3xl font-black tracking-tighter uppercase">Homepage Sections</h1>
          <p className="text-muted-foreground font-medium mt-1">Manage the dynamic content of your storefront sections</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="relative z-10 flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold uppercase tracking-tight hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-primary/25 group"
        >
          {saving ? <LoaderIcon className="w-5 h-5 animate-spin" /> : <SaveIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-muted/50 rounded-2xl border border-border">
        {[
          { id: "hero", label: "Hero", icon: HomeIcon },
          { id: "story", label: "Story", icon: HeartIcon },
          { id: "howItWorks", label: "How It Works", icon: WorkflowIcon },
          { id: "faq", label: "FAQ", icon: HelpCircleIcon },
          { id: "banner", label: "Sticky Banner", icon: MessageSquareIcon },
          { id: "material", label: "Material Tech", icon: SparklesIcon },
          { id: "technical", label: "Technical", icon: ShieldIcon },
          { id: "gift", label: "Gift Curation", icon: GiftIcon },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
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

      {/* Content Area */}
      <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-theme-sm">
        <AnimatePresence mode="wait">

          {/* ── Hero ── */}
          {activeTab === "hero" && (
            <motion.div
              key="hero"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-8 md:p-12 space-y-10"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                    <TypeIcon className="w-5 h-5 text-primary" /> Text Content
                  </h3>
                  <div className="space-y-4">
                    <InputField label="Headline" value={config.ginaGHero?.headline} onChange={(v: any) => updateSection("ginaGHero", "headline", v)} />
                    <TextAreaField label="Subheadline" value={config.ginaGHero?.subheadline} onChange={(v: any) => updateSection("ginaGHero", "subheadline", v)} />
                    <InputField label="Shop Button Text" value={config.ginaGHero?.shopBtnText} onChange={(v: any) => updateSection("ginaGHero", "shopBtnText", v)} />
                    <InputField label="WhatsApp Button Text" value={config.ginaGHero?.whatsappBtnText} onChange={(v: any) => updateSection("ginaGHero", "whatsappBtnText", v)} />
                  </div>
                </div>
                <div className="space-y-6">
                  <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-primary" /> Image & Trust
                  </h3>
                  <div className="space-y-4">
                    <InputField label="Hero Image URL" value={config.ginaGHero?.imageUrl} onChange={(v: any) => updateSection("ginaGHero", "imageUrl", v)} placeholder="https://..." />
                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">Trust Items (one per line)</label>
                      <textarea
                        rows={4}
                        value={(config.ginaGHero?.trustItems || []).join("\n")}
                        onChange={(e) => updateSection("ginaGHero", "trustItems", e.target.value.split("\n").filter(Boolean))}
                        className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm font-medium focus:border-primary outline-none transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Story ── */}
          {activeTab === "story" && (
            <motion.div
              key="story"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-8 md:p-12 space-y-10"
            >
              <div className="max-w-2xl space-y-6">
                <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                  <TypeIcon className="w-5 h-5 text-primary" /> Story Content
                </h3>
                <div className="space-y-4">
                  <InputField label="Section Title" value={config.story?.title} onChange={(v: any) => updateSection("story", "title", v)} />
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">Paragraphs (one per line)</label>
                    <textarea
                      rows={6}
                      value={(config.story?.paragraphs || []).join("\n")}
                      onChange={(e) => updateSection("story", "paragraphs", e.target.value.split("\n").filter(Boolean))}
                      className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm font-medium focus:border-primary outline-none transition-all resize-none"
                    />
                  </div>
                  <InputField label="Tagline (bottom highlight)" value={config.story?.tagline} onChange={(v: any) => updateSection("story", "tagline", v)} />
                </div>
              </div>
            </motion.div>
          )}

          {/* ── How It Works ── */}
          {activeTab === "howItWorks" && (
            <motion.div
              key="howItWorks"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-8 md:p-12 space-y-10"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-3xl">
                <div className="space-y-4">
                  <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                    <TypeIcon className="w-5 h-5 text-primary" /> Section Text
                  </h3>
                  <InputField label="Section Title" value={config.howItWorks?.title} onChange={(v: any) => updateSection("howItWorks", "title", v)} />
                  <InputField label="Subtitle" value={config.howItWorks?.subtitle} onChange={(v: any) => updateSection("howItWorks", "subtitle", v)} />
                  <InputField label="WhatsApp CTA Line" value={config.howItWorks?.ctaLine} onChange={(v: any) => updateSection("howItWorks", "ctaLine", v)} />
                  <InputField label="WhatsApp Button Text" value={config.howItWorks?.ctaBtnText} onChange={(v: any) => updateSection("howItWorks", "ctaBtnText", v)} />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-black uppercase tracking-tight">Steps</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(config.howItWorks?.steps || []).map((step: any, idx: number) => (
                    <div key={idx} className="bg-muted/20 border border-border rounded-2xl p-6 space-y-3">
                      <div className="text-[10px] font-black text-primary uppercase tracking-widest">Step {step.number}</div>
                      <InputField label="Title" value={step.title} onChange={(v: any) => {
                        const steps = [...(config.howItWorks?.steps || [])];
                        steps[idx] = { ...steps[idx], title: v };
                        updateSection("howItWorks", "steps", steps);
                      }} />
                      <TextAreaField label="Description" value={step.description} onChange={(v: any) => {
                        const steps = [...(config.howItWorks?.steps || [])];
                        steps[idx] = { ...steps[idx], description: v };
                        updateSection("howItWorks", "steps", steps);
                      }} />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── FAQ ── */}
          {activeTab === "faq" && (
            <motion.div
              key="faq"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-8 md:p-12 space-y-10"
            >
              <div className="max-w-2xl space-y-4">
                <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                  <TypeIcon className="w-5 h-5 text-primary" /> Section Header
                </h3>
                <InputField label="Section Title" value={config.faq?.title} onChange={(v: any) => updateSection("faq", "title", v)} />
                <InputField label="Subtitle" value={config.faq?.subtitle} onChange={(v: any) => updateSection("faq", "subtitle", v)} />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black uppercase tracking-tight">Questions & Answers</h3>
                  <button
                    onClick={() => updateSection("faq", "faqs", [...(config.faq?.faqs || []), { question: "New Question?", answer: "Answer here." }])}
                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:opacity-80 transition-opacity"
                  >
                    <PlusIcon className="w-4 h-4" /> Add FAQ
                  </button>
                </div>
                <div className="space-y-4">
                  {(config.faq?.faqs || []).map((faq: any, idx: number) => (
                    <div key={idx} className="bg-muted/20 border border-border rounded-2xl p-6 space-y-3 relative group">
                      <button
                        onClick={() => updateSection("faq", "faqs", (config.faq?.faqs || []).filter((_: any, i: number) => i !== idx))}
                        className="absolute top-4 right-4 p-1.5 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                      <InputField label="Question" value={faq.question} onChange={(v: any) => {
                        const faqs = [...(config.faq?.faqs || [])];
                        faqs[idx] = { ...faqs[idx], question: v };
                        updateSection("faq", "faqs", faqs);
                      }} />
                      <TextAreaField label="Answer" value={faq.answer} onChange={(v: any) => {
                        const faqs = [...(config.faq?.faqs || [])];
                        faqs[idx] = { ...faqs[idx], answer: v };
                        updateSection("faq", "faqs", faqs);
                      }} />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Sticky Banner ── */}
          {activeTab === "banner" && (
            <motion.div
              key="banner"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-8 md:p-12 space-y-6 max-w-xl"
            >
              <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                <MessageSquareIcon className="w-5 h-5 text-primary" /> Sticky Banner
              </h3>
              <InputField label="Banner Text" value={config.stickyBanner?.text} onChange={(v: any) => updateSection("stickyBanner", "text", v)} />
              <InputField label="Button Text" value={config.stickyBanner?.btnText} onChange={(v: any) => updateSection("stickyBanner", "btnText", v)} />
              <p className="text-sm text-muted-foreground font-medium">
                The banner links to WhatsApp using the phone number set in <strong>Store Settings → Contact Phone</strong>.
              </p>
            </motion.div>
          )}

          {activeTab === "material" && (
            <motion.div 
              key="material"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-8 md:p-12 space-y-12"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                    <TypeIcon className="w-5 h-5 text-primary" />
                    Text Content
                  </h3>
                  <div className="space-y-4">
                    <InputField label="Badge" value={config.materialTechnology.badge} onChange={(v:any) => updateSection("materialTechnology", "badge", v)} />
                    <InputField label="Title Main" value={config.materialTechnology.title} onChange={(v:any) => updateSection("materialTechnology", "title", v)} />
                    <InputField label="Title Highlight" value={config.materialTechnology.titleHighlight} onChange={(v:any) => updateSection("materialTechnology", "titleHighlight", v)} />
                    <TextAreaField label="Description" value={config.materialTechnology.description} onChange={(v:any) => updateSection("materialTechnology", "description", v)} />
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-primary" />
                    Visual Focus Box
                  </h3>
                  <div className="space-y-4">
                    <InputField label="Main Text" value={config.materialTechnology.imageText} onChange={(v:any) => updateSection("materialTechnology", "imageText", v)} placeholder="Line breaks with \n" />
                    <InputField label="Small Subtext" value={config.materialTechnology.imageSubtext} onChange={(v:any) => updateSection("materialTechnology", "imageSubtext", v)} />
                  </div>
                </div>
              </div>

              <FeatureList 
                title="Technology Features"
                features={config.materialTechnology.features || []}
                onChange={(features:any) => updateSection("materialTechnology", "features", features)}
              />
            </motion.div>
          )}

          {activeTab === "technical" && (
            <motion.div 
              key="technical"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-8 md:p-12 space-y-12"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                    <TypeIcon className="w-5 h-5 text-primary" />
                    Main Heading
                  </h3>
                  <div className="space-y-4">
                    <InputField label="Title Main" value={config.technicalIntegrity.title} onChange={(v:any) => updateSection("technicalIntegrity", "title", v)} />
                    <InputField label="Title Highlight" value={config.technicalIntegrity.titleHighlight} onChange={(v:any) => updateSection("technicalIntegrity", "titleHighlight", v)} />
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                    <LayoutIcon className="w-5 h-5 text-primary" />
                    Technical Box (Right)
                  </h3>
                  <div className="space-y-4">
                    <InputField label="Box Title" value={config.technicalIntegrity.boxTitle} onChange={(v:any) => updateSection("technicalIntegrity", "boxTitle", v)} />
                    <TextAreaField label="Box Description" value={config.technicalIntegrity.boxDesc} onChange={(v:any) => updateSection("technicalIntegrity", "boxDesc", v)} />
                  </div>
                </div>
              </div>

              <SpecList 
                specs={config.technicalIntegrity.specs || []}
                onChange={(specs:any) => updateSection("technicalIntegrity", "specs", specs)}
              />
            </motion.div>
          )}

          {activeTab === "gift" && (
            <motion.div 
              key="gift"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-8 md:p-12 space-y-12"
            >
              <div className="max-w-2xl space-y-6">
                <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                  <TypeIcon className="w-5 h-5 text-primary" />
                  Gifting Content
                </h3>
                <div className="space-y-4">
                  <InputField label="Title Main" value={config.giftCuration.title} onChange={(v:any) => updateSection("giftCuration", "title", v)} />
                  <InputField label="Title Highlight" value={config.giftCuration.titleHighlight} onChange={(v:any) => updateSection("giftCuration", "titleHighlight", v)} />
                  <TextAreaField label="Description" value={config.giftCuration.description} onChange={(v:any) => updateSection("giftCuration", "description", v)} />
                </div>
              </div>

              <FeatureList 
                title="Gifting Points"
                features={config.giftCuration.features || []}
                onChange={(features:any) => updateSection("giftCuration", "features", features)}
                simple
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">{label}</label>
      <input 
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm font-medium focus:border-primary outline-none transition-all"
      />
    </div>
  );
}

function TextAreaField({ label, value, onChange }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">{label}</label>
      <textarea 
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm font-medium focus:border-primary outline-none transition-all resize-none"
      />
    </div>
  );
}

function FeatureList({ title, features, onChange, simple }: any) {
  const [showIconPicker, setShowIconPicker] = useState<number | null>(null);

  const addFeature = () => {
    onChange([...features, { icon: "Sparkles", title: "New Feature", desc: "Feature description" }]);
  };

  const removeFeature = (idx: number) => {
    onChange(features.filter((_: any, i: number) => i !== idx));
  };

  const updateFeature = (idx: number, field: string, value: any) => {
    const newFeatures = [...features];
    newFeatures[idx] = { ...newFeatures[idx], [field]: value };
    onChange(newFeatures);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black uppercase tracking-tight">{title}</h3>
        <button 
          onClick={addFeature}
          className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:opacity-80 transition-opacity"
        >
          <PlusIcon className="w-4 h-4" /> Add Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature: any, idx: number) => (
          <div key={idx} className="bg-muted/20 border border-border rounded-2xl p-6 relative group">
            <button 
              onClick={() => removeFeature(idx)}
              className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
            >
              <TrashIcon className="w-4 h-4" />
            </button>

            <div className="flex gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground block">Icon</label>
                <button 
                  onClick={() => setShowIconPicker(idx)}
                  className="w-12 h-12 bg-card border border-border rounded-xl flex items-center justify-center hover:border-primary transition-all shadow-theme-sm"
                >
                  <IconRenderer name={feature.icon} className="w-5 h-5 text-primary" />
                </button>
              </div>

              <div className="flex-1 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground block">Label/Title</label>
                  <input 
                    type="text"
                    value={feature.title || feature.label || ""}
                    onChange={(e) => updateFeature(idx, simple ? "label" : "title", e.target.value)}
                    className="w-full bg-transparent border-b border-border/50 text-sm font-bold outline-none focus:border-primary transition-all py-1"
                  />
                </div>
                {!simple && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground block">Description</label>
                    <input 
                      type="text"
                      value={feature.desc || ""}
                      onChange={(e) => updateFeature(idx, "desc", e.target.value)}
                      className="w-full bg-transparent border-b border-border/50 text-xs font-medium text-muted-foreground outline-none focus:border-primary transition-all py-1"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showIconPicker !== null && (
        <IconPickerModal 
          isOpen={true}
          onClose={() => setShowIconPicker(null)}
          onSelect={(icon:string) => {
            updateFeature(showIconPicker, "icon", icon);
            setShowIconPicker(null);
          }}
        />
      )}
    </div>
  );
}

function SpecList({ specs, onChange }: any) {
  const [showIconPicker, setShowIconPicker] = useState<number | null>(null);

  const addSpec = () => {
    onChange([...specs, { icon: "Shield", label: "Spec Label", value: "Value" }]);
  };

  const removeSpec = (idx: number) => {
    onChange(specs.filter((_: any, i: number) => i !== idx));
  };

  const updateSpec = (idx: number, field: string, value: any) => {
    const newSpecs = [...specs];
    newSpecs[idx] = { ...newSpecs[idx], [field]: value };
    onChange(newSpecs);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black uppercase tracking-tight">Technical Specifications</h3>
        <button 
          onClick={addSpec}
          className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:opacity-80 transition-opacity"
        >
          <PlusIcon className="w-4 h-4" /> Add Spec
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {specs.map((spec: any, idx: number) => (
          <div key={idx} className="bg-muted/20 border border-border rounded-2xl p-5 relative group">
            <button 
              onClick={() => removeSpec(idx)}
              className="absolute top-2 right-2 p-1.5 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
            >
              <TrashIcon className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-3 mb-3">
              <button 
                onClick={() => setShowIconPicker(idx)}
                className="w-8 h-8 bg-card border border-border rounded-lg flex items-center justify-center hover:border-primary transition-all"
              >
                <IconRenderer name={spec.icon} className="w-4 h-4 text-primary" />
              </button>
              <input 
                type="text"
                value={spec.label || ""}
                onChange={(e) => updateSpec(idx, "label", e.target.value)}
                className="flex-1 bg-transparent border-b border-border/50 text-[10px] font-black uppercase tracking-tighter outline-none focus:border-primary transition-all py-1"
                placeholder="Label"
              />
            </div>
            <input 
              type="text"
              value={spec.value || ""}
              onChange={(e) => updateSpec(idx, "value", e.target.value)}
              className="w-full bg-transparent border-b border-border/50 text-sm font-black uppercase tracking-tight outline-none focus:border-primary transition-all py-1"
              placeholder="Value"
            />
          </div>
        ))}
      </div>

      {showIconPicker !== null && (
        <IconPickerModal 
          isOpen={true}
          onClose={() => setShowIconPicker(null)}
          onSelect={(icon:string) => {
            updateSpec(showIconPicker, "icon", icon);
            setShowIconPicker(null);
          }}
        />
      )}
    </div>
  );
}
