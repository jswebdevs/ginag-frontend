"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Plus, Trash2, GripVertical, Save, ArrowLeft, Image as ImageIcon, Video, PlayCircle } from "lucide-react";
import api from "@/lib/axios";
import PageMediaAddin, { SelectedMediaData } from "./PageMediaAddin";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

interface PageFormProps {
    initialData?: any;
}

export default function PageCreationForm({ initialData }: PageFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Media Modal State
    const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
    const [activeMediaBlock, setActiveMediaBlock] = useState<string | null>(null);

    const [title, setTitle] = useState(initialData?.title || "");
    const [slug, setSlug] = useState(initialData?.slug || "");
    const [status, setStatus] = useState<"PUBLISHED" | "DRAFT">(initialData?.status || "DRAFT");
    const [blocks, setBlocks] = useState<any[]>(initialData?.content || []);

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

    const removeBlock = (id: string) => {
        setBlocks(blocks.filter(b => b.id !== id));
    };

    const updateBlockData = (id: string, key: string, value: any) => {
        setBlocks(blocks.map(b => b.id === id ? { ...b, data: { ...b.data, [key]: value } } : b));
    };

    // 🔥 FIX: Correctly process the array of SelectedMediaData from the modal
    const handleMediaSelect = (selectedMedias: SelectedMediaData[]) => {
        if (!selectedMedias || selectedMedias.length === 0) return;

        // 1. Apply the first image to the active block safely
        const firstMedia = selectedMedias[0];
        if (activeMediaBlock) {
            setBlocks(prev => prev.map(b =>
                b.id === activeMediaBlock
                    ? { ...b, data: { ...b.data, mediaUrl: firstMedia.url, mediaType: firstMedia.type } }
                    : b
            ));
        }

        // 2. If multiple images were selected, spawn new Hero blocks for them!
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
            } else {
                await api.post("/pages", payload);
            }
            router.push("/dashboard/super-admin/storefront/pages");
            router.refresh();
        } catch (error: any) {
            alert(error.response?.data?.message || "Failed to save page");
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
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-card p-4 rounded-2xl border border-border shadow-sm gap-4">
                    <button type="button" onClick={() => router.back()} className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as any)}
                            className="bg-background border border-border rounded-xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-primary focus:outline-none"
                        >
                            <option value="DRAFT">Draft</option>
                            <option value="PUBLISHED">Published</option>
                        </select>
                        <button
                            type="submit"
                            disabled={loading || !title}
                            className="w-full sm:w-auto bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-opacity flex justify-center items-center gap-2 shadow-theme-md disabled:opacity-50"
                        >
                            {loading ? "Saving..." : <><Save className="w-4 h-4" /> Save Page</>}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Blocks Builder */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-card p-4 md:p-6 rounded-3xl border border-border shadow-sm space-y-6">
                            <h2 className="text-xl font-black text-heading uppercase tracking-tight mb-4">Page Content Builder</h2>

                            {blocks.length === 0 ? (
                                <div className="text-center py-12 border-2 border-dashed border-border rounded-2xl">
                                    <p className="text-muted-foreground font-medium">No sections added yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {blocks.map((block, index) => (
                                        <div key={block.id} className="border border-border rounded-2xl bg-background overflow-hidden relative group">

                                            {/* Block Header */}
                                            <div className="bg-muted/30 px-4 py-3 border-b border-border flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                                                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                                                        Section {index + 1}: {block.type.replace('-', ' ')}
                                                    </span>
                                                </div>
                                                <button type="button" onClick={() => removeBlock(block.id)} className="text-red-500 hover:bg-red-500/10 p-1.5 rounded-md transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Block Body Inputs */}
                                            <div className="p-4 space-y-4">

                                                {block.type === "hero" && (
                                                    <>
                                                        <input type="text" placeholder="Hero Heading" value={block.data.heading} onChange={(e) => updateBlockData(block.id, "heading", e.target.value)} className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-lg font-black focus:outline-none focus:ring-2 focus:ring-primary" />
                                                        <input type="text" placeholder="Subheading" value={block.data.subheading} onChange={(e) => updateBlockData(block.id, "subheading", e.target.value)} className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-primary" />

                                                        <div className="flex items-center gap-4 p-3 border border-border rounded-xl bg-muted/20">

                                                            {/* 🔥 VISUAL THUMBNAIL PREVIEW FIXED */}
                                                            {block.data.mediaUrl ? (
                                                                <div className="w-16 h-12 relative rounded-md overflow-hidden bg-black shrink-0 border border-border/50 shadow-sm">
                                                                    {block.data.mediaType === "VIDEO" ? (
                                                                        <video src={block.data.mediaUrl} className="w-full h-full object-cover opacity-80" muted playsInline />
                                                                    ) : (
                                                                        <img src={block.data.mediaUrl} className="w-full h-full object-cover" />
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <div className="w-16 h-12 flex items-center justify-center bg-background rounded-md shrink-0 border border-dashed border-border">
                                                                    <ImageIcon className="w-5 h-5 text-muted-foreground opacity-50" />
                                                                </div>
                                                            )}

                                                            <div className="flex-1 truncate text-sm font-medium text-foreground">
                                                                {block.data.mediaUrl ? "Media Attached Successfully" : <span className="text-muted-foreground">No media selected</span>}
                                                            </div>

                                                            <button
                                                                type="button"
                                                                onClick={() => { setActiveMediaBlock(block.id); setIsMediaModalOpen(true); }}
                                                                className="px-4 py-2 bg-foreground text-background rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-colors shrink-0"
                                                            >
                                                                {block.data.mediaUrl ? "Change Media" : "Choose Media"}
                                                            </button>
                                                        </div>
                                                    </>
                                                )}

                                                {block.type === "rich-text" && (
                                                    <div className="rounded-xl overflow-hidden border border-border pb-10 
                                                        [&_.ql-toolbar]:bg-muted/50 [&_.ql-toolbar]:border-border [&_.ql-toolbar]:border-x-0 [&_.ql-toolbar]:border-t-0
                                                        [&_.ql-container]:border-transparent 
                                                        [&_.ql-editor]:text-foreground [&_.ql-editor]:min-h-[12rem] [&_.ql-editor]:text-base
                                                        [&_.ql-picker-label]:!text-foreground [&_.ql-picker-options]:!bg-card [&_.ql-picker-options]:!border-border [&_.ql-picker-item]:!text-foreground
                                                        [&_.ql-stroke]:!stroke-foreground [&_.ql-fill]:!fill-foreground"
                                                    >
                                                        <ReactQuill
                                                            theme="snow"
                                                            value={block.data.content}
                                                            onChange={(content) => updateBlockData(block.id, "content", content)}
                                                            modules={quillModules}
                                                            formats={quillFormats}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Add Block Buttons */}
                            <div className="pt-4 border-t border-border flex flex-wrap gap-2">
                                <button type="button" onClick={() => addBlock("hero")} className="px-4 py-2 rounded-xl bg-muted text-foreground text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-colors flex items-center gap-2">
                                    <Plus className="w-3 h-3" /> Add Image/Video Block
                                </button>
                                <button type="button" onClick={() => addBlock("rich-text")} className="px-4 py-2 rounded-xl bg-muted text-foreground text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-colors flex items-center gap-2">
                                    <Plus className="w-3 h-3" /> Add Text Block
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Settings */}
                    <div className="space-y-6">
                        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm space-y-4 sticky top-6">
                            <h2 className="text-lg font-black text-heading uppercase tracking-tight">Page Settings</h2>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Page Title *</label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. About Us"
                                    className="w-full bg-background border border-border rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">URL Slug</label>
                                <input
                                    type="text"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                                    placeholder="Leave blank to auto-generate"
                                    className="w-full bg-background border border-border rounded-xl px-4 py-3 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest break-all">
                                    example.com/{slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}