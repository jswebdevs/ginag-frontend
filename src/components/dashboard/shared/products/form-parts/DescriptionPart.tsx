"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

// Dynamically import ReactQuill to avoid SSR hydration errors in Next.js
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <div className="h-[300px] flex items-center justify-center text-muted-foreground bg-muted/10 rounded-2xl border border-border">Loading Editor...</div>
});

export default function DescriptionPart({ product, update }: any) {
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