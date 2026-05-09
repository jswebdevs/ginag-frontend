"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import Swal from "sweetalert2";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    Layout,
    Plus,
    Loader2,
    Check,
    X,
    Pencil,
    Trash2,
    Image as ImageIcon,
    ArrowRight,
    Eye,
    EyeOff
} from "lucide-react";

interface HeroManagementProps {
    role: "super-admin" | "admin";
}

export default function HeroManagement({ role }: HeroManagementProps) {
    const router = useRouter();
    const [heroes, setHeroes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchHeroes();
    }, []);

    const fetchHeroes = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/hero/all');
            setHeroes(res.data.data || []);
        } catch (error) {
            console.error("Failed to fetch hero sections", error);
        } finally {
            setIsLoading(false);
        }
    };

    const openAddModal = () => {
        router.push(`/dashboard/${role}/storefront/hero/create`);
    };

    const openEditModal = (hero: any) => {
        router.push(`/dashboard/${role}/storefront/hero/${hero.id}/edit`);
    };

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This hero section will be removed from the storefront.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, delete it!"
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/hero/${id}`);
                setHeroes(heroes.filter(h => h.id !== id));
                toast.success("Hero section deleted successfully");
            } catch (error) {
                toast.error("Failed to delete hero section");
            }
        }
    };

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            await api.patch(`/hero/${id}`, { isActive: !currentStatus });
            toast.success(`Hero section ${!currentStatus ? 'activated' : 'deactivated'}`);
            // Re-fetch to handle the "only one active" rule on frontend
            fetchHeroes();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 px-4 md:px-0">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 rounded-3xl border border-border shadow-theme-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Layout size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-foreground tracking-tight">Hero Sections</h1>
                        <p className="text-sm text-muted-foreground mt-1">Manage the main banners on your storefront homepage.</p>
                    </div>
                </div>
                <button
                    onClick={openAddModal}
                    className="bg-primary text-primary-foreground h-11 px-6 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-theme-md w-full md:w-auto cursor-pointer"
                >
                    <Plus size={18} /> Add New Hero
                </button>
            </div>

            {/* LISTING */}
            <div className="grid grid-cols-1 gap-6">
                {isLoading ? (
                    <div className="flex flex-col h-64 items-center justify-center space-y-4 bg-card rounded-3xl border border-border">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <p className="text-sm font-bold text-muted-foreground animate-pulse">Loading hero sections...</p>
                    </div>
                ) : heroes.length === 0 ? (
                    <div className="flex flex-col h-64 items-center justify-center text-muted-foreground bg-card rounded-3xl border border-border">
                        <Layout className="w-12 h-12 mb-4 opacity-20" />
                        <p className="font-bold">No hero sections found.</p>
                        <p className="text-sm text-center px-4">Create your first authority banner to wow your customers.</p>
                    </div>
                ) : (
                    heroes.map((hero) => (
                        <div key={hero.id} className="group relative bg-card border border-border rounded-3xl shadow-theme-sm overflow-hidden hover:border-primary/30 transition-all duration-300">
                            <div className="flex flex-col lg:flex-row h-full">
                                {/* IMAGE PREVIEW */}
                                <div className="relative w-full lg:w-72 h-48 lg:h-auto bg-muted overflow-hidden">
                                    {hero.image?.originalUrl ? (
                                        <img src={hero.image.originalUrl} alt={hero.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                                            <ImageIcon size={48} />
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4">
                                        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-sm ${hero.isActive ? 'bg-emerald-500/80 text-white' : 'bg-black/50 text-white'}`}>
                                            {hero.isActive ? "Active" : "Hidden"}
                                        </div>
                                    </div>
                                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white text-xs font-bold">
                                        #{hero.order}
                                    </div>
                                </div>

                                {/* CONTENT */}
                                <div className="flex-1 p-6 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-xl font-black text-foreground mb-1">{hero.title}</h3>
                                        <p className="text-sm font-bold text-primary uppercase tracking-widest mb-3">{hero.subtitle}</p>
                                        <p className="text-sm text-muted-foreground line-clamp-2 max-w-2xl">{hero.description}</p>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-6 border-t border-border">
                                        <div className="flex items-center gap-3">
                                            <div className="px-4 py-2 bg-muted rounded-xl text-xs font-bold flex items-center gap-2">
                                                <ArrowRight size={14} className="text-primary" />
                                                <span>{hero.buttonText}</span>
                                                <span className="text-muted-foreground/50 mx-1">|</span>
                                                <span className="text-primary/70">{hero.buttonLink}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => toggleStatus(hero.id, hero.isActive)}
                                                className={`p-2.5 rounded-xl transition-all ${hero.isActive ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                                                title={hero.isActive ? "Hide from storefront" : "Show on storefront"}
                                            >
                                                {hero.isActive ? <Eye size={20} /> : <EyeOff size={20} />}
                                            </button>
                                            <button 
                                                onClick={() => openEditModal(hero)}
                                                className="p-2.5 bg-muted rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                                                title="Edit"
                                            >
                                                <Pencil size={20} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(hero.id)}
                                                className="p-2.5 bg-muted rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
