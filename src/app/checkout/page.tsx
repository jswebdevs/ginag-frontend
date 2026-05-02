"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";

import OrderForm, { DELIVERY_FEE } from "./_components/OrderForm";
import OrderSection from "./_components/OrderSection";
import PaymentSection from "./_components/PaymentSection";

interface CartData {
  items: any[];
  totalAmount: number;
  totalItems: number;
}

interface FormData {
  name: string;
  cellNumber: string;
  email: string;
  charmColorStyle: string;
  wantsInitial: boolean | null;
  initial: string;
  deliveryMethod: "PICKUP" | "MAILING";
  mailingAddress: string;
}

export default function CheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  // Coupon
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Form
  const [formData, setFormData] = useState<FormData>({
    name: "",
    cellNumber: "",
    email: "",
    charmColorStyle: "",
    wantsInitial: null,
    initial: "",
    deliveryMethod: "PICKUP",
    mailingAddress: "",
  });

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<"STRIPE" | "PAYPAL">("STRIPE");
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null);
  const [stripePublishableKey, setStripePublishableKey] = useState<string>("");
  const [paypalClientId, setPaypalClientId] = useState<string>("");

  const shippingCost = DELIVERY_FEE; // flat $18 for both Pick Up and Mailing

  // Load cart
  useEffect(() => {
    const init = async () => {
      try {
        const res = await api.get("/cart");
        const data = res.data.data;
        if (!data || data.items.length === 0) {
          router.push("/cart");
          return;
        }
        setCart(data);

        // Fetch payment keys from settings
        try {
          const settingsRes = await api.get('/settings');
          setStripePublishableKey(settingsRes.data.data?.stripePublishableKey || "");
          setPaypalClientId(settingsRes.data.data?.paypalClientId || "");
        } catch {}

        // Pre-fill from profile if logged in
        try {
          const userRes = await api.get("/users/me");
          const u = userRes.data.data;
          if (u) {
            setFormData((prev) => ({
              ...prev,
              name: u.fullName || "",
              email: u.email || "",
              cellNumber: u.phone || "",
            }));
          }
        } catch {
          // guest — no pre-fill needed
        }
      } catch {
        toast.error("Failed to load cart.");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [router]);

  // Create Stripe intent whenever total changes or method switches to STRIPE
  useEffect(() => {
    if (!cart || paymentMethod !== "STRIPE") return;

    const total = (cart.totalAmount - discountAmount) + shippingCost;
    if (total <= 0) return;

    let cancelled = false;
    api
      .post("/payments/stripe/create-intent", { amount: total })
      .then((res) => {
        if (!cancelled) setStripeClientSecret(res.data.clientSecret);
      })
      .catch(() => {
        if (!cancelled) toast.error("Could not initialize Stripe. Check your keys.");
      });

    return () => {
      cancelled = true;
    };
  }, [cart, discountAmount, shippingCost, paymentMethod]);

  const totalPayable = cart ? (cart.totalAmount - discountAmount) + shippingCost : 0;

  // Coupon logic
  const handleApplyCoupon = async () => {
    if (!couponCode || !cart) return;
    setCouponLoading(true);
    try {
      const res = await api.post("/coupons/validate", {
        code: couponCode.trim().toUpperCase(),
        cartAmount: cart.totalAmount,
      });
      const coupon = res.data.data;
      setAppliedCoupon(coupon);
      let discount = 0;
      if (coupon.discountType === "PERCENTAGE") {
        discount = (cart.totalAmount * Number(coupon.discountValue)) / 100;
        if (coupon.maxDiscount && discount > Number(coupon.maxDiscount)) discount = Number(coupon.maxDiscount);
      } else {
        discount = Number(coupon.discountValue);
      }
      setDiscountAmount(discount);
      toast.success("Coupon applied!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid coupon.");
      setCouponCode("");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponCode("");
  };

  // Validate the form before payment
  const validateForm = (): boolean => {
    if (!formData.name.trim()) { toast.error("Please enter your name."); return false; }
    if (!formData.cellNumber.trim()) { toast.error("Please enter your cell number."); return false; }
    if (!formData.email.trim()) { toast.error("Please enter your email."); return false; }
    if (!formData.charmColorStyle.trim()) { toast.error("Please describe your charm color & style."); return false; }
    if (formData.wantsInitial === null) { toast.error("Please indicate if you want an initial added."); return false; }
    if (formData.wantsInitial && !formData.initial.trim()) { toast.error("Please enter your initial."); return false; }
    if (formData.deliveryMethod === "MAILING" && !formData.mailingAddress.trim()) { toast.error("Please enter your mailing address."); return false; }
    return true;
  };

  // Place order after payment confirmation
  const placeOrder = useCallback(async (paymentId: string, method: "STRIPE" | "PAYPAL") => {
    setPlacingOrder(true);
    try {
      const shippingAddressPayload = {
        fullName: formData.name,
        phone: formData.cellNumber,
        email: formData.email,
        deliveryMethod: formData.deliveryMethod,
        mailingAddress: formData.mailingAddress,
        charmColorStyle: formData.charmColorStyle,
        wantsInitial: formData.wantsInitial,
        initial: formData.initial,
      };

      await api.post("/orders/checkout", {
        shippingAddress: shippingAddressPayload,
        paymentMethod: method,
        paymentId,
        paymentDetails: { paymentId, method },
        deliveryFee: shippingCost,
        couponId: appliedCoupon?.id || null,
        customerName: formData.name,
        customerPhone: formData.cellNumber,
        customerEmail: formData.email,
      });

      toast.success("Order placed successfully!");
      router.push("/order-success");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to place order. Please contact support.");
    } finally {
      setPlacingOrder(false);
    }
  }, [formData, shippingCost, appliedCoupon, router]);

  const handleStripeSuccess = async (paymentIntentId: string) => {
    await placeOrder(paymentIntentId, "STRIPE");
  };

  // PayPal: create order using PayPal actions (client-side)
  const handlePayPalCreateOrder = async (_data: any, actions: any): Promise<string> => {
    if (!validateForm()) throw new Error("Invalid form");
    return actions.order.create({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: totalPayable.toFixed(2),
          },
          description: "GinaG Purse Charms & Chains",
        },
      ],
    });
  };

  const handlePayPalSuccess = async (orderId: string) => {
    await placeOrder(orderId, "PAYPAL");
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0a07]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-amber-400 animate-spin" />
          <p className="text-xs font-black uppercase tracking-widest text-amber-400/60">
            Preparing your order...
          </p>
        </div>
      </div>
    );
  }

  if (!cart) return null;

  return (
    <div className="min-h-screen bg-[#0d0a07]" style={{ backgroundImage: "radial-gradient(ellipse at top, #1a1105 0%, #0d0a07 70%)" }}>
      <div className="container mx-auto px-4 max-w-6xl py-8 md:py-14">

        {/* Back link */}
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-amber-400/70 hover:text-amber-400 text-xs font-bold uppercase tracking-widest mb-10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </Link>

        {/* Page header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-3">
            <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-amber-500/50" />
            <ShoppingBag className="w-6 h-6 text-amber-400" />
            <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-amber-500/50" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-wider">
            Order <span className="text-amber-400">Form</span>
          </h1>
          <div className="flex items-center justify-center gap-3 mt-2">
            <div className="h-px w-16 bg-amber-500/30" />
            <span className="text-amber-500/50 text-xs">✦</span>
            <div className="h-px w-16 bg-amber-500/30" />
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT: Form */}
          <div className="lg:col-span-7 space-y-8">
            {/* Order Details Card */}
            <div className="bg-white/[0.03] border border-amber-500/20 rounded-3xl p-6 sm:p-8 backdrop-blur-sm">
              <OrderForm
                formData={formData}
                onChange={(data) => setFormData((prev) => ({ ...prev, ...data }))}
              />
            </div>

            {/* Payment Card */}
            <div className="bg-white/[0.03] border border-amber-500/20 rounded-3xl p-6 sm:p-8 backdrop-blur-sm">
              <p className="text-xs font-black uppercase tracking-widest text-amber-400 mb-5">
                Payment Method
              </p>
              <PaymentSection
                totalPayable={totalPayable}
                clientSecret={stripeClientSecret}
                onStripeSuccess={handleStripeSuccess}
                onPayPalSuccess={handlePayPalSuccess}
                onPayPalCreateOrder={handlePayPalCreateOrder}
                isSubmitting={placingOrder}
                paymentMethod={paymentMethod}
                setPaymentMethod={(m) => {
                  setPaymentMethod(m);
                  setStripeClientSecret(null);
                }}
                stripePublishableKey={stripePublishableKey}
                paypalClientId={paypalClientId}
              />
            </div>
          </div>

          {/* RIGHT: Summary */}
          <div className="lg:col-span-5 lg:sticky lg:top-8">
            <div className="bg-white/[0.03] border border-amber-500/20 rounded-3xl p-6 sm:p-8 backdrop-blur-sm">
              <OrderSection
                cart={cart}
                totalPayable={totalPayable}
                shippingCost={shippingCost}
                couponCode={couponCode}
                setCouponCode={setCouponCode}
                appliedCoupon={appliedCoupon}
                handleApplyCoupon={handleApplyCoupon}
                handleRemoveCoupon={handleRemoveCoupon}
                couponLoading={couponLoading}
                discountAmount={discountAmount}
                placingOrder={placingOrder}
              />
            </div>

            {/* Trust badge */}
            <p className="text-center text-[10px] text-amber-500/30 mt-5 leading-relaxed px-4">
              Secure checkout. Your payment is processed by Stripe or PayPal.
              <br />By ordering you agree to our Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
