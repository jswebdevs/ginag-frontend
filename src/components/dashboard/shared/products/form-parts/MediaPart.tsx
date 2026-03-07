"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Star, Save, X, Loader2, UserCircle, Plus } from "lucide-react";
// Adjust this path if your MediaManager is located elsewhere
import MediaManager from "@/components/shared/media/MediaManager";

interface ReviewFormData {
  name: string;
  rating: number;
  comment: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  avatarID?: string | null;
  avatarUrl?: string | null;
}

interface ReviewFormProps {
  initialData?: ReviewFormData;
  onSubmit: (data: ReviewFormData) => Promise<void>;
  isLoading: boolean;
}

export default function ReviewForm({ initialData, onSubmit, isLoading }: ReviewFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<ReviewFormData>({
    name: "",
    rating: 5,
    comment: "",
    status: "APPROVED",
    avatarID: null,
    avatarUrl: null
  });

  const [isMediaManagerOpen, setIsMediaManagerOpen] = useState(false);

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleMediaSelect = (media: any) => {
    setFormData({
      ...formData,
      avatarID: media.id,
      avatarUrl: media.thumbUrl || media.originalUrl
    });
    setIsMediaManagerOpen(false);
  };

  const removeAvatar = () => {
    setFormData({ ...formData, avatarID: null, avatarUrl: null });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-3xl shadow-theme-sm overflow-hidden max-w-2xl mx-auto">
        <div className="p-6 md:p-8 space-y-8">

          {/* --- AVATAR SELECTION --- */}
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="relative w-28 h-28 bg-muted rounded-full border-2 border-dashed border-border overflow-hidden group shadow-sm">
              {formData.avatarUrl ? (
                <div className="relative h-full w-full">
                  <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
                    <button type="button" onClick={() => setIsMediaManagerOpen(true)} className="bg-white text-black px-3 py-1.5 rounded-xl text-[10px] font-black shadow-xl hover:scale-105">Change</button>
                    <button type="button" onClick={removeAvatar} className="text-white/80 hover:text-red-400 text-[10px] font-bold flex items-center gap-1"><X size={12} /> Remove</button>
                  </div>
                </div>
              ) : (
                <button type="button" onClick={() => setIsMediaManagerOpen(true)} className="h-full w-full flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors hover:bg-muted/50">
                  <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center shadow-sm"><Plus size={16} /></div>
                  <span className="text-[10px] font-bold uppercase tracking-wider">Photo</span>
                </button>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* Reviewer Name */}
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
                Reviewer Name <span className="text-destructive">*</span>
              </label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground transition-all"
                placeholder="e.g. Jane Doe"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Rating */}
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
                  Star Rating <span className="text-destructive">*</span>
                </label>
                <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-4 py-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="focus:outline-none hover:scale-110 transition-transform"
                    >
                      <Star
                        size={24}
                        className={star <= formData.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}
                      />
                    </button>
                  ))}
                  <span className="ml-auto text-sm font-bold text-muted-foreground">
                    {formData.rating} / 5
                  </span>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
                  Display Status <span className="text-destructive">*</span>
                </label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground transition-all cursor-pointer"
                >
                  <option value="APPROVED">🟢 Approved (Visible)</option>
                  <option value="PENDING">🟡 Pending (Hidden)</option>
                  <option value="REJECTED">🔴 Rejected (Hidden)</option>
                </select>
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
                Testimonial Content <span className="text-destructive">*</span>
              </label>
              <textarea
                required
                rows={5}
                value={formData.comment}
                onChange={e => setFormData({ ...formData, comment: e.target.value })}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground resize-none transition-all custom-scrollbar"
                placeholder="What did they say about your store?"
              />
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-6 border-t border-border bg-muted/10 flex flex-col-reverse sm:flex-row gap-3 justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 rounded-xl font-bold text-muted-foreground hover:bg-muted transition-colors flex items-center justify-center gap-2"
          >
            <X size={18} /> Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-theme-sm disabled:opacity-50"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {initialData ? "Update Testimonial" : "Publish Testimonial"}
          </button>
        </div>
      </form>

      {/* --- MEDIA MANAGER MODAL (Exact match from MediaPart) --- */}
      {isMediaManagerOpen && (
        <div className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-8">
          <div className="bg-card border border-border rounded-3xl w-full max-w-6xl h-full max-h-[85vh] flex flex-col overflow-hidden shadow-theme-2xl animate-in zoom-in-95">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/10">
              <h3 className="font-black text-foreground uppercase tracking-wider text-sm">
                Select Profile Photo
              </h3>
              <button
                type="button"
                onClick={() => setIsMediaManagerOpen(false)}
                className="p-2 bg-background border border-border hover:bg-destructive hover:text-white rounded-xl transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-hidden bg-background">
              <MediaManager
                isPicker
                multiple={false}
                onSelect={handleMediaSelect}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}