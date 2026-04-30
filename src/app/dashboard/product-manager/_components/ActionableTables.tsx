"use client";

import React from 'react';
import { CheckCircle, Eye, Clock, Store } from 'lucide-react'; // <-- Added Store here
import Link from 'next/link';

interface ActionablesData {
  recentProducts: any[];
}

export default function ActionableTables({ actionables }: { actionables: ActionablesData }) {
  if (!actionables) return null;

  return (
    <div className="grid grid-cols-1">
      
      {/* --- Table 1: Recent Products --- */}
      <div className="bg-card p-6 rounded-2xl border border-border shadow-sm transition-colors duration-300 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-foreground">Recent Products</h3>
          <Link href="/dashboard/product-manager/products" className="text-sm font-semibold text-primary hover:underline">
            Manage All
          </Link>
        </div>
        
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="pb-3 font-semibold px-2">Product</th>
                <th className="pb-3 font-semibold px-2">Category</th>
                <th className="pb-3 font-semibold px-2">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {actionables.recentProducts?.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-muted-foreground font-medium">
                    No recent products found.
                  </td>
                </tr>
              ) : (
                actionables.recentProducts?.map((product: any) => (
                  <tr key={product.id} className="hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-2 font-semibold text-foreground">
                      <div className="flex items-center gap-3">
                        {product.featuredImage?.thumbUrl && (
                          <img src={product.featuredImage.thumbUrl} alt={product.name} className="w-8 h-8 rounded-lg object-cover bg-muted" />
                        )}
                        <span className="truncate max-w-[150px]">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-muted-foreground">
                      {product.categories?.[0]?.name || 'Uncategorized'}
                    </td>
                    <td className="py-3 px-2 text-foreground font-bold">
                      ৳{Number(product.basePrice).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}