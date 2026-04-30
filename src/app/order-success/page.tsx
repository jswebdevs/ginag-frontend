"use client";

import Link from "next/link";
import { CheckCircle, ShoppingBag, ArrowRight, Home } from "lucide-react";

export default function OrderSuccessPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-muted/30 py-12 px-4">
      <div className="bg-card border border-border rounded-3xl p-8 sm:p-12 max-w-lg w-full text-center shadow-sm animate-in fade-in zoom-in duration-500">
        
        {/* Animated Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping"></div>
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center relative z-10">
              <CheckCircle className="w-10 h-10 text-emerald-500" />
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-black text-foreground mb-4">
          Order Successful!
        </h1>
        
        <p className="text-muted-foreground mb-8 text-lg">
          Thank you for shopping with us. Your order has been placed and is currently being processed.
        </p>

        {/* Info Box */}
        <div className="bg-background border border-border rounded-2xl p-6 mb-8 text-left space-y-3">
          <p className="text-sm text-foreground font-medium flex items-start gap-2">
            <span className="text-primary mt-0.5">💬</span> 
            We will send an SMS update to your verified phone number shortly.
          </p>
          <p className="text-sm text-foreground font-medium flex items-start gap-2">
            <span className="text-primary mt-0.5">🚚</span> 
            Our delivery agent will contact you before arriving at your address.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/shop" 
            className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 px-6 rounded-xl font-bold hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <ShoppingBag className="w-5 h-5" />
            Continue Shopping
          </Link>
          
          <Link 
            href="/" 
            className="flex-1 flex items-center justify-center gap-2 bg-muted text-foreground py-3.5 px-6 rounded-xl font-bold hover:bg-border transition-all"
          >
            <Home className="w-5 h-5" />
            Return Home
          </Link>
        </div>

      </div>
    </div>
  );
}