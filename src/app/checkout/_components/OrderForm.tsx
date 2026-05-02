"use client";

import { Package, Mail, Phone, Palette, Type, Truck, MapPin } from "lucide-react";

interface OrderFormData {
  name: string;
  cellNumber: string;
  email: string;
  charmColorStyle: string;
  wantsInitial: boolean | null;
  initial: string;
  deliveryMethod: "PICKUP" | "MAILING";
  mailingAddress: string;
}

interface OrderFormProps {
  formData: OrderFormData;
  onChange: (data: Partial<OrderFormData>) => void;
}

export const DELIVERY_FEE = 18;

export default function OrderForm({ formData, onChange }: OrderFormProps) {
  return (
    <div className="space-y-6">
      {/* Name & Cell */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-amber-400">
            <Mail className="w-3.5 h-3.5" />
            Name <span className="text-red-400">*</span>
          </label>
          <input
            required
            type="text"
            value={formData.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="Your full name"
            className="w-full px-4 py-3 bg-white/5 border border-amber-500/30 rounded-xl focus:ring-2 focus:ring-amber-400/40 outline-none text-white font-medium placeholder:text-white/30 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-amber-400">
            <Phone className="w-3.5 h-3.5" />
            Cell # <span className="text-red-400">*</span>
          </label>
          <input
            required
            type="tel"
            value={formData.cellNumber}
            onChange={(e) => onChange({ cellNumber: e.target.value })}
            placeholder="Your cell number"
            className="w-full px-4 py-3 bg-white/5 border border-amber-500/30 rounded-xl focus:ring-2 focus:ring-amber-400/40 outline-none text-white font-medium placeholder:text-white/30 transition-all"
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-amber-400">
          <Mail className="w-3.5 h-3.5" />
          Email <span className="text-red-400">*</span>
        </label>
        <input
          required
          type="email"
          value={formData.email}
          onChange={(e) => onChange({ email: e.target.value })}
          placeholder="your@email.com"
          className="w-full px-4 py-3 bg-white/5 border border-amber-500/30 rounded-xl focus:ring-2 focus:ring-amber-400/40 outline-none text-white font-medium placeholder:text-white/30 transition-all"
        />
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-amber-500/20" />
        <span className="text-amber-500/50 text-xs">✦</span>
        <div className="flex-1 h-px bg-amber-500/20" />
      </div>

      {/* Charm Color & Style */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-amber-400">
          <Palette className="w-3.5 h-3.5" />
          Charm Color <span className="text-amber-300/70">and</span> Style <span className="text-red-400">*</span>
        </label>
        <textarea
          required
          rows={3}
          value={formData.charmColorStyle}
          onChange={(e) => onChange({ charmColorStyle: e.target.value })}
          placeholder="Describe your preferred colors, bead style, design details..."
          className="w-full px-4 py-3 bg-white/5 border border-amber-500/30 rounded-xl focus:ring-2 focus:ring-amber-400/40 outline-none text-white font-medium placeholder:text-white/30 transition-all resize-none"
        />
      </div>

      {/* Initial Question */}
      <div className="space-y-3 p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5">
        <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-amber-400">
          <Type className="w-3.5 h-3.5" />
          Would you like an initial added?
        </label>
        <div className="flex gap-4">
          {[true, false].map((val) => (
            <button
              key={String(val)}
              type="button"
              onClick={() => onChange({ wantsInitial: val, initial: val ? formData.initial : "" })}
              className={`flex-1 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest border-2 transition-all ${
                formData.wantsInitial === val
                  ? "border-amber-400 bg-amber-400/20 text-amber-300"
                  : "border-amber-500/30 text-white/50 hover:border-amber-500/60"
              }`}
            >
              {val ? "Yes" : "No"}
            </button>
          ))}
        </div>

        {formData.wantsInitial === true && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <label className="text-[10px] font-black uppercase tracking-widest text-amber-300/70">
              Initial Letter
            </label>
            <input
              type="text"
              maxLength={3}
              value={formData.initial}
              onChange={(e) => onChange({ initial: e.target.value.toUpperCase() })}
              placeholder="e.g. G"
              className="w-full px-4 py-3 bg-white/5 border border-amber-500/30 rounded-xl focus:ring-2 focus:ring-amber-400/40 outline-none text-white font-black text-xl tracking-[0.5em] text-center placeholder:text-white/20 placeholder:font-normal placeholder:text-sm placeholder:tracking-widest transition-all"
            />
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-amber-500/20" />
        <span className="text-amber-500/50 text-xs">✦</span>
        <div className="flex-1 h-px bg-amber-500/20" />
      </div>

      {/* Delivery Method */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-amber-400">
          <Truck className="w-3.5 h-3.5" />
          Pick Up or Mailing
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Pick Up */}
          <button
            type="button"
            onClick={() => onChange({ deliveryMethod: "PICKUP" })}
            className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left ${
              formData.deliveryMethod === "PICKUP"
                ? "border-amber-400 bg-amber-400/10"
                : "border-amber-500/30 hover:border-amber-500/60"
            }`}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
              formData.deliveryMethod === "PICKUP" ? "border-amber-400" : "border-white/30"
            }`}>
              {formData.deliveryMethod === "PICKUP" && <div className="w-2.5 h-2.5 bg-amber-400 rounded-full" />}
            </div>
            <div>
              <p className={`font-black text-sm uppercase tracking-wider ${formData.deliveryMethod === "PICKUP" ? "text-amber-300" : "text-white/70"}`}>
                Pick Up
              </p>
              <p className="text-xs text-amber-400/80 mt-0.5 font-semibold">Flat rate $18</p>
            </div>
          </button>

          {/* Mailing */}
          <button
            type="button"
            onClick={() => onChange({ deliveryMethod: "MAILING" })}
            className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left ${
              formData.deliveryMethod === "MAILING"
                ? "border-amber-400 bg-amber-400/10"
                : "border-amber-500/30 hover:border-amber-500/60"
            }`}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
              formData.deliveryMethod === "MAILING" ? "border-amber-400" : "border-white/30"
            }`}>
              {formData.deliveryMethod === "MAILING" && <div className="w-2.5 h-2.5 bg-amber-400 rounded-full" />}
            </div>
            <div>
              <p className={`font-black text-sm uppercase tracking-wider ${formData.deliveryMethod === "MAILING" ? "text-amber-300" : "text-white/70"}`}>
                Mailing
              </p>
              <p className="text-xs text-amber-400/80 mt-0.5 font-semibold">Flat rate packing & mailing ${DELIVERY_FEE}</p>
            </div>
          </button>
        </div>

        {/* Mailing Address */}
        {formData.deliveryMethod === "MAILING" && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-300/70">
              <MapPin className="w-3 h-3" />
              Mailing Address <span className="text-red-400">*</span>
            </label>
            <textarea
              required={formData.deliveryMethod === "MAILING"}
              rows={3}
              value={formData.mailingAddress}
              onChange={(e) => onChange({ mailingAddress: e.target.value })}
              placeholder="Street address, City, State, ZIP Code"
              className="w-full px-4 py-3 bg-white/5 border border-amber-500/30 rounded-xl focus:ring-2 focus:ring-amber-400/40 outline-none text-white font-medium placeholder:text-white/30 transition-all resize-none"
            />
          </div>
        )}
      </div>
    </div>
  );
}
