"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import MediaManager from "@/components/dashboard/shared/media/MediaManager";

export interface SelectedMediaData {
    url: string;
    type: "IMAGE" | "VIDEO";
}

interface PageMediaAddinProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (medias: SelectedMediaData[]) => void;
}

export default function PageMediaAddin({ isOpen, onClose, onSelect }: PageMediaAddinProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen || !mounted) return null;

    const isVideo = (url?: string) => url ? /\.(mp4|webm|ogg|mov)$/i.test(url) : false;

    return createPortal(
        <div className="fixed inset-0 z-99999 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 transition-all">
            <div className="bg-background w-full max-w-4xl h-full max-h-[75vh] rounded-3xl shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden border border-border animate-in zoom-in-95 duration-200">

                <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card z-10 shrink-0">
                    <div>
                        <h3 className="text-lg font-black uppercase tracking-tight text-heading">Select Media</h3>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Choose images or videos for your blocks</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 bg-muted/50 hover:bg-destructive hover:text-white text-muted-foreground rounded-full flex items-center justify-center transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-hidden relative bg-background">
                    <MediaManager
                        isPicker={true}
                        multiple={true} // 🔥 ENABLED MULTIPLE SELECTION!
                        onSelect={(medias: any) => {
                            const mediaArray = Array.isArray(medias) ? medias : [medias];

                            if (mediaArray.length === 0) return;

                            // Format all selected media
                            const formattedMedias = mediaArray.map(media => {
                                const url = media.originalUrl || media.thumbUrl;
                                const type = (media.mediaType === "VIDEO" || isVideo(url)) ? ("VIDEO" as const)  : ("IMAGE" as const);
                                return { url, type };
                            });

                            onSelect(formattedMedias);
                            onClose();
                        }}
                    />
                </div>
            </div>
        </div>,
        document.body
    );
}