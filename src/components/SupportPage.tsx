import React from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Heart, ExternalLink, Wind, PhoneCall, Info, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

export default function SupportPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <section className="mt-8 mb-16 text-center md:text-left">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl md:text-6xl font-extrabold tracking-tighter text-primary leading-[1.1] mb-6"
        >
          You don’t have to figure it out alone
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-charcoal/60 leading-relaxed max-w-2xl font-medium"
        >
          Whether you're feeling overwhelmed or just need a moment of clarity, we're here to connect you with professional guidance. <span className="text-teal font-bold">You got this.</span>
        </motion.p>
      </section>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Talk to Someone Card */}
        <SupportCard 
          title="Talk to Someone"
          description="Connect directly with campus counseling services for a confidential conversation."
          icon={<MessageSquare size={48} className="text-teal/20 group-hover:text-teal/40 transition-colors" />}
          actionText="Official Counseling"
          actionIcon={<ExternalLink size={14} />}
          variant="light"
        />

        {/* Take a Quick Reset Card */}
        <SupportCard 
          title="Take a Quick Reset"
          description="Access immediate breathing exercises and mindfulness tools to center yourself right now."
          icon={<Wind size={48} className="text-white/20 group-hover:text-white/40 transition-colors" />}
          actionText="Begin Reset"
          variant="dark"
        />
      </div>

      {/* Primary CTA Area */}
      <section className="bg-primary rounded-[2rem] p-10 text-center relative overflow-hidden shadow-2xl shadow-primary/20">
        <div className="absolute inset-0 opacity-20 pointer-events-none academic-gradient-maroon"></div>
        <div className="relative z-10">
          <h4 className="text-white text-3xl font-bold mb-4">Need immediate assistance?</h4>
          <p className="text-white/70 mb-8 max-w-xl mx-auto font-medium text-lg">
            Our support team and campus resources are available to ensure you have the tools you need to thrive.
          </p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-primary px-10 py-4 rounded-2xl font-extrabold text-lg tracking-tight hover:shadow-xl transition-all"
          >
            Get Support Now
          </motion.button>
        </div>
      </section>

      {/* Disclaimer */}
      <footer className="mt-20 text-center pb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface-low rounded-full mb-4">
          <Info size={14} className="text-charcoal/40" />
          <span className="text-[10px] font-bold tracking-[0.2em] text-charcoal/40 uppercase">Disclaimer: This is not a clinical service</span>
        </div>
        <p className="text-xs text-charcoal/40 max-w-md mx-auto leading-relaxed">
          ROAR AI provides resource navigation and general support. For medical or psychiatric emergencies, please contact emergency services immediately.
        </p>
      </footer>
    </div>
  );
}

function SupportCard({ title, description, icon, actionText, actionIcon, variant }: { title: string; description: string; icon: React.ReactNode; actionText: string; actionIcon?: React.ReactNode; variant: 'light' | 'dark' }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={cn(
        "group relative overflow-hidden rounded-3xl p-8 transition-all flex flex-col justify-between min-h-[320px] shadow-sm",
        variant === 'light' ? "bg-surface-lowest border border-surface-highest/30" : "bg-charcoal text-white"
      )}
    >
      <div className="absolute top-0 right-0 p-8">
        {icon}
      </div>
      <div>
        <h3 className="text-3xl font-bold mb-3 tracking-tight">{title}</h3>
        <p className={cn("leading-relaxed text-lg", variant === 'light' ? "text-charcoal/60" : "text-white/60")}>
          {description}
        </p>
      </div>
      <div className="mt-8">
        <button className={cn(
          "px-8 py-4 rounded-xl font-bold tracking-tight transition-all flex items-center gap-2 shadow-lg",
          variant === 'light' 
            ? "bg-teal text-white hover:brightness-110 shadow-teal/20" 
            : "bg-surface-highest text-charcoal hover:bg-white shadow-black/10"
        )}>
          {actionText}
          {actionIcon}
        </button>
      </div>
    </motion.div>
  );
}
