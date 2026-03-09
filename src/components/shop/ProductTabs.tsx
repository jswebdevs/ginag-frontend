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
        <div className="mt-16 md:mt-24">
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
            <div className="py-8">
                {activeTabs.map((tab) => {
                    if (currentTab !== tab.id) return null;

                    // Mount the new dedicated Reviews Component
                    if (tab.id === "reviews") {
                        return (
                            <ProductReviews
                                key={tab.id}
                                productId={product.id}
                                initialReviews={product.reviews || []}
                            />
                        );
                    }

                    // Standard Text Tabs
                    return (
                        <div key={tab.id} className="animate-in fade-in slide-in-from-bottom-2 prose prose-sm sm:prose-base max-w-none text-subheading">
                            <div dangerouslySetInnerHTML={{ __html: tab.content.replace(/\n/g, '<br/>') }} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}