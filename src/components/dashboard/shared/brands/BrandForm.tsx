"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { X, Loader2, Save, Image as ImageIcon } from "lucide-react";
import MediaManager from "@/components/dashboard/shared/media/MediaManager";

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
  const [error, setError] = useState("");

  // Media Picker Logic
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
      console.error("Save failed:", err);
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
            <h2 className="text-xl font-black text-foreground">
              {isEdit ? "Edit Brand" : "Add New Brand"}
            </h2>
            <button onClick={onClose} className="p-1.5 text-muted-foreground hover:text-destructive bg-background border border-border rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto">
            {error && (
              <div className="mb-6 p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl text-sm font-bold">
                {error}
              </div>
            )}

            <form id="brand-form" onSubmit={handleSubmit} className="space-y-5">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Name *</label>
                  <input 
                    type="text" required name="name"
                    value={formData.name} onChange={handleChange}
                    placeholder="e.g. Apple, Sony"
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Slug</label>
                  <input 
                    type="text" name="slug"
                    value={formData.slug} onChange={handleChange}
                    placeholder="Auto-generated if blank"
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Website URL</label>
                <input 
                  type="text" name="website"
                  value={formData.website} onChange={handleChange}
                  placeholder="https://www.example.com"
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>

              {/* Media Pickers (Logo & Featured Image) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Brand Logo</label>
                  <div className="flex flex-col gap-3">
                    <div className="w-full h-24 bg-background border border-border rounded-xl flex items-center justify-center shrink-0 overflow-hidden p-2">
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo Preview" className="max-w-full max-h-full object-contain drop-shadow-sm" />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-muted-foreground/30" />
                      )}
                    </div>
                    <button 
                      type="button" onClick={() => setActiveMediaPicker("logo")}
                      className="w-full px-3 py-2 text-sm font-bold bg-muted text-foreground border border-border rounded-xl hover:border-primary hover:text-primary transition-all text-center"
                    >
                      {formData.logoId ? "Change Logo" : "Select Logo"}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Featured Banner</label>
                  <div className="flex flex-col gap-3">
                    <div className="w-full h-24 bg-muted border border-border rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                      {featuredPreview ? (
                        <img src={featuredPreview} alt="Banner Preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-muted-foreground/30" />
                      )}
                    </div>
                    <button 
                      type="button" onClick={() => setActiveMediaPicker("featured")}
                      className="w-full px-3 py-2 text-sm font-bold bg-background text-foreground border border-border rounded-xl hover:border-primary hover:text-primary transition-all text-center"
                    >
                      {formData.featuredImageId ? "Change Banner" : "Select Banner"}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Description</label>
                <textarea 
                  name="description" rows={3}
                  value={formData.description} onChange={handleChange}
                  placeholder="Brief history or description of the brand..."
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                />
              </div>
            </form>
          </div>

          <div className="p-6 border-t border-border bg-muted/10 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold text-muted-foreground hover:bg-muted transition-colors">
              Cancel
            </button>
            <button 
              type="submit" form="brand-form" disabled={loading}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold hover:shadow-theme-md hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {isEdit ? "Update" : "Save"} Brand
            </button>
          </div>

        </div>
      </div>

      {/* Media Picker Overlay */}
      {activeMediaPicker && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-10 bg-background/90 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
          <div className="w-full max-w-6xl relative shadow-theme-2xl rounded-2xl overflow-hidden border border-border flex flex-col bg-card h-full max-h-[85vh]">
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/10 shrink-0">
              <h3 className="font-black text-foreground">
                Select {activeMediaPicker === 'logo' ? 'Brand Logo' : 'Featured Banner'}
              </h3>
              <button onClick={() => setActiveMediaPicker(null)} className="p-1.5 bg-background border border-border hover:bg-destructive hover:text-white rounded-lg transition-colors">
                <X className="w-5 h-5" />
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