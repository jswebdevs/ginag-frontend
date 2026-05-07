"use client";

import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { CheckCircle2, Loader2, Heart, Lock } from "lucide-react";
import api from "@/lib/axios";

const Schema = z
  .object({
    customerName: z.string().min(1, "Name is required").max(120),
    customerPhone: z
      .string()
      .min(1, "Cell number is required")
      .max(40)
      .refine((v) => /[\d]/.test(v), "Enter a valid cell number"),
    customerEmail: z.string().min(1, "Email is required").email("Invalid email address"),
    charmColorAndStyle: z.string().min(1, "Charm color and style is required").max(2000),
    addInitial: z.boolean(),
    initial: z.string().max(20).optional().or(z.literal("")),
    deliveryMethod: z.enum(["PICKUP", "MAILING"], { message: "Choose pick up or mailing" }),
    mailingAddress: z.string().max(2000).optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (data.addInitial && (!data.initial || !data.initial.trim())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["initial"],
        message: "Enter the initial letter(s)",
      });
    }
    if (data.deliveryMethod === "MAILING" && (!data.mailingAddress || !data.mailingAddress.trim())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["mailingAddress"],
        message: "Mailing address is required",
      });
    }
  });

type FormValues = z.infer<typeof Schema>;

const GOLD = "#d4af37";

// Concentrated gold-dust clusters at the top-right and bottom-right corners.
// Coordinates are right/top/bottom offsets in px — deterministic, no SSR drift.
const TOP_RIGHT_DOTS: Array<{ top: string; right: string; size: number; delay: string }> = [
  { top: "10px",  right: "12px", size: 3,   delay: "0s"   },
  { top: "26px",  right: "26px", size: 1.5, delay: "0.4s" },
  { top: "16px",  right: "46px", size: 2,   delay: "0.8s" },
  { top: "36px",  right: "14px", size: 1,   delay: "1.2s" },
  { top: "44px",  right: "34px", size: 2,   delay: "0.6s" },
  { top: "30px",  right: "66px", size: 1,   delay: "1.0s" },
  { top: "56px",  right: "20px", size: 2.5, delay: "0.2s" },
  { top: "52px",  right: "52px", size: 1.5, delay: "1.4s" },
  { top: "66px",  right: "38px", size: 1,   delay: "1.7s" },
  { top: "74px",  right: "12px", size: 1.5, delay: "0.9s" },
  { top: "20px",  right: "82px", size: 1,   delay: "1.5s" },
  { top: "84px",  right: "30px", size: 1,   delay: "0.5s" },
  { top: "8px",   right: "60px", size: 1.5, delay: "1.9s" },
  { top: "94px",  right: "16px", size: 1,   delay: "2.1s" },
  { top: "44px",  right: "78px", size: 1,   delay: "1.1s" },
];

const BOTTOM_RIGHT_DOTS: Array<{ bottom: string; right: string; size: number; delay: string }> = [
  { bottom: "10px", right: "12px", size: 3,   delay: "0.1s" },
  { bottom: "22px", right: "32px", size: 1.5, delay: "0.5s" },
  { bottom: "16px", right: "50px", size: 2,   delay: "1.1s" },
  { bottom: "34px", right: "16px", size: 1,   delay: "0.7s" },
  { bottom: "40px", right: "36px", size: 2,   delay: "1.3s" },
  { bottom: "28px", right: "66px", size: 1,   delay: "0.3s" },
  { bottom: "54px", right: "22px", size: 2.5, delay: "1.5s" },
  { bottom: "48px", right: "52px", size: 1.5, delay: "0.9s" },
  { bottom: "62px", right: "36px", size: 1,   delay: "1.8s" },
  { bottom: "70px", right: "14px", size: 1.5, delay: "0.6s" },
  { bottom: "20px", right: "84px", size: 1,   delay: "1.4s" },
  { bottom: "82px", right: "32px", size: 1,   delay: "0.4s" },
  { bottom: "8px",  right: "62px", size: 1.5, delay: "2.0s" },
  { bottom: "94px", right: "18px", size: 1,   delay: "0.8s" },
  { bottom: "46px", right: "78px", size: 1,   delay: "1.6s" },
];

export default function OrderForm() {
  const [submitted, setSubmitted] = useState<{ orderNumber: string } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      charmColorAndStyle: "",
      addInitial: false,
      initial: "",
      deliveryMethod: "PICKUP",
      mailingAddress: "",
    },
  });

  const addInitial = watch("addInitial");
  const deliveryMethod = watch("deliveryMethod");

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await api.post("/custom-orders", values);
      const orderNumber = res.data?.data?.orderNumber || "—";
      setSubmitted({ orderNumber });
      reset();
      toast.success("Order received!", { description: `Confirmation #${orderNumber}` });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit order. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="relative text-center py-12 px-6 overflow-hidden">
        <GoldDust />
        <div
          className="relative w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6 border-2 animate-float-slow"
          style={{ borderColor: GOLD, color: GOLD }}
        >
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2
          className="relative text-3xl font-black uppercase tracking-widest mb-2"
          style={{ color: GOLD, fontFamily: "serif" }}
        >
          Order Received
        </h2>
        <p className="relative text-white/70 text-sm mb-6">
          Thanks — we'll reach out shortly to finalize your charm.
        </p>
        <div className="relative border border-white/10 rounded-lg p-4 mb-8 max-w-xs mx-auto">
          <div className="text-[10px] uppercase tracking-widest text-white/50 mb-1">
            Confirmation
          </div>
          <div className="text-2xl font-black" style={{ color: GOLD }}>
            {submitted.orderNumber}
          </div>
        </div>
        <button
          onClick={() => setSubmitted(null)}
          className="relative px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest border-2 transition-colors hover:bg-white/5"
          style={{ borderColor: GOLD, color: GOLD }}
        >
          Place another order
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative px-5 md:px-7 py-5 md:py-6 text-white space-y-3"
    >
      {/* Floating gold dust */}
      <GoldDust />

      {/* Header — ORDER FORM with line + heart underneath */}
      <div className="relative">
        <h2
          className="text-3xl md:text-4xl font-black uppercase tracking-[0.18em] text-center md:text-left"
          style={{ color: GOLD, fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
        >
          Order Form
        </h2>
        <HeartDivider className="mt-1.5 max-w-[200px] md:mx-0 mx-auto" />
      </div>

      {/* Name */}
      <UnderlineField
        label="Name"
        error={errors.customerName?.message}
        required
        layout="inline"
        {...register("customerName")}
        autoComplete="name"
      />

      {/* Cell # */}
      <UnderlineField
        label="Cell #"
        error={errors.customerPhone?.message}
        required
        layout="inline"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        {...register("customerPhone")}
      />

      {/* Email — required for order confirmation */}
      <UnderlineField
        label="Email"
        error={errors.customerEmail?.message}
        required
        layout="inline"
        type="email"
        autoComplete="email"
        {...register("customerEmail")}
      />

      {/* Charm Color and Style — block label with lock icon, notebook lines below */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between">
          <SectionLabel>Charm Color and Style</SectionLabel>
          <Lock className="w-5 h-5" style={{ color: GOLD }} aria-hidden="true" />
        </div>
        <UnderlineMulti rows={2} {...register("charmColorAndStyle")} />
        {errors.charmColorAndStyle && (
          <p className="text-[11px] text-red-400">{errors.charmColorAndStyle.message}</p>
        )}
      </div>

      <HeartDivider />

      {/* Initial */}
      <div className="space-y-2">
        <SectionLabel>
          Would you like an initial added?{" "}
          <span className="opacity-70 text-[10px] tracking-widest">(yes or no)</span>
        </SectionLabel>
        <div className="flex items-center gap-3">
          <label className="inline-flex items-center gap-2 cursor-pointer text-xs">
            <input type="checkbox" {...register("addInitial")} className="sr-only peer" />
            <span
              className="w-4 h-4 border-2 flex items-center justify-center transition-colors"
              style={{ borderColor: GOLD }}
            >
              {addInitial && <span className="w-2 h-2" style={{ background: GOLD }} />}
            </span>
            <span className="uppercase text-[10px] tracking-widest text-white/80">Add</span>
          </label>
          <UnderlineField
            label="Initial"
            required={addInitial}
            layout="inline"
            {...register("initial")}
            maxLength={20}
            className="uppercase tracking-[0.3em] flex-1"
          />
        </div>
        {errors.initial && <p className="text-[11px] text-red-400">{errors.initial.message}</p>}
      </div>

      <HeartDivider />

      {/* Pick Up or Mailing — two checkboxes + vertical separator + flat-rate note */}
      <div className="space-y-2">
        <SectionLabel>Pick Up or Mailing</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-[auto_1px_1fr] gap-3 sm:gap-4 items-center">
          <div className="flex flex-col gap-2">
            <SquareCheckbox
              {...register("deliveryMethod")}
              value="PICKUP"
              checked={deliveryMethod === "PICKUP"}
              label="Pick Up"
            />
            <SquareCheckbox
              {...register("deliveryMethod")}
              value="MAILING"
              checked={deliveryMethod === "MAILING"}
              label="Mailing"
            />
          </div>
          <div className="hidden sm:block self-stretch w-px" style={{ background: `${GOLD}66` }} />
          <p className="text-[12px] md:text-sm text-white/85" style={{ fontFamily: "serif" }}>
            Flat rate packing and Mailing $18
          </p>
        </div>
        {errors.deliveryMethod && (
          <p className="text-[11px] text-red-400">{errors.deliveryMethod.message}</p>
        )}
      </div>

      <HeartDivider />

      {/* Mailing Address — always visible to mirror reference layout */}
      <div className="space-y-1.5">
        <SectionLabel>Mailing Address:</SectionLabel>
        <UnderlineMulti
          rows={2}
          disabled={deliveryMethod !== "MAILING"}
          {...register("mailingAddress")}
        />
        {deliveryMethod !== "MAILING" && (
          <p className="text-[10px] text-white/40 italic">
            Required only when "Mailing" is selected
          </p>
        )}
        {errors.mailingAddress && (
          <p className="text-[11px] text-red-400">{errors.mailingAddress.message}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="relative w-full mt-2 py-2.5 rounded-md font-black uppercase tracking-[0.25em] text-xs border-2 transition-all hover:scale-[1.01] hover:bg-white/5 disabled:opacity-50 overflow-hidden cursor-pointer"
        style={{ borderColor: GOLD, color: GOLD, background: "transparent" }}
      >
        {isSubmitting ? (
          <span className="inline-flex items-center gap-2 justify-center">
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending…
          </span>
        ) : (
          "Submit Order"
        )}
      </button>
    </form>
  );
}

/* ───────── Inline sub-components ───────── */

function GoldDust() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden -z-0">
      {/* Top-right cluster: heart sits above the dot swarm */}
      <Heart
        className="absolute top-2 right-2.5 w-6 h-6 animate-float-slow"
        style={{ color: GOLD, fill: GOLD }}
        aria-hidden="true"
      />
      {TOP_RIGHT_DOTS.map((s, i) => (
        <span
          key={`tr-${i}`}
          className="absolute rounded-full animate-twinkle"
          style={{
            top: s.top,
            right: s.right,
            width: `${s.size}px`,
            height: `${s.size}px`,
            background: GOLD,
            boxShadow: `0 0 ${s.size * 2.5}px ${GOLD}`,
            animationDelay: s.delay,
          }}
        />
      ))}

      {/* Bottom-right cluster: heart sits above the dot swarm */}
      <Heart
        className="absolute right-3 w-9 h-9 animate-float-slow"
        style={{ color: GOLD, fill: "transparent", strokeWidth: 1.5, bottom: "108px" }}
        aria-hidden="true"
      />
      {BOTTOM_RIGHT_DOTS.map((s, i) => (
        <span
          key={`br-${i}`}
          className="absolute rounded-full animate-twinkle"
          style={{
            bottom: s.bottom,
            right: s.right,
            width: `${s.size}px`,
            height: `${s.size}px`,
            background: GOLD,
            boxShadow: `0 0 ${s.size * 2.5}px ${GOLD}`,
            animationDelay: s.delay,
          }}
        />
      ))}
    </div>
  );
}

function HeartDivider({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative flex items-center justify-center gap-3 ${className}`}
      aria-hidden="true"
    >
      <span className="h-px flex-1" style={{ background: GOLD, opacity: 0.45 }} />
      <Heart className="w-3 h-3" style={{ color: GOLD, fill: GOLD }} />
      <span className="h-px flex-1" style={{ background: GOLD, opacity: 0.45 }} />
    </div>
  );
}

function SectionLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label
      className="block text-[12px] md:text-[13px] font-black uppercase tracking-[0.18em]"
      style={{ color: GOLD, fontFamily: "serif" }}
    >
      {children}
      {required && <span className="ml-1 opacity-60">*</span>}
    </label>
  );
}

interface UnderlineFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
  /** "block" stacks label above the underline; "inline" puts label and underline on one row (matches reference) */
  layout?: "block" | "inline";
}
const UnderlineField = React.forwardRef<HTMLInputElement, UnderlineFieldProps>(
  ({ label, error, required, layout = "block", className = "", ...rest }, ref) => {
    if (layout === "inline") {
      return (
        <div className="space-y-0.5">
          <div
            className="flex items-baseline gap-2 border-b-2 pb-0.5"
            style={{ borderBottomColor: GOLD }}
          >
            <span
              className="text-[13px] md:text-sm shrink-0 leading-none"
              style={{ color: "#fff", fontFamily: "serif" }}
            >
              {label}
              {required && <span className="ml-0.5 opacity-60">*</span>}:
            </span>
            <input
              ref={ref}
              {...rest}
              className={`flex-1 w-full bg-transparent border-0 outline-none px-0 py-0 text-white text-[15px] leading-none placeholder:text-white/30 ${className}`}
            />
          </div>
          {error && <p className="text-[11px] text-red-400 pl-1">{error}</p>}
        </div>
      );
    }
    return (
      <div className="space-y-1.5">
        <SectionLabel required={required}>{label}</SectionLabel>
        <div className="relative">
          <input
            ref={ref}
            {...rest}
            className={`w-full bg-transparent border-0 border-b-2 outline-none px-0 py-2 text-white text-base placeholder:text-white/30 transition-colors ${className}`}
            style={{ borderBottomColor: GOLD }}
          />
        </div>
        {error && <p className="text-[11px] text-red-400">{error}</p>}
      </div>
    );
  },
);
UnderlineField.displayName = "UnderlineField";

const UnderlineMulti = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className = "", disabled, ...rest }, ref) => (
  <div
    className={`pb-1 transition-opacity ${disabled ? "opacity-40" : "opacity-100"}`}
  >
    <textarea
      ref={ref}
      disabled={disabled}
      {...rest}
      className={`w-full bg-transparent border-0 outline-none resize-none text-white text-base placeholder:text-white/30 leading-7 disabled:cursor-not-allowed ${className}`}
      style={{
        backgroundImage: `repeating-linear-gradient(transparent, transparent 27px, ${GOLD} 27px, ${GOLD} 28px)`,
      }}
    />
  </div>
));
UnderlineMulti.displayName = "UnderlineMulti";

interface SquareCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  checked?: boolean;
}
const SquareCheckbox = React.forwardRef<HTMLInputElement, SquareCheckboxProps>(
  ({ label, checked, ...rest }, ref) => (
    <label
      className="flex items-center gap-3 px-1 py-1 cursor-pointer group"
    >
      <input ref={ref} type="radio" className="sr-only" {...rest} />
      <span
        className="w-5 h-5 border-2 flex items-center justify-center transition-all group-hover:scale-105"
        style={{
          borderColor: GOLD,
          background: checked ? `${GOLD}33` : "transparent",
        }}
      >
        {checked && <span className="w-2.5 h-2.5" style={{ background: GOLD }} />}
      </span>
      <span
        className="text-xs md:text-sm font-black uppercase tracking-[0.22em]"
        style={{ color: GOLD, fontFamily: "serif" }}
      >
        {label}
      </span>
    </label>
  ),
);
SquareCheckbox.displayName = "SquareCheckbox";
