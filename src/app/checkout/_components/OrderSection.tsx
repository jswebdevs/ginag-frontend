"use client";

import { Ticket, X, Loader2, CheckCircle2 } from "lucide-react";

interface OrderSectionProps {
  cart: any;
  totalPayable: number;
  shippingCost: number;
  couponCode: string;
  setCouponCode: (code: string) => void;
  appliedCoupon: any;
  handleApplyCoupon: () => void;
  handleRemoveCoupon: () => void;
  couponLoading: boolean;
  discountAmount: number;
  placingOrder: boolean;
  isPhoneVerified?: boolean;
}

export default function OrderSection({
  cart, totalPayable, shippingCost, couponCode, setCouponCode, appliedCoupon,
  handleApplyCoupon, handleRemoveCoupon, couponLoading, discountAmount,
}: OrderSectionProps) {
  return (
    <div className="space-y-6">
      {/* Items List */}
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-amber-400 mb-3">Your Order</p>
        <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
          {cart.items.map((item: any) => {
            const itemPrice = Number(item.variation.salePrice || item.variation.basePrice);
            const imageUrl = item.variation.product.featuredImage?.originalUrl;

            return (
              <div key={item.id} className="flex gap-3">
                <div className="w-14 h-14 bg-white/10 rounded-xl overflow-hidden flex-shrink-0 border border-amber-500/20">
                  {imageUrl && (
                    <img src={imageUrl} alt={item.variation.product.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-grow flex flex-col justify-center">
                  <h4 className="text-sm font-bold text-white line-clamp-1">{item.variation.product.name}</h4>
                  <p className="text-xs text-white/50 mt-0.5">{item.variation.name}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-white/40">Qty: {item.quantity}</span>
                    <span className="text-sm font-bold text-amber-400">${(itemPrice * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-amber-500/20" />

      {/* Coupon */}
      <div>
        <label className="text-[10px] font-black uppercase tracking-widest text-amber-400/60 block mb-2">Promo Code</label>
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500/50" />
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              disabled={!!appliedCoupon}
              className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-amber-500/30 rounded-xl outline-none focus:ring-2 focus:ring-amber-400/30 uppercase font-bold text-sm text-white placeholder:normal-case placeholder:font-medium placeholder:text-white/30 disabled:opacity-50 transition-all"
              placeholder="Enter promo code"
            />
          </div>
          {appliedCoupon ? (
            <button type="button" onClick={handleRemoveCoupon} className="p-2.5 text-red-400 bg-red-400/10 rounded-xl hover:bg-red-400/20 transition-colors shrink-0">
              <X className="w-5 h-5" />
            </button>
          ) : (
            <button type="button" onClick={handleApplyCoupon} disabled={couponLoading || !couponCode}
              className="px-4 py-2.5 bg-amber-500 text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-amber-400 transition-all disabled:opacity-50 disabled:pointer-events-none shrink-0">
              {couponLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Apply"}
            </button>
          )}
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-2.5 text-sm">
        <div className="flex justify-between text-white/60">
          <span>Subtotal ({cart.totalItems} items)</span>
          <span className="text-white font-bold">${cart.totalAmount.toFixed(2)}</span>
        </div>

        {appliedCoupon && (
          <div className="flex justify-between text-emerald-400 bg-emerald-400/10 p-2.5 rounded-xl border border-emerald-400/20 border-dashed">
            <span className="flex items-center gap-1.5"><Ticket className="w-3.5 h-3.5" /> {appliedCoupon.code}</span>
            <span className="font-bold">-${discountAmount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between text-white/60">
          <span>Shipping</span>
          <span className={`font-bold ${shippingCost === 0 ? "text-emerald-400" : "text-white"}`}>
            {shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-end p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5">
        <span className="font-bold text-white text-base">Total</span>
        <span className="text-2xl font-black text-amber-400">${totalPayable.toFixed(2)}</span>
      </div>
    </div>
  );
}
