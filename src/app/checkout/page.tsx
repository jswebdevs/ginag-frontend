"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import api from "@/lib/axios";
import Swal from "sweetalert2";

// Import Components
import Address from "./_components/Address";
import Payment from "./_components/Payment";
import OrderSection from "./_components/OrderSection";

interface CartData {
  items: any[];
  totalAmount: number;
  totalItems: number;
}

export default function CheckoutPage() {
  const router = useRouter();

  // --- States ---
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [userAddresses, setUserAddresses] = useState<any[]>([]);

  // Coupon States
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Form States
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    district: "",
    thana: "",
    house: "",
    road: "",
    area: "",
  });

  // Payment States
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "MFS">("COD");
  const [mfsInfo, setMfsInfo] = useState({ provider: "bKash", senderNumber: "", transactionId: "" });

  // Dynamic Shipping Cost
  const SHIPPING_COST = formData.district === "" ? 0 : (formData.district === "Dhaka" ? 80 : 150);

  // --- Initialization & Persistence Logic ---
  useEffect(() => {
    const initializeCheckout = async () => {
      try {
        // 1. Fetch Cart Data
        const cartRes = await api.get("/cart");
        const cartData = cartRes.data.data;
        if (!cartData || cartData.items.length === 0) {
          router.push("/cart");
          return;
        }
        setCart(cartRes.data.data);

        // 2. Fetch User Profile (if any)
        try {
          const userRes = await api.get("/users/me");
          const user = userRes.data.data;

          if (user) {
            setIsLoggedIn(true);
            setUserAddresses(user.addresses || []);

            // PERSISTENCE CHECK: DB Verification status OR Session Verification
            const sessionVerifiedPhone = sessionStorage.getItem("verified_phone");
            if (user.phoneVerified || (sessionVerifiedPhone && user.phone === sessionVerifiedPhone)) {
              setIsPhoneVerified(true);
              // Ensure session storage stays in sync for reloads
              if (user.phoneVerified) sessionStorage.setItem("verified_phone", user.phone);
            }

            // Pre-fill form from profile (default address)
            const defaultAddr = user.addresses?.find((a: any) => a.isDefault) || user.addresses?.[0];
            setFormData({
              fullName: user.fullName || "",
              phone: user.phone || "",
              email: user.email || "",
              district: defaultAddr?.district || "",
              thana: defaultAddr?.thana || "",
              house: defaultAddr?.house || "",
              road: defaultAddr?.road || "",
              area: defaultAddr?.area || "",
            });
          }
        } catch (error) {
          // Guest Persistence Logic
          const guestVerifiedPhone = sessionStorage.getItem("verified_phone");
          if (guestVerifiedPhone) {
            setFormData(prev => ({ ...prev, phone: guestVerifiedPhone }));
            setIsPhoneVerified(true);
          }
        }
      } catch (error) {
        console.error("Checkout Initialization Failed:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeCheckout();
  }, [router]);

  // --- Form Handlers ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- Coupon Handlers ---
  const handleApplyCoupon = async () => {
    if (!couponCode || !cart) return;
    setCouponLoading(true);

    try {
      const res = await api.post("/coupons/validate", {
        code: couponCode.trim().toUpperCase(),
        cartAmount: cart.totalAmount
      });

      const coupon = res.data.data;
      setAppliedCoupon(coupon);

      let discount = 0;
      if (coupon.discountType === 'PERCENTAGE') {
        discount = (cart.totalAmount * Number(coupon.discountValue)) / 100;
        if (coupon.maxDiscount && discount > Number(coupon.maxDiscount)) {
          discount = Number(coupon.maxDiscount);
        }
      } else {
        discount = Number(coupon.discountValue);
      }

      setDiscountAmount(discount);
      Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Coupon Applied!', showConfirmButton: false, timer: 1500 });
    } catch (error: any) {
      Swal.fire({ icon: 'error', title: 'Invalid Coupon', text: error.response?.data?.message || "This coupon is not valid." });
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

  // --- Order Placement Handler ---
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Mandatory Verification Check
    if (!isPhoneVerified) {
      Swal.fire({
        icon: 'warning',
        title: 'Phone Not Verified',
        text: 'You must verify your phone number via OTP before placing an order.'
      });
      return;
    }

    // 2. MFS Validation
    if (paymentMethod === "MFS" && (!mfsInfo.senderNumber || !mfsInfo.transactionId)) {
      Swal.fire({ icon: 'warning', title: 'Payment Info Required', text: 'Please enter your TrxID and Sender Number.' });
      return;
    }

    setPlacingOrder(true);

    try {
      // Note: Backend will update User profile address inside this call if userId exists
      await api.post("/orders/checkout", {
        shippingAddress: formData,
        paymentMethod: paymentMethod,
        paymentDetails: paymentMethod === "MFS" ? mfsInfo : null,
        shippingCost: SHIPPING_COST,
        couponId: appliedCoupon?.id || null,
        customerPhone: formData.phone
      });

      // Verification cycle complete, clean up session
      sessionStorage.removeItem("verified_phone");

      Swal.fire({
        title: "Order Successful!",
        text: "Your order has been placed and your address has been saved to your profile.",
        icon: "success",
        confirmButtonColor: "#0ea5e9",
      }).then(() => {
        router.push(isLoggedIn ? "/dashboard/orders" : "/order-success");
      });

    } catch (error: any) {
      Swal.fire({
        title: "Order Failed",
        text: error.response?.data?.message || "Something went wrong. Please try again.",
        icon: "error",
      });
    } finally {
      setPlacingOrder(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Initializing Secure Checkout...</p>
        </div>
      </div>
    );
  }

  if (!cart) return null;

  const totalPayable = (cart.totalAmount - discountAmount) + SHIPPING_COST;

  return (
    <div className="min-h-screen bg-muted/30 py-6 sm:py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Page Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/cart" className="w-10 h-10 flex items-center justify-center bg-card border border-border rounded-full text-muted-foreground hover:text-foreground hover:border-primary transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-foreground uppercase tracking-tight">
            Secure <span className="text-primary italic">Checkout</span>
          </h1>
        </div>

        {/* MAIN GRID STRUCTURE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT COLUMN: Input Forms (7 out of 12) */}
          <div className="lg:col-span-7 space-y-8">
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-8">
              <Address
                formData={formData}
                setFormData={setFormData}
                handleInputChange={handleInputChange as any}
                isPhoneVerified={isPhoneVerified}
                setIsPhoneVerified={setIsPhoneVerified}
                userAddresses={userAddresses}
              />
              <Payment
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                mfsInfo={mfsInfo}
                setMfsInfo={setMfsInfo}
                totalPayable={totalPayable}
              />
            </form>
          </div>

          {/* RIGHT COLUMN: Order Summary (5 out of 12) */}
          <div className="lg:col-span-5 sticky top-8">
            <OrderSection
              cart={cart}
              totalPayable={totalPayable}
              shippingCost={SHIPPING_COST}
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              appliedCoupon={appliedCoupon}
              handleApplyCoupon={handleApplyCoupon}
              handleRemoveCoupon={handleRemoveCoupon}
              couponLoading={couponLoading}
              discountAmount={discountAmount}
              placingOrder={placingOrder}
              isPhoneVerified={isPhoneVerified}
            />
          </div>

        </div>
      </div>
    </div>
  );
}