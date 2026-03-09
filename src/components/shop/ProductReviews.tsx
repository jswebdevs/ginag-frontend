"use client";

import { useState, useEffect, useRef } from "react";
import { Star, ShieldCheck, Upload, X, MessageSquare, Image as ImageIcon, Loader2, ShoppingCart } from "lucide-react";
import api from "@/lib/axios";
import Swal from "sweetalert2";

interface ProductReviewsProps {
    productId: string;
    initialReviews: any[];
}

export default function ProductReviews({ productId, initialReviews }: ProductReviewsProps) {
    const [reviews, setReviews] = useState(initialReviews);
    const [isEligible, setIsEligible] = useState(false); // True if logged in AND bought the product
    const [loadingEligibility, setLoadingEligibility] = useState(true);

    // Form State
    const [showForm, setShowForm] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Check if the user is eligible to review
    useEffect(() => {
        const checkEligibility = async () => {
            try {
                // NOTE: You will need to create this route in your backend!
                // It should check the Order table to see if req.user.id has bought this productId
                const res = await api.get(`/reviews/check-eligibility/${productId}`);
                setIsEligible(res.data.eligible);
            } catch (error) {
                setIsEligible(false);
            } finally {
                setLoadingEligibility(false);
            }
        };
        checkEligibility();
    }, [productId]);

    // Handle Image Selection (Only images allowed)
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);

            // Enforce image only & limit to 3 images max
            const validImages = selectedFiles.filter(file => file.type.startsWith("image/"));
            const newImages = [...images, ...validImages].slice(0, 3);

            setImages(newImages);

            // Generate preview URLs
            const newPreviews = newImages.map(file => URL.createObjectURL(file));
            setImagePreviews(newPreviews);
        }
    };

    const removeImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);

        const newPreviews = [...imagePreviews];
        newPreviews.splice(index, 1);
        setImagePreviews(newPreviews);
    };

    const handleSubmit = async () => {
        if (rating === 0) return Swal.fire("Error", "Please select a star rating.", "error");

        setIsSubmitting(true);
        try {
            // Use FormData to send text + images together
            const formData = new FormData();
            formData.append("productId", productId);
            formData.append("rating", rating.toString());
            if (comment) formData.append("comment", comment);
            images.forEach(img => formData.append("images", img));

            const res = await api.post("/reviews", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            setReviews([res.data.data, ...reviews]);
            setShowForm(false);
            setRating(0);
            setComment("");
            setImages([]);
            setImagePreviews([]);
            Swal.fire("Success", "Your review has been submitted!", "success");

        } catch (error: any) {
            Swal.fire("Error", error.response?.data?.message || "Failed to submit review.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Calculate Average Rating
    const avgRating = reviews.length > 0
        ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
        : "0.0";

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 space-y-8">

            {/* --- HEADER SUMMARY --- */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-full md:w-1/3 bg-card border border-border p-8 rounded-[2rem] text-center shadow-theme-sm flex flex-col items-center justify-center">
                    <h3 className="text-6xl font-black text-heading mb-2">{avgRating}</h3>
                    <div className="flex justify-center text-yellow-500 mb-2">
                        {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} className={`w-5 h-5 ${s <= Number(avgRating) ? 'fill-current' : 'text-muted-foreground/30'}`} />
                        ))}
                    </div>
                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">Based on {reviews.length} reviews</p>
                </div>

                <div className="flex-1 w-full space-y-6">
                    <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl flex items-start gap-4">
                        <ShieldCheck className="w-6 h-6 text-primary shrink-0 mt-1" />
                        <div className="flex-1">
                            <h4 className="font-bold text-primary mb-1">Verified Purchases Only</h4>
                            <p className="text-sm text-primary/80 mb-4">To maintain the integrity of our platform, only customers who have successfully purchased and received this item can leave a review.</p>

                            {!loadingEligibility && (
                                isEligible ? (
                                    <button
                                        onClick={() => setShowForm(!showForm)}
                                        className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest hover:scale-105 transition-transform"
                                    >
                                        {showForm ? "Cancel Review" : "Write a Review"}
                                    </button>
                                ) : (
                                    <div className="inline-flex items-center gap-2 bg-background border border-border px-4 py-2 rounded-xl text-xs font-bold text-muted-foreground">
                                        <ShoppingCart className="w-4 h-4" />
                                        {reviews.length === 0 ? "Buy this product to leave the first review!" : "You must purchase this product to review it."}
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- REVIEW FORM --- */}
            {showForm && (
                <div className="bg-card border border-border rounded-[2rem] p-6 md:p-8 shadow-theme-lg animate-in slide-in-from-top-4">
                    <h4 className="font-black text-heading uppercase tracking-wider mb-6">Leave Your Review</h4>

                    {/* Star Selector */}
                    <div className="mb-6">
                        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Overall Rating *</label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    type="button"
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(star)}
                                    className="p-1 transition-transform hover:scale-110"
                                >
                                    <Star className={`w-8 h-8 ${(hoverRating || rating) >= star ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground/30"}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Comment Area */}
                    <div className="mb-6">
                        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Your Review</label>
                        <textarea
                            rows={4}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="What did you like or dislike? How did the product fit?"
                            className="w-full bg-background border border-border rounded-2xl p-4 text-sm outline-none focus:border-primary resize-none"
                        />
                    </div>

                    {/* Image Upload Area */}
                    <div className="mb-8">
                        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Add Photos (Max 3)</label>
                        <div className="flex flex-wrap gap-4">
                            {imagePreviews.map((url, idx) => (
                                <div key={idx} className="relative w-24 h-24 rounded-xl border border-border overflow-hidden group">
                                    <img src={url} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        onClick={() => removeImage(idx)}
                                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}

                            {imagePreviews.length < 3 && (
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-24 h-24 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors bg-muted/20"
                                >
                                    <Upload size={20} className="mb-1" />
                                    <span className="text-[10px] font-bold uppercase">Upload</span>
                                </button>
                            )}
                            {/* Hidden File Input restricting to images */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                accept="image/png, image/jpeg, image/webp"
                                multiple
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </div>
                    </div>

                    {/* Submit Action */}
                    <div className="flex justify-end gap-4">
                        <button onClick={() => setShowForm(false)} className="px-6 py-3 rounded-xl font-bold text-muted-foreground hover:bg-muted transition-colors">
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || rating === 0}
                            className="bg-primary text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest flex items-center gap-2 hover:shadow-theme-md transition-all disabled:opacity-50"
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Review"}
                        </button>
                    </div>
                </div>
            )}

            {/* --- REVIEWS LIST --- */}
            <div className="space-y-6 mt-8">
                {reviews.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-border rounded-3xl">
                        <MessageSquare className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
                        <p className="text-muted-foreground font-bold">No reviews yet.</p>
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="bg-card border border-border p-6 rounded-3xl shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-muted rounded-full overflow-hidden border border-border flex flex-col items-center justify-center">
                                        {/* Placeholder for User Avatar */}
                                        <span className="font-black text-muted-foreground">{review.user?.firstName?.charAt(0) || 'U'}</span>
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-heading text-sm">{review.user?.firstName || "Verified Buyer"}</h5>
                                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex text-yellow-500">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? 'fill-current' : 'text-muted-foreground/30'}`} />
                                    ))}
                                </div>
                            </div>

                            {review.comment && (
                                <p className="text-sm text-subheading mb-4 leading-relaxed">{review.comment}</p>
                            )}

                            {/* Review Images */}
                            {review.images && review.images.length > 0 && (
                                <div className="flex gap-3">
                                    {review.images.map((img: string, idx: number) => (
                                        <div key={idx} className="w-20 h-20 rounded-xl overflow-hidden border border-border">
                                            <img src={img} alt="Review attachment" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}