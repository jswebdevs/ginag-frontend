"use client";

import { useState } from "react";
import ProductReviews from "./ProductReviews";

export default function ProductTabs({ product }: { product: any }) {
    // 1. Define all possible tabs
    const allTabs = [
        { id: "desc", label: "Description", content: product.longDesc },
        { id: "spec", label: "Specifications", content: product.specifications },
        { id: "material", label: "Material", content: product.material },
        { id: "usage", label: "Usage", content: product.usage },
        { id: "usefulness", label: "Usefulness", content: product.usefulness },
        { id: "awareness", label: "Awareness", content: product.awareness },
        { id: "reviews", label: `Reviews (${product.reviews?.length || 0})`, content: "REVIEWS_SPECIAL" }
    ];

    // 2. Filter out tabs that have no content (Keep reviews visible always)
    const activeTabs = allTabs.filter(tab => tab.content && tab.content.trim() !== "");

    const [currentTab, setCurrentTab] = useState(activeTabs[0]?.id || "desc");

    if (activeTabs.length === 0) return null;

    return (
        <div className="mt-16 md:mt-24 w-full">
            {/* Tab Headers */}
            <div className="flex overflow-x-auto border-b border-border hide-scrollbar">
                {activeTabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setCurrentTab(tab.id)}
                        className={`px-8 py-4 text-sm font-black uppercase tracking-widest whitespace-nowrap transition-all border-b-2 ${currentTab === tab.id
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content Area */}
            <div className="py-8 w-full overflow-hidden">
                {activeTabs.map((tab) => {
                    if (currentTab !== tab.id) return null;

                    // 1. Mount the dedicated Reviews Component
                    if (tab.id === "reviews") {
                        return (
                            <ProductReviews
                                key={tab.id}
                                productId={product.id}
                                initialReviews={product.reviews || []}
                            />
                        );
                    }

                    // 2. Handle Long Description (HTML from Quill)
                    if (tab.id === "desc") {
                        // FIX: Replace excessive non-breaking spaces with normal spaces so the text wraps properly
                        const cleanHtml = tab.content.replace(/&nbsp;/g, ' ');

                        return (
                            <div key={tab.id} className="animate-in fade-in slide-in-from-bottom-2 prose prose-sm sm:prose-base max-w-none text-subheading break-words">
                                <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
                            </div>
                        );
                    }

                    // 3. Handle Plain Text / Lists (Specs, Usage, Material, etc.)
                    // Split the text by newlines. If there's more than one line, render a bulleted list.
                    const lines = tab.content.split('\n').filter((line: string) => line.trim() !== "");
                    const isList = lines.length > 1;

                    return (
                        <div key={tab.id} className="animate-in fade-in slide-in-from-bottom-2 text-subheading text-sm sm:text-base leading-relaxed">
                            {isList ? (
                                <ul className="space-y-3">
                                    {lines.map((line: string, i: number) => (
                                        <li key={i} className="flex items-start gap-3">
                                            {/* Custom Bullet Point */}
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                                            <span className="flex-1">{line}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>{tab.content}</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}