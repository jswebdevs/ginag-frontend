"use client";

import Link from "next/link";
import { CheckCircle, ShoppingBag, Home } from "lucide-react";

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0a07] py-12 px-4"
      style={{ backgroundImage: "radial-gradient(ellipse at top, #1a1105 0%, #0d0a07 70%)" }}>
      <div className="border border-amber-500/20 bg-white/[0.03] rounded-3xl p-8 sm:p-12 max-w-lg w-full text-center backdrop-blur-sm animate-in fade-in zoom-in duration-500">

        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-400/20 rounded-full animate-ping" />
            <div className="w-20 h-20 bg-amber-400/10 rounded-full flex items-center justify-center relative z-10 border border-amber-500/30">
              <CheckCircle className="w-10 h-10 text-amber-400" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-12 bg-amber-500/30" />
          <span className="text-amber-500/50 text-xs">✦</span>
          <div className="h-px w-12 bg-amber-500/30" />
        </div>

        <h1 className="text-3xl font-black text-white mb-3 uppercase tracking-wider">
          Order <span className="text-amber-400">Placed!</span>
        </h1>

        <p className="text-white/50 mb-8 leading-relaxed">
          Thank you for your order! We&apos;ll handcraft your charm with care and reach out shortly about pickup or delivery.
        </p>

        {/* Info box */}
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5 mb-8 text-left space-y-3">
          <p className="text-sm text-white/80 flex items-start gap-2.5">
            <span className="text-amber-400 mt-0.5">💌</span>
            A confirmation email has been sent to your inbox.
          </p>
          <p className="text-sm text-white/80 flex items-start gap-2.5">
            <span className="text-amber-400 mt-0.5">✂️</span>
            Your custom charm will be handcrafted just for you.
          </p>
          <p className="text-sm text-white/80 flex items-start gap-2.5">
            <span className="text-amber-400 mt-0.5">📞</span>
            We&apos;ll contact you at your cell number with updates.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/shop"
            className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-black py-3.5 px-6 rounded-xl font-black uppercase tracking-wider text-sm transition-all hover:shadow-lg hover:shadow-amber-500/30"
          >
            <ShoppingBag className="w-4 h-4" />
            Shop More
          </Link>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-3.5 px-6 rounded-xl font-bold text-sm transition-all border border-amber-500/20"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
