"use client";

import React, { useEffect, useState } from 'react';
import { Users, CreditCard, ShoppingBag, TrendingUp, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import api from '@/lib/axios';
import { useCurrency } from '@/context/SettingsContext';


export default function InsightsPage() {
  const { symbol } = useCurrency();
  const [data, setData] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const [overviewRes, chartRes] = await Promise.all([
          api.get('/analytics/overview'),
          api.get('/analytics/chart-data?days=180')
        ]);

        const overview = overviewRes.data.data;
        const rawChartData = chartRes.data.data;

        const avgOrderValue = overview.totalOrders > 0 
          ? overview.totalRevenue / overview.totalOrders 
          : 0;

        const chartDataMap = new Map();

        rawChartData.forEach((item: any) => {
          const dateObj = new Date(item.date);
          const monthStr = dateObj.toLocaleDateString('en-US', { month: 'short' });
          
          if (!chartDataMap.has(monthStr)) {
            chartDataMap.set(monthStr, { month: monthStr, revenue: 0, orders: 0 });
          }
          
          const current = chartDataMap.get(monthStr);
          current.revenue += Number(item.totalRevenue || 0);
          current.orders += Number(item.totalOrders || 0);
        });

        const formattedChartData = Array.from(chartDataMap.values());

        setData({
          kpis: {
            totalRevenue: overview.totalRevenue,
            avgOrderValue,
            totalOrders: overview.totalOrders,
            totalCustomers: overview.totalCustomers
          },
          chartData: formattedChartData
        });
        
      } catch (err) {
        setError('Failed to load insights data.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) return <div className="p-8 text-red-500 bg-background min-h-screen">{error}</div>;

  return (
    <div className="space-y-6 transition-colors duration-300">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Sales Insights</h1>
        <p className="text-muted-foreground mt-1">Analyze your order volume and revenue growth.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Revenue (6m)" 
          value={`${symbol}${data?.kpis?.totalRevenue?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}`} 
          trend="Based on delivered orders" 
          icon={<TrendingUp className="w-6 h-6 text-primary" />} 
          color="bg-primary/10"
        />
        <StatCard 
          title="Avg. Order Value" 
          value={`${symbol}${data?.kpis?.avgOrderValue?.toFixed(2) || '0.00'}`} 
          trend="Per successful transaction" 
          icon={<CreditCard className="w-6 h-6 text-emerald-500" />} 
          color="bg-emerald-500/10"
        />
        <StatCard 
          title="Total Orders (6m)" 
          value={data?.kpis?.totalOrders || '0'} 
          trend="Fully processed" 
          icon={<ShoppingBag className="w-6 h-6 text-blue-500" />} 
          color="bg-blue-500/10"
        />
        <StatCard 
          title="Active Customers" 
          value={data?.kpis?.totalCustomers || '0'} 
          trend="Registered on platform" 
          icon={<Users className="w-6 h-6 text-orange-500" />} 
          color="bg-orange-500/10"
        />
      </div>

      {/* Chart Section using dynamic theme variables */}
      <div className="bg-card p-6 rounded-xl border border-border shadow-sm transition-colors duration-300">
        <h3 className="text-lg font-semibold text-foreground mb-6">Revenue vs Orders (Last 6 Months)</h3>
        
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.chartData || []} margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-muted-foreground/20" />
              
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'currentColor', fontSize: 12 }} 
                className="text-muted-foreground"
                dy={10} 
              />
              
              <YAxis 
                yAxisId="left" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'currentColor', fontSize: 12 }} 
                className="text-muted-foreground"
                tickFormatter={(val) => `${symbol}${val}`}

              />
              
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'currentColor', fontSize: 12 }} 
                className="text-muted-foreground"
              />
              
              <Tooltip 
                cursor={{ fill: 'currentColor', opacity: 0.05 }}
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  borderColor: 'var(--border)', 
                  color: 'var(--foreground)',
                  borderRadius: '8px', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  fontWeight: '500'
                }}
              />
              
              {/* Uses primary color for Revenue */}
              <Bar yAxisId="left" dataKey="revenue" fill="var(--primary)" radius={[4, 4, 0, 0]} name={`Revenue (${symbol})`} />

              
              {/* Uses primary color with 30% opacity for Orders to avoid the missing --secondary black box */}
              <Bar yAxisId="right" dataKey="orders" fill="var(--primary)" fillOpacity={0.3} radius={[4, 4, 0, 0]} name="Total Orders" />
              
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// Fixed StatCard to use bg-card and border-border
function StatCard({ title, value, trend, icon, color }: { title: string, value: string, trend: string, icon: React.ReactNode, color: string }) {
  return (
    <div className="bg-card p-5 rounded-xl border border-border shadow-sm flex flex-col justify-between transition-colors duration-300">
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        <h4 className="text-2xl font-bold text-foreground mt-1">{value}</h4>
        <p className="text-xs text-muted-foreground/80 mt-2">{trend}</p>
      </div>
    </div>
  );
}