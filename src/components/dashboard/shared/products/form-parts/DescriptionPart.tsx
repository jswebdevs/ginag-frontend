"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Sparkles, Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import { generateAIContent } from "@/services/ai.service";
import "react-quill-new/dist/quill.snow.css";

// Dynamically import ReactQuill to avoid SSR hydration errors in Next.js
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <div className="h-[300px] flex items-center justify-center text-muted-foreground bg-muted/10 rounded-2xl border border-border">Loading Editor...</div>
});

export default function DescriptionPart({ product, update }: any) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAIGenerate = async () => {
    if (!product.name) {
      return Swal.fire("Missing Name", "Please enter a Product Title in Part 1 so the AI knows what to write about!", "warning");
    }

    setIsGenerating(true);

    const systemInstruction = `
        You are an expert SEO copywriter for a premium e-commerce store. 
        Write highly optimized, persuasive, and engaging product copy.
        CRITICAL RULE: Return ONLY valid raw HTML. Do not wrap the response in markdown blocks (like \`\`\`html). Do not include <html>, <body>, or <head> tags.
    `;

    // We pass the shortDesc as context if it exists, making the long description hyper-accurate!
    const prompt = `
        Write a detailed, persuasive, and engaging long-form product description for "${product.name}".
        ${product.shortDesc ? `Use these specific product features as context: ${product.shortDesc}` : ""}
        
        Structure the HTML exactly like this:
        1. Start with an <h3> tag containing a catchy, benefit-driven headline.
        2. Follow with 1-2 engaging <p> paragraphs explaining the value proposition.
        3. End with a <ul> containing 4-5 <li> tags highlighting the best features or technical specs.
    `;

    try {
      const aiResponse = await generateAIContent(prompt, systemInstruction);

      update({ longDesc: aiResponse });

      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Description written!',
        showConfirmButton: false,
        timer: 2000
      });
    } catch (error: any) {
      console.error("AI Error (longDesc):", error);
      Swal.fire("Generation Failed", error.message || "Failed to generate content.", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  // Custom toolbar configuration (matching your blog settings)
  const quillModules = {
    toolbar: [
      [{ 'header': [2, 3, 4, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'clean']
    ],
  };

  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'align', 'link'
  ];

  return (
    <div className="bg-card border border-border rounded-3xl p-4 md:p-8 shadow-theme-sm space-y-4">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <h2 className="text-xl font-black text-foreground tracking-tight">Part 3: Long Description</h2>

        {/* AI GENERATE BUTTON */}
        <button
          type="button"
          onClick={handleAIGenerate}
          disabled={isGenerating}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50"
          title="Auto-generate an HTML-formatted product description"
        >
          {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {isGenerating ? "Writing..." : "AI Generate Copy"}
        </button>
      </div>

      <div className="space-y-2 pt-2">
        {/* Tailwind wrapper to match your application's UI perfectly */}
        <div className="rounded-xl overflow-hidden border border-border 
          [&_.ql-toolbar]:bg-muted/50 [&_.ql-toolbar]:border-border [&_.ql-toolbar]:border-x-0 [&_.ql-toolbar]:border-t-0
          [&_.ql-container]:border-transparent 
          [&_.ql-editor]:text-foreground [&_.ql-editor]:min-h-[300px] [&_.ql-editor]:text-base
          [&_.ql-stroke]:!stroke-foreground [&_.ql-fill]:!fill-foreground"
        >
          <ReactQuill
            theme="snow"
            value={product.longDesc || ""}
            onChange={(content) => update({ longDesc: content })}
            modules={quillModules}
            formats={quillFormats}
            placeholder="Write the full story of this product..."
          />
        </div>
      </div>
    </div>
  );
}