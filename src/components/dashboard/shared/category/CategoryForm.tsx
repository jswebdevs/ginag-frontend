"use client";

import { useState, useRef, useEffect } from "react";
import api from "@/lib/axios";
import Image from "next/image";
import Swal from "sweetalert2";
import { generateAIContent } from "@/services/ai.service";

// 🔥 Use stable static icons from React Icons
import {
  LuX,
  LuLoader,
  LuSave,
  LuChevronDown,
  LuImage,
  LuSearch,
  LuSparkles
} from "react-icons/lu";

import MediaManager from "@/components/dashboard/shared/media/MediaManager";
import IconPickerModal from "@/components/dashboard/shared/icon/IconPickerModal";

interface CategoryFormProps {
  initialData?: any;
  categories: any[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function CategoryForm({ initialData, categories, onClose, onSuccess }: CategoryFormProps) {
  const isEdit = !!initialData;

  // --- Form States ---
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    parentId: initialData?.parentId || "",
    icon: initialData?.icon || "",
    featuredImageId: initialData?.featuredImageId || "",
  });

  const [loading, setLoading] = useState(false);
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [error, setError] = useState("");

  // --- UI States ---
  const [isParentDropdownOpen, setIsParentDropdownOpen] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);

  // To show a visual preview of the selected image
  const [mediaPreview, setMediaPreview] = useState<string | null>(
    initialData?.featuredImage?.thumbUrl || initialData?.featuredImage?.originalUrl || null
  );

  const parentDropdownRef = useRef<HTMLDivElement>(null);

  // Close custom dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (parentDropdownRef.current && !parentDropdownRef.current.contains(event.target as Node)) {
        setIsParentDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- AI GENERATION: DESCRIPTION ---
  const generateDescription = async () => {
    if (!formData.name) {
      return Swal.fire("Name Required", "Please enter a category name first.", "warning");
    }

    setIsGeneratingDesc(true);
    const prompt = `Write a professional, catchy 2-sentence description for an e-commerce category named "${formData.name}". Return ONLY the description text.`;

    try {
      const aiResponse = await generateAIContent(prompt, "You are a professional e-commerce merchandiser and copywriter.");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...formData,
        parentId: formData.parentId === "" ? null : formData.parentId,
      };

      if (isEdit) {
        await api.patch(`/categories/${initialData.id}`, payload);
      } else {
        await api.post('/categories', payload);
      }
      onSuccess();
    } catch (err: any) {
      console.error("Save failed:", err);
      setError(err.response?.data?.message || "Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  // Filter out the current category so it can't be its own parent
  const availableParents = categories.filter(c => c.id !== initialData?.id);
  const selectedParentName = formData.parentId
    ? availableParents.find(c => c.id === formData.parentId)?.name
    : "None (Top Level)";

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-card w-full max-w-xl border border-border rounded-3xl shadow-theme-2xl overflow-hidden flex flex-col max-h-[90vh]">

          <div className="flex items-center justify-between p-6 border-b border-border bg-muted/10">
            <h2 className="text-xl font-black text-foreground tracking-tight">
              {isEdit ? "Edit Category" : "Add New Category"}
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

            <form id="category-form" onSubmit={handleSubmit} className="space-y-6">

              {/* Name & Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">Name *</label>
                  <input
                    type="text" required name="name"
                    value={formData.name} onChange={handleChange}
                    placeholder="e.g. Smart Watches"
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">Slug</label>
                  <input
                    type="text" name="slug"
                    value={formData.slug} onChange={handleChange}
                    placeholder="Auto-generated if blank"
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-mono focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>

              {/* Custom Parent Category Dropdown */}
              <div className="relative" ref={parentDropdownRef}>
                <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">Parent Category</label>
                <div
                  onClick={() => setIsParentDropdownOpen(!isParentDropdownOpen)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none transition-all flex items-center justify-between cursor-pointer select-none hover:bg-muted/30"
                >
                  <span className={formData.parentId ? "text-foreground font-bold" : "text-muted-foreground"}>
                    {selectedParentName}
                  </span>
                  <LuChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isParentDropdownOpen ? "rotate-180" : ""}`} />
                </div>

                {isParentDropdownOpen && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-card border border-border rounded-2xl shadow-theme-xl z-50 overflow-hidden">
                    <div className="max-h-[210px] overflow-y-auto custom-scrollbar flex flex-col p-2 gap-1">
                      <div
                        onClick={() => { setFormData({ ...formData, parentId: "" }); setIsParentDropdownOpen(false); }}
                        className={`px-3 py-2 text-sm rounded-xl cursor-pointer transition-colors ${formData.parentId === "" ? "bg-primary/10 text-primary font-bold" : "hover:bg-muted text-foreground"}`}
                      >
                        None (Top Level)
                      </div>
                      {availableParents.map(cat => (
                        <div
                          key={cat.id}
                          onClick={() => { setFormData({ ...formData, parentId: cat.id }); setIsParentDropdownOpen(false); }}
                          className={`px-3 py-2 text-sm rounded-xl cursor-pointer transition-colors ${formData.parentId === cat.id ? "bg-primary/10 text-primary font-bold" : "hover:bg-muted text-foreground"}`}
                        >
                          {cat.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Media & Icon Pickers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* 1. Icon Picker */}
                <div>
                  <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">Category Icon</label>
                  <div className="flex gap-2">
                    <input
                      type="text" name="icon"
                      value={formData.icon} onChange={handleChange}
                      placeholder="e.g. LuMonitor"
                      className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowIconPicker(true)}
                      className="px-3 bg-muted text-foreground border border-border rounded-xl hover:border-primary hover:text-primary transition-all flex items-center justify-center shrink-0"
                      title="Browse Icons"
                    >
                      <LuSearch className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 2. Featured Image Picker */}
                <div>
                  <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">Featured Image</label>
                  <div className="flex gap-3 items-center">
                    <div className="relative w-11 h-11 bg-muted/30 border border-border rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                      {mediaPreview ? (
                        <Image
                          src={mediaPreview}
                          alt="Preview"
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      ) : (
                        <LuImage className="w-5 h-5 text-muted-foreground/30" />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowMediaPicker(true)}
                      className="flex-1 px-3 py-2.5 text-[10px] uppercase tracking-widest font-black bg-muted text-foreground border border-border rounded-xl hover:border-primary hover:text-primary transition-all text-center"
                    >
                      {formData.featuredImageId ? "Change" : "Select Image"}
                    </button>
                  </div>
                </div>

              </div>

              {/* Description with AI Button */}
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
                  name="description" rows={3}
                  value={formData.description} onChange={handleChange}
                  placeholder="Brief description of the category..."
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
              type="submit" form="category-form" disabled={loading}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:shadow-theme-md hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0"
            >
              {loading ? <LuLoader className="w-4 h-4 animate-spin" /> : <LuSave className="w-4 h-4" />}
              {isEdit ? "Update" : "Save"} Category
            </button>
          </div>

        </div>
      </div>

      {/* --- MEDIA MANAGER MODAL OVERLAY --- */}
      {showMediaPicker && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-10 bg-background/90 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
          <div className="w-full max-w-6xl relative shadow-theme-2xl rounded-3xl overflow-hidden border border-border flex flex-col bg-card h-full max-h-[85vh]">

            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/10 shrink-0">
              <h3 className="font-black text-foreground uppercase tracking-tight text-sm">Select Featured Image</h3>
              <button onClick={() => setShowMediaPicker(false)} className="p-1.5 bg-background border border-border hover:bg-destructive hover:text-white rounded-xl transition-colors">
                <LuX className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-background flex-1 overflow-hidden">
              <MediaManager
                isPicker={true}
                onSelect={(media) => {
                  setFormData({ ...formData, featuredImageId: media.id });
                  setMediaPreview(media.thumbUrl || media.originalUrl);
                  setShowMediaPicker(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* --- ICON PICKER MODAL OVERLAY --- */}
      <IconPickerModal
        isOpen={showIconPicker}
        onClose={() => setShowIconPicker(false)}
        onSelect={(selectedIconName) => {
          setFormData({ ...formData, icon: selectedIconName });
          setShowIconPicker(false);
        }}
      />
    </>
  );
}