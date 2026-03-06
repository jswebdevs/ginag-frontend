"use client";

import MediaManager from "@/components/dashboard/shared/media/MediaManager";

export default function MediaLibraryPage() {
  return (
    <div className="p-4 md:p-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight mb-1">Media Library</h1>
        <p className="text-sm text-muted-foreground">Manage your images, icons, and files.</p>
      </div>

      {/* Render the core component - passing no props means it acts purely as a manager, not a picker */}
      <MediaManager />
    </div>
  );
}