"use client";

import { User, Mail, Phone, Lock, Calendar, Users } from "lucide-react";

export default function FormBasicInfo({ data, update, isEdit }: any) {
    return (
        <div className="bg-card border border-border rounded-3xl p-8 shadow-theme-sm space-y-6">
            <div className="border-b border-border pb-4">
                <h2 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2">
                    <User className="text-primary" /> Personal Information
                </h2>
                <p className="text-xs text-muted-foreground mt-1">Basic details and login credentials.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* First & Last Name */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">First Name *</label>
                    <input
                        type="text" value={data.firstName} onChange={(e) => update({ firstName: e.target.value })}
                        placeholder="John"
                        className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Last Name *</label>
                    <input
                        type="text" value={data.lastName} onChange={(e) => update({ lastName: e.target.value })}
                        placeholder="Doe"
                        className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-all"
                    />
                </div>

                {/* Username & Email */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                        <User size={14} /> Username *
                    </label>
                    <input
                        type="text" value={data.username} onChange={(e) => update({ username: e.target.value.toLowerCase().replace(/\s/g, '') })}
                        placeholder="johndoe"
                        className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                        <Mail size={14} /> Email Address *
                    </label>
                    <input
                        type="email" value={data.email} onChange={(e) => update({ email: e.target.value })}
                        placeholder="admin@dreamreloaded.com"
                        className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-all"
                    />
                </div>

                {/* Phone & Password */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                        <Phone size={14} /> Phone Number
                    </label>
                    <input
                        type="tel" value={data.phone || ""} onChange={(e) => update({ phone: e.target.value })}
                        placeholder="+880 1..."
                        className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                        <Lock size={14} /> {isEdit ? "New Password (Optional)" : "Password *"}
                    </label>
                    <input
                        type="password" value={data.password || ""} onChange={(e) => update({ password: e.target.value })}
                        placeholder={isEdit ? "Leave blank to keep current" : "••••••••"}
                        className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-all"
                    />
                </div>

                {/* Gender & DOB */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                        <Users size={14} /> Gender
                    </label>
                    <select
                        value={data.gender || ""} onChange={(e) => update({ gender: e.target.value })}
                        className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-all cursor-pointer"
                    >
                        <option value="">Select Gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                        <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                        <Calendar size={14} /> Date of Birth
                    </label>
                    <input
                        type="date" value={data.dob || ""} onChange={(e) => update({ dob: e.target.value })}
                        className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-all"
                    />
                </div>

            </div>
        </div>
    );
}