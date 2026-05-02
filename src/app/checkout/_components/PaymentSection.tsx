"use client";

import { useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";

// --- Stripe inner form ---
interface StripeFormProps {
  onSuccess: (paymentIntentId: string) => Promise<void>;
  isSubmitting: boolean;
}

function StripeForm({ onSuccess, isSubmitting }: StripeFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      toast.error(error.message || "Payment failed. Please try again.");
      setProcessing(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      await onSuccess(paymentIntent.id);
    }
    setProcessing(false);
  };

  return (
    <form id="stripe-form" onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement
        options={{
          layout: "tabs",
          variables: {
            colorPrimary: "#f59e0b",
            colorBackground: "#1a1410",
            colorText: "#ffffff",
            colorDanger: "#ef4444",
            fontFamily: "system-ui, sans-serif",
            borderRadius: "12px",
          },
        } as any}
      />
      <button
        type="submit"
        disabled={!stripe || !elements || processing || isSubmitting}
        className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest rounded-2xl transition-all hover:shadow-lg hover:shadow-amber-500/30 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
      >
        {processing || isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            Pay with Stripe
          </>
        )}
      </button>
    </form>
  );
}

// --- Main Payment Section ---
interface PaymentSectionProps {
  totalPayable: number;
  clientSecret: string | null;
  onStripeSuccess: (paymentIntentId: string) => Promise<void>;
  onPayPalSuccess: (orderId: string) => Promise<void>;
  onPayPalCreateOrder: (data: any, actions: any) => Promise<string>;
  isSubmitting: boolean;
  paymentMethod: "STRIPE" | "PAYPAL";
  setPaymentMethod: (m: "STRIPE" | "PAYPAL") => void;
  stripePublishableKey: string;
  paypalClientId: string;
}

export default function PaymentSection({
  totalPayable,
  clientSecret,
  onStripeSuccess,
  onPayPalSuccess,
  onPayPalCreateOrder,
  isSubmitting,
  paymentMethod,
  setPaymentMethod,
  stripePublishableKey,
  paypalClientId,
}: PaymentSectionProps) {
  const stripePromise = useMemo(
    () => (stripePublishableKey ? loadStripe(stripePublishableKey) : null),
    [stripePublishableKey]
  );

  return (
    <div className="space-y-5">
      {/* Method Switcher */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setPaymentMethod("STRIPE")}
          className={`py-3 rounded-2xl border-2 font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
            paymentMethod === "STRIPE"
              ? "border-amber-400 bg-amber-400/10 text-amber-300"
              : "border-amber-500/30 text-white/50 hover:border-amber-500/60"
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Stripe
        </button>
        <button
          type="button"
          onClick={() => setPaymentMethod("PAYPAL")}
          className={`py-3 rounded-2xl border-2 font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
            paymentMethod === "PAYPAL"
              ? "border-amber-400 bg-amber-400/10 text-amber-300"
              : "border-amber-500/30 text-white/50 hover:border-amber-500/60"
          }`}
        >
          <span className="text-sm font-bold">PP</span>
          PayPal
        </button>
      </div>

      {/* Stripe */}
      {paymentMethod === "STRIPE" && clientSecret && (
        <div className="animate-in fade-in duration-300">
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: "night",
                variables: {
                  colorPrimary: "#f59e0b",
                  colorBackground: "#1a1410",
                  colorText: "#ffffff",
                  borderRadius: "12px",
                },
              },
            }}
          >
            <StripeForm onSuccess={onStripeSuccess} isSubmitting={isSubmitting} />
          </Elements>
        </div>
      )}

      {paymentMethod === "STRIPE" && !clientSecret && (
        <div className="flex items-center justify-center py-8 text-amber-400/60 gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-xs font-medium">Preparing secure payment...</span>
        </div>
      )}

      {/* PayPal */}
      {paymentMethod === "PAYPAL" && paypalClientId && (
        <div className="animate-in fade-in duration-300 [&_.paypal-buttons]:rounded-2xl">
          <PayPalScriptProvider
            options={{
              clientId: paypalClientId,
              currency: "USD",
            }}
          >
            <PayPalButtons
              style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }}
              disabled={isSubmitting}
              createOrder={onPayPalCreateOrder}
              onApprove={async (data) => {
                await onPayPalSuccess(data.orderID);
              }}
              onError={(err) => {
                console.error("PayPal error:", err);
                toast.error("PayPal payment failed. Please try again.");
              }}
            />
          </PayPalScriptProvider>
        </div>
      )}

      {paymentMethod === "PAYPAL" && !paypalClientId && (
        <div className="text-center py-6 text-white/40 text-xs border border-amber-500/20 rounded-2xl">
          PayPal is not configured yet. Please use Stripe or contact support.
        </div>
      )}
    </div>
  );
}
