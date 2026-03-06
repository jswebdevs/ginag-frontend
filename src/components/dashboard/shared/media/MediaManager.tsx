"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { UploadCloud, Image as ImageIcon, Trash2, Copy, Check, Loader2, X } from "lucide-react";

interface MediaManagerProps {
  isPicker?: boolean; 
  multiple?: boolean; // NEW: Supports array selection
  onSelect?: (media: any | any[]) => void;
}

export default function MediaManager({ isPicker = false, multiple = false, onSelect }: MediaManagerProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "library">("library");
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Selection & Upload States
  const [previewItem, setPreviewItem] = useState<any | null>(null); // For the sidebar
  const [selectedItems, setSelectedItems] = useState<any[]>([]); // For the checkmarks
  const [isUploading, setIsUploading] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await api.get('/media');
      setMediaItems(res.data.data || res.data || []);
    } catch (error) {
      console.error("Failed to fetch media:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "library") fetchMedia();
  }, [activeTab]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', files[0]); 

    try {
      await api.post('/media', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setActiveTab("library");
      fetchMedia();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this file permanently?")) return;
    try {
      await api.delete(`/media/${id}`);
      setPreviewItem(null);
      setSelectedItems(selectedItems.filter(i => i.id !== id));
      fetchMedia();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // NEW: Handles clicking an image in the grid
  const handleItemClick = (item: any) => {
    setPreviewItem(item); // Always show details in sidebar

    if (multiple) {
      const isSelected = selectedItems.some(i => i.id === item.id);
      if (isSelected) {
        setSelectedItems(selectedItems.filter(i => i.id !== item.id));
      } else {
        setSelectedItems([...selectedItems, item]);
      }
    } else {
      setSelectedItems([item]);
    }
  };

  // Helper to check if an item has a checkmark
  const isSelected = (id: string) => selectedItems.some(i => i.id === id);

  return (
    <div className="flex flex-col h-full min-h-[60vh] bg-card border border-border rounded-2xl shadow-theme-lg overflow-hidden">
      
      {/* TOP TABS */}
      <div className="flex items-center gap-6 px-6 border-b border-border bg-muted/10 shrink-0">
        <button 
          onClick={() => setActiveTab("library")}
          className={`py-4 text-sm font-bold border-b-2 transition-all ${activeTab === "library" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          Media Library
        </button>
        <button 
          onClick={() => setActiveTab("upload")}
          className={`py-4 text-sm font-bold border-b-2 transition-all ${activeTab === "upload" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          Upload Files
        </button>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* UPLOAD ZONE */}
        {activeTab === "upload" && (
          <div className="flex-1 flex items-center justify-center p-6 bg-muted/5 animate-in fade-in">
            <label className="w-full max-w-2xl h-64 border-2 border-dashed border-border hover:border-primary/50 rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-colors bg-card hover:bg-muted/10">
              <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
              {isUploading ? (
                <>
                  <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                  <p className="text-foreground font-bold">Uploading...</p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <UploadCloud className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-black text-foreground mb-2">Drop files to upload</h3>
                  <p className="text-muted-foreground">or click to select files</p>
                </>
              )}
            </label>
          </div>
        )}

        {/* MEDIA LIBRARY GRID */}
        {activeTab === "library" && (
          <div className={`flex-1 overflow-y-auto p-4 transition-all duration-300 ${previewItem ? 'md:pr-80' : ''} custom-scrollbar`}>
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : mediaItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                <ImageIcon className="w-12 h-12 mb-4 opacity-20" />
                <p>No media files found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 auto-rows-max">
                {mediaItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all group bg-muted ${isSelected(item.id) ? 'border-primary ring-4 ring-primary/20' : 'border-border hover:border-primary/50'}`}
                  >
                    <img 
                      src={item.thumbUrl || item.originalUrl} 
                      alt={item.title || "Media"} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    {/* Checkmark when selected */}
                    {isSelected(item.id) && (
                      <div className="absolute top-2 right-2 bg-primary text-white p-1 rounded-md shadow-md animate-in zoom-in">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* RIGHT SIDEBAR: ATTACHMENT DETAILS */}
        {activeTab === "library" && previewItem && (
          <div className="absolute top-0 right-0 h-full w-full md:w-80 bg-card border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right-8 duration-300 z-10">
            
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/10 shrink-0">
              <h3 className="font-black text-foreground uppercase tracking-wider text-sm">Attachment Details</h3>
              <button onClick={() => setPreviewItem(null)} className="p-1 hover:bg-muted rounded text-muted-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
              <div className="aspect-square bg-muted rounded-xl border border-border/50 overflow-hidden flex items-center justify-center p-2">
                <img src={previewItem.originalUrl} alt={previewItem.title} className="max-w-full max-h-full object-contain drop-shadow-md" />
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground font-bold text-xs uppercase tracking-wider">File name</p>
                  <p className="text-foreground break-all font-medium">{previewItem.filename || previewItem.title}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <label className="text-muted-foreground font-bold text-xs uppercase tracking-wider mb-2 block">File URL</label>
                <div className="flex items-center gap-2">
                  <input type="text" readOnly value={previewItem.originalUrl} className="w-full bg-muted border border-border rounded-lg p-2 text-xs text-foreground outline-none" />
                  <button onClick={() => handleCopyUrl(previewItem.originalUrl)} className="p-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg transition-colors shrink-0" title="Copy URL">
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex flex-col gap-3 pb-8">
                <button onClick={() => handleDelete(previewItem.id)} className="flex items-center justify-center gap-2 w-full py-2.5 text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/20 rounded-xl font-bold transition-all text-sm">
                  <Trash2 className="w-4 h-4" /> Delete Permanently
                </button>

                {/* THE SELECTION SUBMIT BUTTON */}
                {isPicker && onSelect && selectedItems.length > 0 && (
                  <button 
                    onClick={() => {
                      onSelect(multiple ? selectedItems : selectedItems[0]);
                      setSelectedItems([]); // reset
                    }}
                    className="w-full py-3 mt-4 bg-primary text-primary-foreground font-black rounded-xl shadow-theme-md hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                  >
                    <Check size={18} />
                    {multiple ? `Insert ${selectedItems.length} Images` : `Set as Featured Image`}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}