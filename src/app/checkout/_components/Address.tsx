"use client";

import { useState, useEffect } from "react";
import { MapPin, ShieldCheck, Loader2, BookmarkCheck } from "lucide-react";
import api from "@/lib/axios";
import Swal from "sweetalert2";
import bdAddressData from "./address.json"; // Ensure path is correct

// Type casting for the new deeply nested BD address data
const addressData = bdAddressData as Record<string, Record<string, string[]>>;
const DIVISIONS = Object.keys(addressData).sort();

interface AddressProps {
  formData: any;
  setFormData: any; // Used for quick-filling saved addresses
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isPhoneVerified: boolean;
  setIsPhoneVerified: (val: boolean) => void;
  userAddresses?: any[]; // Array of saved addresses from user profile
}

export default function Address({
  formData,
  setFormData,
  handleInputChange,
  isPhoneVerified,
  setIsPhoneVerified,
  userAddresses = []
}: AddressProps) {

  // OTP Local States
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  /**
   * DEPENDENT DROPDOWNS LOGIC
   */
  const districts = formData.division ? Object.keys(addressData[formData.division] || {}).sort() : [];
  const thanas = (formData.division && formData.district) ? (addressData[formData.division][formData.district] || []).sort() : [];

  const handleDivisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleInputChange(e); // Set division
    // Reset district and thana
    handleInputChange({ target: { name: 'district', value: '' } } as any);
    handleInputChange({ target: { name: 'thana', value: '' } } as any);
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleInputChange(e); // Set district
    // Reset thana
    handleInputChange({ target: { name: 'thana', value: '' } } as any);
  };


  /**
   * REQUIREMENT: Persistence on Reload
   */
  useEffect(() => {
    const sessionVerifiedPhone = sessionStorage.getItem("verified_phone");
    if (sessionVerifiedPhone && formData.phone === sessionVerifiedPhone) {
      setIsPhoneVerified(true);
    }
  }, [formData.phone, setIsPhoneVerified]);


  /**
   * REQUIREMENT: Saved Address Picker
   */
  const selectSavedAddress = (addr: any) => {
    setFormData((prev: any) => ({
      ...prev,
      division: addr.division || "",
      district: addr.district || "",
      thana: addr.thana || "",
      postalCode: addr.postalCode || "",
      house: addr.house || "",
      road: addr.road || "",
      area: addr.area || "",
    }));

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Saved address applied',
      showConfirmButton: false,
      timer: 1500,
      background: 'hsl(var(--card))',
      color: 'hsl(var(--foreground))',
    });
  };

  /**
   * OTP Logic: Sending
   */
  const sendOtp = async () => {
    if (!formData.phone || formData.phone.length < 11) {
      Swal.fire({ icon: 'warning', title: 'Invalid Phone', text: 'Please enter a valid 11-digit mobile number.' });
      return;
    }

    setIsSending(true);
    try {
      await api.post('/users/send-otp', { phone: formData.phone });
      setIsOtpSent(true);
      Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'OTP Sent!', showConfirmButton: false, timer: 2000 });
    } catch (error: any) {
      Swal.fire({ icon: 'error', title: 'Failed to send OTP', text: error.response?.data?.message || 'Please try again later.' });
    } finally {
      setIsSending(false);
    }
  };

  /**
   * OTP Logic: Verification
   */
  const verifyOtp = async () => {
    if (!otp) return;

    setIsVerifying(true);
    try {
      await api.post('/users/verify-otp', { phone: formData.phone, otp });
      // Save to session storage so reload doesn't kill the status
      sessionStorage.setItem("verified_phone", formData.phone);
      setIsPhoneVerified(true);
      Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Number Verified!', showConfirmButton: false, timer: 2000 });
    } catch (error: any) {
      Swal.fire({ icon: 'error', title: 'Invalid OTP', text: 'The OTP code is incorrect or expired.' });
    } finally {
      setIsVerifying(false);
    }
  };


  return (
    <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-theme-sm space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <MapPin className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-black text-foreground uppercase tracking-tight">
            Shipping <span className="text-primary italic">Details</span>
          </h2>
        </div>
      </div>

      {/* Saved Addresses Picker Section */}
      {userAddresses.length > 0 && (
        <div className="p-5 border-2 border-dashed border-primary/20 rounded-2xl bg-primary/5 animate-in fade-in duration-500">
          <label className="text-[10px] font-black uppercase tracking-widest text-primary/70 mb-4 block">
            Quick Fill Saved Address
          </label>
          <div className="flex flex-wrap gap-3">
            {userAddresses.map((addr, i) => (
              <button
                key={i}
                type="button"
                onClick={() => selectSavedAddress(addr)}
                className="px-4 py-2.5 bg-background border border-border rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-primary hover:text-primary transition-all flex items-center gap-2 shadow-sm group"
              >
                <BookmarkCheck size={14} className="text-muted-foreground group-hover:text-primary" />
                {addr.thana || 'Address'}, {addr.district}
                {addr.isDefault && <span className="text-[8px] bg-primary/10 px-1 rounded text-primary">Default</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Full Name */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Full Name <span className="text-red-500">*</span></label>
          <input
            required
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-foreground"
            placeholder="Recipient's Name"
          />
        </div>

        {/* Mobile Number & OTP Verification */}
        <div className="space-y-4 md:col-span-2 p-5 border border-border rounded-2xl bg-muted/10">
          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            Mobile Verification <span className="text-red-500">*</span>
          </label>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Phone Input Box */}
            <div className="flex-grow flex gap-2">
              <div className="relative flex-grow">
                <input
                  required
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => {
                    handleInputChange(e);
                    if (e.target.value !== sessionStorage.getItem("verified_phone")) {
                      setIsPhoneVerified(false);
                      setIsOtpSent(false);
                    }
                  }}
                  disabled={isPhoneVerified}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-foreground disabled:opacity-60"
                  placeholder="01XXXXXXXXX"
                />
              </div>
              {!isPhoneVerified && (
                <button
                  type="button"
                  onClick={sendOtp}
                  disabled={isSending || !formData.phone}
                  className="px-6 py-3 bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-widest rounded-xl hover:shadow-theme-md transition-all whitespace-nowrap disabled:opacity-50 active:scale-95"
                >
                  {isSending ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : isOtpSent ? "Resend OTP" : "Get OTP"}
                </button>
              )}
            </div>

            {/* OTP Verification Box */}
            {!isPhoneVerified && isOtpSent && (
              <div className="flex-grow flex gap-2 animate-in slide-in-from-right-4 duration-300">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground text-center tracking-[0.3em] font-black"
                  placeholder="0000"
                  maxLength={6}
                />
                <button
                  type="button"
                  onClick={verifyOtp}
                  disabled={isVerifying || !otp}
                  className="px-8 py-3 bg-foreground text-background font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-black transition-all whitespace-nowrap disabled:opacity-50 active:scale-95"
                >
                  {isVerifying ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Verify"}
                </button>
              </div>
            )}

            {/* Success/Verified Badge */}
            {isPhoneVerified && (
              <div className="flex items-center gap-2 px-6 py-3 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-xl font-black text-[10px] uppercase tracking-widest flex-grow justify-center shadow-sm">
                <ShieldCheck className="w-4 h-4" />
                Verified
              </div>
            )}
          </div>
        </div>

        {/* Division Selection */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Division <span className="text-red-500">*</span></label>
          <select
            required
            name="division"
            value={formData.division}
            onChange={handleDivisionChange}
            className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-foreground cursor-pointer appearance-none"
          >
            <option value="" disabled>Select Division</option>
            {DIVISIONS.map(div => (
              <option key={div} value={div}>{div}</option>
            ))}
          </select>
        </div>

        {/* District Selection */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">District <span className="text-red-500">*</span></label>
          <select
            required
            name="district"
            value={formData.district}
            onChange={handleDistrictChange}
            disabled={!formData.division}
            className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-foreground cursor-pointer disabled:opacity-50 appearance-none"
          >
            <option value="" disabled>Select District</option>
            {districts.map(dist => (
              <option key={dist} value={dist}>{dist}</option>
            ))}
          </select>
        </div>

        {/* Thana Selection */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Thana / Upazila <span className="text-red-500">*</span></label>
          <select
            required
            name="thana"
            value={formData.thana}
            onChange={handleInputChange}
            disabled={!formData.district}
            className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-foreground cursor-pointer disabled:opacity-50 appearance-none"
          >
            <option value="" disabled>Select Thana</option>
            {thanas.map((thana: string) => (
              <option key={thana} value={thana}>{thana}</option>
            ))}
          </select>
        </div>

        {/* Postal Code & Address Line Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:col-span-2">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex justify-between">
              <span>Postal Code</span> <span className="lowercase font-medium opacity-70">(Optional)</span>
            </label>
            <input type="text" name="postalCode" value={formData.postalCode || ""} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-sm" placeholder="e.g. 1206" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">House/Apt <span className="text-red-500">*</span></label>
            <input required type="text" name="house" value={formData.house || ""} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-sm" placeholder="e.g. 12/A" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex justify-between">
              <span>Road</span> <span className="lowercase font-medium opacity-70">(Optional)</span>
            </label>
            <input type="text" name="road" value={formData.road || ""} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-sm" placeholder="e.g. Main St" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Area/Block <span className="text-red-500">*</span></label>
            <input required type="text" name="area" value={formData.area || ""} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-sm" placeholder="e.g. Sector 7" />
          </div>
        </div>

      </div>
    </div>
  );
}