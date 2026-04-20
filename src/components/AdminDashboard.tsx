import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Users, BookOpen, MessageSquare, MousePointer2, ShieldCheck, Activity, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { cn } from '../lib/utils';

const DATA = [
  { name: 'Jan', value: 400, prev: 240 },
  { name: 'Feb', value: 300, prev: 139 },
  { name: 'Mar', value: 600, prev: 980 },
  { name: 'Apr', value: 800, prev: 390 },
  { name: 'May', value: 500, prev: 480 },
  { name: 'Jun', value: 900, prev: 380 },
  { name: 'Jul', value: 1100, prev: 430 },
];

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Dashboard Header */}
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tighter mb-2">Institutional Dashboard</h1>
        <p className="text-charcoal/60 font-medium text-lg">Real-time engagement and academic performance oversight.</p>
      </header>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard 
          label="Students Engaged" 
          value="12,482" 
          trend="+14.2%" 
          trendUp={true} 
          icon={<Users size={20} />} 
          primary
        />
        <MetricCard 
          label="Study Sessions" 
          value="45.2k" 
          trend="+8.7%" 
          trendUp={true} 
          icon={<BookOpen size={20} />} 
        />
        <MetricCard 
          label="Support Interactions" 
          value="3,890" 
          trend="-2.1%" 
          trendUp={false} 
          icon={<MessageSquare size={20} />} 
        />
        <MetricCard 
          label="Resource Clicks" 
          value="18.5k" 
          trend="+22.4%" 
          trendUp={true} 
          icon={<MousePointer2 size={20} />} 
        />
      </div>

      {/* Main Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Engagement Chart */}
        <div className="lg:col-span-8 bg-charcoal p-10 rounded-3xl overflow-hidden relative min-h-[450px] shadow-2xl">
          <div className="relative z-10 h-full flex flex-col">
            <div className="flex justify-between items-start mb-12">
              <div>
                <h3 className="text-2xl font-extrabold text-white tracking-tight">Student Engagement Over Time</h3>
                <p className="text-white/40 font-medium">Monthly aggregate of active learning behaviors</p>
              </div>
              <div className="flex gap-6">
                <div className="flex items-center gap-2 text-teal text-[10px] font-bold uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-teal"></span> Current Period
                </div>
                <div className="flex items-center gap-2 text-white/20 text-[10px] font-bold uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-white/20"></span> Previous Year
                </div>
              </div>
            </div>

            <div className="flex-1 w-full min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DATA}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#317673" stopOpacity={1} />
                      <stop offset="100%" stopColor="#317673" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#ffffff40', fontSize: 12, fontWeight: 600 }}
                    dy={10}
                  />
                  <Tooltip 
                    cursor={{ fill: '#ffffff05' }}
                    contentStyle={{ backgroundColor: '#252727', border: 'none', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="value" fill="url(#barGradient)" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-1/2 h-full academic-gradient-maroon opacity-10 blur-3xl rounded-full translate-x-1/4 translate-y-1/4"></div>
        </div>

        {/* Engagement Summary */}
        <div className="lg:col-span-4 bg-teal-soft p-8 rounded-3xl flex flex-col shadow-sm">
          <h3 className="text-2xl font-extrabold text-teal tracking-tight mb-8">Engagement Summary</h3>
          <div className="space-y-8 flex-1">
            <SummaryItem 
              icon={<BookOpen size={20} />} 
              title="Reading Peaks" 
              desc="Students are 3x more active on Tuesday evenings." 
            />
            <SummaryItem 
              icon={<MessageSquare size={20} />} 
              title="Support Speed" 
              desc="AI resolution rates increased by 12% this week." 
            />
          </div>
          <div className="mt-8">
            <button className="w-full py-4 bg-teal text-white font-bold rounded-xl shadow-lg shadow-teal/20 hover:brightness-110 transition-all flex items-center justify-center gap-2">
              <Download size={18} />
              Download Full PDF
            </button>
          </div>
        </div>

        {/* Top Schools */}
        <div className="lg:col-span-6 bg-surface-low p-8 rounded-3xl border border-surface-highest/30">
          <div className="flex justify-between items-center mb-8">
            <h4 className="text-xl font-extrabold tracking-tight">Top Performing Schools</h4>
            <span className="text-[10px] font-bold text-teal uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse"></span>
              Live Updates
            </span>
          </div>
          <div className="space-y-4">
            <SchoolRow name="School of Arts & Sciences" engagement="88%" trend="up" />
            <SchoolRow name="College of Business" engagement="72%" trend="neutral" />
            <SchoolRow name="School of Engineering" engagement="94%" trend="up" />
          </div>
        </div>

        {/* System Status */}
        <div className="lg:col-span-6 bg-surface-low p-8 rounded-3xl border border-surface-highest/30 relative overflow-hidden">
          <h4 className="text-xl font-extrabold tracking-tight mb-8">Admin System Status</h4>
          <div className="grid grid-cols-2 gap-4">
            <StatusTile label="API Uptime" value="99.98%" color="text-teal" />
            <StatusTile label="Inference Latency" value="142ms" color="text-charcoal" />
          </div>
          <div className="mt-8 flex items-center gap-4 p-5 bg-primary/5 rounded-2xl border border-primary/10">
            <ShieldCheck className="text-primary shrink-0" size={24} />
            <p className="text-xs font-semibold text-charcoal/60 leading-relaxed">
              System security scans complete. All academic data encryption protocols are active and verified.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, trend, trendUp, icon, primary }: { label: string; value: string; trend: string; trendUp: boolean; icon: React.ReactNode; primary?: boolean }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={cn(
        "p-8 rounded-3xl shadow-sm flex flex-col justify-between border border-surface-highest/30",
        primary ? "bg-primary text-white" : "bg-surface-lowest"
      )}
    >
      <div>
        <div className={cn("mb-4 opacity-60", primary ? "text-white" : "text-charcoal")}>
          {icon}
        </div>
        <p className={cn("text-[10px] font-bold uppercase tracking-widest mb-2", primary ? "text-white/60" : "text-charcoal/40")}>
          {label}
        </p>
        <h2 className="text-4xl font-extrabold tracking-tighter">{value}</h2>
      </div>
      <div className="flex items-center gap-2 mt-6">
        <div className={cn("flex items-center gap-1 font-bold text-sm", trendUp ? (primary ? "text-teal-soft" : "text-teal") : "text-primary")}>
          {trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {trend}
        </div>
        <span className={cn("text-[10px] font-bold uppercase tracking-widest ml-auto opacity-40")}>vs last month</span>
      </div>
    </motion.div>
  );
}

function SummaryItem({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="bg-teal p-2.5 rounded-xl text-white shadow-md shadow-teal/10">
        {icon}
      </div>
      <div>
        <p className="font-bold text-teal tracking-tight">{title}</p>
        <p className="text-sm text-teal/60 font-medium leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function SchoolRow({ name, engagement, trend }: { name: string; engagement: string; trend: 'up' | 'neutral' }) {
  return (
    <div className="flex items-center justify-between p-5 bg-surface-lowest rounded-2xl border-l-4 border-teal shadow-sm hover:translate-x-1 transition-transform cursor-pointer">
      <span className="font-bold text-charcoal tracking-tight">{name}</span>
      <div className="flex items-center gap-6">
        <span className="text-sm font-extrabold text-teal">{engagement} Engaged</span>
        {trend === 'up' ? <TrendingUp size={18} className="text-teal" /> : <div className="w-[18px] h-[2px] bg-surface-highest" />}
      </div>
    </div>
  );
}

function StatusTile({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-surface-lowest p-6 rounded-2xl text-center shadow-sm border border-surface-highest/20">
      <p className="text-[10px] uppercase font-bold text-charcoal/30 tracking-widest mb-2">{label}</p>
      <p className={cn("text-3xl font-extrabold tracking-tighter", color)}>{value}</p>
    </div>
  );
}
