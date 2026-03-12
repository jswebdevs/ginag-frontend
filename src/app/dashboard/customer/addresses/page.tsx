"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Plus, Edit2, Trash2, Star, CheckCircle, X, Home, Briefcase, Map, Loader2, Copy } from "lucide-react";
import api from "@/lib/axios";
import Swal from "sweetalert2";

// Matching your Prisma AddressType enum
type AddressType = 'HOME' | 'WORK' | 'SHIPPING' | 'BILLING' | 'PRESENT' | 'PERMANENT';

interface Address {
    id?: string;
    type: AddressType;
    isDefault: boolean;
    house?: string;
    road?: string;
    area?: string;
    postalCode?: string;
    thana: string;
    district: string;
    division: string;
    country: string;
}

const initialFormState: Address = {
    type: 'HOME',
    isDefault: false,
    house: '',
    road: '',
    area: '',
    postalCode: '',
    thana: '',
    district: '',
    division: '',
    country: 'Bangladesh'
};

export default function AddressesPage() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [formData, setFormData] = useState<Address>(initialFormState);
    const [saving, setSaving] = useState(false);

    // 1. Fetch Addresses
    const fetchAddresses = async () => {
        try {
            // We pull the addresses from the 'getMe' endpoint
            const res = await api.get("/users/me");
            setAddresses(res.data.data?.addresses || []);
        } catch (error) {
            console.error("Failed to load addresses", error);
            Swal.fire({ toast: true, position: "bottom-end", icon: "error", title: "Failed to load addresses", showConfirmButton: false, timer: 3000, background: "hsl(var(--card))", color: "hsl(var(--foreground))" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    // 2. Open Modal for Add/Edit/Duplicate
    const openModal = (index: number | null = null, isDuplicate: boolean = false) => {
        if (index !== null) {
            const sourceAddress = addresses[index];
            if (isDuplicate) {
                // Prepare as a NEW address (no ID, no editing index, forced not default)
                const { id, ...dataToCopy } = sourceAddress;
                setFormData({ ...dataToCopy, isDefault: false });
                setEditingIndex(null); // Null means we are adding, not editing
            } else {
                // Standard Edit
                setFormData(sourceAddress);
                setEditingIndex(index);
            }
        } else {
            // Standard Add New
            setFormData({
                ...initialFormState,
                // If it's the very first address, make it default automatically
                isDefault: addresses.length === 0
            });
            setEditingIndex(null);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData(initialFormState);
        setEditingIndex(null);
    };

    // 3. Handle Form Changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // 4. Save to Backend (Update Profile)
    const handleSaveAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        // Create a copy of current addresses
        let updatedAddresses = [...addresses];

        // Handle "isDefault" logic: if this new one is default, unset others
        if (formData.isDefault) {
            updatedAddresses = updatedAddresses.map(addr => ({ ...addr, isDefault: false }));
        }

        if (editingIndex !== null) {
            // Update existing
            updatedAddresses[editingIndex] = formData;
        } else {
            // Add new
            updatedAddresses.push(formData);
        }

        // Fallback: If no addresses are default, force the first one to be default
        if (updatedAddresses.length > 0 && !updatedAddresses.some(a => a.isDefault)) {
            updatedAddresses[0].isDefault = true;
        }

        try {
            // Your controller expects the full array under 'addresses'
            await api.patch("/users/profile", { addresses: updatedAddresses });
            setAddresses(updatedAddresses);
            closeModal();
            Swal.fire({ toast: true, position: "bottom-end", icon: "success", title: "Address saved successfully", showConfirmButton: false, timer: 2000, background: "hsl(var(--card))", color: "hsl(var(--foreground))" });
        } catch (error: any) {
            Swal.fire({ title: "Error", text: error.response?.data?.message || "Failed to save address.", icon: "error", background: "hsl(var(--card))", color: "hsl(var(--foreground))" });
        } finally {
            setSaving(false);
        }
    };

    // 5. Delete Address
    const handleDelete = async (index: number) => {
        const result = await Swal.fire({
            title: "Delete Address?",
            text: "Are you sure you want to remove this address?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            confirmButtonText: "Yes, delete",
            background: "hsl(var(--card))",
            color: "hsl(var(--foreground))",
            customClass: { popup: 'border border-border rounded-2xl shadow-theme-lg' }
        });

        if (result.isConfirmed) {
            let updatedAddresses = [...addresses];
            const deletedWasDefault = updatedAddresses[index].isDefault;
            updatedAddresses.splice(index, 1);

            // If we deleted the default, assign default to the next available one
            if (deletedWasDefault && updatedAddresses.length > 0) {
                updatedAddresses[0].isDefault = true;
            }

            try {
                await api.patch("/users/profile", { addresses: updatedAddresses });
                setAddresses(updatedAddresses);
                Swal.fire({ toast: true, position: "bottom-end", icon: "success", title: "Address deleted", showConfirmButton: false, timer: 2000, background: "hsl(var(--card))", color: "hsl(var(--foreground))" });
            } catch (error) {
                Swal.fire({ toast: true, position: "bottom-end", icon: "error", title: "Failed to delete address", showConfirmButton: false, timer: 3000, background: "hsl(var(--card))", color: "hsl(var(--foreground))" });
            }
        }
    };

    // 6. Set as Default instantly
    const handleSetDefault = async (index: number) => {
        if (addresses[index].isDefault) return;

        const updatedAddresses = addresses.map((addr, i) => ({
            ...addr,
            isDefault: i === index
        }));

        try {
            await api.patch("/users/profile", { addresses: updatedAddresses });
            setAddresses(updatedAddresses);
            Swal.fire({ toast: true, position: "bottom-end", icon: "success", title: "Default address updated", showConfirmButton: false, timer: 2000, background: "hsl(var(--card))", color: "hsl(var(--foreground))" });
        } catch (error) {
            Swal.fire({ toast: true, position: "bottom-end", icon: "error", title: "Failed to set default", showConfirmButton: false, timer: 3000, background: "hsl(var(--card))", color: "hsl(var(--foreground))" });
        }
    };

    const getIconForType = (type: string) => {
        if (type === 'HOME') return <Home className="w-5 h-5 text-blue-500" />;
        if (type === 'WORK') return <Briefcase className="w-5 h-5 text-orange-500" />;
        return <Map className="w-5 h-5 text-primary" />;
    };

    if (loading) {
        return (
            <div className="flex flex-col space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto px-4 py-8">
                <div className="h-10 w-48 bg-muted rounded-lg animate-pulse mb-2"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-48 bg-card border border-border rounded-2xl animate-pulse"></div>
                    <div className="h-48 bg-card border border-border rounded-2xl animate-pulse"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Address Book</h1>
                    <p className="text-sm text-muted-foreground mt-1">Manage your shipping and billing addresses.</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold shadow-theme-sm hover:-translate-y-0.5 transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Add New Address
                </button>
            </div>

            {/* Address Grid */}
            {addresses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-card rounded-3xl border border-border shadow-sm text-center px-4">
                    <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-4">
                        <MapPin className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">No addresses found</h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                        Add a shipping address so you can check out quickly next time.
                    </p>
                    <button
                        onClick={() => openModal()}
                        className="mt-6 text-primary font-bold hover:underline"
                    >
                        + Add your first address
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {addresses.map((address, index) => (
                        <div
                            key={index}
                            className={`relative bg-card rounded-3xl p-6 shadow-sm border transition-all ${address.isDefault
                                ? 'border-primary shadow-primary/10'
                                : 'border-border hover:border-primary/50'
                                }`}
                        >
                            {/* Default Badge */}
                            {address.isDefault && (
                                <div className="absolute top-0 right-6 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                                    <Star className="w-3 h-3 fill-current" />
                                    Default Shipping
                                </div>
                            )}

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-muted rounded-xl border border-border">
                                    {getIconForType(address.type)}
                                </div>

                                <div className="flex-1">
                                    <h3 className="font-bold text-foreground capitalize mb-2 flex items-center gap-2">
                                        {address.type.toLowerCase()} Address
                                    </h3>

                                    <div className="text-sm text-muted-foreground space-y-1">
                                        <p>
                                            {address.house && `${address.house}, `}
                                            {address.road && `${address.road}`}
                                        </p>
                                        <p>{address.area}</p>
                                        <p className="font-medium text-foreground">
                                            {address.thana}, {address.district} {address.postalCode}
                                        </p>
                                        <p>{address.division}, {address.country}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Card Actions - UPDATED WITH VISIBLE DUPLICATE BUTTON */}
                            <div className="mt-6 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-y-4">
                                {!address.isDefault ? (
                                    <button
                                        onClick={() => handleSetDefault(index)}
                                        className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                                    >
                                        <CheckCircle className="w-4 h-4" /> Set as Default
                                    </button>
                                ) : (
                                    <span className="text-sm font-semibold text-primary flex items-center gap-1.5 opacity-80 cursor-default">
                                        <CheckCircle className="w-4 h-4" /> Default
                                    </span>
                                )}

                                <div className="flex items-center gap-2">
                                    {/* DUPLICATE BUTTON */}
                                    <button
                                        onClick={() => openModal(index, true)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-blue-600 bg-blue-100 hover:bg-blue-200 dark:text-blue-400 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
                                        title="Copy to new address"
                                    >
                                        <Copy className="w-4 h-4" />
                                        <span className="hidden sm:inline">Duplicate</span>
                                    </button>

                                    {/* EDIT BUTTON */}
                                    <button
                                        onClick={() => openModal(index)}
                                        className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                        title="Edit Address"
                                    >
                                        <Edit2 className="w-4.5 h-4.5" />
                                    </button>

                                    {/* DELETE BUTTON */}
                                    <button
                                        onClick={() => handleDelete(index)}
                                        className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                        title="Delete Address"
                                    >
                                        <Trash2 className="w-4.5 h-4.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* --- ADD / EDIT MODAL --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-card border border-border w-full max-w-2xl rounded-3xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">

                        <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
                            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-primary" />
                                {editingIndex !== null ? "Edit Address" : "Add New Address"}
                            </h2>
                            <button onClick={closeModal} className="p-2 text-muted-foreground hover:text-red-500 bg-background rounded-full transition-colors border border-border hover:border-red-500/50">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                            <form id="addressForm" onSubmit={handleSaveAddress} className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                {/* Type Selection */}
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-sm font-semibold text-foreground">Address Label / Type</label>
                                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                        {['HOME', 'WORK', 'SHIPPING', 'BILLING', 'PRESENT', 'PERMANENT'].map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, type: type as AddressType })}
                                                className={`py-2 text-xs font-bold rounded-lg border transition-colors ${formData.type === type
                                                    ? 'bg-primary/10 border-primary text-primary'
                                                    : 'bg-background border-border text-muted-foreground hover:border-primary/50'
                                                    }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-foreground text-muted-foreground text-xs uppercase tracking-wider">Thana / Upazila *</label>
                                    <input required type="text" name="thana" value={formData.thana} onChange={handleChange} className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-foreground" placeholder="e.g. Mirpur" />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-foreground text-muted-foreground text-xs uppercase tracking-wider">District / City *</label>
                                    <input required type="text" name="district" value={formData.district} onChange={handleChange} className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-foreground" placeholder="e.g. Dhaka" />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-foreground text-muted-foreground text-xs uppercase tracking-wider">Division *</label>
                                    <select required name="division" value={formData.division} onChange={handleChange} className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-foreground">
                                        <option value="">Select Division</option>
                                        {['Barishal', 'Chattogram', 'Dhaka', 'Khulna', 'Rajshahi', 'Rangpur', 'Mymensingh', 'Sylhet'].map(div => (
                                            <option key={div} value={div}>{div}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-foreground text-muted-foreground text-xs uppercase tracking-wider">Area / Village</label>
                                    <input type="text" name="area" value={formData.area} onChange={handleChange} className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-foreground" placeholder="e.g. D-Block" />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-foreground text-muted-foreground text-xs uppercase tracking-wider">Road / Street</label>
                                    <input type="text" name="road" value={formData.road} onChange={handleChange} className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-foreground" placeholder="e.g. Road 19" />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-foreground text-muted-foreground text-xs uppercase tracking-wider">House / Building</label>
                                    <input type="text" name="house" value={formData.house} onChange={handleChange} className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-foreground" placeholder="e.g. House 18, Apt 4B" />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-foreground text-muted-foreground text-xs uppercase tracking-wider">Postal / ZIP Code</label>
                                    <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-foreground" placeholder="e.g. 1216" />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-foreground text-muted-foreground text-xs uppercase tracking-wider">Country *</label>
                                    <input required type="text" name="country" value={formData.country} onChange={handleChange} className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl outline-none text-muted-foreground cursor-not-allowed" readOnly />
                                </div>

                                {/* Default Checkbox */}
                                <div className="md:col-span-2 pt-4 flex items-center gap-3">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            id="isDefault"
                                            name="isDefault"
                                            checked={formData.isDefault}
                                            onChange={handleChange}
                                            disabled={addresses.length === 0} // Can't uncheck if it's the only address
                                            className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-border transition-all checked:border-primary checked:bg-primary"
                                        />
                                        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary-foreground opacity-0 transition-opacity peer-checked:opacity-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                    <label htmlFor="isDefault" className="text-sm font-semibold cursor-pointer select-none text-foreground">
                                        Set as my default address
                                    </label>
                                </div>

                            </form>
                        </div>

                        <div className="p-6 border-t border-border bg-muted/30 flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={saving}
                                className="px-6 py-2.5 rounded-xl font-bold text-muted-foreground hover:bg-background border border-transparent hover:border-border transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="addressForm"
                                disabled={saving}
                                className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-2.5 rounded-xl font-bold shadow-theme-sm hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
                                {saving ? "Saving..." : "Save Address"}
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}