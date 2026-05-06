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
    customerEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
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
      <div className="text-center py-12 px-6">
        <div
          className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6 border-2"
          style={{ borderColor: GOLD, color: GOLD }}
        >
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2
          className="text-3xl font-black uppercase tracking-widest mb-2"
          style={{ color: GOLD, fontFamily: "serif" }}
        >
          Order Received
        </h2>
        <p className="text-white/70 text-sm mb-6">
          Thanks — we'll reach out shortly to finalize your charm.
        </p>
        <div className="border border-white/10 rounded-lg p-4 mb-8 max-w-xs mx-auto">
          <div className="text-[10px] uppercase tracking-widest text-white/50 mb-1">
            Confirmation
          </div>
          <div className="text-2xl font-black" style={{ color: GOLD }}>
            {submitted.orderNumber}
          </div>
        </div>
        <button
          onClick={() => setSubmitted(null)}
          className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest border-2 transition-colors hover:bg-white/5"
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
      className="relative px-5 md:pl-6 md:pr-6 py-4 text-white space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2
          className="text-2xl md:text-3xl font-black uppercase tracking-[0.15em]"
          style={{ color: GOLD, fontFamily: "serif" }}
        >
          Order Form
        </h2>
        <Heart className="w-4 h-4" style={{ color: GOLD, fill: GOLD }} />
      </div>
      <div
        className="flex items-center justify-center gap-3"
        style={{ color: GOLD }}
        aria-hidden="true"
      >
        <span className="h-px flex-1" style={{ background: GOLD, opacity: 0.4 }} />
        <span className="text-[10px]">◆</span>
        <span className="h-px flex-1" style={{ background: GOLD, opacity: 0.4 }} />
      </div>

      {/* Name */}
      <UnderlineField
        label="Name"
        error={errors.customerName?.message}
        required
        {...register("customerName")}
        autoComplete="name"
      />

      {/* Cell # */}
      <UnderlineField
        label="Cell #"
        error={errors.customerPhone?.message}
        required
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        {...register("customerPhone")}
      />

      {/* Optional email — useful for confirmation receipt, kept subtle */}
      <UnderlineField
        label="Email (optional, for confirmation)"
        error={errors.customerEmail?.message}
        type="email"
        autoComplete="email"
        {...register("customerEmail")}
      />

      {/* Charm Color and Style */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label required>
            Charm Color <span className="opacity-70">and</span> Style
          </Label>
          <Lock className="w-3.5 h-3.5" style={{ color: GOLD }} />
        </div>
        <UnderlineMulti rows={2} {...register("charmColorAndStyle")} />
        {errors.charmColorAndStyle && (
          <p className="text-[11px] text-red-400">{errors.charmColorAndStyle.message}</p>
        )}
      </div>

      {/* Initial */}
      <div className="space-y-2">
        <Label>
          Would you like an initial added?{" "}
          <span className="opacity-70 text-[10px] tracking-widest">(yes or no)</span>
        </Label>
        <div className="flex items-center gap-3">
          <label className="inline-flex items-center gap-2 cursor-pointer text-xs">
            <input type="checkbox" {...register("addInitial")} className="sr-only peer" />
            <span
              className="w-4 h-4 rounded border-2 flex items-center justify-center"
              style={{ borderColor: GOLD }}
            >
              {addInitial && <CheckCircle2 className="w-3 h-3" style={{ color: GOLD }} />}
            </span>
            <span className="uppercase text-[10px] tracking-widest text-white/80">Add initial</span>
          </label>
          <UnderlineField
            label="Initial"
            required={addInitial}
            {...register("initial")}
            maxLength={20}
            className="uppercase tracking-[0.3em] flex-1"
          />
        </div>
        {errors.initial && <p className="text-[11px] text-red-400">{errors.initial.message}</p>}
      </div>

      {/* Pick Up or Mailing */}
      <div className="space-y-2">
        <Label required>Pick Up or Mailing</Label>
        <div className="grid grid-cols-2 gap-3">
          <RadioBox
            {...register("deliveryMethod")}
            value="PICKUP"
            checked={deliveryMethod === "PICKUP"}
            label="Pick Up"
          />
          <RadioBox
            {...register("deliveryMethod")}
            value="MAILING"
            checked={deliveryMethod === "MAILING"}
            label="Mailing"
          />
        </div>
        <p className="text-[10px] text-white/60 italic">Flat rate packing and mailing $18</p>
        {errors.deliveryMethod && (
          <p className="text-[11px] text-red-400">{errors.deliveryMethod.message}</p>
        )}
      </div>

      {/* Mailing Address */}
      {deliveryMethod === "MAILING" && (
        <div className="space-y-1.5">
          <Label required>Mailing Address</Label>
          <UnderlineMulti rows={2} {...register("mailingAddress")} />
          {errors.mailingAddress && (
            <p className="text-[11px] text-red-400">{errors.mailingAddress.message}</p>
          )}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-3 py-3 rounded-md font-black uppercase tracking-[0.2em] text-xs border-2 transition-all hover:scale-[1.01] disabled:opacity-50"
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

/* -------- small inline sub-components — kept local so the design stays cohesive -------- */

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label
      className="block text-[11px] font-black uppercase tracking-[0.15em]"
      style={{ color: GOLD }}
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
}
const UnderlineField = React.forwardRef<HTMLInputElement, UnderlineFieldProps>(
  ({ label, error, required, className = "", ...rest }, ref) => (
    <div className="space-y-1.5">
      <Label required={required}>{label}</Label>
      <div className="relative">
        <input
          ref={ref}
          {...rest}
          className={`w-full bg-transparent border-0 border-b-2 outline-none px-0 py-2 text-white text-base placeholder:text-white/30 focus:border-[color:var(--gold)] transition-colors ${className}`}
          style={{ borderBottomColor: GOLD, ["--gold" as any]: GOLD }}
        />
      </div>
      {error && <p className="text-[11px] text-red-400">{error}</p>}
    </div>
  ),
);
UnderlineField.displayName = "UnderlineField";

const UnderlineMulti = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className = "", ...rest }, ref) => (
  <div
    className="border-b-2 pb-1"
    style={{ borderBottomColor: GOLD }}
  >
    <textarea
      ref={ref}
      {...rest}
      className={`w-full bg-transparent border-0 outline-none resize-none text-white text-base placeholder:text-white/30 leading-7 ${className}`}
      style={{
        backgroundImage: `repeating-linear-gradient(transparent, transparent 27px, ${GOLD}33 27px, ${GOLD}33 28px)`,
      }}
    />
  </div>
));
UnderlineMulti.displayName = "UnderlineMulti";

interface RadioBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  checked?: boolean;
}
const RadioBox = React.forwardRef<HTMLInputElement, RadioBoxProps>(
  ({ label, checked, ...rest }, ref) => (
    <label
      className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-all border ${
        checked ? "bg-white/5" : "border-transparent"
      }`}
      style={{ borderColor: checked ? GOLD : "transparent" }}
    >
      <input ref={ref} type="radio" className="sr-only" {...rest} />
      <span
        className="w-4 h-4 border-2 flex items-center justify-center"
        style={{ borderColor: GOLD }}
      >
        {checked && <span className="w-2 h-2" style={{ background: GOLD }} />}
      </span>
      <span
        className="text-xs font-black uppercase tracking-[0.2em]"
        style={{ color: GOLD }}
      >
        {label}
      </span>
    </label>
  ),
);
RadioBox.displayName = "RadioBox";
