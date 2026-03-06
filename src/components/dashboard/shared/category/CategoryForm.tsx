"use client";

import { useState, useRef, useEffect } from "react";
import api from "@/lib/axios";
import { X, Loader2, Save, ChevronDown, Image as ImageIcon, Search } from "lucide-react";

// Updated paths based on your new structure
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
        <div className="bg-card w-full max-w-lg border border-border rounded-3xl shadow-theme-2xl overflow-hidden flex flex-col max-h-[90vh]">
          
          <div className="flex items-center justify-between p-6 border-b border-border bg-muted/10">
            <h2 className="text-xl font-black text-foreground">
              {isEdit ? "Edit Category" : "Add New Category"}
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

            <form id="category-form" onSubmit={handleSubmit} className="space-y-5">
              
              {/* Name & Slug */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Name *</label>
                  <input 
                    type="text" required name="name"
                    value={formData.name} onChange={handleChange}
                    placeholder="e.g. Smart Watches"
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

              {/* Custom Parent Category Dropdown (Shows exactly 5 items and scrolls) */}
              <div className="relative" ref={parentDropdownRef}>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Parent Category</label>
                <div 
                  onClick={() => setIsParentDropdownOpen(!isParentDropdownOpen)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:ring-2 focus:ring-primary outline-none transition-all flex items-center justify-between cursor-pointer select-none hover:bg-muted/30"
                >
                  <span className={formData.parentId ? "text-foreground font-medium" : "text-muted-foreground"}>
                    {selectedParentName}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isParentDropdownOpen ? "rotate-180" : ""}`} />
                </div>

                {isParentDropdownOpen && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-card border border-border rounded-xl shadow-theme-xl z-50 overflow-hidden">
                    <div className="max-h-[210px] overflow-y-auto custom-scrollbar flex flex-col p-1">
                      <div 
                        onClick={() => { setFormData({ ...formData, parentId: "" }); setIsParentDropdownOpen(false); }}
                        className={`px-3 py-2.5 text-sm rounded-lg cursor-pointer transition-colors ${formData.parentId === "" ? "bg-primary text-primary-foreground font-bold" : "hover:bg-muted text-foreground"}`}
                      >
                        None (Top Level)
                      </div>
                      {availableParents.map(cat => (
                        <div 
                          key={cat.id}
                          onClick={() => { setFormData({ ...formData, parentId: cat.id }); setIsParentDropdownOpen(false); }}
                          className={`px-3 py-2.5 text-sm rounded-lg cursor-pointer transition-colors ${formData.parentId === cat.id ? "bg-primary text-primary-foreground font-bold" : "hover:bg-muted text-foreground"}`}
                        >
                          {cat.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Media & Icon Pickers */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* 1. Icon Picker */}
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Category Icon</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" name="icon"
                      value={formData.icon} onChange={handleChange}
                      placeholder="e.g. Monitor"
                      className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-foreground focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowIconPicker(true)}
                      className="px-3 bg-muted text-foreground border border-border rounded-xl hover:border-primary hover:text-primary transition-all flex items-center justify-center shrink-0"
                      title="Browse Icons"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 2. Featured Image Picker */}
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Featured Image</label>
                  <div className="flex gap-3 items-center">
                    <div className="w-11 h-11 bg-muted border border-border rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                      {mediaPreview ? (
                        <img src={mediaPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-muted-foreground/50" />
                      )}
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setShowMediaPicker(true)}
                      className="flex-1 px-3 py-2.5 text-sm font-bold bg-background text-foreground border border-border rounded-xl hover:border-primary hover:text-primary transition-all text-center"
                    >
                      {formData.featuredImageId ? "Change Image" : "Select Image"}
                    </button>
                  </div>
                </div>

              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Description</label>
                <textarea 
                  name="description" rows={3}
                  value={formData.description} onChange={handleChange}
                  placeholder="Brief description of the category..."
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
              type="submit" form="category-form" disabled={loading}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold hover:shadow-theme-md hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {isEdit ? "Update" : "Save"} Category
            </button>
          </div>

        </div>
      </div>

      {/* --- MEDIA MANAGER MODAL OVERLAY --- */}
      {showMediaPicker && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-10 bg-background/90 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
          <div className="w-full max-w-6xl relative shadow-theme-2xl rounded-2xl overflow-hidden border border-border flex flex-col bg-card h-full max-h-[85vh]">
            
            {/* Modal Header for Media Manager */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/10 shrink-0">
              <h3 className="font-black text-foreground">Select Featured Image</h3>
              <button onClick={() => setShowMediaPicker(false)} className="p-1.5 bg-background border border-border hover:bg-destructive hover:text-white rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* The actual MediaManager Component acting as a picker */}
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