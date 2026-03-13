"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { LuX, LuLoader, LuSave, LuImage, LuSparkles, LuGlobe } from "react-icons/lu";
import MediaManager from "@/components/dashboard/shared/media/MediaManager";
import Swal from "sweetalert2";
import { generateAIContent } from "@/services/ai.service"; // 🔥 Using your existing service

interface BrandFormProps {
  initialData?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BrandForm({ initialData, onClose, onSuccess }: BrandFormProps) {
  const isEdit = !!initialData;

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    website: initialData?.website || "",
    logoId: initialData?.logoId || "",
    featuredImageId: initialData?.featuredImageId || "",
  });

  const [loading, setLoading] = useState(false);
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [isGeneratingUrl, setIsGeneratingUrl] = useState(false);
  const [error, setError] = useState("");

  const [activeMediaPicker, setActiveMediaPicker] = useState<"logo" | "featured" | null>(null);

  const [logoPreview, setLogoPreview] = useState<string | null>(
    initialData?.logo?.thumbUrl || initialData?.logo?.originalUrl || null
  );
  const [featuredPreview, setFeaturedPreview] = useState<string | null>(
    initialData?.featuredImage?.thumbUrl || initialData?.featuredImage?.originalUrl || null
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- AI GENERATION: DESCRIPTION ---
  const generateDescription = async () => {
    if (!formData.name) {
      return Swal.fire("Name Required", "Please enter a brand name first.", "warning");
    }

    setIsGeneratingDesc(true);
    const prompt = `Write a professional, catchy 2-sentence brand description for a company named "${formData.name}". Return ONLY the description text.`;

    try {
      const aiResponse = await generateAIContent(prompt, "You are a professional brand copywriter.");
      if (aiResponse) {
        setFormData(prev => ({ ...prev, description: aiResponse.trim() }));
      }
    } catch (err: any) {
      console.error("AI Description Error:", err);
      Swal.fire("Generation Failed", "Could not generate description.", "error");
    } finally {
      setIsGeneratingDesc(false);
    }
  };

  // --- AI GENERATION: WEBSITE URL ---
  const generateWebsiteUrl = async () => {
    if (!formData.name) {
      return Swal.fire("Name Required", "Please enter a brand name first.", "warning");
    }

    setIsGeneratingUrl(true);
    const prompt = `Find the official website URL for the brand "${formData.name}". 
      CRITICAL RULE 1: Return ONLY the URL starting with https://www. 
      CRITICAL RULE 2: If no official website exists, return strictly the phrase "NO_WEBSITE_FOUND".`;

    try {
      const aiResponse = await generateAIContent(prompt, "You are a digital researcher.");
      const cleanedUrl = aiResponse.trim();

      if (cleanedUrl.includes("NO_WEBSITE_FOUND")) {
        Swal.fire({
          icon: "info",
          title: "No Website Found",
          text: `AI could not locate an official website for ${formData.name}.`,
          background: 'hsl(var(--card))',
          color: 'hsl(var(--foreground))',
        });
      } else {
        setFormData(prev => ({ ...prev, website: cleanedUrl }));
      }
    } catch (err: any) {
      console.error("AI URL Error:", err);
      Swal.fire("Generation Failed", "Could not find website URL.", "error");
    } finally {
      setIsGeneratingUrl(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isEdit) {
        await api.patch(`/brands/${initialData.id}`, formData);
      } else {
        await api.post('/brands', formData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save brand");
    } finally {
      setLoading(false);
    }
  };

  const handleMediaSelect = (media: any) => {
    if (activeMediaPicker === "logo") {
      setFormData({ ...formData, logoId: media.id });
      setLogoPreview(media.thumbUrl || media.originalUrl);
    } else if (activeMediaPicker === "featured") {
      setFormData({ ...formData, featuredImageId: media.id });
      setFeaturedPreview(media.thumbUrl || media.originalUrl);
    }
    setActiveMediaPicker(null);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-card w-full max-w-xl border border-border rounded-3xl shadow-theme-2xl overflow-hidden flex flex-col max-h-[90vh]">

          <div className="flex items-center justify-between p-6 border-b border-border bg-muted/10">
            <h2 className="text-xl font-black text-foreground tracking-tight">
              {isEdit ? "Edit Brand" : "Add New Brand"}
            </h2>
            <button onClick={onClose} className="p-1.5 text-muted-foreground hover:text-destructive bg-background border border-border rounded-xl transition-colors">
              <LuX className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto custom-scrollbar">
            {error && (
              <div className="mb-6 p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl text-xs font-bold uppercase tracking-widest">
                {error}
              </div>
            )}

            <form id="brand-form" onSubmit={handleSubmit} className="space-y-6">

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">Name *</label>
                  <input
                    type="text" required name="name"
                    value={formData.name} onChange={handleChange}
                    placeholder="e.g. Apple"
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">Slug</label>
                  <input
                    type="text" name="slug"
                    value={formData.slug} onChange={handleChange}
                    placeholder="auto-generated"
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Website URL</label>
                  <button
                    type="button"
                    onClick={generateWebsiteUrl}
                    disabled={isGeneratingUrl}
                    className="flex items-center gap-1.5 text-[10px] font-black text-primary uppercase tracking-widest hover:opacity-70 disabled:opacity-50 transition-all"
                  >
                    {isGeneratingUrl ? <LuLoader className="w-3 h-3 animate-spin" /> : <LuGlobe className="w-3 h-3" />}
                    AI Link
                  </button>
                </div>
                <input
                  type="url" name="website"
                  value={formData.website} onChange={handleChange}
                  placeholder="https://www.example.com"
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none transition-all font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">Brand Logo</label>
                  <div className="flex flex-col gap-3">
                    <div className="w-full h-24 bg-muted/30 border border-border rounded-2xl flex items-center justify-center shrink-0 overflow-hidden p-2">
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo" className="max-w-full max-h-full object-contain" />
                      ) : (
                        <LuImage className="w-8 h-8 text-muted-foreground/20" />
                      )}
                    </div>
                    <button
                      type="button" onClick={() => setActiveMediaPicker("logo")}
                      className="w-full px-3 py-2 text-[10px] font-black uppercase tracking-widest bg-muted text-foreground border border-border rounded-xl hover:border-primary hover:text-primary transition-all"
                    >
                      {formData.logoId ? "Change Logo" : "Select Logo"}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">Featured Banner</label>
                  <div className="flex flex-col gap-3">
                    <div className="w-full h-24 bg-muted/30 border border-border rounded-2xl flex items-center justify-center shrink-0 overflow-hidden">
                      {featuredPreview ? (
                        <img src={featuredPreview} alt="Banner" className="w-full h-full object-cover" />
                      ) : (
                        <LuImage className="w-8 h-8 text-muted-foreground/20" />
                      )}
                    </div>
                    <button
                      type="button" onClick={() => setActiveMediaPicker("featured")}
                      className="w-full px-3 py-2 text-[10px] font-black uppercase tracking-widest bg-muted text-foreground border border-border rounded-xl hover:border-primary hover:text-primary transition-all"
                    >
                      {formData.featuredImageId ? "Change Banner" : "Select Banner"}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Description</label>
                  <button
                    type="button"
                    onClick={generateDescription}
                    disabled={isGeneratingDesc}
                    className="flex items-center gap-1.5 text-[10px] font-black text-primary uppercase tracking-widest hover:opacity-70 disabled:opacity-50 transition-all"
                  >
                    {isGeneratingDesc ? <LuLoader className="w-3 h-3 animate-spin" /> : <LuSparkles className="w-3 h-3" />}
                    AI Description
                  </button>
                </div>
                <textarea
                  name="description" rows={4}
                  value={formData.description} onChange={handleChange}
                  placeholder="Describe the brand's unique identity..."
                  className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all resize-none leading-relaxed"
                />
              </div>
            </form>
          </div>

          <div className="p-6 border-t border-border bg-muted/10 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-muted-foreground hover:bg-muted transition-colors">
              Cancel
            </button>
            <button
              type="submit" form="brand-form" disabled={loading}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:shadow-theme-md hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0 cursor-pointer"
            >
              {loading ? <LuLoader className="w-4 h-4 animate-spin" /> : <LuSave className="w-4 h-4" />}
              {isEdit ? "Update" : "Save"} Brand
            </button>
          </div>
        </div>
      </div>

      {/* Media Picker Overlay */}
      {activeMediaPicker && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-10 bg-background/90 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
          <div className="w-full max-w-6xl relative shadow-theme-2xl rounded-3xl overflow-hidden border border-border flex flex-col bg-card h-full max-h-[85vh]">
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/10 shrink-0">
              <h3 className="font-black text-foreground uppercase tracking-tight text-sm">
                Select {activeMediaPicker === 'logo' ? 'Brand Logo' : 'Featured Banner'}
              </h3>
              <button onClick={() => setActiveMediaPicker(null)} className="p-1.5 bg-background border border-border hover:bg-destructive hover:text-white rounded-xl transition-colors">
                <LuX className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-background flex-1 overflow-hidden">
              <MediaManager isPicker={true} onSelect={handleMediaSelect} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}