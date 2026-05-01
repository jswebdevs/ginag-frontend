"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/axios";
import { toast } from "sonner";
import {
    Layout,
    ArrowLeft,
    Check,
    X,
    Image as ImageIcon,
    Loader2,
    Save,
    Eye,
    EyeOff
} from "lucide-react";

import MediaManager from "@/components/dashboard/shared/media/MediaManager";

interface HeroFormProps {
    role: "super-admin" | "admin";
}

export default function HeroForm({ role }: HeroFormProps) {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        subtitle: "",
        description: "",
        buttonText: "START SHOPPING",
        buttonLink: "/products",
        badgeLabel: "",
        badgeText: "",
        imageID: "",
        order: 0,
        isActive: true,
    });
    const [selectedImage, setSelectedImage] = useState<any>(null);

    useEffect(() => {
        if (id) {
            fetchHero();
        }
    }, [id]);

    const fetchHero = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/hero/all');
            const hero = res.data.data.find((h: any) => h.id === id);
            if (hero) {
                setFormData({
                    title: hero.title,
                    subtitle: hero.subtitle || "",
                    description: hero.description || "",
                    buttonText: hero.buttonText,
                    buttonLink: hero.buttonLink,
                    badgeLabel: hero.badgeLabel || "",
                    badgeText: hero.badgeText || "",
                    imageID: hero.imageID || "",
                    order: hero.order,
                    isActive: hero.isActive,
                });
                setSelectedImage(hero.image);
            }
        } catch (error) {
            toast.error("Failed to fetch hero data");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.imageID) {
            toast.error("Please select a hero image");
            return;
        }

        setIsSaving(true);
        try {
            if (id) {
                await api.patch(`/hero/${id}`, formData);
                toast.success("Hero section updated successfully");
            } else {
                await api.post('/hero', formData);
                toast.success("Hero section created successfully");
            }
            router.push(`/dashboard/${role}/storefront/hero`);
        } catch (error) {
            toast.error("Failed to save hero section");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col h-64 items-center justify-center space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm font-bold text-muted-foreground">Loading form...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* TOP BAR */}
            <div className="flex items-center justify-between bg-card p-4 rounded-2xl border border-border shadow-theme-sm">
                <button 
                    onClick={() => router.back()}
                    className="h-10 px-4 rounded-xl hover:bg-muted transition-colors flex items-center gap-2 text-sm font-bold text-muted-foreground"
                >
                    <ArrowLeft size={18} /> Back
                </button>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <Layout size={18} />
                    </div>
                    <h1 className="text-sm font-black uppercase tracking-widest">{id ? "Edit Hero" : "New Hero"}</h1>
                </div>
                <div className="w-20" /> {/* Spacer */}
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* LEFT COLUMN: Visuals */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-card p-6 rounded-[2rem] border border-border shadow-theme-sm space-y-4">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] block">Featured Asset</label>
                            <div 
                                onClick={() => setIsMediaPickerOpen(true)}
                                className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-muted flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-border hover:border-primary/40 transition-all group/image shadow-inner"
                            >
                                {selectedImage ? (
                                    <>
                                        <img src={selectedImage.originalUrl} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                            <p className="text-white text-[10px] font-black uppercase tracking-widest bg-primary px-4 py-2 rounded-full shadow-lg">Change Asset</p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center p-6">
                                        <div className="w-12 h-12 bg-background rounded-2xl flex items-center justify-center text-muted-foreground mx-auto mb-4 border border-border shadow-theme-sm">
                                            <ImageIcon size={24} />
                                        </div>
                                        <p className="text-[10px] font-black text-foreground uppercase tracking-widest">Select Media</p>
                                    </div>
                                )}
                            </div>
                            <p className="text-[10px] text-center text-muted-foreground font-bold uppercase tracking-tighter">Recommended: 1920x800px</p>
                        </div>

                        <div className="bg-card p-6 rounded-[2rem] border border-border shadow-theme-sm space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-black text-xs text-foreground uppercase tracking-tight">Active Status</p>
                                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Live on Storefront</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} />
                                    <div className="w-12 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 shadow-inner"></div>
                                </label>
                            </div>
                            <div className="pt-4 border-t border-border flex items-center justify-between">
                                <div>
                                    <p className="font-black text-xs text-foreground uppercase tracking-tight">Display Order</p>
                                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Sorting priority</p>
                                </div>
                                <input type="number" min="0" value={formData.order} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} className="w-16 h-10 bg-muted/30 border border-border rounded-xl text-center text-sm font-black focus:border-primary outline-none" />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-card p-8 rounded-[2.5rem] border border-border shadow-theme-sm space-y-8">
                            
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3 block">Main Headline <span className="text-destructive">*</span></label>
                                    <input required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. DEFINE YOUR STANDARD" className="w-full h-14 bg-muted/20 border border-border rounded-2xl px-5 text-lg font-black focus:border-primary focus:bg-background outline-none transition-all shadow-inner uppercase tracking-tighter" />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3 block">Badge / Subtitle</label>
                                    <input type="text" value={formData.subtitle} onChange={e => setFormData({ ...formData, subtitle: e.target.value })} placeholder="e.g. THE 2024 COLLECTION" className="w-full h-12 bg-muted/20 border border-border rounded-xl px-5 text-sm font-bold focus:border-primary outline-none transition-all uppercase" />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3 block">Description / Narrative</label>
                                    <textarea 
                                        rows={4} 
                                        value={formData.description} 
                                        onChange={e => setFormData({ ...formData, description: e.target.value })} 
                                        placeholder="Craft a compelling story for this hero section..." 
                                        className="w-full bg-muted/20 border border-border rounded-2xl px-5 py-4 text-sm font-medium focus:border-primary focus:bg-background outline-none transition-all shadow-inner resize-none leading-relaxed"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-muted/10 rounded-[2rem] border border-border/50">
                                <div>
                                    <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-2 block">Action Button Text</label>
                                    <input required type="text" value={formData.buttonText} onChange={e => setFormData({ ...formData, buttonText: e.target.value })} className="w-full h-10 bg-background border border-border rounded-xl px-4 text-xs font-black uppercase tracking-widest focus:border-primary outline-none" />
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-2 block">Destination Link</label>
                                    <input required type="text" value={formData.buttonLink} onChange={e => setFormData({ ...formData, buttonLink: e.target.value })} className="w-full h-10 bg-background border border-border rounded-xl px-4 text-xs font-bold focus:border-primary outline-none" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-muted/10 rounded-[2rem] border border-border/50">
                                <div>
                                    <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-2 block">Float Badge Label</label>
                                    <input type="text" value={formData.badgeLabel} onChange={e => setFormData({ ...formData, badgeLabel: e.target.value })} placeholder="e.g. Authentic Gear" className="w-full h-10 bg-background border border-border rounded-xl px-4 text-xs font-black uppercase tracking-widest focus:border-primary outline-none" />
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-2 block">Float Badge Text</label>
                                    <input type="text" value={formData.badgeText} onChange={e => setFormData({ ...formData, badgeText: e.target.value })} placeholder="e.g. Niche Excellence Certified" className="w-full h-10 bg-background border border-border rounded-xl px-4 text-xs font-bold focus:border-primary outline-none" />
                                </div>
                            </div>

                            <div className="pt-6 border-t border-border flex justify-end gap-3">
                                <button type="button" onClick={() => router.back()} className="h-14 px-8 rounded-2xl font-black text-xs uppercase tracking-widest text-muted-foreground hover:bg-muted transition-all">Discard</button>
                                <button type="submit" disabled={isSaving || !formData.imageID} className="h-14 px-10 bg-primary text-primary-foreground rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-theme-md disabled:opacity-50 disabled:grayscale">
                                    {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                                    {id ? "Update Hero" : "Publish Hero"}
                                </button>
                            </div>

                        </div>
                    </div>

                </div>

            </form>

            {/* MEDIA PICKER MODAL */}
            {isMediaPickerOpen && (
                <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300">
                    <div className="bg-card w-full max-w-6xl h-full max-h-[85vh] rounded-[3rem] shadow-theme-2xl flex flex-col overflow-hidden border border-border/50">
                        <div className="flex items-center justify-between px-8 py-6 border-b border-border bg-muted/10 shrink-0">
                            <div>
                                <h3 className="text-xl font-black uppercase tracking-tight text-foreground">Hero Asset Library</h3>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Select a high-resolution visual for your storefront</p>
                            </div>
                            <button onClick={() => setIsMediaPickerOpen(false)} className="w-12 h-12 bg-background border border-border hover:bg-destructive hover:text-white rounded-2xl flex items-center justify-center transition-all">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-hidden relative p-2">
                            <MediaManager 
                                isPicker={true} 
                                onSelect={(media: any) => {
                                    setFormData({ ...formData, imageID: media.id });
                                    setSelectedImage(media);
                                    setIsMediaPickerOpen(false);
                                }} 
                            />
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
