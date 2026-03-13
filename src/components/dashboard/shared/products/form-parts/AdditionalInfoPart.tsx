"use client";

import { useState, useEffect } from "react";
import { AlignLeft, List, Plus, Trash2, ShieldAlert, Sparkles, BookOpen, Layers, Settings2, Loader2 } from "lucide-react";
import { generateAIContent } from "@/services/ai.service";
import Swal from "sweetalert2";

// Helper Component: Renders a field that can toggle between Paragraph and Bulleted List
const FieldEditor = ({ label, field, value, update, icon: Icon, isWarning = false, onGenerate, isGenerating, isGenerated }: any) => {
    const [descType, setDescType] = useState<"paragraph" | "list">("paragraph");

    useEffect(() => {
        if (value?.includes('\n')) setDescType("list");
    }, [value]);

    const listItems = value ? value.split("\n") : [""];

    const updateListItem = (index: number, val: string) => {
        const newList = [...listItems];
        newList[index] = val;
        update({ [field]: newList.join("\n") });
    };

    const addListItem = () => {
        update({ [field]: (value || "") + "\n" });
    };

    const removeListItem = (index: number) => {
        const newList = listItems.filter((_: string, i: number) => i !== index);
        update({ [field]: newList.join("\n") });
    };

    const colorClass = isWarning ? "text-orange-500" : "text-muted-foreground";
    const focusClass = isWarning ? "focus:border-orange-500" : "focus:border-primary";
    const markerClass = isWarning ? "bg-orange-500" : "bg-primary";

    return (
        <div className="space-y-4 bg-muted/10 p-4 rounded-2xl border border-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <label className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${colorClass}`}>
                        <Icon size={16} /> {label}
                    </label>

                    {/* AI Button */}
                    {!isGenerated && (
                        <button
                            type="button"
                            onClick={() => onGenerate(field, descType)}
                            disabled={isGenerating}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all disabled:opacity-50 ${isWarning ? 'bg-orange-500/10 text-orange-600 hover:bg-orange-500/20' : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20'
                                }`}
                            title={`Auto-generate SEO ${label}`}
                        >
                            {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                            AI Generate
                        </button>
                    )}
                </div>

                <div className="flex bg-muted p-1 rounded-xl w-fit">
                    <button
                        type="button" onClick={() => setDescType("paragraph")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${descType === 'paragraph' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}
                    >
                        <AlignLeft size={12} /> Paragraph
                    </button>
                    <button
                        type="button" onClick={() => setDescType("list")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${descType === 'list' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}
                    >
                        <List size={12} /> List
                    </button>
                </div>
            </div>

            {descType === "paragraph" ? (
                <textarea
                    value={value || ""}
                    onChange={(e) => update({ [field]: e.target.value })}
                    rows={4}
                    placeholder={`Enter ${label.toLowerCase()} details...`}
                    className={`w-full bg-background border border-border rounded-xl px-4 py-3 text-sm outline-none resize-none transition-all ${focusClass}`}
                />
            ) : (
                <div className="space-y-2 animate-in fade-in duration-300">
                    {listItems.map((item: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-3 group">
                            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${markerClass}`} />
                            <input
                                type="text" value={item} onChange={(e) => updateListItem(idx, e.target.value)}
                                placeholder={`Point ${idx + 1}`}
                                className={`flex-1 bg-transparent border-b border-border py-1.5 text-sm outline-none ${focusClass}`}
                            />
                            <button
                                type="button" onClick={() => removeListItem(idx)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-destructive transition-all"
                                title="Remove point"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button" onClick={addListItem}
                        className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-wider mt-4 hover:underline ${isWarning ? 'text-orange-500' : 'text-primary'}`}
                    >
                        <Plus size={14} /> Add Point
                    </button>
                </div>
            )}
        </div>
    );
};

export default function AdditionalInfoPart({ product, update }: any) {
    const [generatingField, setGeneratingField] = useState<string | null>(null);
    const [generatedFields, setGeneratedFields] = useState<string[]>([]);

    const handleAIGenerate = async (field: string, descType: "paragraph" | "list" | "string" = "string") => {
        if (!product.name) {
            return Swal.fire("Missing Name", "Please enter a Product Title in Part 1 so the AI knows what to write about!", "warning");
        }

        setGeneratingField(field);

        // SEO Persona and Base Rules
        const systemInstruction = `
            You are an expert SEO copywriter for a premium e-commerce store. 
            Write highly optimized, search-intent driven product copy for a product named "${product.name}".
            Use natural keyword integration without stuffing. 
            CRITICAL RULE: Return ONLY the raw text. Do not wrap in markdown or quotes.
        `;

        let prompt = "";

        // Dynamically build the prompt based on the field AND the toggle state (paragraph vs list)
        switch (field) {
            case "material":
                prompt = `Write a 1-2 sentence overview of the materials and build quality for "${product.name}". Focus on durability, premium feel, and SEO keywords related to materials.`;
                break;
            case "specifications":
                prompt = descType === "paragraph"
                    ? `Write a concise paragraph detailing the technical specifications of "${product.name}". Make it readable and SEO-friendly.`
                    : `List 4-8 technical specifications for "${product.name}". Format strictly as raw text, one spec per line. Do NOT use bullets, dashes, or numbers at the start of lines.`;
                break;
            case "usage":
                prompt = descType === "paragraph"
                    ? `Write a persuasive, SEO-friendly paragraph explaining how to use or style "${product.name}".`
                    : `List 3-5 step-by-step usage instructions or styling tips for "${product.name}". Format strictly as raw text, one step per line. Do NOT use bullets, dashes, or numbers.`;
                break;
            case "usefulness":
                prompt = descType === "paragraph"
                    ? `Write an SEO-optimized paragraph highlighting the primary benefits of "${product.name}" and why customers need it.`
                    : `List 3-5 key benefits of "${product.name}". Format strictly as raw text, one benefit per line. Do NOT use bullets, dashes, or numbers.`;
                break;
            case "awareness":
                prompt = descType === "paragraph"
                    ? `Write a brief paragraph covering care instructions, safety warnings, or limitations for "${product.name}". Keep it professional.`
                    : `List 2-4 care instructions or warnings for "${product.name}". Format strictly as raw text, one item per line. Do NOT use bullets, dashes, or numbers.`;
                break;
        }

        try {
            let aiResponse = await generateAIContent(prompt, systemInstruction);

            // If the user requested a list, aggressively strip out any markdown the AI tried to add
            if (descType === "list") {
                aiResponse = aiResponse.split('\n')
                    .map(line => line.replace(/^[-*•\d.\s]+/, '').trim())
                    .filter(Boolean)
                    .join('\n');
            }

            update({ [field]: aiResponse });
            setGeneratedFields(prev => [...prev, field]);

        } catch (error: any) {
            console.error(`AI Error (${field}):`, error);
            Swal.fire("Generation Failed", error.message || "Failed to generate content.", "error");
        } finally {
            setGeneratingField(null);
        }
    };

    return (
        <div className="bg-card border border-border rounded-3xl p-4 md:p-8 shadow-theme-sm space-y-8">
            <h2 className="text-xl font-black text-foreground border-b border-border pb-4 tracking-tight">Part 4: Extended Details</h2>

            {/* Material & Build (Single Input) */}
            <div>
                <div className="flex items-center gap-3 mb-3">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                        <Layers size={16} /> Material & Build Overview
                    </label>
                    {!generatedFields.includes("material") && (
                        <button
                            type="button"
                            onClick={() => handleAIGenerate("material", "string")}
                            disabled={generatingField === "material"}
                            className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all disabled:opacity-50"
                        >
                            {generatingField === "material" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                            AI Generate
                        </button>
                    )}
                </div>
                <input
                    type="text" value={product.material || ""}
                    onChange={(e) => update({ material: e.target.value })}
                    placeholder="e.g. 100% Organic Cotton, Aerospace Grade Aluminum..."
                    className="w-full bg-background border border-border rounded-xl px-5 py-3 text-sm outline-none focus:border-primary transition-all"
                />
            </div>

            {/* Grid of Toggleable Editors */}
            <div className="grid grid-cols-1 gap-4">
                <FieldEditor
                    label="Specs" field="specifications" icon={Settings2} value={product.specifications} update={update}
                    onGenerate={handleAIGenerate} isGenerating={generatingField === "specifications"} isGenerated={generatedFields.includes("specifications")}
                />
                <FieldEditor
                    label="Usage Rules" field="usage" icon={BookOpen} value={product.usage} update={update}
                    onGenerate={handleAIGenerate} isGenerating={generatingField === "usage"} isGenerated={generatedFields.includes("usage")}
                />
                <FieldEditor
                    label="Benefits" field="usefulness" icon={Sparkles} value={product.usefulness} update={update}
                    onGenerate={handleAIGenerate} isGenerating={generatingField === "usefulness"} isGenerated={generatedFields.includes("usefulness")}
                />
                <FieldEditor
                    label="Warning & Care" field="awareness" icon={ShieldAlert} value={product.awareness} update={update} isWarning={true}
                    onGenerate={handleAIGenerate} isGenerating={generatingField === "awareness"} isGenerated={generatedFields.includes("awareness")}
                />
            </div>

        </div>
    );
}