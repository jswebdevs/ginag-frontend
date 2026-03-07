"use client";

import React, { useEffect, useState } from 'react';
import api from '@/lib/axios';
import dynamic from 'next/dynamic';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Reusing these shared components
import KPICards from './_components/KPICards';
import ActionableTables from './_components/ActionableTables';

const WelcomeCard3D = dynamic(() => import('./_components/WelcomeCard3D'), {
    ssr: false,
    loading: () => (
        <div className="h-64 w-full rounded-2xl bg-primary/10 animate-pulse flex items-center justify-center text-primary font-bold shadow-sm">
            Initializing Admin Hub...
        </div>
    )
});

export default function AdminDashboardPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [days, setDays] = useState(30);

    useEffect(() => {
        const fetchAdminData = async () => {
            if (!data) setLoading(true);

            try {
                // Admins fetch restricted overview and chart data
                const [overviewRes, chartRes, ordersRes] = await Promise.all([
                    api.get('/analytics/overview'),
                    api.get(`/analytics/chart-data?days=${days}`),
                    api.get('/orders/all?limit=5')
                ]);

                const formattedChartData = chartRes.data.data.map((stat: any) => ({
                    name: new Date(stat.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    revenue: Number(stat.totalRevenue)
                }));

                setData({
                    kpis: overviewRes.data.data,
                    chartData: formattedChartData,
                    actionables: {
                        recentOrders: ordersRes.data.data
                    }
                });
                setError('');
            } catch (err) {
                setError('Connection to admin analytics lost. Please refresh.');
                console.error("Admin Dashboard fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, [days]);

    if (loading && !data) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) return <div className="p-8 text-destructive bg-destructive/10 rounded-xl font-bold">{error}</div>;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* 3D Visual Header */}
            <WelcomeCard3D />

            {/* Sales Stats Overview */}
            <KPICards kpis={data?.kpis} />

            {/* Revenue Graph with Mobile Support */}
            <div className="bg-card p-4 md:p-6 rounded-3xl border border-border shadow-theme-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h3 className="text-xl font-black text-foreground tracking-tight">Performance Chart</h3>
                        <p className="text-xs text-muted-foreground">Revenue generated across the store.</p>
                    </div>
                    <select
                        value={days}
                        onChange={(e) => setDays(Number(e.target.value))}
                        className="w-full sm:w-auto bg-background border border-border text-foreground font-bold text-xs rounded-xl p-2.5 outline-none cursor-pointer hover:border-primary transition-all shadow-sm"
                    >
                        <option value={7}>Week View</option>
                        <option value={30}>Month View</option>
                        <option value={90}>Quarter View</option>
                    </select>
                </div>

                <div className="w-full h-[300px] md:h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data?.chartData || []}>
                            <defs>
                                <linearGradient id="adminColorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-muted-foreground/10" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                dy={10}
                                fontSize={10}
                                className="text-muted-foreground font-bold"
                                minTickGap={20}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                fontSize={10}
                                className="text-muted-foreground font-bold"
                                tickFormatter={(val) => `৳${val}`}
                                width={50}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--card)',
                                    borderColor: 'var(--border)',
                                    borderRadius: '16px',
                                    fontSize: '12px',
                                    boxShadow: 'var(--shadow-lg)'
                                }}
                                itemStyle={{ color: 'var(--primary)', fontWeight: '900' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="var(--primary)"
                                strokeWidth={4}
                                fillOpacity={1}
                                fill="url(#adminColorRev)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Task List / Recent Orders */}
            <ActionableTables actionables={data?.actionables} />
        </div>
    );
}
