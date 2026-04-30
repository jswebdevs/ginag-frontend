'use client';

import React, { useState } from 'react';
import { X, MapPin, CreditCard, Package } from 'lucide-react';

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'COMPLETED';

export interface OrderItem {
    id: string;
    productId: string;
    variationId: string | null;
    productName: string;
    quantity: number;
    price: string | number;
    totalPrice: string | number;
    product?: {
        name: string;
        featuredImage?: {
            thumbUrl: string;
            originalUrl: string;
        };
    };
}

// Updated to match the rich data your API provides
export interface Order {
    id: string;
    orderNumber: string;
    createdAt: string;
    status: OrderStatus;
    totalAmount: string | number;
    deliveryFee?: string | number;
    discountAmount?: string | number;
    paymentMethod?: string;
    paymentStatus?: string;
    shippingAddress?: {
        fullName?: string;
        phone?: string;
        house?: string;
        road?: string;
        area?: string;
        thana?: string;
        district?: string;
    };
    items: OrderItem[];
}

interface MyOrdersListProps {
    orders: Order[];
    onCancelClick: (orderId: string) => void;
    onChangeVariationClick: (orderId: string, item: OrderItem) => void;
}

export default function MyOrdersList({ orders, onCancelClick, onChangeVariationClick }: MyOrdersListProps) {
    // Modal State
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const getStatusColor = (status: string) => {
        switch (status?.toUpperCase()) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-900/50';
            case 'CONFIRMED': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900/50';
            case 'PROCESSING': return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-900/50';
            case 'SHIPPED': return 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-900/50';
            case 'COMPLETED':
            case 'DELIVERED': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900/50';
            case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900/50';
            default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
        }
    };

    if (!orders || orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 bg-card rounded-2xl border border-border shadow-sm px-4 text-center">
                <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground">No orders yet</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm">When you place an order, it will appear here so you can track its status.</p>
                <button
                    onClick={() => window.location.href = '/shop'}
                    className="mt-6 inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-xl transition-opacity bg-primary text-primary-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                    Start Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6 sm:space-y-8 relative">
            {orders.map((order) => {
                const statusUpper = order.status.toUpperCase();
                const canCancel = ['PENDING', 'CONFIRMED'].includes(statusUpper);
                const canChangeVariation = ['PENDING', 'CONFIRMED', 'PROCESSING'].includes(statusUpper);

                return (
                    <div key={order.id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:border-primary/30 transition-colors">
                        {/* Header */}
                        <div className="bg-muted/30 px-4 sm:px-6 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-semibold text-foreground">
                                        {order.orderNumber}
                                    </p>
                                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1.5 font-medium">
                                    Placed {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                            <div className="flex items-center sm:justify-end">
                                <p className="text-sm text-muted-foreground mr-2">Total:</p>
                                <p className="font-bold text-lg text-foreground">
                                    ৳{(Number(order.totalAmount) || 0).toLocaleString()}
                                </p>
                            </div>
                        </div>

                        {/* Items Preview (Max 2 to save space, rest inside modal) */}
                        <div className="px-4 sm:px-6 py-2 divide-y divide-border">
                            {order.items.slice(0, 2).map((item) => {
                                const imageUrl = item.product?.featuredImage?.thumbUrl || item.product?.featuredImage?.originalUrl;
                                const displayName = item.product?.name || item.productName;
                                const displayVariation = item.product?.name ? item.productName : 'N/A';

                                return (
                                    <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center gap-4">
                                        <div className="flex items-start gap-4 flex-1 min-w-0">
                                            <div className="h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 rounded-xl border border-border overflow-hidden bg-muted flex items-center justify-center">
                                                {imageUrl ? (
                                                    <img src={imageUrl} alt={displayName} className="h-full w-full object-cover object-center" />
                                                ) : (
                                                    <Package className="w-6 h-6 text-muted-foreground/50" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0 pt-1">
                                                <h4 className="text-sm font-bold text-foreground line-clamp-1">{displayName}</h4>
                                                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                                    <p><span className="font-medium text-foreground/80">Variant:</span> {displayVariation}</p>
                                                    <p><span className="font-medium text-foreground/80">Qty:</span> {item.quantity}</p>
                                                </div>
                                                <p className="mt-1 text-sm font-semibold text-foreground">৳{(Number(item.price) || 0).toLocaleString()}</p>
                                            </div>
                                        </div>

                                        <div className="sm:ml-4 sm:flex-shrink-0 mt-2 sm:mt-0 flex justify-end">
                                            <button
                                                onClick={() => onChangeVariationClick(order.id, item)}
                                                disabled={!canChangeVariation}
                                                className={`text-xs font-semibold px-4 py-2 rounded-lg border transition-all ${canChangeVariation
                                                        ? 'border-primary text-primary hover:bg-primary/10'
                                                        : 'text-muted-foreground border-border bg-muted/50 cursor-not-allowed'
                                                    }`}
                                            >
                                                Change Variant
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                            {order.items.length > 2 && (
                                <div className="py-3 text-center text-sm font-medium text-muted-foreground bg-muted/20 rounded-b-xl">
                                    + {order.items.length - 2} more items
                                </div>
                            )}
                        </div>

                        {/* Footer Actions */}
                        <div className="px-4 sm:px-6 py-4 bg-muted/10 border-t border-border flex flex-wrap items-center justify-end gap-3">
                            <button
                                onClick={() => setSelectedOrder(order)}
                                className="flex-1 sm:flex-none text-center px-5 py-2.5 text-sm font-bold text-foreground bg-background border border-border rounded-xl hover:bg-muted transition-colors shadow-sm"
                            >
                                View Order Details
                            </button>

                            <button
                                onClick={() => onCancelClick(order.id)}
                                disabled={!canCancel}
                                className={`flex-1 sm:flex-none text-center px-5 py-2.5 text-sm font-bold rounded-xl transition-colors ${canCancel
                                        ? 'text-red-600 bg-red-50 hover:bg-red-100 dark:text-red-400 dark:bg-red-900/20 dark:hover:bg-red-900/40 border border-transparent'
                                        : 'text-muted-foreground bg-muted border-border cursor-not-allowed hidden sm:block'
                                    }`}
                            >
                                Cancel Order
                            </button>
                        </div>
                    </div>
                );
            })}

            {/* --- ORDER DETAILS MODAL --- */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-card border border-border w-full max-w-3xl rounded-3xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">

                        {/* Modal Header */}
                        <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
                            <div>
                                <h2 className="text-xl font-black text-foreground">Order Details</h2>
                                <p className="text-sm text-muted-foreground mt-1">Order {selectedOrder.orderNumber}</p>
                            </div>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="p-2 text-muted-foreground hover:text-red-500 bg-background rounded-full transition-colors border border-border hover:border-red-500/50"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body (Scrollable) */}
                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-8">

                            {/* Status & Info Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-background rounded-2xl p-5 border border-border">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Order Status</p>
                                        <span className={`inline-flex px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${getStatusColor(selectedOrder.status)}`}>
                                            {selectedOrder.status}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Payment Status</p>
                                        <p className="font-semibold flex items-center gap-2">
                                            <CreditCard className="w-4 h-4 text-primary" />
                                            {selectedOrder.paymentStatus || 'Pending'}
                                            <span className="text-muted-foreground font-normal text-sm">({selectedOrder.paymentMethod || 'COD'})</span>
                                        </p>
                                    </div>
                                </div>

                                {selectedOrder.shippingAddress && (
                                    <div className="sm:border-l sm:border-border sm:pl-6">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-2">Shipping Address</p>
                                        <div className="text-sm font-medium text-foreground flex items-start gap-2">
                                            <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-bold">{selectedOrder.shippingAddress.fullName}</p>
                                                <p>{selectedOrder.shippingAddress.phone}</p>
                                                <p className="text-muted-foreground mt-1">
                                                    {selectedOrder.shippingAddress.house && `${selectedOrder.shippingAddress.house}, `}
                                                    {selectedOrder.shippingAddress.road && `${selectedOrder.shippingAddress.road}`}
                                                    <br />
                                                    {selectedOrder.shippingAddress.area}, {selectedOrder.shippingAddress.thana}
                                                    <br />
                                                    {selectedOrder.shippingAddress.district}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Full Items List */}
                            <div>
                                <h3 className="text-lg font-bold text-foreground mb-4">Items Ordered</h3>
                                <div className="border border-border rounded-2xl overflow-hidden divide-y divide-border bg-background">
                                    {selectedOrder.items.map((item) => {
                                        const imageUrl = item.product?.featuredImage?.thumbUrl || item.product?.featuredImage?.originalUrl;
                                        const displayName = item.product?.name || item.productName;
                                        const displayVariation = item.product?.name ? item.productName : 'N/A';

                                        return (
                                            <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-16 w-16 rounded-xl border border-border overflow-hidden bg-muted flex items-center justify-center shrink-0">
                                                        {imageUrl ? (
                                                            <img src={imageUrl} alt={displayName} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <Package className="w-6 h-6 text-muted-foreground/50" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm text-foreground line-clamp-1">{displayName}</p>
                                                        <p className="text-xs text-muted-foreground mt-0.5">Variant: {displayVariation}</p>
                                                        <p className="text-xs font-medium text-foreground mt-1">
                                                            {item.quantity} x ৳{Number(item.price).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right font-black text-foreground">
                                                    ৳{(Number(item.price) * item.quantity).toLocaleString()}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Price Summary */}
                            <div className="flex justify-end pt-4">
                                <div className="w-full sm:w-1/2 space-y-3 text-sm">
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Subtotal</span>
                                        <span>৳{(Number(selectedOrder.totalAmount) - Number(selectedOrder.deliveryFee || 0) + Number(selectedOrder.discountAmount || 0)).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Delivery Fee</span>
                                        <span>+ ৳{Number(selectedOrder.deliveryFee || 0).toLocaleString()}</span>
                                    </div>
                                    {Number(selectedOrder.discountAmount) > 0 && (
                                        <div className="flex justify-between text-green-500 font-medium">
                                            <span>Discount</span>
                                            <span>- ৳{Number(selectedOrder.discountAmount).toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center border-t border-border pt-3">
                                        <span className="font-bold text-foreground text-base">Total Amount</span>
                                        <span className="font-black text-xl text-primary">৳{Number(selectedOrder.totalAmount).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}