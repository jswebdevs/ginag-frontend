"use client";

import { useState } from "react";
import { Image as ImageIcon, Upload, X } from "lucide-react";
import Image from "next/image";

// Adjust this import path to point to your actual MediaManager component
import MediaManager from "@/components/dashboard/shared/media/MediaManager";

export default function FormAvatar({ data, update }: any) {
    const [isMediaOpen, setIsMediaOpen] = useState(false);

    const handleMediaSelect = (selectedMedia: any) => {
        // If multiple=false, selectedMedia should be a single object, but we check just in case
        const media = Array.isArray(selectedMedia) ? selectedMedia[0] : selectedMedia;

        // Update the avatar field with the URL
        update({ avatar: media.originalUrl || media.url });
        setIsMediaOpen(false);
    };

    return (
        <div className="bg-card border border-border rounded-3xl p-6 shadow-theme-sm space-y-6">
            <div className="border-b border-border pb-4">
                <h3 className="font-black text-foreground uppercase tracking-widest text-sm flex items-center gap-2">
                    <ImageIcon size={16} /> Profile Picture
                </h3>
            </div>

            <div className="flex flex-col items-center gap-5">

                {/* Clickable Avatar Circle */}
                <div
                    onClick={() => setIsMediaOpen(true)}
                    className="w-32 h-32 rounded-full border-4 border-muted overflow-hidden relative bg-background flex items-center justify-center shadow-inner group cursor-pointer"
                >
                    {data.avatar ? (
                        <>
                            <Image src={data.avatar} alt="Avatar" fill className="object-cover transition-all group-hover:opacity-40" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Upload className="text-foreground drop-shadow-md w-8 h-8" />
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center text-muted-foreground group-hover:text-primary transition-colors">
                            <Upload className="w-8 h-8 mb-1" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Upload</span>
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    onClick={() => setIsMediaOpen(true)}
                    className="text-xs font-bold text-primary hover:underline bg-primary/10 px-4 py-1.5 rounded-full"
                >
                    {data.avatar ? "Change Image" : "Select from Library"}
                </button>
            </div>

            {/* Media Manager Modal Overlay */}
            {isMediaOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-card w-full max-w-4xl h-[70vh] min-h-[500px] rounded-3xl border border-border shadow-2xl flex flex-col relative overflow-hidden">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30 shrink-0">
                            <h3 className="font-black text-foreground uppercase tracking-widest text-sm">Select Profile Picture</h3>
                            <button
                                onClick={() => setIsMediaOpen(false)}
                                className="p-2 bg-background hover:bg-destructive hover:text-white rounded-xl transition-colors shadow-sm"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Media Manager Injection */}
                        <div className="flex-1 overflow-hidden">
                            <MediaManager
                                isPicker={true} // REQUIRED to show the submit button in the sidebar
                                multiple={false}
                                onSelect={handleMediaSelect}
                            />
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}