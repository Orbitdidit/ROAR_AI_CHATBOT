import React from 'react';
import { motion } from 'motion/react';
import { BookMarked, FileText, Quote, Search, Sparkles, Wand2, Zap, ArrowRight, Clock, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';

export default function ToolsScreen() {
  return (
    <div className="max-w-7xl mx-auto pb-20">
      {/* Header Section */}
      <section className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal/10 rounded-full mb-4 border border-teal/20">
          <Sparkles size={12} className="text-teal" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal">Academic Utility Belt</span>
        </div>
        <h2 className="text-5xl font-extrabold tracking-tighter text-charcoal mb-4">Precision tools for focus</h2>
        <p className="text-charcoal/60 max-w-xl text-lg font-medium leading-relaxed">
          Enhance your workflow with AI-driven utilities designed specifically for TSU academic excellence.
        </p>
      </section>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ToolCard 
          icon={<Quote size={24} />}
          title="Instant Citations"
          description="Generate perfect APA, MLA, or Chicago citations from any URL or PDF snippet instantly."
          color="bg-primary"
          badge="Most Popular"
        />
        <ToolCard 
          icon={<FileText size={24} />}
          title="Note Simplifier"
          description="Convert dense lecture transcripts into structured, easy-to-read executive summaries."
          color="bg-teal"
        />
        <ToolCard 
          icon={<BookMarked size={24} />}
          title="Research Navigator"
          description="Locate relevant academic journals and peer-reviewed sources for your current topic."
          color="bg-charcoal"
        />
        <ToolCard 
          icon={<Wand2 size={24} />}
          title="Grammar polisher"
          description="Elevate your academic tone and fix complex structural errors with university-level logic."
          color="bg-primary/80"
        />
        <ToolCard 
          icon={<Search size={24} />}
          title="Source Verifier"
          description="Fact-check claims and cross-reference information across trusted university databases."
          color="bg-teal/80"
        />
        <ToolCard 
          icon={<Zap size={24} />}
          title="Concept Explainer"
          description="Enter a complex term and get three levels of explanation: Simple, Standard, and Deep Dive."
          color="bg-charcoal/80"
          badge="Beta"
        />
      </div>

      {/* Feature Highlight */}
      <section className="mt-16 bg-surface-lowest rounded-[2.5rem] border border-surface-highest/30 overflow-hidden shadow-sm flex flex-col md:flex-row items-stretch">
        <div className="flex-1 p-10 md:p-14">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-6">
            <Clock size={16} />
            Efficiency Booster
          </div>
          <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6">Automate the busy work, <br /><span className="text-primary">focus on the thinking.</span></h3>
          <p className="text-charcoal/60 text-lg mb-8 max-w-md font-medium leading-relaxed">
            Current ROAR Pilot tools are optimized for TSU curriculum standards, ensuring your work meeting institutional high bars.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-charcoal text-white rounded-xl text-sm font-bold shadow-lg">
              <ShieldCheck size={16} className="text-teal" />
              Verified Safe
            </div>
            <div className="text-[10px] uppercase font-bold text-charcoal/40 tracking-widest">
              Standardized by <br /> TSU Faculty
            </div>
          </div>
        </div>
        <div className="md:w-1/3 bg-primary academic-gradient-maroon flex items-center justify-center p-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="grid grid-cols-4 gap-4 rotate-12 -translate-x-10">
              {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} className="w-12 h-12 border border-white rounded-lg"></div>
              ))}
            </div>
          </div>
          <div className="relative z-10 text-center">
            <div className="text-6xl font-black text-white/20 mb-4 tracking-tighter">PILOT</div>
            <div className="text-white font-bold tracking-[0.3em] uppercase text-xs">Pilot Active</div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ToolCard({ icon, title, description, color, badge }: { icon: React.ReactNode; title: string; description: string; color: string; badge?: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-surface-lowest p-8 rounded-3xl border border-surface-highest/30 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between"
    >
      <div>
        <div className="flex justify-between items-start mb-6">
          <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:rotate-6", color)}>
            {icon}
          </div>
          {badge && (
            <span className="bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-primary/20">
              {badge}
            </span>
          )}
        </div>
        <h4 className="text-xl font-bold tracking-tight mb-3 group-hover:text-primary transition-colors">{title}</h4>
        <p className="text-charcoal/60 text-sm leading-relaxed font-medium mb-6">
          {description}
        </p>
      </div>
      <button className="flex items-center gap-2 text-xs font-bold text-charcoal hover:text-primary transition-all uppercase tracking-widest group/btn">
        Launch Tool
        <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
      </button>
    </motion.div>
  );
}
