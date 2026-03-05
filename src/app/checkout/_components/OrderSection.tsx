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
  isPhoneVerified: boolean;
}

export default function OrderSection({
  cart, totalPayable, shippingCost, couponCode, setCouponCode, appliedCoupon,
  handleApplyCoupon, handleRemoveCoupon, couponLoading, discountAmount, placingOrder
}: OrderSectionProps) {
  return (
    <div className="bg-card border border-border rounded-3xl p-5 sm:p-8 lg:sticky lg:top-24 shadow-sm">
      <h2 className="text-xl font-bold text-foreground mb-6">Order Summary</h2>
      
      {/* Items List */}
      <div className="space-y-4 mb-6 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
        {cart.items.map((item: any) => {
          const itemPrice = Number(item.variation.salePrice || item.variation.basePrice);
          const imageUrl = item.variation.product.featuredImage?.originalUrl;
          
          return (
            <div key={item.id} className="flex gap-3 sm:gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-muted rounded-xl overflow-hidden flex-shrink-0 border border-border">
                {imageUrl && <img src={imageUrl} alt={item.variation.product.name} className="w-full h-full object-cover" />}
              </div>
              <div className="flex-grow flex flex-col justify-center">
                <h4 className="text-sm font-bold text-foreground line-clamp-1">{item.variation.product.name}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Variant: {item.variation.name}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs font-semibold text-muted-foreground">Qty: {item.quantity}</span>
                  <span className="text-sm font-bold text-primary">BDT {(itemPrice * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="w-full h-px bg-border mb-6"></div>

      {/* Coupon Section */}
      <div className="mb-6">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">Promo Code</label>
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              disabled={!!appliedCoupon}
              className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all uppercase font-bold text-sm text-foreground placeholder:normal-case placeholder:font-medium disabled:opacity-70"
              placeholder="Enter coupon code"
            />
          </div>
          {appliedCoupon ? (
            <button 
              type="button"
              onClick={handleRemoveCoupon}
              className="p-2.5 text-red-500 bg-red-500/10 rounded-xl hover:bg-red-500/20 transition-colors shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          ) : (
            <button 
              type="button"
              onClick={handleApplyCoupon}
              disabled={couponLoading || !couponCode}
              className="px-4 sm:px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:grayscale disabled:pointer-events-none text-sm shrink-0"
            >
              {couponLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Apply"}
            </button>
          )}
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 text-sm font-medium mb-6">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal ({cart.totalItems} items)</span>
          <span className="text-foreground font-bold">BDT {cart.totalAmount.toFixed(2)}</span>
        </div>
        
        {appliedCoupon && (
          <div className="flex justify-between text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20 border-dashed">
            <span className="flex items-center gap-1.5"><Ticket className="w-4 h-4" /> Discount ({appliedCoupon.code})</span>
            <span className="font-bold">-BDT {discountAmount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between text-muted-foreground">
          <span>Shipping Fee</span>
          <span className="text-foreground font-bold">BDT {shippingCost.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex justify-between items-end mb-6 sm:mb-8 bg-muted/50 p-4 rounded-2xl border border-border">
        <span className="font-bold text-foreground text-base sm:text-lg">Total</span>
        <span className="text-2xl sm:text-3xl font-black text-primary">BDT {totalPayable.toFixed(2)}</span>
      </div>

      {/* Responsive Submit Button */}
      <button 
        type="submit"
        form="checkout-form"
        disabled={placingOrder}
        className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:pointer-events-none"
      >
        {placingOrder ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CheckCircle2 className="w-5 h-5" />
            Place Order
          </>
        )}
      </button>
      
      <p className="text-center text-[10px] text-muted-foreground mt-4 leading-relaxed">
        By placing this order, you agree to our Terms of Service. Your personal data is protected by our Privacy Policy.
      </p>
    </div>
  );
}