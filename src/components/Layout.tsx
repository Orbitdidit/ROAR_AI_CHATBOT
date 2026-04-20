import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, BookOpen, LifeBuoy, ShieldCheck, Settings, Send, Paperclip, ChevronRight, TrendingUp, TrendingDown, CheckCircle2, Play, Edit3, Menu, Activity, Database, ShieldAlert } from 'lucide-react';
import { cn } from '../lib/utils';
import { Screen } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeScreen: Screen;
  setActiveScreen: (screen: Screen) => void;
}

export default function Layout({ children, activeScreen, setActiveScreen }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-surface overflow-x-hidden">
      {/* Top Bar */}
      <header className="fixed top-0 w-full z-50 neo-glass border-b border-surface-highest/30 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-highest ring-2 ring-primary/10">
            <img 
              src="https://picsum.photos/seed/student/100/100" 
              alt="Profile" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <h1 className="text-2xl font-extrabold text-primary tracking-tighter">ROAR AI</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-surface-low transition-colors text-charcoal/60">
            <Settings size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-24 pb-32 max-w-7xl mx-auto w-full px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeScreen}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full z-50 px-4 pb-6 pt-3 bg-surface/80 backdrop-blur-2xl border-t border-surface-highest/30 rounded-t-3xl shadow-[0_-10px_30px_rgba(110,0,0,0.04)]">
        <div className="max-w-lg mx-auto flex justify-around items-center">
          <NavButton 
            active={activeScreen === 'chat'} 
            onClick={() => setActiveScreen('chat')}
            icon={<MessageSquare size={20} />}
            label="Chat"
          />
          <NavButton 
            active={activeScreen === 'study'} 
            onClick={() => setActiveScreen('study')}
            icon={<BookOpen size={20} />}
            label="Study"
          />
          <NavButton 
            active={activeScreen === 'support'} 
            onClick={() => setActiveScreen('support')}
            icon={<LifeBuoy size={20} />}
            label="Support"
          />
          <NavButton 
            active={activeScreen === 'admin'} 
            onClick={() => setActiveScreen('admin')}
            icon={<ShieldCheck size={20} />}
            label="Admin"
          />
        </div>
      </nav>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center px-4 py-1.5 transition-all duration-300 rounded-xl",
        active ? "bg-primary text-white scale-110 shadow-lg" : "text-charcoal/40 hover:text-primary"
      )}
    >
      <motion.div
        animate={active ? { scale: 1.1 } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {icon}
      </motion.div>
      <span className="text-[10px] font-bold uppercase tracking-widest mt-1">{label}</span>
    </button>
  );
}
