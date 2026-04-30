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

export default function ProductManagerDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [days, setDays] = useState(30);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!data) setLoading(true);

      try {
        // Fetch from routes concurrently. 
        const [overviewRes, productsRes] = await Promise.all([
          api.get('/analytics/overview'),
          api.get('/products?limit=5')
        ]);

        setData({
          kpis: overviewRes.data.data,
          actionables: {
            recentProducts: productsRes.data.data
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

      <ActionableTables actionables={data?.actionables} />
    </div>
  );
}