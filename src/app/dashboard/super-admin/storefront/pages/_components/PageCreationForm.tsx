"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { 
    Plus, 
    Trash2, 
    GripVertical, 
    Save, 
    ArrowLeft, 
    Image as ImageIcon, 
    Video, 
    PlayCircle, 
    Loader2, 
    Type, 
    Layout, 
    MousePointer2, 
    Columns, 
    Layers,
    Settings,
    Eye,
    Globe,
    FileText
} from "lucide-react";
import api from "@/lib/axios";
import PageMediaAddin, { SelectedMediaData } from "./PageMediaAddin";
import Swal from "sweetalert2";

const ReactQuill = dynamic(async () => {
    const { default: RQ } = await import("react-quill-new");
    return ({ forwardedRef, ...props }: any) => <RQ ref={forwardedRef} {...props} />;
}, { ssr: false });
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
    const [activeMediaBlock, setActiveMediaBlock] = useState<{ id: string, target: 'block' | 'quill' } | null>(null);
    const quillRefs = useRef<any>({});

    const [title, setTitle] = useState(initialData?.title || "");
    const [slug, setSlug] = useState(initialData?.slug || "");
    const [status, setStatus] = useState<"PUBLISHED" | "DRAFT">(initialData?.status || "DRAFT");
    const [featuredImage, setFeaturedImage] = useState(initialData?.featuredImage || "");
    const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription || "");
    const [blocks, setBlocks] = useState<any[]>(initialData?.content || []);

    const generateSlug = (text: string) =>
        text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    useEffect(() => {
        if (!isSlugManual && !initialData) {
            setSlug(generateSlug(title));
        }
    }, [title, isSlugManual, initialData]);

    const quillModules = {
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, 4, false] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'align': [] }],
                ['link', 'image', 'video'],
                ['clean']
            ],
            handlers: {
                image: () => {
                    // We'll handle this by setting a specific state
                    // But since we have multiple quills, we need to know which one
                    // This is tricky with Quill's static handler. 
                    // Instead, we'll add a "Media" button in our own UI or use a ref.
                }
            }
        },
    };

    const quillFormats = [
        'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'align', 'link', 'image', 'video'
    ];

    const addBlock = (type: string) => {
        const newBlock = {
            id: `block-${Date.now()}`,
            type,
            data: type === "hero" ? { heading: "", subheading: "", mediaUrl: "", mediaType: "IMAGE", align: "center" }
                : type === "rich-text" ? { content: "" }
                : type === "media" ? { mediaUrl: "", mediaType: "IMAGE", caption: "" }
                : type === "cta" ? { text: "", buttonText: "", buttonLink: "", variant: "primary" }
                : {}
        };
        setBlocks([...blocks, newBlock]);
    };

    const removeBlock = async (id: string) => {
        const result = await Swal.fire({
            title: "Remove section?",
            text: "This content block will be permanently removed.",
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

        if (activeMediaBlock?.target === 'block') {
            // Update the specific block with the first selected media
            const firstMedia = selectedMedias[0];
            setBlocks(prev => prev.map(b =>
                b.id === activeMediaBlock.id
                    ? { ...b, data: { ...b.data, mediaUrl: firstMedia.url, mediaType: firstMedia.type } }
                    : b
            ));
        } else if (activeMediaBlock?.target === 'quill') {
            // Insert ALL selected media into the Quill editor at the current selection
            const quill = quillRefs.current[activeMediaBlock.id]?.getEditor();
            if (quill) {
                let range = quill.getSelection(true);
                let currentIndex = range.index;

                selectedMedias.forEach((media) => {
                    if (media.type === 'IMAGE') {
                        quill.insertEmbed(currentIndex, 'image', media.url);
                    } else {
                        quill.insertEmbed(currentIndex, 'video', media.url);
                    }
                    currentIndex++; // Move index for next insertion
                    quill.insertText(currentIndex, '\n'); // Add a newline after each media
                    currentIndex++;
                });
            }
        } else if (activeMediaBlock?.target === 'featured') {
            // Set the first selected media as the featured image
            setFeaturedImage(selectedMedias[0].url);
        }

        setIsMediaModalOpen(false);
        setActiveMediaBlock(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = { 
                title, 
                slug, 
                status, 
                featuredImage,
                metaDescription,
                content: blocks 
            };

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

            <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-500">
                {/* Header Action Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between bg-card/80 backdrop-blur-xl p-4 rounded-3xl border border-border shadow-theme-lg sticky top-6 z-50 gap-4">
                    <div className="flex items-center gap-4">
                        <button type="button" onClick={() => router.back()} className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-lg font-black uppercase tracking-tight leading-none">
                                {initialData ? "Edit" : "New"} <span className="text-primary italic">Page</span>
                            </h1>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                                {status === 'PUBLISHED' ? <span className="text-green-500">● Live on site</span> : <span className="text-amber-500">● Draft Mode</span>}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as any)}
                            className="bg-muted/50 border border-border rounded-2xl px-4 py-2.5 text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer hover:bg-muted transition-colors"
                        >
                            <option value="DRAFT">Draft</option>
                            <option value="PUBLISHED">Published</option>
                        </select>
                        
                        <button
                            type="submit"
                            disabled={loading || !title}
                            className="flex-1 sm:flex-none bg-primary text-primary-foreground px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all flex justify-center items-center gap-2 shadow-theme-md disabled:opacity-50 active:scale-95"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {initialData ? "Save Changes" : "Publish Page"}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Title Input */}
                        <div className="bg-card border border-border rounded-[2rem] p-8 md:p-12 shadow-sm">
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Page Title"
                                className="w-full bg-transparent border-none text-4xl md:text-5xl font-black text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-0 leading-tight"
                            />
                            <div className="flex items-center gap-2 mt-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                <Globe className="w-3.5 h-3.5" />
                                <span>URL Slug:</span>
                                <span className="text-primary lowercase">{slug || "..." }</span>
                            </div>
                        </div>

                        {/* Blocks Builder */}
                        <div className="space-y-6">
                            {blocks.length === 0 ? (
                                <div className="bg-card/30 border-4 border-dashed border-border rounded-[2.5rem] py-32 flex flex-col items-center justify-center text-center group hover:border-primary/20 transition-colors">
                                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <Plus className="w-10 h-10 text-muted-foreground/30" />
                                    </div>
                                    <h3 className="text-xl font-black text-muted-foreground uppercase tracking-widest">Start Building</h3>
                                    <p className="text-sm text-muted-foreground/60 mt-2 max-w-xs px-6">Choose a section type below to begin constructing your page layout.</p>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {blocks.map((block, index) => (
                                        <div key={block.id} className="bg-card border border-border rounded-3xl overflow-hidden shadow-theme-sm relative group animate-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: `${index * 50}ms` }}>
                                            
                                            {/* Block Header */}
                                            <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center border border-border shadow-sm">
                                                        <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab active:cursor-grabbing" />
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="p-1.5 rounded-md bg-primary/10 text-primary">
                                                            {block.type === 'hero' ? <Layout size={12} /> : block.type === 'rich-text' ? <Type size={12} /> : block.type === 'media' ? <ImageIcon size={12} /> : <MousePointer2 size={12} />}
                                                        </span>
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-foreground">
                                                            {block.type.replace('-', ' ')}
                                                        </span>
                                                    </div>
                                                </div>
                                                <button type="button" onClick={() => removeBlock(block.id)} className="w-8 h-8 rounded-lg bg-background flex items-center justify-center text-muted-foreground hover:text-red-500 border border-border shadow-sm transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Block Content */}
                                            <div className="p-8">
                                                {block.type === "hero" && (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                        <div className="space-y-6">
                                                            <div className="space-y-2">
                                                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Heading</label>
                                                                <input type="text" placeholder="Main Section Heading" value={block.data.heading} onChange={(e) => updateBlockData(block.id, "heading", e.target.value)} className="w-full bg-muted/20 border border-border rounded-2xl px-5 py-4 text-xl font-black focus:outline-none focus:ring-2 focus:ring-primary transition-all" />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Description</label>
                                                                <textarea rows={3} placeholder="Additional context text..." value={block.data.subheading} onChange={(e) => updateBlockData(block.id, "subheading", e.target.value)} className="w-full bg-muted/20 border border-border rounded-2xl px-5 py-4 font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none" />
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="space-y-4">
                                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block">Background Media</label>
                                                            <div 
                                                                onClick={() => { setActiveMediaBlock({ id: block.id, target: 'block' }); setIsMediaModalOpen(true); }}
                                                                className="relative aspect-video rounded-2xl overflow-hidden bg-muted flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-border hover:border-primary/40 transition-all group/media"
                                                            >
                                                                {block.data.mediaUrl ? (
                                                                    <>
                                                                        {block.data.mediaType === "VIDEO" ? (
                                                                            <video src={block.data.mediaUrl} className="w-full h-full object-cover" muted autoPlay loop />
                                                                        ) : (
                                                                            <img src={block.data.mediaUrl} className="w-full h-full object-cover" alt="Hero" />
                                                                        )}
                                                                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover/media:opacity-100 flex items-center justify-center transition-opacity">
                                                                            <span className="bg-white text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Change Media</span>
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <div className="text-center p-6">
                                                                        <ImageIcon className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                                                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Select Image or Video</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {block.type === "rich-text" && (
                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Editor</label>
                                                            <button 
                                                                type="button" 
                                                                onClick={() => { setActiveMediaBlock({ id: block.id, target: 'quill' }); setIsMediaModalOpen(true); }}
                                                                className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-primary hover:underline"
                                                            >
                                                                <ImageIcon size={12} /> Insert Media
                                                            </button>
                                                        </div>
                                                        <div className="rounded-[1.5rem] overflow-hidden border border-border 
                                                            [&_.ql-toolbar]:bg-muted/30 [&_.ql-toolbar]:border-border [&_.ql-toolbar]:border-x-0 [&_.ql-toolbar]:border-t-0 [&_.ql-toolbar]:px-4 [&_.ql-toolbar]:py-3
                                                            [&_.ql-container]:border-transparent [&_.ql-editor]:text-foreground [&_.ql-editor]:p-8 [&_.ql-editor]:min-h-[25rem] [&_.ql-editor]:text-lg [&_.ql-editor]:leading-relaxed
                                                            [&_.ql-stroke]:!stroke-foreground [&_.ql-fill]:!fill-foreground [&_.ql-picker]:!text-foreground [&_.ql-picker-label]:!text-foreground"
                                                        >
                                                            <ReactQuill 
                                                                theme="snow" 
                                                                forwardedRef={(el: any) => quillRefs.current[block.id] = el}
                                                                value={block.data.content} 
                                                                onChange={(content: string) => updateBlockData(block.id, "content", content)} 
                                                                modules={quillModules} 
                                                                formats={quillFormats} 
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                {block.type === "media" && (
                                                    <div className="space-y-6">
                                                        <div 
                                                            onClick={() => { setActiveMediaBlock({ id: block.id, target: 'block' }); setIsMediaModalOpen(true); }}
                                                            className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden bg-muted flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-border hover:border-primary/40 transition-all group/media"
                                                        >
                                                            {block.data.mediaUrl ? (
                                                                <>
                                                                    {block.data.mediaType === "VIDEO" ? (
                                                                        <video src={block.data.mediaUrl} className="w-full h-full object-cover" controls />
                                                                    ) : (
                                                                        <img src={block.data.mediaUrl} className="w-full h-full object-cover" alt="Content" />
                                                                    )}
                                                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover/media:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
                                                                        <span className="bg-white text-black px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Change Media</span>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <div className="text-center">
                                                                    <ImageIcon className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                                                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Attach Image or Video</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <input type="text" placeholder="Add a caption..." value={block.data.caption} onChange={(e) => updateBlockData(block.id, "caption", e.target.value)} className="w-full bg-transparent border-b border-border py-2 text-sm text-center italic text-muted-foreground focus:outline-none focus:border-primary transition-colors" />
                                                    </div>
                                                )}

                                                {block.type === "cta" && (
                                                    <div className="flex flex-col md:flex-row gap-6 items-end">
                                                        <div className="flex-1 space-y-2">
                                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Message</label>
                                                            <input type="text" placeholder="Ready to start?" value={block.data.text} onChange={(e) => updateBlockData(block.id, "text", e.target.value)} className="w-full bg-muted/20 border border-border rounded-xl px-5 py-3 font-bold focus:outline-none" />
                                                        </div>
                                                        <div className="w-full md:w-1/4 space-y-2">
                                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Button Text</label>
                                                            <input type="text" placeholder="Click here" value={block.data.buttonText} onChange={(e) => updateBlockData(block.id, "buttonText", e.target.value)} className="w-full bg-muted/20 border border-border rounded-xl px-5 py-3 font-bold focus:outline-none" />
                                                        </div>
                                                        <div className="w-full md:w-1/3 space-y-2">
                                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Link</label>
                                                            <input type="text" placeholder="/shop" value={block.data.buttonLink} onChange={(e) => updateBlockData(block.id, "buttonLink", e.target.value)} className="w-full bg-muted/20 border border-border rounded-xl px-5 py-3 font-bold focus:outline-none" />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Add Block Interface */}
                        <div className="bg-card/50 border border-border rounded-[2.5rem] p-8">
                            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-6 text-center">Insert New Section</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <BlockTypeButton icon={<Layout size={20} />} label="Hero" onClick={() => addBlock("hero")} />
                                <BlockTypeButton icon={<Type size={20} />} label="Text" onClick={() => addBlock("rich-text")} />
                                <BlockTypeButton icon={<ImageIcon size={20} />} label="Media" onClick={() => addBlock("media")} />
                                <BlockTypeButton icon={<MousePointer2 size={20} />} label="CTA" onClick={() => addBlock("cta")} />
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar: Settings */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm space-y-8 sticky top-28">
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-tight flex items-center gap-2 mb-6">
                                    <Settings size={16} className="text-primary" />
                                    Page Settings
                                </h3>
                                
                                <div className="space-y-6">
                                    {/* Slug Settings */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex justify-between">
                                            URL Path
                                            {!isSlugManual && <span className="text-[8px] text-primary italic">Syncing</span>}
                                        </label>
                                        <div className="flex items-center bg-muted/30 border border-border rounded-2xl px-4 py-3 group focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                                            <span className="text-muted-foreground text-sm font-bold opacity-40">/</span>
                                            <input
                                                type="text"
                                                value={slug}
                                                onChange={(e) => {
                                                    setSlug(generateSlug(e.target.value));
                                                    setIsSlugManual(true);
                                                }}
                                                placeholder="about-us"
                                                className="w-full bg-transparent border-none font-bold text-sm focus:outline-none focus:ring-0 p-0 ml-1"
                                            />
                                        </div>
                                    </div>

                                    {/* Featured Image */}
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Featured Image</label>
                                        <div 
                                            onClick={() => { setActiveMediaBlock({ id: 'featured', target: 'featured' }); setIsMediaModalOpen(true); }}
                                            className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-muted flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-border hover:border-primary/40 transition-all group/featured"
                                        >
                                            {featuredImage ? (
                                                <>
                                                    <img src={featuredImage} className="w-full h-full object-cover" alt="Featured" />
                                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover/featured:opacity-100 flex items-center justify-center transition-opacity">
                                                        <span className="bg-white text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Replace</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="text-center">
                                                    <ImageIcon className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                                                    <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Select Cover</p>
                                                </div>
                                            )}
                                        </div>
                                        {featuredImage && (
                                            <button type="button" onClick={() => setFeaturedImage("")} className="text-[9px] font-black text-red-500 uppercase tracking-widest hover:underline">Remove Featured Image</button>
                                        )}
                                    </div>

                                    {/* Meta Description */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">SEO Description</label>
                                        <textarea
                                            value={metaDescription}
                                            onChange={(e) => setMetaDescription(e.target.value)}
                                            rows={4}
                                            placeholder="Write a brief summary for search engines..."
                                            className="w-full bg-muted/30 border border-border rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                                        />
                                        <p className="text-[9px] text-muted-foreground italic font-medium">Recommended: 150-160 characters.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-border flex flex-col gap-4">
                                <button type="button" className="w-full py-3 rounded-2xl bg-muted text-foreground text-[10px] font-black uppercase tracking-widest hover:bg-foreground hover:text-background transition-all flex items-center justify-center gap-2 border border-border/50">
                                    <Eye size={14} /> Preview Page
                                </button>
                                <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl">
                                    <div className="flex items-center gap-2 mb-2 text-primary">
                                        <FileText size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Page Stats</span>
                                    </div>
                                    <div className="flex justify-between text-[9px] font-bold text-muted-foreground uppercase">
                                        <span>Blocks:</span>
                                        <span>{blocks.length}</span>
                                    </div>
                                    <div className="flex justify-between text-[9px] font-bold text-muted-foreground uppercase mt-1">
                                        <span>Status:</span>
                                        <span className={status === 'PUBLISHED' ? 'text-green-500' : 'text-amber-500'}>{status}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}

function BlockTypeButton({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="group flex flex-col items-center justify-center p-6 rounded-3xl bg-background border border-border hover:border-primary/50 hover:shadow-theme-md transition-all active:scale-95"
        >
            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors mb-3">
                {icon}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground">{label}</span>
        </button>
    );
}