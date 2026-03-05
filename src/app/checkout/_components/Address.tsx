"use client";

import { useState } from "react";
import { MapPin, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import api from "@/lib/axios";
import Swal from "sweetalert2";
import bdAddressData from "./address.json"; // Adjust path if needed

// Cast the JSON to a type so TypeScript knows District names are keys
const addressData = bdAddressData as Record<string, string[]>;
const districts = Object.keys(addressData).sort();

interface AddressProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isPhoneVerified: boolean;
  setIsPhoneVerified: (val: boolean) => void;
}

export default function Address({ formData, handleInputChange, isPhoneVerified, setIsPhoneVerified }: AddressProps) {
  // OTP States
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // --- Handle District Change to Reset Thana ---
  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleInputChange(e);
    // Reset Thana when District changes
    handleInputChange({ target: { name: 'thana', value: '' } } as any);
  };

  // --- OTP Logic ---
  const sendOtp = async () => {
    if (!formData.phone || formData.phone.length < 11) {
      Swal.fire({ icon: 'warning', title: 'Invalid Phone', text: 'Please enter a valid mobile number.' });
      return;
    }
    
    setIsSending(true);
    try {
      // Endpoint depends on your backend (e.g., /auth/send-otp)
      await api.post('/users/send-otp', { phone: formData.phone });
      setIsOtpSent(true);
      Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'OTP Sent!', showConfirmButton: false, timer: 2000 });
    } catch (error: any) {
      Swal.fire({ icon: 'error', title: 'Failed to send OTP', text: error.response?.data?.message || 'Try again later.' });
    } finally {
      setIsSending(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) return;
    
    setIsVerifying(true);
    try {
      // Endpoint depends on your backend (e.g., /auth/verify-otp)
      await api.post('/users/verify-otp', { phone: formData.phone, otp });
      setIsPhoneVerified(true);
      Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Number Verified!', showConfirmButton: false, timer: 2000 });
    } catch (error: any) {
      Swal.fire({ icon: 'error', title: 'Invalid OTP', text: 'The OTP you entered is incorrect.' });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
          <MapPin className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Shipping Details</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* ROW 1: Full Name */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-semibold text-foreground">Full Name <span className="text-red-500">*</span></label>
          <input required type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground" placeholder="John Doe" />
        </div>
        
        {/* ROW 2: Mobile & OTP Verification */}
        <div className="space-y-2 md:col-span-2 p-4 border border-border rounded-2xl bg-muted/20">
          <label className="text-sm font-semibold text-foreground">Mobile Number Verification <span className="text-red-500">*</span></label>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Phone Input & Send Btn */}
            <div className="flex-grow flex gap-2">
              <input 
                required 
                type="tel" 
                name="phone" 
                value={formData.phone} 
                onChange={(e) => {
                  handleInputChange(e);
                  setIsPhoneVerified(false); // Reset verification if number changes
                  setIsOtpSent(false);
                }} 
                disabled={isPhoneVerified}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground disabled:opacity-70" 
                placeholder="017........" 
              />
              {!isPhoneVerified && (
                <button 
                  type="button" 
                  onClick={sendOtp} 
                  disabled={isSending || !formData.phone}
                  className="px-4 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all whitespace-nowrap disabled:opacity-50"
                >
                  {isSending ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : isOtpSent ? "Resend" : "Send OTP"}
                </button>
              )}
            </div>

            {/* OTP Input & Verify Btn */}
            {!isPhoneVerified && isOtpSent && (
              <div className="flex-grow flex gap-2 animate-in fade-in slide-in-from-right-4">
                <input 
                  type="text" 
                  value={otp} 
                  onChange={(e) => setOtp(e.target.value)} 
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground text-center tracking-[0.2em] font-bold" 
                  placeholder="• • • •" 
                  maxLength={6}
                />
                <button 
                  type="button" 
                  onClick={verifyOtp}
                  disabled={isVerifying || !otp}
                  className="px-6 py-3 bg-heading text-background font-bold rounded-xl hover:bg-black transition-all whitespace-nowrap disabled:opacity-50"
                >
                  {isVerifying ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Verify"}
                </button>
              </div>
            )}

            {/* Success State */}
            {isPhoneVerified && (
              <div className="flex items-center gap-2 px-4 py-3 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-xl font-bold flex-grow justify-center">
                <ShieldCheck className="w-5 h-5" />
                Verified
              </div>
            )}
          </div>
        </div>

        {/* ROW 3: District & Thana */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">District <span className="text-red-500">*</span></label>
          <select 
            required 
            name="district" 
            value={formData.district} 
            onChange={handleDistrictChange} 
            className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground cursor-pointer"
          >
            <option value="" disabled>Select District</option>
            {districts.map(dist => (
              <option key={dist} value={dist}>{dist}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Thana / Upazila <span className="text-red-500">*</span></label>
          <select 
            required 
            name="thana" 
            value={formData.thana} 
            onChange={handleInputChange} 
            disabled={!formData.district}
            className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground cursor-pointer disabled:opacity-50"
          >
            <option value="" disabled>Select Thana</option>
            {formData.district && addressData[formData.district]?.sort().map((thana: string) => (
              <option key={thana} value={thana}>{thana}</option>
            ))}
          </select>
        </div>

        {/* ROW 4: House, Road, Area */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:col-span-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">House <span className="text-red-500">*</span></label>
            <input required type="text" name="house" value={formData.house} onChange={handleInputChange} className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground" placeholder="e.g. House 12" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Road</label>
            <input type="text" name="road" value={formData.road} onChange={handleInputChange} className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground" placeholder="e.g. Road 4" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Area <span className="text-red-500">*</span></label>
            <input required type="text" name="area" value={formData.area} onChange={handleInputChange} className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground" placeholder="e.g. Block C" />
          </div>
        </div>

      </div>
    </div>
  );
}