"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { UploadCloud, Image as ImageIcon, Trash2, Copy, Check, Loader2, X, Film, Search } from "lucide-react";
import Swal from "sweetalert2";

interface MediaManagerProps {
  isPicker?: boolean;
  multiple?: boolean;
  onSelect?: (media: any | any[]) => void;
}

export default function MediaManager({ isPicker = false, multiple = false, onSelect }: MediaManagerProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "library">("library");
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Infinite Scroll States
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(20);

  // Selection & Upload States
  const [previewItem, setPreviewItem] = useState<any | null>(null);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
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

  // Reset pagination when search changes
  useEffect(() => {
    setVisibleCount(20);
  }, [searchQuery, activeTab]);

  // --- FILTERING & PAGINATION ---
  const filteredItems = mediaItems.filter((item) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const searchableText = (item.filename || item.title || item.originalUrl || "").toLowerCase();
    return searchableText.includes(query);
  });

  const visibleItems = filteredItems.slice(0, visibleCount);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    // If scrolled within 100px of the bottom, load more
    if (scrollHeight - scrollTop <= clientHeight + 100) {
      if (visibleCount < filteredItems.length) {
        setVisibleCount((prev) => prev + 20);
      }
    }
  };

  // --- BULK UPLOAD HANDLER ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB limit per file

    const oversizedFiles = fileList.filter(f => f.size > MAX_SIZE);
    if (oversizedFiles.length > 0) {
      Swal.fire({
        title: "Some files are too large",
        text: `${oversizedFiles.length} file(s) exceed the 10MB limit and will be skipped.`,
        icon: "warning",
        confirmButtonColor: "#0ea5e9"
      });
    }

    const validFiles = fileList.filter(f => f.size <= MAX_SIZE);
    if (validFiles.length === 0) {
      e.target.value = ''; // Reset input
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    validFiles.forEach(file => formData.append('files', file));

    try {
      await api.post('/media', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setActiveTab("library");
      fetchMedia();
      Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Upload complete!', showConfirmButton: false, timer: 1500 });
    } catch (error: any) {
      console.error("Upload failed:", error);
      Swal.fire({
        title: "Upload Failed",
        text: error.response?.data?.message || "Failed to upload media. Ensure backend uses upload.array('files').",
        icon: "error",
        confirmButtonColor: "#0ea5e9"
      });
    } finally {
      setIsUploading(false);
      e.target.value = ''; // Reset input
    }
  };

  // --- BULK DELETE HANDLER ---
  const handleBulkDelete = async () => {
    const idsToDelete = selectedItems.map(item => item.id);
    if (idsToDelete.length === 0) return;

    const result = await Swal.fire({
      title: `Delete ${idsToDelete.length} item(s)?`,
      text: "These files will be permanently removed from storage.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete!",
      reverseButtons: true
    });

    if (!result.isConfirmed) return;

    try {
      await api.request({
        method: 'DELETE',
        url: '/media',
        data: { ids: idsToDelete }
      });

      setPreviewItem(null);
      setSelectedItems([]);
      fetchMedia();

      Swal.fire({
        title: "Deleted!",
        text: "The files have been permanently removed.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error("Delete failed:", error);
      Swal.fire("Error", "Failed to delete files.", "error");
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleItemClick = (item: any) => {
    const isAlreadySelected = selectedItems.some(i => i.id === item.id);

    if (multiple || !isPicker) {
      if (isAlreadySelected) {
        setSelectedItems(selectedItems.filter(i => i.id !== item.id));
        if (previewItem?.id === item.id) setPreviewItem(null);
      } else {
        setSelectedItems([...selectedItems, item]);
        setPreviewItem(item);
      }
    } else {
      setSelectedItems([item]);
      setPreviewItem(item);
    }
  };

  const isSelected = (id: string) => selectedItems.some(i => i.id === id);

  const isVideo = (url: string) => {
    if (!url) return false;
    return /\.(mp4|webm|ogg|mov)$/i.test(url);
  };

  return (
    <div className="flex flex-col h-full min-h-[70vh] bg-card border border-border rounded-2xl shadow-theme-lg overflow-hidden relative">

      {/* TOP TABS & BULK ACTIONS */}
      <div className="flex items-center justify-between px-6 border-b border-border bg-muted/10 shrink-0">
        <div className="flex gap-6">
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

        {/* BULK DELETE BUTTON */}
        {activeTab === "library" && selectedItems.length > 1 && (
          <button
            onClick={handleBulkDelete}
            className="flex items-center gap-2 px-4 py-1.5 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg text-xs font-bold hover:bg-destructive hover:text-white transition-all animate-in zoom-in"
          >
            <Trash2 size={14} />
            Delete Selected ({selectedItems.length})
          </button>
        )}
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* UPLOAD ZONE */}
        {activeTab === "upload" && (
          <div className="flex-1 flex items-center justify-center p-6 bg-muted/5 animate-in fade-in">
            <label className="w-full max-w-2xl h-80 border-2 border-dashed border-border hover:border-primary/50 rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-colors bg-card hover:bg-muted/10 group">
              <input type="file" multiple className="hidden" accept="image/*,video/*" onChange={handleFileUpload} disabled={isUploading} />
              {isUploading ? (
                <div className="text-center">
                  <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                  <p className="text-foreground font-bold">Uploading files...</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-black text-foreground mb-2">Select Multiple Files</h3>
                  <p className="text-muted-foreground">Drag & drop or click to browse (Max 10MB each)</p>
                </div>
              )}
            </label>
          </div>
        )}

        {/* MEDIA LIBRARY GRID + SEARCH */}
        {activeTab === "library" && (
          <div className={`flex flex-col flex-1 transition-all duration-300 min-w-0 ${previewItem ? 'md:pr-80' : ''}`}>

            {/* SEARCH BAR */}
            <div className="p-4 border-b border-border bg-card shrink-0">
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search media by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-muted/50 border border-border rounded-xl text-sm font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-foreground"
                />
              </div>
            </div>

            {/* GRID AREA */}
            <div
              className="flex-1 overflow-y-auto p-4 custom-scrollbar"
              onScroll={handleScroll}
            >
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                  <Search className="w-12 h-12 mb-4 opacity-20" />
                  <p className="font-medium">No media files found matching "{searchQuery}".</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 auto-rows-max">
                  {visibleItems.map((item) => {
                    const mediaIsVideo = isVideo(item.originalUrl);

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleItemClick(item)}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all group bg-muted ${isSelected(item.id) ? 'border-primary ring-4 ring-primary/20' : 'border-border hover:border-primary/50'}`}
                      >
                        {mediaIsVideo ? (
                          <video
                            src={item.originalUrl}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            muted loop playsInline
                            onMouseEnter={(e) => e.currentTarget.play()}
                            onMouseLeave={(e) => e.currentTarget.pause()}
                          />
                        ) : (
                          <img
                            src={item.thumbUrl || item.originalUrl}
                            alt={item.title || "Media"}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                        )}

                        {mediaIsVideo && (
                          <div className="absolute bottom-2 left-2 bg-black/60 text-white p-1 rounded shadow-md pointer-events-none">
                            <Film size={12} />
                          </div>
                        )}

                        {isSelected(item.id) && (
                          <div className="absolute top-2 right-2 bg-primary text-white p-1 rounded-md shadow-md animate-in zoom-in">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
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
              <div className="aspect-square bg-muted rounded-xl border border-border/50 overflow-hidden flex items-center justify-center p-2 relative">
                {isVideo(previewItem.originalUrl) ? (
                  <video src={previewItem.originalUrl} controls className="max-w-full max-h-full object-contain rounded-lg drop-shadow-md" />
                ) : (
                  <img src={previewItem.originalUrl} alt={previewItem.title} className="max-w-full max-h-full object-contain drop-shadow-md" />
                )}
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground font-bold text-xs uppercase tracking-wider">File name</p>
                  <p className="text-foreground break-all font-medium">{previewItem.filename || previewItem.title || "Uploaded File"}</p>
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
                {/* Fallback delete if only 1 is selected */}
                {selectedItems.length === 1 && (
                  <button onClick={handleBulkDelete} className="flex items-center justify-center gap-2 w-full py-2.5 text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/20 rounded-xl font-bold transition-all text-sm">
                    <Trash2 className="w-4 h-4" /> Delete Permanently
                  </button>
                )}

                {isPicker && onSelect && selectedItems.length > 0 && (
                  <button
                    onClick={() => {
                      onSelect(multiple ? selectedItems : selectedItems[0]);
                      setSelectedItems([]);
                    }}
                    className="w-full py-3 mt-4 bg-primary text-primary-foreground font-black rounded-xl shadow-theme-md hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                  >
                    <Check size={18} />
                    {multiple ? `Insert ${selectedItems.length} Files` : `Set as Featured Media`}
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