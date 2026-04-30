"use client";

import { useState } from "react";
import { MapPin, Plus, Trash2, CheckCircle2, Home } from "lucide-react";
import Swal from "sweetalert2";

const DIVISIONS = ["Dhaka", "Chittagong", "Rajshahi", "Khulna", "Barishal", "Sylhet", "Rangpur", "Mymensingh"];
const ADDRESS_TYPES = ["PRESENT", "PERMANENT", "HOME", "WORK", "SHIPPING", "BILLING"];

// 🔥 Added Interface for Sub-component Props
interface AddressInputProps {
    label: string;
    value: string;
    onChange: (val: string) => void;
    isMono?: boolean;
}

export default function FormAddresses({ data, update }: any) {
    const [isAdding, setIsAdding] = useState(false);

    const [draft, setDraft] = useState({
        type: "PRESENT",
        isDefault: false,
        house: "",
        road: "",
        area: "",
        postalCode: "",
        thana: "",
        district: "",
        division: "Dhaka",
        country: "Bangladesh"
    });

    const handleAddAddress = () => {
        if (!draft.district || !draft.thana || !draft.postalCode) {
            Swal.fire({
                title: "Incomplete Address",
                text: "District, Thana, and Postal Code are strictly required.",
                icon: "warning",
                confirmButtonColor: "hsl(var(--primary))",
                background: 'hsl(var(--card))',
                color: 'hsl(var(--foreground))',
            });
            return;
        }

        const newAddresses = [...(data.addresses || [])];

        if (newAddresses.length === 0 || draft.isDefault) {
            newAddresses.forEach(a => a.isDefault = false);
            draft.isDefault = true;
        }

        newAddresses.push({ ...draft });
        update({ addresses: newAddresses });

        setDraft({
            type: "PERMANENT",
            isDefault: false,
            house: "", road: "", area: "", postalCode: "",
            thana: "", district: "", division: "Dhaka", country: "Bangladesh"
        });
        setIsAdding(false);

        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Address added',
            showConfirmButton: false,
            timer: 1500,
            background: 'hsl(var(--card))',
            color: 'hsl(var(--foreground))',
        });
    };

    const removeAddress = async (index: number) => {
        const result = await Swal.fire({
            title: "Remove Address?",
            text: "Are you sure you want to delete this address from your book?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#64748b",
            confirmButtonText: "Yes, delete it",
            reverseButtons: true,
            background: 'hsl(var(--card))',
            color: 'hsl(var(--foreground))',
        });

        if (!result.isConfirmed) return;

        const newAddresses = [...data.addresses];
        newAddresses.splice(index, 1);

        if (newAddresses.length > 0 && !newAddresses.some((a: any) => a.isDefault)) {
            newAddresses[0].isDefault = true;
        }

        update({ addresses: newAddresses });
    };

    const setDefault = (index: number) => {
        const newAddresses = data.addresses.map((addr: any, i: number) => ({
            ...addr,
            isDefault: i === index
        }));
        update({ addresses: newAddresses });
    };

    return (
        <div className="bg-card border border-border rounded-3xl p-8 shadow-theme-sm space-y-8 mt-8">
            <div className="border-b border-border pb-4 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2 uppercase">
                        <MapPin className="text-primary" /> Address Book
                    </h2>
                    <p className="text-xs text-muted-foreground font-medium mt-1">Manage present, permanent, and work addresses.</p>
                </div>
                {!isAdding && (
                    <button
                        type="button"
                        onClick={() => setIsAdding(true)}
                        className="bg-primary/10 text-primary px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-primary hover:text-white transition-all"
                    >
                        <Plus size={14} /> Add Address
                    </button>
                )}
            </div>

            {/* List Existing Addresses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(data.addresses || []).map((addr: any, idx: number) => (
                    <div key={idx} className={`p-5 border rounded-2xl relative group transition-all ${addr.isDefault ? 'bg-primary/5 border-primary/30' : 'bg-background border-border hover:border-primary/30'}`}>
                        <button
                            type="button" onClick={() => removeAddress(idx)}
                            className="absolute top-4 right-4 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 size={16} />
                        </button>

                        <div className="flex items-center gap-2 mb-3">
                            <span className="px-2.5 py-1 bg-muted text-muted-foreground rounded-md text-[10px] font-black uppercase tracking-wider">
                                {addr.type}
                            </span>
                            {addr.isDefault && (
                                <span className="flex items-center gap-1 text-[10px] font-black text-primary uppercase tracking-widest">
                                    <CheckCircle2 size={12} /> Default
                                </span>
                            )}
                        </div>

                        <div className="text-sm font-medium text-foreground leading-relaxed">
                            <p className="font-bold">{[addr.house, addr.road, addr.area].filter(Boolean).join(", ")}</p>
                            <p>{addr.thana}, {addr.district} - {addr.postalCode}</p>
                            <p className="text-muted-foreground text-xs uppercase tracking-tight mt-1">{addr.division}, {addr.country}</p>
                        </div>

                        {!addr.isDefault && (
                            <button
                                type="button" onClick={() => setDefault(idx)}
                                className="mt-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                            >
                                <Home size={12} /> Set as Default
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {(data.addresses || []).length === 0 && !isAdding && (
                <div className="text-center p-12 border border-dashed border-border rounded-3xl bg-muted/5">
                    <MapPin className="mx-auto text-muted-foreground/20 mb-4" size={48} />
                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">No addresses found</p>
                </div>
            )}

            {/* Add New Address Form */}
            {isAdding && (
                <div className="bg-muted/10 border border-border rounded-3xl p-6 animate-in fade-in slide-in-from-top-4 duration-300">
                    <h3 className="text-xs font-black text-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Plus size={16} className="text-primary" /> New Address Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Address Type</label>
                            <select
                                value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value })}
                                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer"
                            >
                                {ADDRESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2 md:col-span-2 flex items-end pb-2">
                            <label className="flex items-center gap-3 cursor-pointer select-none group">
                                <input
                                    type="checkbox" checked={draft.isDefault}
                                    onChange={(e) => setDraft({ ...draft, isDefault: e.target.checked })}
                                    className="w-5 h-5 accent-primary rounded-lg border-border"
                                />
                                <span className="text-xs font-black uppercase tracking-widest text-foreground group-hover:text-primary transition-colors">Set as Default Address</span>
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* 🔥 Passing explicit string type in the anonymous function */}
                        <AddressInput label="House / Apt (Opt)" value={draft.house} onChange={(v: string) => setDraft({ ...draft, house: v })} />
                        <AddressInput label="Road / Street (Opt)" value={draft.road} onChange={(v: string) => setDraft({ ...draft, road: v })} />
                        <AddressInput label="Area / Block (Opt)" value={draft.area} onChange={(v: string) => setDraft({ ...draft, area: v })} />

                        <AddressInput label="Thana / Upazila *" value={draft.thana} onChange={(v: string) => setDraft({ ...draft, thana: v })} />
                        <AddressInput label="District / City *" value={draft.district} onChange={(v: string) => setDraft({ ...draft, district: v })} />
                        <AddressInput label="Postal Code *" value={draft.postalCode} onChange={(v: string) => setDraft({ ...draft, postalCode: v })} isMono />

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Division</label>
                            <select value={draft.division} onChange={e => setDraft({ ...draft, division: e.target.value })} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer">
                                {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mt-8 pt-6 border-t border-border">
                        <button
                            type="button"
                            onClick={handleAddAddress}
                            className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:shadow-theme-md hover:scale-105 transition-all"
                        >
                            Save Address
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsAdding(false)}
                            className="text-muted-foreground font-black text-xs uppercase tracking-widest hover:text-foreground transition-colors px-4 py-2.5"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// 🔥 Updated sub-component with explicit typing
function AddressInput({ label, value, onChange, isMono = false }: AddressInputProps) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{label}</label>
            <input
                type="text"
                placeholder="Input your Address"
                value={value}
                onChange={e => onChange(e.target.value)}
                className={`w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-primary focus:outline-none transition-all ${isMono ? 'font-mono' : ''}`}
            />
        </div>
    );
}