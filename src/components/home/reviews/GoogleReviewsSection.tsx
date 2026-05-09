"use client";

import { useEffect, useState } from "react";
import { Star, ExternalLink, Loader2 } from "lucide-react";
import api from "@/lib/axios";

interface GoogleReview {
  author: string;
  avatar?: string;
  rating: number;
  text: string;
  relativeTime: string;
}

interface ReviewsPayload {
  name?: string;
  rating?: number;
  total: number;
  googleUrl?: string;
  reviews: GoogleReview[];
}

export default function GoogleReviewsSection() {
  const [data, setData] = useState<ReviewsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await api.get("/google-reviews");
        if (cancelled) return;
        setConfigured(res.data?.configured !== false);
        setData(res.data?.data || null);
      } catch {
        if (!cancelled) setData(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <section className="py-16 flex justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </section>
    );
  }

  if (configured === false || !data || data.reviews.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
            <Star className="w-3 h-3 fill-current" /> Google Reviews
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-heading uppercase tracking-tight mb-3">
            What our customers say
          </h2>
          {data.rating != null && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <div className="flex text-yellow-500">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i <= Math.round(data.rating!) ? "fill-current" : "text-muted/30"}`}
                  />
                ))}
              </div>
              <span className="font-bold text-foreground">{data.rating.toFixed(1)}</span>
              <span>· {data.total} reviews on Google</span>
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.reviews.slice(0, 6).map((r, i) => (
            <article
              key={`${r.author}-${i}`}
              className="bg-card border border-border rounded-2xl p-6 shadow-theme-sm hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-4">
                {r.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.avatar} alt={r.author} className="w-10 h-10 rounded-full" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                    {r.author?.[0] || "?"}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-foreground truncate">{r.author}</div>
                  <div className="text-xs text-muted-foreground">{r.relativeTime}</div>
                </div>
              </div>
              <div className="flex text-yellow-500 mb-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i <= r.rating ? "fill-current" : "text-muted/30"}`}
                  />
                ))}
              </div>
              <p className="text-sm text-subheading leading-relaxed line-clamp-6">{r.text}</p>
            </article>
          ))}
        </div>

        {data.googleUrl && (
          <div className="text-center mt-10">
            <a
              href={data.googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 text-primary font-bold text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              See all reviews on Google <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
