"use client";

import React, { useEffect, useState } from 'react';
import api from '@/lib/axios'; 
import dynamic from 'next/dynamic';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Import our sub-components
import KPICards from '../_components/KPICards';
import ActionableTables from '../_components/ActionableTables';

// Dynamically import the 3D card so it doesn't break Server-Side Rendering (SSR)
const WelcomeCard3D = dynamic(() => import('../_components/WelcomeCard3D'), { 
  ssr: false,
  loading: () => (
    <div className="h-64 w-full rounded-2xl bg-primary/10 animate-pulse flex items-center justify-center text-primary font-bold shadow-sm">
      Initializing 3D Engine...
    </div>
  )
});

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Track the selected timeframe (default is 30 days)
  const [days, setDays] = useState(30);

  useEffect(() => {
    const fetchDashboardData = async () => {
      // Only show the full-page loader on the very first load
      if (!data) setLoading(true); 
      
      try {
        // Fetch real data from your backend based on the selected 'days'
        const res = await api.get(`/stats/dashboard?days=${days}`); 
        setData(res.data.data);
        setError('');
      } catch (err) {
        setError('Failed to load dashboard data. Ensure backend is running.');
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [days, data]); 

  // --- Initial Loading State ---
  if (loading && !data) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="bg-red-500/10 text-red-500 p-6 rounded-2xl border border-red-500/20 text-center max-w-md">
          <p className="font-bold text-lg mb-2">Oops!</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 transition-colors duration-300 animate-in fade-in slide-in-from-bottom-4">
      
      {/* Row 1: 3D Greeting Card */}
      <WelcomeCard3D />

      {/* Row 2: Real KPIs (Passed from backend) */}
      <KPICards kpis={data?.kpis} />

      {/* Row 3: Revenue Chart with Dynamic Filter */}
      <div className="bg-card p-6 rounded-2xl border border-border shadow-sm transition-colors duration-300">
        
        {/* Header Flexbox with Title and Select Dropdown */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h3 className="text-xl font-black text-foreground">
            Revenue Overview
          </h3>
          
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
        
        {/* Fixed sizing wrapper to prevent Recharts height crash */}
        <div className="w-full h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data?.chartData || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-muted-foreground/20" />
              
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                dy={10} 
                fontSize={12} 
                stroke="currentColor"
                className="text-muted-foreground font-medium"
                minTickGap={30} 
              />
              
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                fontSize={12} 
                stroke="currentColor"
                className="text-muted-foreground font-medium"
                tickFormatter={(val) => `৳${val}`} // Using BDT symbol
                width={65} 
              />
              
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  borderColor: 'var(--border)', 
                  color: 'var(--foreground)',
                  borderRadius: '12px', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  fontWeight: 'bold'
                }} 
                itemStyle={{ color: 'var(--primary)' }}
                // FIX: Changed value type to `any` and wrapped in Number()
                formatter={(value: any) => [`BDT ${Number(value).toFixed(2)}`, 'Revenue']}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="var(--primary)" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorRev)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}