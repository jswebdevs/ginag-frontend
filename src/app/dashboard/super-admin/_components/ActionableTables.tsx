"use client";

import React from 'react';
import { CheckCircle, Eye, Clock } from 'lucide-react';
import Link from 'next/link';

interface ActionablesData {
  recentOrders: any[];
  pendingVendors: any[];
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

      {/* --- Table 2: Pending Vendors --- */}
      <div className="bg-card p-6 rounded-2xl border border-border shadow-sm transition-colors duration-300 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            Pending Vendors 
            {actionables.pendingVendors?.length > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {actionables.pendingVendors.length}
              </span>
            )}
          </h3>
          <Link href="/dashboard/superadmin/vendors" className="text-sm font-semibold text-primary hover:underline">
            Manage
          </Link>
        </div>
        
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="pb-3 font-semibold px-2">Store Name</th>
                <th className="pb-3 font-semibold px-2">Applied On</th>
                <th className="pb-3 font-semibold px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {actionables.pendingVendors?.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-muted-foreground font-medium">
                    No pending vendor approvals.
                  </td>
                </tr>
              ) : (
                actionables.pendingVendors?.map((vendor: any) => (
                  <tr key={vendor.id} className="hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-2 font-semibold text-foreground flex items-center gap-2">
                      <Store className="w-4 h-4 text-muted-foreground" />
                      {vendor.vendorProfile?.storeName || 'Unnamed Store'}
                    </td>
                    <td className="py-3 px-2 text-muted-foreground font-medium">
                      {new Date(vendor.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-2 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          className="p-1.5 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors" 
                          title='Review Details'
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-1.5 text-emerald-600 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg transition-colors" 
                          title='Approve Vendor'
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      </div>
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