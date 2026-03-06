"use client";
import { Bold, Italic, List, Heading1, Heading2 } from "lucide-react";

export default function DescriptionPart({ product, update }: any) {
  
  // Basic implementation of a custom toolbar
  const wrapText = (before: string, after: string = before) => {
    const textarea = document.getElementById('longDescInput') as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);
    update({ longDesc: newText });
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-8 shadow-theme-sm space-y-4">
      <h2 className="text-xl font-black text-foreground">Details</h2>
      
      <div className="border border-border rounded-2xl overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 p-2 bg-muted/30 border-b border-border">
          <button type="button" onClick={() => wrapText('**')} className="p-2 hover:bg-background rounded-lg" title="Bold"><Bold size={18}/></button>
          <button type="button" onClick={() => wrapText('*')} className="p-2 hover:bg-background rounded-lg" title="Italic"><Italic size={18}/></button>
          <button type="button" onClick={() => wrapText('# ', '')} className="p-2 hover:bg-background rounded-lg" title="H1"><Heading1 size={18}/></button>
          <button type="button" onClick={() => wrapText('## ', '')} className="p-2 hover:bg-background rounded-lg" title="H2"><Heading2 size={18}/></button>
          <button type="button" onClick={() => wrapText('- ', '')} className="p-2 hover:bg-background rounded-lg" title="List Item"><List size={18}/></button>
        </div>
        
        <textarea 
          id="longDescInput"
          value={product.longDesc}
          onChange={(e) => update({ longDesc: e.target.value })}
          rows={12}
          placeholder="Write the full story of this product..."
          className="w-full p-6 bg-background outline-none text-foreground font-serif leading-relaxed"
        />
      </div>
    </div>
  );
}