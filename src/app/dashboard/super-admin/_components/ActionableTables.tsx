"use client";

import React from 'react';
import { CheckCircle, Eye, Clock, Store } from 'lucide-react'; // <-- Added Store here
import Link from 'next/link';

interface ActionablesData {
  recentOrders: any[];
}

export default function ActionableTables({ actionables }: { actionables: ActionablesData }) {
  if (!actionables) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* --- Table 1: Recent Orders --- */}
      <div className="bg-card p-6 rounded-2xl border border-border shadow-sm transition-colors duration-300 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-foreground">Recent Orders</h3>
          <Link href="/dashboard/superadmin/orders" className="text-sm font-semibold text-primary hover:underline">
            View All
          </Link>
        </div>
        
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="pb-3 font-semibold px-2">Customer</th>
                <th className="pb-3 font-semibold px-2">Total</th>
                <th className="pb-3 font-semibold px-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {actionables.recentOrders?.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-muted-foreground font-medium">
                    No recent orders found.
                  </td>
                </tr>
              ) : (
                actionables.recentOrders?.map((order: any) => (
                  <tr key={order.id} className="hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-2 font-semibold text-foreground">
                      {order.customerName || `${order.user?.firstName || ''} ${order.user?.lastName || ''}` || 'Guest'}
                    </td>
                    <td className="py-3 px-2 text-foreground font-medium">
                      ৳{Number(order.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider
                        ${order.status === 'PENDING' ? 'bg-orange-500/10 text-orange-500' : 
                          order.status === 'DELIVERED' ? 'bg-emerald-500/10 text-emerald-500' : 
                          'bg-primary/10 text-primary'}`}
                      >
                        {order.status}
                      </span>
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