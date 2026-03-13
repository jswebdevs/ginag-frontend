"use client";

import { useState, MouseEvent, useRef, useEffect } from "react";
import { ImageIcon, Film, Maximize } from "lucide-react";

interface ProductGalleryProps {
    featuredImage?: { originalUrl: string; thumbUrl?: string };
    images: { originalUrl: string; thumbUrl?: string }[];
    productName: string;
    currentVariation?: any; // 🔥 NEW PROPTYPE
}

export default function ProductGallery({ featuredImage, images, productName, currentVariation }: ProductGalleryProps) {
    // 1. Determine which set of images to use (Variation specific or Main Product fallback)
    // Remember: variation images are just arrays of strings (URLs) based on your Prisma schema.

    // Determine Featured Image
    const displayFeatured = currentVariation?.featuredImage
        ? { originalUrl: currentVariation.featuredImage }
        : featuredImage;

    // Determine Gallery Array
    const displayGallery = (currentVariation?.gallery && currentVariation.gallery.length > 0)
        ? currentVariation.gallery.map((url: string) => ({ originalUrl: url })) // Format to match main images array
        : images;

    // Combine them
    const allImages = displayFeatured ? [displayFeatured, ...displayGallery] : displayGallery;
    const defaultImg = allImages[0]?.originalUrl || null;

    const [activeImage, setActiveImage] = useState<string | null>(defaultImg);
    const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
    const [isHovering, setIsHovering] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);

    // 🔥 NEW: Whenever the variation changes, automatically switch the active image to the new variation's featured image!
    useEffect(() => {
        if (allImages.length > 0) {
            setActiveImage(allImages[0].originalUrl);
        }
    }, [currentVariation]);

    // Helper to detect if the URL is a video
    const isVideo = (url?: string | null) => url ? /\.(mp4|webm|ogg|mov)$/i.test(url) : false;

    // Mouse tracking for zoom effect
    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (isVideo(activeImage)) return;

        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setZoomPos({ x, y });
    };

    const handleFullscreen = () => {
        if (videoRef.current) {
            if (videoRef.current.requestFullscreen) {
                videoRef.current.requestFullscreen();
            } else if ((videoRef.current as any).webkitRequestFullscreen) {
                (videoRef.current as any).webkitRequestFullscreen();
            } else if ((videoRef.current as any).msRequestFullscreen) {
                (videoRef.current as any).msRequestFullscreen();
            }
        }
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
                        <div className="w-full h-full relative bg-black flex items-center justify-center group/video">
                            <video
                                ref={videoRef}
                                src={activeImage}
                                controls autoPlay muted loop playsInline
                                className="w-full h-full object-contain"
                            />
                            <button
                                onClick={handleFullscreen}
                                className="absolute top-4 right-4 p-2.5 bg-black/60 text-white rounded-xl backdrop-blur-sm opacity-0 group-hover/video:opacity-100 hover:bg-primary transition-all shadow-lg"
                                title="View Fullscreen"
                            >
                                <Maximize className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <>
                            <img
                                src={activeImage}
                                alt={productName}
                                className={`w-full h-full object-cover transition-opacity duration-300 ${isHovering ? 'opacity-0' : 'opacity-100'}`}
                            />
                            <div
                                className={`absolute inset-0 w-full h-full bg-no-repeat transition-opacity duration-300 pointer-events-none ${isHovering ? 'opacity-100' : 'opacity-0'}`}
                                style={{
                                    backgroundImage: `url(${activeImage})`,
                                    backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                                    backgroundSize: '200%',
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
                                key={`${img.originalUrl}-${idx}`} // Use URL to force re-render if it changes
                                onClick={() => setActiveImage(img.originalUrl)}
                                className={`relative w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all bg-muted ${activeImage === img.originalUrl
                                    ? 'border-primary ring-2 ring-primary/20 scale-105 shadow-sm'
                                    : 'border-transparent hover:border-primary/50'
                                    }`}
                            >
                                {mediaIsVideo ? (
                                    <>
                                        <video src={img.originalUrl} preload="metadata" className="w-full h-full object-cover opacity-70" />
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