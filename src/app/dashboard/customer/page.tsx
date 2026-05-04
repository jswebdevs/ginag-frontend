"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { useUserStore } from '@/store/useUserStore';
import { Package, ShoppingBag, Heart, ArrowRight } from 'lucide-react';
import { useCurrency } from '@/context/SettingsContext';


export default function UserDashboardPage() {
    const { symbol } = useCurrency();
    const { user } = useUserStore();


    const [stats, setStats] = useState({ activeOrders: 0, totalOrders: 0, wishlistItems: 0 });
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch Orders and Wishlist concurrently
                const [ordersRes, wishlistRes] = await Promise.all([
                    api.get('/orders/my-orders').catch(() => ({ data: { data: [] } })), // Catch to prevent full crash
                    api.get('/wishlist/my-wishlist').catch(() => ({ data: { data: { items: [] } } })) // Adjust wishlist endpoint as needed
                ]);

                const allOrders = ordersRes.data?.data || [];
                const wishlistData = wishlistRes.data?.data?.items || wishlistRes.data?.data || [];

                // Calculate Active Orders (Pending, Confirmed, Processing, Shipped)
                const activeStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED'];
                const activeCount = allOrders.filter((o: any) => activeStatuses.includes(o.status.toUpperCase())).length;

                setStats({
                    activeOrders: activeCount,
                    totalOrders: allOrders.length,
                    wishlistItems: wishlistData.length
                });

                // Get only the 3 most recent orders
                setRecentOrders(allOrders.slice(0, 3));

            } catch (err) {
                console.error("Dashboard data fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'CONFIRMED': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'PROCESSING': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
            case 'SHIPPED': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400';
            case 'COMPLETED':
            case 'DELIVERED': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'CANCELLED': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Welcome Banner */}
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                        Hello, <span className="text-primary">{user?.firstName || "Customer"}</span>! 👋
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Welcome to your account dashboard. Here you can manage your orders, track shipments, and update your profile.
                    </p>
                </div>
                <Link href="/shop" className="shrink-0 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold shadow-md shadow-primary/20 hover:opacity-90 transition-opacity">
                    Continue Shopping
                </Link>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                        <Package className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Active Orders</p>
                        <h3 className="text-2xl font-bold text-foreground">{stats.activeOrders}</h3>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                        <h3 className="text-2xl font-bold text-foreground">{stats.totalOrders}</h3>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-rose-100 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                        <Heart className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Wishlist Items</p>
                        <h3 className="text-2xl font-bold text-foreground">{stats.wishlistItems}</h3>
                    </div>
                </div>
            </div>

            {/* Recent Activity List */}
            <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border flex items-center justify-between">
                    <h2 className="text-lg font-bold text-foreground">Recent Activity</h2>
                    <Link href="/user/orders" className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline">
                        View All <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {recentOrders.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                        <p>You haven't placed any orders yet.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {recentOrders.map((order) => (
                            <div key={order.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors">

                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-muted border border-border flex items-center justify-center text-muted-foreground">
                                        <Package className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-foreground">{order.orderNumber}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/2">
                                    <div className="text-left sm:text-right">
                                        <p className="text-xs text-muted-foreground mb-1">Total</p>
                                        <p className="font-bold text-foreground">{symbol}{(Number(order.totalAmount) || 0).toLocaleString()}</p>

                                    </div>

                                    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border border-transparent ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>

                                    <Link
                                        href={`/user/orders/${order.id}`}
                                        className="hidden sm:flex text-sm font-semibold px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-foreground"
                                    >
                                        Details
                                    </Link>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}