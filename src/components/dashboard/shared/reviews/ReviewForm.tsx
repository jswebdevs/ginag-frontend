"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Star, Save, X, Loader2, UserCircle, Edit3 } from "lucide-react";
// Import the MediaManager directly
import MediaManager from "@/components/dashboard/shared/media/MediaManager";

interface ReviewFormData {
    name: string;
    rating: number;
    comment: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    avatarID?: string | null;
    avatarUrl?: string | null; // Used purely for the UI preview
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
        // MediaManager passes back the selected item
        setFormData({
            ...formData,
            avatarID: media.id,
            avatarUrl: media.thumbUrl || media.originalUrl
        });
        setIsMediaManagerOpen(false); // Close the modal
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="bg-card border border-border rounded-3xl shadow-theme-sm overflow-hidden max-w-2xl mx-auto">
                <div className="p-6 md:p-8 space-y-6">

                    {/* AVATAR SELECTION AREA */}
                    <div className="flex flex-col items-center justify-center gap-3 mb-4">
                        <button
                            type="button"
                            onClick={() => setIsMediaManagerOpen(true)}
                            className="w-24 h-24 rounded-full border-2 border-dashed border-border flex items-center justify-center bg-muted/50 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all overflow-hidden relative group shadow-sm"
                        >
                            {formData.avatarUrl ? (
                                <>
                                    <img src={formData.avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <Edit3 size={24} className="text-white" />
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center text-muted-foreground group-hover:text-primary transition-colors">
                                    <UserCircle size={32} />
                                    <span className="text-[10px] uppercase font-black tracking-wider mt-1">Photo</span>
                                </div>
                            )}
                        </button>
                        {formData.avatarUrl && (
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, avatarID: null, avatarUrl: null })}
                                className="text-xs text-destructive font-bold hover:underline"
                            >
                                Remove Photo
                            </button>
                        )}
                    </div>

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

            {/* EMBEDDED MEDIA MANAGER MODAL */}
            {isMediaManagerOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-background w-full max-w-6xl h-[90vh] md:h-[80vh] flex flex-col rounded-3xl shadow-theme-xl overflow-hidden animate-in zoom-in-95 duration-200 border border-border">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card shrink-0">
                            <div>
                                <h2 className="text-xl font-black text-foreground tracking-tight">Select Profile Photo</h2>
                                <p className="text-xs text-muted-foreground mt-0.5">Upload a new image or choose from your library</p>
                            </div>
                            <button
                                onClick={() => setIsMediaManagerOpen(false)}
                                className="p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-xl transition-colors"
                                title="Close"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-hidden bg-card relative">
                            <MediaManager
                                isPicker={true}
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