"use client";

import React, { useState, useEffect, useRef } from "react";
import { User as UserIcon, Mail, Phone, Calendar, ShieldCheck, Camera, Loader2, Save } from "lucide-react";
import api from "@/lib/axios";
import { useUserStore } from "@/store/useUserStore";
import Swal from "sweetalert2";

export default function ProfilePage() {
    const { user: storeUser, fetchUser } = useUserStore() as any; // Assuming you have a fetchUser/refresh method
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        gender: "",
        dob: "",
    });

    const [phoneVerified, setPhoneVerified] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    // 1. Fetch Latest User Data
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const res = await api.get("/users/me"); // Adjust base path if needed (e.g., /auth/me or /users/me)
                const data = res.data.data;

                // Format DOB for HTML date input (YYYY-MM-DD)
                const formattedDob = data.dob ? new Date(data.dob).toISOString().split("T")[0] : "";

                setFormData({
                    firstName: data.firstName || "",
                    lastName: data.lastName || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    gender: data.gender || "",
                    dob: formattedDob,
                });
                setAvatarUrl(data.avatar);
                setPhoneVerified(!!data.phoneVerified);
            } catch (error) {
                console.error("Failed to load profile", error);
                Swal.fire({
                    toast: true, position: "bottom-end", icon: "error", title: "Failed to load profile data", showConfirmButton: false, timer: 3000,
                    background: "hsl(var(--card))", color: "hsl(var(--foreground))"
                });
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    // 2. Handle Text Input Changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 3. Handle Avatar Upload
    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type & size (e.g., max 2MB)
        if (!file.type.startsWith("image/")) {
            Swal.fire({ icon: "error", title: "Invalid File", text: "Please select an image file.", background: "hsl(var(--card))", color: "hsl(var(--foreground))" });
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            Swal.fire({ icon: "error", title: "File too large", text: "Image must be under 2MB.", background: "hsl(var(--card))", color: "hsl(var(--foreground))" });
            return;
        }

        setUploadingAvatar(true);
        const uploadData = new FormData();
        uploadData.append("avatar", file);

        try {
            const res = await api.post("/users/profile/avatar", uploadData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setAvatarUrl(res.data.data.avatar);
            if (fetchUser) fetchUser(); // Update global store if available

            Swal.fire({ toast: true, position: "bottom-end", icon: "success", title: "Avatar updated!", showConfirmButton: false, timer: 2000, background: "hsl(var(--card))", color: "hsl(var(--foreground))" });
        } catch (error) {
            console.error("Avatar upload failed", error);
            Swal.fire({ toast: true, position: "bottom-end", icon: "error", title: "Failed to upload avatar", showConfirmButton: false, timer: 3000, background: "hsl(var(--card))", color: "hsl(var(--foreground))" });
        } finally {
            setUploadingAvatar(false);
            if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input
        }
    };

    // 4. Handle Profile Form Submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            await api.patch("/users/profile", {
                firstName: formData.firstName,
                lastName: formData.lastName,
                gender: formData.gender || undefined,
                dob: formData.dob || undefined,
            });

            if (fetchUser) fetchUser(); // Update global store sidebar name

            Swal.fire({
                toast: true, position: "bottom-end", icon: "success", title: "Profile updated successfully", showConfirmButton: false, timer: 2000,
                background: "hsl(var(--card))", color: "hsl(var(--foreground))"
            });
        } catch (error: any) {
            console.error("Profile update failed", error);
            Swal.fire({
                title: "Error", text: error.response?.data?.message || "Failed to update profile.", icon: "error", confirmButtonColor: "var(--primary)",
                background: "hsl(var(--card))", color: "hsl(var(--foreground))",
                customClass: { popup: "border border-border rounded-2xl shadow-theme-lg", htmlContainer: "text-muted-foreground" }
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto px-4 py-8">
                <div className="h-32 w-full bg-card border border-border rounded-2xl animate-pulse"></div>
                <div className="h-96 w-full bg-card border border-border rounded-2xl animate-pulse"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">My Profile</h1>
                <p className="text-sm text-muted-foreground mt-1">Manage your personal information and security.</p>
            </div>

            {/* --- SECTION 1: AVATAR & HEADER --- */}
            <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center gap-6">

                {/* Avatar Container */}
                <div className="relative group">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-background shadow-lg bg-muted flex items-center justify-center">
                        {uploadingAvatar ? (
                            <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        ) : avatarUrl ? (
                            <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <UserIcon className="w-12 h-12 text-muted-foreground/50" />
                        )}
                    </div>

                    {/* Overlay Upload Button */}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingAvatar}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer disabled:cursor-not-allowed"
                    >
                        <Camera className="w-6 h-6 mb-1" />
                        <span className="text-xs font-bold">Change</span>
                    </button>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleAvatarChange}
                        accept="image/*"
                        className="hidden"
                    />
                </div>

                {/* Basic Info Display */}
                <div className="text-center sm:text-left">
                    <h2 className="text-2xl font-bold text-foreground">{formData.firstName} {formData.lastName}</h2>
                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5 bg-muted px-3 py-1 rounded-full border border-border">
                            <Mail className="w-4 h-4" />
                            {formData.email}
                        </span>
                        <span className="flex items-center gap-1.5 bg-muted px-3 py-1 rounded-full border border-border">
                            <ShieldCheck className="w-4 h-4 text-green-500" />
                            Customer Account
                        </span>
                    </div>
                </div>
            </div>

            {/* --- SECTION 2: PERSONAL INFORMATION FORM --- */}
            <form onSubmit={handleSubmit} className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">

                <div>
                    <h3 className="text-lg font-bold text-foreground border-b border-border pb-3 mb-6">Personal Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                        {/* First Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-foreground transition-colors"
                            />
                        </div>

                        {/* Last Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-foreground transition-colors"
                            />
                        </div>

                        {/* Gender */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-foreground transition-colors"
                            >
                                <option value="">Select Gender</option>
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                                <option value="OTHER">Other</option>
                                <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                            </select>
                        </div>

                        {/* Date of Birth */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">Date of Birth</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                <input
                                    type="date"
                                    name="dob"
                                    value={formData.dob}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-foreground transition-colors [color-scheme:light] dark:[color-scheme:dark]"
                                />
                            </div>
                        </div>

                    </div>
                </div>

                {/* --- SECTION 3: CONTACT INFORMATION (Read Only / Locked) --- */}
                <div>
                    <h3 className="text-lg font-bold text-foreground border-b border-border pb-3 mb-6">Contact Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                        {/* Email (LOCKED) */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground flex justify-between">
                                Email Address
                                <span className="text-xs text-muted-foreground italic">Cannot be changed</span>
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border rounded-xl text-muted-foreground cursor-not-allowed"
                                />
                            </div>
                        </div>

                        {/* Phone (Managed via OTP separately) */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground flex justify-between">
                                Phone Number
                                {phoneVerified ? (
                                    <span className="text-xs text-green-500 font-bold">✓ Verified</span>
                                ) : formData.phone ? (
                                    <span className="text-xs text-yellow-500 font-bold">Unverified</span>
                                ) : null}
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                                <input
                                    type="tel"
                                    value={formData.phone || "No phone added"}
                                    disabled
                                    className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border rounded-xl text-muted-foreground cursor-not-allowed"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Phone numbers are updated during checkout verification.</p>
                        </div>

                    </div>
                </div>

                {/* Action Button */}
                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold shadow-theme-sm hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>

            </form>
        </div>
    );
}