"use client";

import { useState } from "react";
import { X, Plus, Image as ImageIcon } from "lucide-react";
import MediaManager from "@/components/dashboard/shared/media/MediaManager";

interface BlogFormMediaProps {
    featuredImage: any | null;
    onChange: (image: any | null) => void;
}

export default function BlogFormMedia({ featuredImage, onChange }: BlogFormMediaProps) {
    const [isManagerOpen, setIsManagerOpen] = useState(false);

    const handleSelect = (media: any) => {
        // Safely extract the single media object even if an array is returned
        const selectedMedia = Array.isArray(media) ? media[0] : media;
        if (!selectedMedia) return;

        onChange({
            id: selectedMedia.id,
            thumbUrl: selectedMedia.thumbUrl,
            originalUrl: selectedMedia.originalUrl,
            alt: selectedMedia.alt || "",
        });
        setIsManagerOpen(false);
    };

    const imageUrl = featuredImage?.thumbUrl || featuredImage?.originalUrl;

    return (
        <>
            <div className="space-y-3">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">
                    Featured Image
                </label>

                <div className="relative w-full aspect-[16/9] bg-muted rounded-xl border-2 border-dashed border-border overflow-hidden group shadow-sm transition-colors hover:border-primary/50">
                    {imageUrl ? (
                        <div className="relative h-full w-full bg-black">
                            <img src={imageUrl} alt="Featured" className="w-full h-full object-cover" />

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 backdrop-blur-sm z-10">
                                <button
                                    type="button"
                                    onClick={() => setIsManagerOpen(true)}
                                    className="bg-white text-black px-4 py-2 rounded-xl text-xs font-black shadow-xl hover:scale-105 transition-transform"
                                >
                                    Change Image
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onChange(null)}
                                    className="text-white/80 hover:text-red-400 text-xs font-bold flex items-center gap-1 transition-colors"
                                >
                                    <X size={14} /> Remove
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setIsManagerOpen(true)}
                            className="h-full w-full flex flex-col items-center justify-center gap-3 text-muted-foreground hover:text-primary transition-colors hover:bg-muted/50"
                        >
                            <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center shadow-sm border border-border">
                                <ImageIcon size={20} />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest">Select Image</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Media Manager Modal */}
            {isManagerOpen && (
                <div className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-8">
                    <div className="bg-card border border-border rounded-3xl w-full max-w-6xl h-full max-h-[85vh] flex flex-col overflow-hidden shadow-theme-2xl animate-in zoom-in-95">
                        <div className="p-4 border-b border-border flex justify-between items-center bg-muted/10">
                            <h3 className="font-black text-foreground uppercase tracking-wider text-sm">Select Featured Image</h3>
                            <button type="button" onClick={() => setIsManagerOpen(false)} className="p-2 bg-background border border-border hover:bg-destructive hover:text-white rounded-xl transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-hidden bg-background">
                            <MediaManager isPicker multiple={false} onSelect={handleSelect} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}