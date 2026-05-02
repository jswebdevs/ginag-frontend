"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import {
    Save, Store, Globe, ShieldAlert, Loader2,
    Plus, X, Phone, Mail, MapPin, CreditCard
} from "lucide-react";
import MediaManager from "@/components/dashboard/shared/media/MediaManager";

export default function GeneralSettingsPage() {
    const [activeTab, setActiveTab] = useState<"IDENTITY" | "CONTACT" | "REGIONAL" | "RULES" | "PAYMENTS">("IDENTITY");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [pickerMode, setPickerMode] = useState<"logo" | "favicon" | "ogImage" | null>(null);

    const [formData, setFormData] = useState({
        storeName: "",
        tagline: "",
        companySlogan: "",
        supportEmail: "",
        supportPhone: "",
        contactEmail: "",
        contactPhone: "",
        contactAddress: "",
        currencyCode: "USD",
        currencySymbol: "$",
        timezone: "Asia/Dhaka",
        address: "",
        enableGuestCheckout: true,
        orderPrefix: "DRM-",
        maintenanceMode: false,
        maintenanceMessage: "",
        stripePublishableKey: "",
        paypalClientId: "",
        logoId: null as string | null,
        faviconId: null as string | null,
        ogImageId: null as string | null,
        logoUrl: null as string | null,
        faviconUrl: null as string | null,
        ogImageUrl: null as string | null,
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await api.get('/settings');
            if (res.data.data) {
                const d = res.data.data;
                setFormData({
                    storeName: d.storeName || "",
                    tagline: d.tagline || "",
                    companySlogan: d.companySlogan || "",
                    supportEmail: d.supportEmail || "",
                    supportPhone: d.supportPhone || "",
                    contactEmail: d.contactEmail || "",
                    contactPhone: d.contactPhone || "",
                    contactAddress: d.contactAddress || "",
                    currencyCode: d.currencyCode || "USD",
                    currencySymbol: d.currencySymbol || "$",
                    timezone: d.timezone || "Asia/Dhaka",
                    address: d.address || "",
                    enableGuestCheckout: d.enableGuestCheckout ?? true,
                    orderPrefix: d.orderPrefix || "DRM-",
                    maintenanceMode: d.maintenanceMode ?? false,
                    maintenanceMessage: d.maintenanceMessage || "",
                    stripePublishableKey: d.stripePublishableKey || "",
                    paypalClientId: d.paypalClientId || "",
                    logoId: d.logoId,
                    logoUrl: d.logo?.thumbUrl || d.logo?.originalUrl || null,
                    faviconId: d.faviconId,
                    faviconUrl: d.favicon?.thumbUrl || d.favicon?.originalUrl || null,
                    ogImageId: d.ogImageId,
                    ogImageUrl: d.ogImage?.thumbUrl || d.ogImage?.originalUrl || null,
                });
            }
        } catch (error) {
            console.error("Failed to load settings", error);
            toast.error("Could not load settings.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const { logoUrl, faviconUrl, ogImageUrl, ...payload } = formData;
            await api.patch('/settings', payload);
            toast.success("Settings saved successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to save settings.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleMediaSelect = (media: any) => {
        if (pickerMode === "logo") {
            setFormData({ ...formData, logoId: media.id, logoUrl: media.thumbUrl || media.originalUrl });
        } else if (pickerMode === "favicon") {
            setFormData({ ...formData, faviconId: media.id, faviconUrl: media.thumbUrl || media.originalUrl });
        } else if (pickerMode === "ogImage") {
            setFormData({ ...formData, ogImageId: media.id, ogImageUrl: media.thumbUrl || media.originalUrl });
        }
        setPickerMode(null);
    };

    const removeImage = (type: "logo" | "favicon" | "ogImage") => {
        if (type === "logo") setFormData({ ...formData, logoId: null, logoUrl: null });
        if (type === "favicon") setFormData({ ...formData, faviconId: null, faviconUrl: null });
        if (type === "ogImage") setFormData({ ...formData, ogImageId: null, ogImageUrl: null });
    };

    const ImageUploadBox = ({ title, type, url }: { title: string, type: "logo" | "favicon" | "ogImage", url: string | null }) => (
        <div className="space-y-3">
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest">{title}</label>
            <div className="relative aspect-video bg-muted rounded-2xl border-2 border-dashed border-border overflow-hidden group shadow-sm flex flex-col items-center justify-center">
                {url ? (
                    <div className="relative h-full w-full p-4 flex items-center justify-center">
                        <img src={url} alt={title} className="max-w-full max-h-full object-contain drop-shadow-md" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
                            <button type="button" onClick={() => setPickerMode(type)} className="bg-white text-black px-4 py-2 rounded-xl text-xs font-black shadow-xl hover:scale-105">Change</button>
                            <button type="button" onClick={() => removeImage(type)} className="text-white/80 hover:text-red-400 text-xs font-bold flex items-center gap-1"><X size={14} /> Remove</button>
                        </div>
                    </div>
                ) : (
                    <button type="button" onClick={() => setPickerMode(type)} className="h-full w-full flex flex-col items-center justify-center gap-3 text-muted-foreground hover:text-primary transition-colors hover:bg-muted/50">
                        <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center shadow-sm"><Plus size={20} /></div>
                        <span className="text-sm font-bold">Upload {title}</span>
                    </button>
                )}
            </div>
        </div>
    );

    if (isLoading) return <div className="flex h-64 items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;

    return (
        <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 rounded-3xl border border-border shadow-theme-sm">
                <div>
                    <h1 className="text-2xl font-black text-foreground tracking-tight">General Settings</h1>
                    <p className="text-sm text-muted-foreground mt-1">Manage global configuration for your store.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-primary text-primary-foreground h-11 px-6 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-theme-md disabled:opacity-50 w-full md:w-auto"
                >
                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    Save Changes
                </button>
            </div>

            {/* TABS & CONTENT */}
            <div className="bg-card border border-border rounded-3xl shadow-theme-sm overflow-hidden flex flex-col md:flex-row min-h-[500px]">

                {/* SIDEBAR TABS */}
                <div className="w-full md:w-64 bg-muted/10 border-r border-border p-4 space-y-2 shrink-0">
                    <button onClick={() => setActiveTab("IDENTITY")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === "IDENTITY" ? "bg-background shadow-sm text-primary border border-border" : "text-muted-foreground hover:bg-muted/50"}`}>
                        <Store size={18} /> Store Identity
                    </button>
                    <button onClick={() => setActiveTab("CONTACT")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === "CONTACT" ? "bg-background shadow-sm text-primary border border-border" : "text-muted-foreground hover:bg-muted/50"}`}>
                        <Phone size={18} /> Contact Info
                    </button>
                    <button onClick={() => setActiveTab("REGIONAL")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === "REGIONAL" ? "bg-background shadow-sm text-primary border border-border" : "text-muted-foreground hover:bg-muted/50"}`}>
                        <Globe size={18} /> Region & Currency
                    </button>
                    <button onClick={() => setActiveTab("RULES")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === "RULES" ? "bg-background shadow-sm text-primary border border-border" : "text-muted-foreground hover:bg-muted/50"}`}>
                        <ShieldAlert size={18} /> Checkout & Status
                    </button>
                    <button onClick={() => setActiveTab("PAYMENTS")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === "PAYMENTS" ? "bg-background shadow-sm text-primary border border-border" : "text-muted-foreground hover:bg-muted/50"}`}>
                        <CreditCard size={18} /> Payment Keys
                    </button>
                </div>

                {/* TAB CONTENT */}
                <div className="flex-1 p-6 md:p-10">

                    {/* --- TAB 1: IDENTITY --- */}
                    {activeTab === "IDENTITY" && (
                        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Shop / Store Name</label>
                                    <input type="text" value={formData.storeName} onChange={e => setFormData({ ...formData, storeName: e.target.value })} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Tagline</label>
                                    <input type="text" value={formData.tagline} onChange={e => setFormData({ ...formData, tagline: e.target.value })} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="e.g. Your dream products" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Company Slogan</label>
                                    <input type="text" value={formData.companySlogan} onChange={e => setFormData({ ...formData, companySlogan: e.target.value })} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="e.g. Quality you can trust, prices you'll love" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-border">
                                <ImageUploadBox title="Store Logo / Shop Logo" type="logo" url={formData.logoUrl} />
                                <ImageUploadBox title="Favicon (Icon)" type="favicon" url={formData.faviconUrl} />
                                <ImageUploadBox title="Social Image (OG)" type="ogImage" url={formData.ogImageUrl} />
                            </div>
                        </div>
                    )}

                    {/* --- TAB 2: CONTACT INFO --- */}
                    {activeTab === "CONTACT" && (
                        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
                            <div>
                                <h3 className="text-sm font-black text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Mail size={16} className="text-primary" /> Support Channels
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Support Email</label>
                                        <input type="email" value={formData.supportEmail} onChange={e => setFormData({ ...formData, supportEmail: e.target.value })} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none" placeholder="support@yourstore.com" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Support Phone Number</label>
                                        <input type="text" value={formData.supportPhone} onChange={e => setFormData({ ...formData, supportPhone: e.target.value })} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none" placeholder="017XXXXXXXX" />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-border">
                                <h3 className="text-sm font-black text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Phone size={16} className="text-primary" /> General Contact
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Contact Email</label>
                                        <input type="email" value={formData.contactEmail} onChange={e => setFormData({ ...formData, contactEmail: e.target.value })} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none" placeholder="info@yourstore.com" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Contact Phone</label>
                                        <input type="text" value={formData.contactPhone} onChange={e => setFormData({ ...formData, contactPhone: e.target.value })} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none" placeholder="018XXXXXXXX" />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-border">
                                <h3 className="text-sm font-black text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <MapPin size={16} className="text-primary" /> Addresses
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Physical Address (Headquarters)</label>
                                        <textarea value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} rows={3} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none resize-none" placeholder="Company headquarters address" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Contact Address (Public)</label>
                                        <textarea value={formData.contactAddress} onChange={e => setFormData({ ...formData, contactAddress: e.target.value })} rows={3} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none resize-none" placeholder="Address shown to customers on contact pages" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- TAB 3: REGIONAL --- */}
                    {activeTab === "REGIONAL" && (
                        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Currency Code</label>
                                    <input type="text" value={formData.currencyCode} onChange={e => setFormData({ ...formData, currencyCode: e.target.value })} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none" placeholder="e.g. BDT" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Currency Symbol</label>
                                    <input type="text" value={formData.currencySymbol} onChange={e => setFormData({ ...formData, currencySymbol: e.target.value })} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none" placeholder="e.g. ৳" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Timezone</label>
                                    <input type="text" value={formData.timezone} onChange={e => setFormData({ ...formData, timezone: e.target.value })} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none" placeholder="e.g. Asia/Dhaka" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- TAB 4: RULES & STATUS --- */}
                    {activeTab === "RULES" && (
                        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">

                            <div className="bg-background border border-border rounded-2xl p-5 flex items-center justify-between shadow-sm">
                                <div>
                                    <p className="font-bold text-foreground">Allow Guest Checkout</p>
                                    <p className="text-xs text-muted-foreground mt-1">Users can buy without creating an account.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={formData.enableGuestCheckout} onChange={e => setFormData({ ...formData, enableGuestCheckout: e.target.checked })} />
                                    <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Order Number Prefix</label>
                                <input type="text" value={formData.orderPrefix} onChange={e => setFormData({ ...formData, orderPrefix: e.target.value })} className="w-full md:w-1/2 bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none" placeholder="e.g. DRM-" />
                            </div>

                            <div className="pt-6 border-t border-border space-y-4">
                                <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                                    <div>
                                        <p className="font-bold text-destructive flex items-center gap-2"><ShieldAlert size={16} /> Maintenance Mode</p>
                                        <p className="text-xs text-muted-foreground mt-1">Locks the frontend for customers. Admins can still log in.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={formData.maintenanceMode} onChange={e => setFormData({ ...formData, maintenanceMode: e.target.checked })} />
                                        <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-destructive"></div>
                                    </label>
                                </div>

                                {formData.maintenanceMode && (
                                    <div className="animate-in slide-in-from-top-2">
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Maintenance Display Message</label>
                                        <textarea value={formData.maintenanceMessage} onChange={e => setFormData({ ...formData, maintenanceMessage: e.target.value })} rows={2} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none resize-none" placeholder="We are upgrading our servers. Be back soon!" />
                                    </div>
                                )}
                            </div>

                        </div>
                    )}

                    {/* --- TAB 5: PAYMENT KEYS --- */}
                    {activeTab === "PAYMENTS" && (
                        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
                            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-sm text-amber-700 dark:text-amber-300">
                                <p className="font-bold mb-1">ℹ️ Public keys only</p>
                                <p className="text-xs opacity-80">Enter your Stripe <strong>Publishable Key</strong> (pk_live_... or pk_test_...) and your PayPal <strong>Client ID</strong>. These are safe to store here. Your Stripe Secret Key must be set in the server environment variables — never enter it here.</p>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Stripe Publishable Key</label>
                                    <input
                                        type="text"
                                        value={formData.stripePublishableKey}
                                        onChange={e => setFormData({ ...formData, stripePublishableKey: e.target.value })}
                                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none font-mono"
                                        placeholder="pk_live_... or pk_test_..."
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">PayPal Client ID</label>
                                    <input
                                        type="text"
                                        value={formData.paypalClientId}
                                        onChange={e => setFormData({ ...formData, paypalClientId: e.target.value })}
                                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none font-mono"
                                        placeholder="Your PayPal Client ID..."
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* --- MEDIA MANAGER MODAL --- */}
            {pickerMode && (
                <div className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-8">
                    <div className="bg-card border border-border rounded-3xl w-full max-w-6xl h-full max-h-[85vh] flex flex-col overflow-hidden shadow-theme-2xl animate-in zoom-in-95">
                        <div className="p-4 border-b border-border flex justify-between items-center bg-muted/10">
                            <h3 className="font-black text-foreground uppercase tracking-wider text-sm">
                                Select {pickerMode === 'logo' ? 'Store Logo / Shop Logo' : pickerMode === 'favicon' ? 'Favicon' : 'Social Image (OG)'}
                            </h3>
                            <button onClick={() => setPickerMode(null)} className="p-2 bg-background border border-border hover:bg-destructive hover:text-white rounded-xl transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-hidden bg-background">
                            <MediaManager
                                isPicker
                                multiple={false}
                                onSelect={handleMediaSelect}
                            />
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
