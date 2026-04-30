"use client";

import React, { useEffect, useState } from 'react';
import api from '@/lib/axios';
import dynamic from 'next/dynamic';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import KPICards from './_components/KPICards';
import ActionableTables from './_components/ActionableTables';

const WelcomeCard3D = dynamic(() => import('./_components/WelcomeCard3D'), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full rounded-2xl bg-primary/10 animate-pulse flex items-center justify-center text-primary font-bold shadow-sm">
      Initializing 3D Engine...
    </div>
  )
});

export default function SuperadminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [days, setDays] = useState(30);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!data) setLoading(true);

      try {
        // Fetch from routes concurrently. 
        // Note: Adjusted the order route to match your Express router setup
        const [overviewRes, chartRes, ordersRes] = await Promise.all([
          api.get('/analytics/overview'),
          api.get(`/analytics/chart-data?days=${days}`),
          api.get('/orders/all?limit=5')
        ]);

        // Format the chart data to match what Recharts expects
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
        setError('Failed to load dashboard data. Ensure backend is running.');
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [days]); // Trigger fetch only when 'days' filter changes

  if (loading && !data) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) return <div className="p-8 text-destructive bg-destructive/10 rounded-xl font-bold">{error}</div>;

  return (
    <div className="space-y-6 transition-colors duration-300 animate-in fade-in slide-in-from-bottom-4">
      <WelcomeCard3D />

      {/* Passes the exact numeric overview data */}
      <KPICards kpis={data?.kpis} />

      <div className="bg-card p-6 rounded-2xl border border-border shadow-sm transition-colors duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h3 className="text-xl font-black text-foreground">Revenue Overview</h3>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="bg-background border border-border text-foreground font-semibold text-sm rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary p-2.5 outline-none cursor-pointer transition-colors"
          >
            <option value={7}>Last 7 Days</option>
            <option value={30}>Last 30 Days</option>
            <option value={100}>Last 100 Days</option>
          </select>
        </div>

        <div className="w-full h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data?.chartData || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-muted-foreground/20" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} dy={10} fontSize={12} stroke="currentColor" className="text-muted-foreground font-medium" minTickGap={30} />
              <YAxis axisLine={false} tickLine={false} fontSize={12} stroke="currentColor" className="text-muted-foreground font-medium" tickFormatter={(val) => `৳${val}`} width={65} />
              <Tooltip
                contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                itemStyle={{ color: 'var(--primary)' }}
                formatter={(value: any) => [`৳${Number(value).toLocaleString()}`, 'Exact Revenue']}
              />
              <Area type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <ActionableTables actionables={data?.actionables} />
    </div>
  );
}