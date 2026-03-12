'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import axiosInstance from '@/lib/axios';
import { useUserStore } from '@/store/useUserStore';
import { useThemeStore } from '@/store/themeStore';
import MyOrdersList, { Order, OrderItem } from '@/components/dashboard/orders/MyOrderList';

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    const { user, isAuthenticated } = useUserStore();
    const { mode, primaryColor } = useThemeStore(); // Assuming 'mode' is 'light'|'dark' and 'primaryColor' is a hex

    useEffect(() => {
        // Redirect if not logged in using your store
        if (!isAuthenticated && !isLoading) {
            router.push('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                // Utilizing your configured axios instance - it already handles base URL and tokens!
                const response = await axiosInstance.get('/orders/my-orders');
                const fetchedOrders = response.data.data || response.data || [];
                setOrders(fetchedOrders);
            } catch (err: any) {
                console.error('Error fetching orders:', err);
                setError(err.response?.data?.message || 'Failed to load your orders.');
            } finally {
                setIsLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchOrders();
        }
    }, [isAuthenticated, router]);

    const handleCancel = (orderId: string) => {
        Swal.fire({
            title: 'Cancel Order?',
            text: "This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: primaryColor || '#ef4444', // Theme primary or red
            cancelButtonColor: mode === 'dark' ? '#374151' : '#9ca3af',
            confirmButtonText: 'Yes, Cancel it',
            cancelButtonText: 'Keep Order',
            showLoaderOnConfirm: true,
            background: mode === 'dark' ? '#171717' : '#ffffff',
            color: mode === 'dark' ? '#f3f4f6' : '#111827',
            preConfirm: async () => {
                try {
                    // Using your axios instance
                    const response = await axiosInstance.patch(`/orders/${orderId}/cancel`);
                    return response.data;
                } catch (error: any) {
                    Swal.showValidationMessage(
                        `Cancel failed: ${error.response?.data?.message || error.message}`
                    );
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Cancelled',
                    text: 'Your order has been cancelled.',
                    icon: 'success',
                    confirmButtonColor: primaryColor,
                    background: mode === 'dark' ? '#171717' : '#ffffff',
                    color: mode === 'dark' ? '#f3f4f6' : '#111827',
                });
                setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o));
            }
        });
    };

    const handleChangeVariation = async (orderId: string, item: OrderItem) => {
        Swal.fire({
            title: 'Feature coming soon',
            text: `Changing variation for ${item.name} will require a backend update endpoint.`,
            icon: 'info',
            confirmButtonColor: primaryColor,
            background: mode === 'dark' ? '#171717' : '#ffffff',
            color: mode === 'dark' ? '#f3f4f6' : '#111827',
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                {/* Spinner uses theme primary color */}
                <div
                    className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2"
                    style={{ borderColor: primaryColor || (mode === 'dark' ? '#ffffff' : '#000000') }}
                ></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto py-8 px-4 text-center">
                <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 p-4 rounded-xl border border-red-100 dark:border-red-900/30 inline-block">
                    <p className="font-medium">{error}</p>
                    <button onClick={() => window.location.reload()} className="mt-3 text-sm font-semibold underline hover:text-red-900 dark:hover:text-red-300">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                    My Orders
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 sm:mt-0">
                    Welcome back, {user?.name || 'User'}
                </p>
            </div>

            <MyOrdersList
                orders={orders}
                onCancelClick={handleCancel}
                onChangeVariationClick={handleChangeVariation}
            />
        </div>
    );
}