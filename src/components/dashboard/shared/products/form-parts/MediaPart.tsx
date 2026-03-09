"use client";

import { useState } from "react";
import { X, Plus, Film } from "lucide-react";
import MediaManager from "@/components/dashboard/shared/media/MediaManager";

interface MediaPartProps {
  product: {
    featuredImage?: { id: string; thumbUrl?: string; originalUrl: string };
    galleryImages: { id: string; thumbUrl?: string; originalUrl: string }[];
  };
  update: (fields: Partial<MediaPartProps["product"]>) => void;
}

export default function MediaPart({ product, update }: MediaPartProps) {
  const [isFeaturedManagerOpen, setIsFeaturedManagerOpen] = useState(false);
  const [isGalleryManagerOpen, setIsGalleryManagerOpen] = useState(false);

  const handleFeaturedSelect = (media: any) => {
    const selectedMedia = Array.isArray(media) ? media[0] : media;
    if (!selectedMedia) return;
    update({
      featuredImage: {
        id: selectedMedia.id,
        thumbUrl: selectedMedia.thumbUrl,
        originalUrl: selectedMedia.originalUrl,
      },
    });
    setIsFeaturedManagerOpen(false);
  };

  const handleGallerySelect = (medias: any) => {
    const mediaArray = Array.isArray(medias) ? medias : [medias];
    const newGallery = mediaArray.map((media: any) => ({
      id: media.id,
      thumbUrl: media.thumbUrl,
      originalUrl: media.originalUrl,
    }));
    update({ galleryImages: [...product.galleryImages, ...newGallery] });
    setIsGalleryManagerOpen(false);
  };

  const removeFeatured = () => update({ featuredImage: undefined });
  const removeGalleryImage = (id: string) => {
    update({ galleryImages: product.galleryImages.filter((img) => img.id !== id) });
  };

  // Helper to detect if the URL is a video
  const isVideo = (url?: string) => url ? /\.(mp4|webm|ogg|mov)$/i.test(url) : false;

  return (
    <>
      <div className="bg-card border border-border rounded-3xl shadow-theme-sm overflow-hidden">
        <div className="p-6 md:p-8 space-y-8">
          <h2 className="text-xl font-black text-foreground uppercase tracking-wider">Media & Images</h2>

          {/* Featured Image */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
              Featured Image <span className="text-destructive">*</span>
            </label>
            <div className="relative w-40 h-40 bg-muted rounded-xl border-2 border-dashed border-border overflow-hidden group shadow-sm">
              {product.featuredImage ? (
                <div className="relative h-full w-full bg-black">
                  {/* FIX: Render video if it's a video */}
                  {isVideo(product.featuredImage.originalUrl) ? (
                    <video src={product.featuredImage.originalUrl} className="w-full h-full object-cover opacity-80" autoPlay muted loop playsInline />
                  ) : (
                    <img src={product.featuredImage.thumbUrl || product.featuredImage.originalUrl} alt="Featured" className="w-full h-full object-cover" />
                  )}

                  {isVideo(product.featuredImage.originalUrl) && <Film className="absolute top-2 left-2 text-white/50 w-5 h-5" />}

                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 backdrop-blur-sm z-10">
                    <button type="button" onClick={() => setIsFeaturedManagerOpen(true)} className="bg-white text-black px-3 py-1.5 rounded-xl text-[10px] font-black shadow-xl hover:scale-105">Change</button>
                    <button type="button" onClick={removeFeatured} className="text-white/80 hover:text-red-400 text-[10px] font-bold flex items-center gap-1"><X size={12} /> Remove</button>
                  </div>
                </div>
              ) : (
                <button type="button" onClick={() => setIsFeaturedManagerOpen(true)} className="h-full w-full flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors hover:bg-muted/50">
                  <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center shadow-sm"><Plus size={24} /></div>
                  <span className="text-[10px] font-bold uppercase tracking-wider">Add Featured</span>
                </button>
              )}
            </div>
          </div>

          {/* Gallery Images */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Gallery Media</label>
            <div className="flex flex-wrap gap-4">
              {product.galleryImages.map((img) => (
                <div key={img.id} className="relative w-24 h-24 bg-black rounded-xl border border-border overflow-hidden group shadow-sm">
                  {/* FIX: Render video if it's a video */}
                  {isVideo(img.originalUrl) ? (
                    <video src={img.originalUrl} className="w-full h-full object-cover opacity-80" muted loop playsInline />
                  ) : (
                    <img src={img.thumbUrl || img.originalUrl} alt="Gallery" className="w-full h-full object-cover" />
                  )}

                  {isVideo(img.originalUrl) && <Film className="absolute bottom-1 left-1 text-white/70 w-4 h-4" />}

                  <button type="button" onClick={() => removeGalleryImage(img.id)} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-destructive">
                    <X size={12} />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => setIsGalleryManagerOpen(true)} className="w-24 h-24 flex flex-col items-center justify-center gap-2 text-muted-foreground border-2 border-dashed border-border rounded-xl hover:text-primary hover:bg-muted/50 transition-colors">
                <Plus size={20} />
                <span className="text-[10px] font-bold uppercase">Add</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Media Modal */}
      {isFeaturedManagerOpen && (
        <div className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-8">
          <div className="bg-card border border-border rounded-3xl w-full max-w-6xl h-full max-h-[85vh] flex flex-col overflow-hidden shadow-theme-2xl animate-in zoom-in-95">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/10">
              <h3 className="font-black text-foreground uppercase tracking-wider text-sm">Select Featured Image</h3>
              <button type="button" onClick={() => setIsFeaturedManagerOpen(false)} className="p-2 bg-background border border-border hover:bg-destructive hover:text-white rounded-xl transition-colors"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-hidden bg-background"><MediaManager isPicker multiple={false} onSelect={handleFeaturedSelect} /></div>
          </div>
        </div>
      )}

      {/* Gallery Media Modal */}
      {isGalleryManagerOpen && (
        <div className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-8">
          <div className="bg-card border border-border rounded-3xl w-full max-w-6xl h-full max-h-[85vh] flex flex-col overflow-hidden shadow-theme-2xl animate-in zoom-in-95">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/10">
              <h3 className="font-black text-foreground uppercase tracking-wider text-sm">Select Gallery Media</h3>
              <button type="button" onClick={() => setIsGalleryManagerOpen(false)} className="p-2 bg-background border border-border hover:bg-destructive hover:text-white rounded-xl transition-colors"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-hidden bg-background"><MediaManager isPicker multiple={true} onSelect={handleGallerySelect} /></div>
          </div>
        </div>
      )}
    </>
  );
}