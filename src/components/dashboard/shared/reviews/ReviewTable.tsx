"use client";

import Link from "next/link";
import { useState } from "react";
import { Star, CheckCircle, XCircle, Trash2, Edit, Loader2, UserCircle } from "lucide-react";

interface ReviewTableProps {
    type: "PRODUCT" | "SITE";
    reviews: any[];
    onToggleStatus: (id: string, currentStatus: string) => void;
    onDelete: (id: string) => void;
}

export default function ReviewTable({ type, reviews, onToggleStatus, onDelete }: ReviewTableProps) {
    const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={14}
                        className={star <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}
                    />
                ))}
            </div>
        );
    };

    if (reviews.length === 0) {
        return (
            <div className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center border border-border rounded-2xl bg-muted/10">
                <Loader2 className="w-8 h-8 mb-4 opacity-20" />
                <p className="font-semibold">No reviews found.</p>
                <p className="text-sm">When users leave reviews, they will appear here.</p>
            </div>
        );
    }

    return (
        <div className="w-full overflow-x-auto rounded-2xl border border-border bg-card shadow-theme-sm">
            <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                    <tr className="border-b border-border bg-muted/20 text-xs uppercase tracking-wider text-muted-foreground font-black">
                        <th className="p-4 w-24">Rating</th>
                        <th className="p-4">{type === "PRODUCT" ? "User / Product" : "Reviewer Name"}</th>
                        <th className="p-4 w-1/3">Comment</th>
                        <th className="p-4 w-28">Date</th>
                        <th className="p-4 text-center w-28">Status</th>
                        <th className="p-4 text-right w-32">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {reviews.map((review) => {
                        // This perfectly catches the URL once your backend `include`s the reviewAvatar!
                        const avatarUrl = type === "PRODUCT"
                            ? review.user?.avatar
                            : (review.reviewAvatar?.thumbUrl || review.reviewAvatar?.originalUrl);

                        const hasValidImage = avatarUrl && !brokenImages.has(review.id);

                        return (
                            <tr key={review.id} className="border-b border-border hover:bg-muted/10 transition-colors group">
                                <td className="p-4">{renderStars(review.rating)}</td>

                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full bg-muted border border-border flex items-center justify-center overflow-hidden shrink-0 shadow-sm relative">
                                            {hasValidImage ? (
                                                <img
                                                    src={avatarUrl}
                                                    alt="Avatar"
                                                    className="w-full h-full object-cover"
                                                    onError={() => setBrokenImages(prev => new Set(prev).add(review.id))}
                                                />
                                            ) : (
                                                <UserCircle className="w-6 h-6 text-muted-foreground/50" />
                                            )}
                                        </div>
                                        <div>
                                            {type === "PRODUCT" ? (
                                                <>
                                                    <p className="font-bold text-foreground whitespace-nowrap">
                                                        {review.user?.firstName} {review.user?.lastName}
                                                    </p>
                                                    <Link href={`/products/${review.product?.slug}`} target="_blank" className="text-xs text-primary hover:underline truncate max-w-[200px] block">
                                                        {review.product?.name}
                                                    </Link>
                                                </>
                                            ) : (
                                                <p className="font-bold text-foreground whitespace-nowrap">{review.name}</p>
                                            )}
                                        </div>
                                    </div>
                                </td>

                                <td className="p-4 text-muted-foreground text-xs leading-relaxed">
                                    {review.comment || <span className="italic opacity-50">No comment provided</span>}
                                </td>

                                <td className="p-4 text-muted-foreground text-xs font-medium whitespace-nowrap">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </td>

                                <td className="p-4 text-center">
                                    <span className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider w-24
                                        ${review.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-500' :
                                            review.status === 'REJECTED' ? 'bg-destructive/10 text-destructive' :
                                                'bg-amber-500/10 text-amber-500'}`}>
                                        {review.status}
                                    </span>
                                </td>

                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => onToggleStatus(review.id, review.status)}
                                            className={`p-2 rounded-lg transition-colors shrink-0 ${review.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' : 'bg-muted text-muted-foreground hover:text-emerald-500'}`}
                                            title={review.status === 'APPROVED' ? "Mark as Pending" : "Approve Review"}
                                        >
                                            <CheckCircle size={16} />
                                        </button>

                                        {type === "SITE" && (
                                            <Link href={`/dashboard/super-admin/reviews/edit/${review.id}`} className="p-2 bg-muted rounded-lg text-muted-foreground hover:text-primary transition-colors shrink-0">
                                                <Edit size={16} />
                                            </Link>
                                        )}

                                        <button
                                            onClick={() => onDelete(review.id)}
                                            className="p-2 bg-muted rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
                                            title="Delete Review"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}