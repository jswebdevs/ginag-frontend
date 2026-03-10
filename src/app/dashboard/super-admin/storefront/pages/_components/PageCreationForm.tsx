"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Plus, Trash2, GripVertical, Save, ArrowLeft, Image as ImageIcon, Video, PlayCircle, Loader2 } from "lucide-react";
import api from "@/lib/axios";
import PageMediaAddin, { SelectedMediaData } from "./PageMediaAddin";
import Swal from "sweetalert2"; // 🔥 Import SweetAlert2

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

interface PageFormProps {
    initialData?: any;
}

export default function PageCreationForm({ initialData }: PageFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isSlugManual, setIsSlugManual] = useState(!!initialData?.slug);

    // Media Modal State
    const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
    const [activeMediaBlock, setActiveMediaBlock] = useState<string | null>(null);

    const [title, setTitle] = useState(initialData?.title || "");
    const [slug, setSlug] = useState(initialData?.slug || "");
    const [status, setStatus] = useState<"PUBLISHED" | "DRAFT">(initialData?.status || "DRAFT");
    const [blocks, setBlocks] = useState<any[]>(initialData?.content || []);

    const generateSlug = (text: string) =>
        text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    // Auto-generate slug if not manually edited
    useEffect(() => {
        if (!isSlugManual && !initialData) {
            setSlug(generateSlug(title));
        }
    }, [title, isSlugManual, initialData]);

    const quillModules = {
        toolbar: [
            [{ 'header': [2, 3, 4, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['link', 'clean']
        ],
    };

    const quillFormats = ['header', 'bold', 'italic', 'underline', 'strike', 'list', 'align', 'link'];

    const addBlock = (type: string) => {
        const newBlock = {
            id: `block-${Date.now()}`,
            type,
            data: type === "hero" ? { heading: "", subheading: "", mediaUrl: "", mediaType: "IMAGE" }
                : type === "rich-text" ? { content: "" }
                    : {}
        };
        setBlocks([...blocks, newBlock]);
    };

    const removeBlock = async (id: string) => {
        const result = await Swal.fire({
            title: "Remove section?",
            text: "This content block will be permanently removed from the builder.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            confirmButtonText: "Remove",
            background: 'hsl(var(--card))',
            color: 'hsl(var(--foreground))',
        });

        if (result.isConfirmed) {
            setBlocks(blocks.filter(b => b.id !== id));
        }
    };

    const updateBlockData = (id: string, key: string, value: any) => {
        setBlocks(blocks.map(b => b.id === id ? { ...b, data: { ...b.data, [key]: value } } : b));
    };

    const handleMediaSelect = (selectedMedias: SelectedMediaData[]) => {
        if (!selectedMedias || selectedMedias.length === 0) return;

        const firstMedia = selectedMedias[0];
        if (activeMediaBlock) {
            setBlocks(prev => prev.map(b =>
                b.id === activeMediaBlock
                    ? { ...b, data: { ...b.data, mediaUrl: firstMedia.url, mediaType: firstMedia.type } }
                    : b
            ));
        }

        if (selectedMedias.length > 1) {
            const newBlocks = selectedMedias.slice(1).map((media, idx) => ({
                id: `block-${Date.now()}-${idx}`,
                type: "hero",
                data: { heading: "", subheading: "", mediaUrl: media.url, mediaType: media.type }
            }));

            setBlocks(prev => {
                const activeIndex = prev.findIndex(b => b.id === activeMediaBlock);
                if (activeIndex !== -1) {
                    const newArray = [...prev];
                    newArray.splice(activeIndex + 1, 0, ...newBlocks);
                    return newArray;
                }
                return [...prev, ...newBlocks];
            });
        }

        setIsMediaModalOpen(false);
        setActiveMediaBlock(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = { title, slug, status, content: blocks };
            if (initialData?.id) {
                await api.patch(`/pages/${initialData.id}`, payload);
                Swal.fire({ title: "Updated!", text: "Page layout has been updated.", icon: "success", timer: 1500, showConfirmButton: false });
            } else {
                await api.post("/pages", payload);
                Swal.fire({ title: "Created!", text: "New page published successfully.", icon: "success", timer: 1500, showConfirmButton: false });
            }
            router.push("/dashboard/super-admin/storefront/pages");
            router.refresh();
        } catch (error: any) {
            Swal.fire({ title: "Error", text: error.response?.data?.message || "Failed to save page", icon: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <PageMediaAddin
                isOpen={isMediaModalOpen}
                onClose={() => { setIsMediaModalOpen(false); setActiveMediaBlock(null); }}
                onSelect={handleMediaSelect}
            />

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Top Bar Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-card p-4 rounded-2xl border border-border shadow-sm gap-4 sticky top-4 z-40 backdrop-blur-md bg-card/90">
                    <button type="button" onClick={() => router.back()} className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as any)}
                            className="bg-background border border-border rounded-xl px-4 py-2 text-sm font-black uppercase tracking-widest focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer"
                        >
                            <option value="DRAFT">Draft</option>
                            <option value="PUBLISHED">Published</option>
                        </select>
                        <button
                            type="submit"
                            disabled={loading || !title}
                            className="w-full sm:w-auto bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-opacity flex justify-center items-center gap-2 shadow-theme-md disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {initialData ? "Update Page" : "Save Page"}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Left Column: Blocks Builder */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-card p-4 md:p-8 rounded-3xl border border-border shadow-sm space-y-8">
                            <h2 className="text-xl font-black text-heading uppercase tracking-tight">Layout Builder</h2>

                            {blocks.length === 0 ? (
                                <div className="text-center py-20 border-2 border-dashed border-border rounded-3xl bg-muted/5">
                                    <ImageIcon className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                                    <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">No sections added yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {blocks.map((block, index) => (
                                        <div key={block.id} className="border border-border rounded-2xl bg-background overflow-hidden relative group transition-all hover:border-primary/30">

                                            {/* Block Header */}
                                            <div className="bg-muted/30 px-5 py-3 border-b border-border flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab active:cursor-grabbing" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                                        Section {index + 1}: {block.type.replace('-', ' ')}
                                                    </span>
                                                </div>
                                                <button type="button" onClick={() => removeBlock(block.id)} className="text-muted-foreground hover:text-red-500 transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Block Body */}
                                            <div className="p-6 space-y-4">
                                                {block.type === "hero" && (
                                                    <>
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Heading</label>
                                                            <input type="text" placeholder="Main Section Heading" value={block.data.heading} onChange={(e) => updateBlockData(block.id, "heading", e.target.value)} className="w-full bg-muted/10 border border-border rounded-xl px-4 py-3 text-lg font-black focus:outline-none focus:ring-2 focus:ring-primary" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Sub-Heading / Text</label>
                                                            <input type="text" placeholder="Additional context text..." value={block.data.subheading} onChange={(e) => updateBlockData(block.id, "subheading", e.target.value)} className="w-full bg-muted/10 border border-border rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-primary" />
                                                        </div>

                                                        <div className="flex items-center gap-4 p-4 border border-border rounded-xl bg-muted/5 mt-4">
                                                            {block.data.mediaUrl ? (
                                                                <div className="w-20 h-14 relative rounded-lg overflow-hidden bg-black shrink-0 border border-border shadow-sm">
                                                                    {block.data.mediaType === "VIDEO" ? (
                                                                        <div className="relative w-full h-full flex items-center justify-center">
                                                                            <PlayCircle className="absolute z-10 text-white w-6 h-6 opacity-80" />
                                                                            <video src={block.data.mediaUrl} className="w-full h-full object-cover opacity-60" muted />
                                                                        </div>
                                                                    ) : (
                                                                        <img src={block.data.mediaUrl} className="w-full h-full object-cover" alt="Selected media" />
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <div className="w-20 h-14 flex items-center justify-center bg-background rounded-lg shrink-0 border border-dashed border-border">
                                                                    <ImageIcon className="w-6 h-6 text-muted-foreground opacity-30" />
                                                                </div>
                                                            )}

                                                            <div className="flex-1">
                                                                <p className="text-xs font-black uppercase tracking-widest text-foreground">
                                                                    {block.data.mediaUrl ? "Media Attached" : "Background Media"}
                                                                </p>
                                                                <p className="text-[10px] font-medium text-muted-foreground uppercase mt-0.5">
                                                                    {block.data.mediaUrl ? "Ready to publish" : "Select an image or video"}
                                                                </p>
                                                            </div>

                                                            <button
                                                                type="button"
                                                                onClick={() => { setActiveMediaBlock(block.id); setIsMediaModalOpen(true); }}
                                                                className="px-4 py-2 bg-foreground text-background rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all shrink-0 shadow-sm"
                                                            >
                                                                {block.data.mediaUrl ? "Change" : "Browse"}
                                                            </button>
                                                        </div>
                                                    </>
                                                )}

                                                {block.type === "rich-text" && (
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Article Body</label>
                                                        <div className="rounded-2xl overflow-hidden border border-border pb-10 
                                                            [&_.ql-toolbar]:bg-muted/50 [&_.ql-toolbar]:border-border [&_.ql-toolbar]:border-x-0 [&_.ql-toolbar]:border-t-0
                                                            [&_.ql-container]:border-transparent [&_.ql-editor]:text-foreground [&_.ql-editor]:min-h-[15rem] 
                                                            [&_.ql-stroke]:!stroke-foreground [&_.ql-fill]:!fill-foreground"
                                                        >
                                                            <ReactQuill theme="snow" value={block.data.content} onChange={(content) => updateBlockData(block.id, "content", content)} modules={quillModules} formats={quillFormats} />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Add Block Buttons */}
                            <div className="pt-8 border-t border-border flex flex-wrap gap-3">
                                <button type="button" onClick={() => addBlock("hero")} className="px-5 py-3 rounded-xl bg-muted text-foreground text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all flex items-center gap-2 border border-border/50">
                                    <Plus className="w-3 h-3" /> Add Hero / Media
                                </button>
                                <button type="button" onClick={() => addBlock("rich-text")} className="px-5 py-3 rounded-xl bg-muted text-foreground text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all flex items-center gap-2 border border-border/50">
                                    <Plus className="w-3 h-3" /> Add Text Content
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Settings */}
                    <div className="space-y-6">
                        <div className="bg-card p-8 rounded-3xl border border-border shadow-sm space-y-8 sticky top-28">
                            <h2 className="text-lg font-black text-heading uppercase tracking-tight">Meta Data</h2>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Page Title *</label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. About Our Journey"
                                    className="w-full bg-background border border-border rounded-xl px-4 py-3 font-bold focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex justify-between">
                                    URL Slug
                                    {!isSlugManual && <span className="text-[8px] text-primary italic">Auto-Sync ON</span>}
                                </label>
                                <input
                                    type="text"
                                    value={slug}
                                    onChange={(e) => {
                                        setSlug(generateSlug(e.target.value));
                                        setIsSlugManual(true);
                                    }}
                                    placeholder="about-us"
                                    className="w-full bg-background border border-border rounded-xl px-4 py-3 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <div className="flex items-center justify-between">
                                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest break-all">
                                        /{slug}
                                    </p>
                                    {isSlugManual && (
                                        <button type="button" onClick={() => { setIsSlugManual(false); setSlug(generateSlug(title)); }} className="text-[8px] font-black text-primary uppercase underline">Reset Auto</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}