"use client";

import { Ticket, Percent, Banknote } from "lucide-react";
import { useCurrency } from "@/context/SettingsContext";


export default function FormCouponDetails({ data, update }: any) {
  const { symbol } = useCurrency();
  return (

    <div className="bg-card border border-border rounded-3xl p-8 shadow-theme-sm space-y-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2">
          <Ticket className="text-primary" /> Coupon Identity
        </h2>
        <p className="text-xs text-muted-foreground mt-1">The code customers will enter and the discount amount.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        
        {/* Coupon Code */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Coupon Code *</label>
          <input 
            type="text" 
            value={data.code} 
            onChange={(e) => update({ code: e.target.value.toUpperCase().replace(/\s/g, '') })}
            placeholder="e.g., SUMMER50, WELCOME20"
            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-all font-black tracking-widest text-primary"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Internal Description</label>
          <input 
            type="text" 
            value={data.description} 
            onChange={(e) => update({ description: e.target.value })}
            placeholder="e.g., Influencer campaign for July"
            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Discount Type */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Discount Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => update({ discountType: "PERCENTAGE" })}
                className={`py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                  data.discountType === "PERCENTAGE" 
                  ? "bg-primary/10 border-primary text-primary" 
                  : "bg-background border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                <Percent size={14} /> Percentage
              </button>
              <button
                type="button"
                onClick={() => update({ discountType: "FIXED_AMOUNT" })}
                className={`py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                  data.discountType === "FIXED_AMOUNT" 
                  ? "bg-primary/10 border-primary text-primary" 
                  : "bg-background border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                <Banknote size={14} /> Fixed Amount
              </button>
            </div>
          </div>

          {/* Discount Value */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Discount Value *
            </label>
            <div className="relative">
              <input 
                type="number" 
                min="0"
                step="0.01"
                value={data.discountValue} 
                onChange={(e) => update({ discountValue: e.target.value })}
                placeholder={data.discountType === "PERCENTAGE" ? "10" : "500"}
                className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary transition-all font-mono"
              />
              <span className="absolute left-4 top-2.5 font-bold text-muted-foreground">
                {data.discountType === "PERCENTAGE" ? "%" : symbol}

              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}