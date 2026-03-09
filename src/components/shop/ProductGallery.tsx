"use client";

import { useState, MouseEvent } from "react";
import { ImageIcon, Film } from "lucide-react";

interface ProductGalleryProps {
    featuredImage?: { originalUrl: string; thumbUrl?: string };
    images: { originalUrl: string; thumbUrl?: string }[];
    productName: string;
}

export default function ProductGallery({ featuredImage, images, productName }: ProductGalleryProps) {
    const defaultImg = featuredImage?.originalUrl || images?.[0]?.originalUrl || null;
    const [activeImage, setActiveImage] = useState<string | null>(defaultImg);
    const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
    const [isHovering, setIsHovering] = useState(false);

    // Combine featured and gallery images, filtering out duplicates if needed
    const allImages = featuredImage ? [featuredImage, ...images] : images;

    // Helper to detect if the URL is a video
    const isVideo = (url?: string | null) => url ? /\.(mp4|webm|ogg|mov)$/i.test(url) : false;

    // Mouse tracking for zoom effect (Only applied to images)
    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (isVideo(activeImage)) return; // Disable zoom tracking for videos

        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setZoomPos({ x, y });
    };

    return (
        <div className="space-y-4 lg:sticky lg:top-24 z-10">

            {/* MAIN DISPLAY AREA */}
            <div
                className={`aspect-[4/5] sm:aspect-square bg-card border border-border rounded-3xl overflow-hidden relative flex items-center justify-center group ${!isVideo(activeImage) ? 'cursor-crosshair' : ''}`}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                {activeImage ? (
                    isVideo(activeImage) ? (
                        // VIDEO RENDERER
                        <video
                            src={activeImage}
                            controls
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover bg-black"
                        />
                    ) : (
                        // IMAGE RENDERER WITH ZOOM
                        <>
                            <img
                                src={activeImage}
                                alt={productName}
                                className={`w-full h-full object-cover transition-opacity duration-300 ${isHovering ? 'opacity-0' : 'opacity-100'}`}
                            />
                            {/* Zoom Overlay */}
                            <div
                                className={`absolute inset-0 w-full h-full bg-no-repeat transition-opacity duration-300 pointer-events-none ${isHovering ? 'opacity-100' : 'opacity-0'}`}
                                style={{
                                    backgroundImage: `url(${activeImage})`,
                                    backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                                    backgroundSize: '200%', // Adjust zoom level here
                                }}
                            />
                        </>
                    )
                ) : (
                    <ImageIcon className="w-20 h-20 text-muted-foreground/30" />
                )}
            </div>

            {/* THUMBNAILS CAROUSEL */}
            {allImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                    {allImages.map((img, idx) => {
                        const mediaIsVideo = isVideo(img.originalUrl);

                        return (
                            <button
                                key={idx}
                                onClick={() => setActiveImage(img.originalUrl)}
                                className={`relative w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all bg-muted ${activeImage === img.originalUrl
                                        ? 'border-primary ring-2 ring-primary/20'
                                        : 'border-transparent hover:border-primary/50'
                                    }`}
                            >
                                {mediaIsVideo ? (
                                    <>
                                        {/* The browser will automatically grab the first frame of the video to act as a thumbnail */}
                                        <video
                                            src={img.originalUrl}
                                            preload="metadata"
                                            className="w-full h-full object-cover opacity-70"
                                        />
                                        <Film className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-white drop-shadow-md" />
                                    </>
                                ) : (
                                    <img
                                        src={img.thumbUrl || img.originalUrl}
                                        className="w-full h-full object-cover"
                                        alt={`Thumbnail ${idx}`}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            )}

        </div>
    );
}