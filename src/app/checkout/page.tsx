"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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
  
  // States
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  // Coupon States
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null); 
  const [discountAmount, setDiscountAmount] = useState(0);

  // Form States
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    district: "",
    thana: "",
    house: "",
    road: "",
    area: "",
  });

  // Payment States
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "MFS">("COD");
  const [mfsInfo, setMfsInfo] = useState({ provider: "bKash", senderNumber: "", transactionId: "" });
  
  // --- DYNAMIC SHIPPING COST LOGIC ---
  // If no district is selected, show 0. If "Dhaka", show 80. Otherwise, 150.
  const SHIPPING_COST = formData.district === "" ? 0 : (formData.district === "Dhaka" ? 80 : 150);

  // --- Initialization ---
  useEffect(() => {
    const initializeCheckout = async () => {
      try {
        const cartRes = await api.get("/cart");
        const cartData = cartRes.data.data;
        
        if (!cartData || cartData.items.length === 0) {
          router.push("/cart");
          return;
        }
        setCart(cartData);

        try {
          const userRes = await api.get("/users/me");
          const user = userRes.data.data;
          
          if (user) {
            setIsLoggedIn(true);
            const updatedForm = {
              fullName: user.fullName || "",
              phone: user.phone || "",
              email: user.email || "",
              address: "",
              city: "",
              zipCode: "",
              district: "",
              thana: "",
              house: "",
              road: "",
              area: "",
            };

            // If the user's phone is already verified in DB, mark it true
            if (user.phoneVerified) {
              setIsPhoneVerified(true);
            }

            if (user.addresses && user.addresses.length > 0) {
              const defaultAddr = user.addresses[0];
              updatedForm.district = defaultAddr.district || "";
              updatedForm.thana = defaultAddr.thana || "";
              updatedForm.house = defaultAddr.house || "";
              updatedForm.road = defaultAddr.road || "";
              updatedForm.area = defaultAddr.area || "";
            }
            setFormData(updatedForm);
          }
        } catch (error) {
          console.log("Proceeding as guest checkout");
        }
      } catch (error) {
        console.error("Failed to initialize checkout:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeCheckout();
  }, [router]);

  // --- Handlers ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === "MFS" && (!mfsInfo.senderNumber || !mfsInfo.transactionId)) {
      Swal.fire({ icon: 'warning', title: 'Missing Info', text: 'Please enter your TrxID and Sender Number for manual payment.' });
      return;
    }

    setPlacingOrder(true);

    try {
      await api.post("/orders/checkout", {
        shippingAddress: formData,
        paymentMethod: paymentMethod,
        paymentDetails: paymentMethod === "MFS" ? mfsInfo : null,
        shippingCost: SHIPPING_COST,
        couponId: appliedCoupon?.id || null,
        customerPhone: formData.phone // Ensure phone is sent directly as well
      });

      Swal.fire({
        title: "Order Placed!",
        text: "Your order has been successfully placed.",
        icon: "success",
        confirmButtonColor: "#0ea5e9",
      }).then(() => {
        router.push(isLoggedIn ? "/dashboard/orders" : "/order-success"); 
      });

    } catch (error: any) {
      Swal.fire({
        title: "Checkout Failed",
        text: error.response?.data?.message || "Something went wrong.",
        icon: "error",
      });
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!cart) return null;

  const totalPayable = (cart.totalAmount - discountAmount) + SHIPPING_COST;

  return (
    <div className="min-h-screen bg-muted/30 py-6 sm:py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 sm:mb-8">
          <Link href="/cart" className="w-10 h-10 flex items-center justify-center bg-card border border-border rounded-full text-muted-foreground hover:text-foreground hover:border-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-foreground">Secure Checkout</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-12">
          
          {/* LEFT: Forms */}
          <div className="flex-grow space-y-6 sm:space-y-8">
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-6 sm:space-y-8">
              <Address 
                formData={formData} 
                handleInputChange={handleInputChange as any} 
                isPhoneVerified={isPhoneVerified}
                setIsPhoneVerified={setIsPhoneVerified}
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

          {/* RIGHT: Summary */}
          <div className="w-full lg:w-[420px] flex-shrink-0">
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
              isPhoneVerified={isPhoneVerified} // <-- Passing this down
            />
          </div>

        </div>
      </div>
    </div>
  );
}