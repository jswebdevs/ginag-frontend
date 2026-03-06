"use client";

import { useState, useEffect } from "react";
import { X, Image as ImageIcon, Plus, LayoutGrid, Trash2 } from "lucide-react";
import MediaManager from "../../media/MediaManager";

export default function MediaPart({ product, update }: any) {
  const [pickerMode, setPickerMode] = useState<"featured" | "gallery" | null>(null);

  const [featuredImgObj, setFeaturedImgObj] = useState<any>(product.featuredImage || null);
  const [galleryImgObjs, setGalleryImgObjs] = useState<any[]>(product.images || []);

  useEffect(() => {
    if (product.featuredImage) setFeaturedImgObj(product.featuredImage);
    if (product.images) setGalleryImgObjs(product.images);
  }, [product.featuredImage, product.images]);

  // Handle single selection
  const handleSelectFeatured = (media: any) => {
    setFeaturedImgObj(media);
    update({ featuredImageId: media.id, featuredImage: media });
    setPickerMode(null);
  };

  // Handle multiple selection (array of media objects)
  const handleSelectGallery = (mediaArray: any[]) => {
    const existingIds = product.galleryImageIds || [];
    const newMedia = mediaArray.filter(m => !existingIds.includes(m.id));
    
    if (newMedia.length > 0) {
      const combinedIds = [...existingIds, ...newMedia.map(m => m.id)];
      const combinedObjs = [...galleryImgObjs, ...newMedia];
      setGalleryImgObjs(combinedObjs);
      update({ galleryImageIds: combinedIds, images: combinedObjs });
    }
    setPickerMode(null); // Now closes automatically because MediaManager handles bulk insertion!
  };

  const removeFeatured = () => {
    setFeaturedImgObj(null);
    update({ featuredImageId: "", featuredImage: null });
  };

  const removeGalleryImage = (idToRemove: string) => {
    const newIds = (product.galleryImageIds || []).filter((id: string) => id !== idToRemove);
    const newObjs = galleryImgObjs.filter((img: any) => img.id !== idToRemove);
    setGalleryImgObjs(newObjs);
    update({ galleryImageIds: newIds, images: newObjs });
  };

  const featuredUrl = featuredImgObj?.thumbUrl || featuredImgObj?.originalUrl;

  return (
    <div className="bg-card border border-border rounded-3xl p-8 shadow-theme-sm space-y-8">
      <h2 className="text-xl font-black text-foreground border-b border-border pb-4 tracking-tight">Part 4: Product Media</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* --- r1: FEATURED IMAGE (SINGLE) --- */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest">Main Image</label>
          <div className="relative aspect-square bg-muted rounded-3xl border-2 border-dashed border-border overflow-hidden group shadow-sm">
            {featuredUrl ? (
              <div className="relative h-full w-full">
                <img src={featuredUrl} alt="Featured" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
                    <button type="button" onClick={() => setPickerMode("featured")} className="bg-white text-black px-4 py-2 rounded-xl text-xs font-black shadow-xl hover:scale-105">Change</button>
                    <button type="button" onClick={removeFeatured} className="text-white/80 hover:text-red-400 text-xs font-bold flex items-center gap-1"><X size={14}/> Remove</button>
                </div>
              </div>
            ) : (
              <button type="button" onClick={() => setPickerMode("featured")} className="h-full w-full flex flex-col items-center justify-center gap-3 text-muted-foreground hover:text-primary transition-colors hover:bg-muted/50">
                <div className="w-14 h-14 rounded-full bg-background flex items-center justify-center shadow-sm"><Plus size={24} /></div>
                <span className="text-sm font-bold">Add Main Image</span>
              </button>
            )}
          </div>
        </div>

        {/* --- r2: GALLERY IMAGES (MULTIPLE) --- */}
        <div className="md:col-span-2 space-y-3">
          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center justify-between">
            <span>Gallery Images</span>
            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-md text-[10px] font-black">{galleryImgObjs.length} Items</span>
          </label>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 min-h-[150px] p-5 bg-muted/10 border-2 border-dashed border-border rounded-3xl items-start content-start">
            {galleryImgObjs.map((img: any) => (
              <div key={img.id} className="relative aspect-square bg-card border border-border rounded-2xl overflow-hidden group shadow-sm">
                <img src={img.thumbUrl || img.originalUrl} className="w-full h-full object-cover" alt="Gallery item" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button type="button" onClick={() => removeGalleryImage(img.id)} className="p-2 bg-destructive text-white rounded-xl shadow-xl hover:scale-110"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}

            <button type="button" onClick={() => setPickerMode("gallery")} className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-border/60 rounded-2xl text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-all group bg-background/50">
              <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center shadow-sm group-hover:scale-110 mb-2"><Plus size={20} /></div>
              <span className="text-[10px] font-bold">Add More</span>
            </button>
          </div>
        </div>
      </div>

      {/* --- MODAL --- */}
      {pickerMode && (
        <div className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-8">
          <div className="bg-card border border-border rounded-3xl w-full max-w-6xl h-full max-h-[85vh] flex flex-col overflow-hidden shadow-theme-2xl animate-in zoom-in-95">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/10">
              <h3 className="font-black text-foreground uppercase tracking-wider text-sm">
                {pickerMode === 'featured' ? 'Select Main Image' : 'Select Gallery Images'}
              </h3>
              <button onClick={() => setPickerMode(null)} className="p-2 bg-background border border-border hover:bg-destructive hover:text-white rounded-xl"><X size={18} /></button>
            </div>
            
            <div className="flex-1 overflow-hidden bg-background">
              <MediaManager 
                isPicker 
                multiple={pickerMode === 'gallery'} 
                onSelect={pickerMode === 'featured' ? handleSelectFeatured : handleSelectGallery} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}