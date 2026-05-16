import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Phone, User, Clock, ArrowRight, Sparkles } from "lucide-react";

const CONTACT = {
  name: "Gina A. Greenlee",
  email: "alexgreeng@att.net",
  phone: "615-202-2317",
  responseTime: "within 24 hours",
};

const phoneDigits = CONTACT.phone.replace(/\D/g, "");

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with GinaG Purse Decor — text, call, or email for custom charm orders and inquiries.",
  alternates: { canonical: "/contact-us" },
};

export default function ContactPage() {
  return (
    <main className="bg-background min-h-screen pt-12 md:pt-20 pb-24 md:pb-24">
      <div className="container mx-auto px-4 max-w-3xl">

        {/* Header — smaller and tighter on mobile */}
        <header className="text-center mb-10 md:mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-5">
            <Sparkles className="w-3.5 h-3.5" /> Get in Touch
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter text-heading leading-[0.9] mb-4">
            Contact Us
          </h1>
          <p className="text-sm md:text-base text-muted-foreground font-medium max-w-md mx-auto leading-relaxed">
            Have a question or want a custom design? Text, call, or email — we
            reply {CONTACT.responseTime}.
          </p>
        </header>

        {/* Primary actions — large tap targets, stacked on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-6">
          <a
            href={`tel:${phoneDigits}`}
            className="group flex items-center gap-4 bg-primary text-primary-foreground rounded-2xl p-5 shadow-theme-md active:scale-[0.98] transition-transform"
          >
            <span className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-[10px] font-black uppercase tracking-[0.2em] opacity-80">
                Call or Text
              </span>
              <span className="block text-base md:text-lg font-black truncate">
                {CONTACT.phone}
              </span>
            </span>
            <ArrowRight className="w-4 h-4 opacity-80 group-active:translate-x-0.5 transition-transform" />
          </a>

          <a
            href={`mailto:${CONTACT.email}`}
            className="group flex items-center gap-4 bg-card border border-border rounded-2xl p-5 hover:border-primary/50 active:scale-[0.98] transition-all"
          >
            <span className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                Email
              </span>
              <span className="block text-sm md:text-base font-black text-heading break-all">
                {CONTACT.email}
              </span>
            </span>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-active:translate-x-0.5 transition-transform" />
          </a>
        </div>

        {/* Supporting info row — name + response time, side-by-side on all sizes */}
        <div className="grid grid-cols-2 gap-3 md:gap-4 mb-10">
          <div className="flex items-center gap-3 bg-card/60 border border-border rounded-xl p-4">
            <User className="w-4 h-4 text-primary shrink-0" />
            <div className="min-w-0">
              <div className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                Owner
              </div>
              <div className="text-sm font-black text-heading truncate">
                {CONTACT.name}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-card/60 border border-border rounded-xl p-4">
            <Clock className="w-4 h-4 text-primary shrink-0" />
            <div className="min-w-0">
              <div className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                Reply Time
              </div>
              <div className="text-sm font-black text-heading truncate">
                {CONTACT.responseTime}
              </div>
            </div>
          </div>
        </div>

        {/* Custom-order CTA — anchors the mobile flow toward the order form */}
        <Link
          href="/order-now"
          className="flex items-center justify-between gap-4 bg-linear-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-5 md:p-6 hover:border-primary/40 active:scale-[0.99] transition-all"
        >
          <div className="min-w-0">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1">
              Ready to Order?
            </div>
            <div className="text-base md:text-lg font-black text-heading leading-snug">
              Place a custom charm order — pickup or mailing
            </div>
          </div>
          <span className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
            <ArrowRight className="w-4 h-4" />
          </span>
        </Link>
      </div>
    </main>
  );
}
