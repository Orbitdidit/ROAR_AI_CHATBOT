import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, BookOpen, LifeBuoy, ShieldCheck, Settings, Send, Paperclip, 
  ChevronRight, TrendingUp, TrendingDown, CheckCircle2, Play, Edit3, Menu, 
  Activity, Database, ShieldAlert, Wrench, RefreshCw, UserCircle, Shield, 
  Sparkles, RotateCw 
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Screen, UserProfile, UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeScreen: Screen;
  setActiveScreen: (screen: Screen) => void;
  userProfile?: UserProfile | null;
  isUploading?: boolean;
  uploadProgress?: number;
  onResetDemo: () => void;
  onWithdrawConsent: () => void;
  onSwitchRole: (role: UserRole) => void;
}

export default function Layout({ 
  children, 
  activeScreen, 
  setActiveScreen, 
  userProfile, 
  isUploading, 
  uploadProgress, 
  onResetDemo, 
  onWithdrawConsent, 
  onSwitchRole 
}: LayoutProps) {
  const isAdmin = userProfile?.role && ['faculty', 'admin', 'staff'].includes(userProfile.role);
  const [showDemoMenu, setShowDemoMenu] = React.useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-surface overflow-x-hidden">
      {/* Uploading State Overlay Global */}
      <AnimatePresence>
        {isUploading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-charcoal/40 backdrop-blur-md z-[1000] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[3rem] p-12 max-w-md w-full shadow-2xl text-center"
            >
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <RotateCw size={40} className="text-primary animate-spin" />
              </div>
              <h3 className="text-2xl font-black tracking-tight mb-2">Analyzing Material</h3>
              <p className="text-charcoal/40 font-bold mb-8">
                ROAR AI is synchronizing with your study materials.
              </p>
              
              <div className="w-full h-2 bg-surface-low rounded-full overflow-hidden mb-4">
                <motion.div 
                  className="h-full bg-primary"
                  animate={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary">
                {uploadProgress}% Complete
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Bar */}
      <header className="fixed top-0 w-full z-50 neo-glass border-b border-surface-highest/20 px-6 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl bg-primary p-2 flex items-center justify-center cursor-pointer transition-transform active:scale-95 shadow-md shadow-primary/20"
            onClick={() => setActiveScreen('chat')}
          >
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black text-charcoal leading-none font-display uppercase tracking-tight">ROAR AI</span>
            <span className="text-[9px] font-bold text-charcoal/40 uppercase tracking-widest whitespace-nowrap mt-1">
              Texas Southern University
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end mr-2">
            <span className="text-[9px] font-black text-charcoal/40 uppercase tracking-widest leading-none">
              {isAdmin ? 'Faculty Portal' : 'Student Hub'}
            </span>
            <span className="text-xs font-black text-charcoal leading-tight font-display">{userProfile?.firstName} {userProfile?.lastName}</span>
          </div>
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-surface-low border border-surface-highest p-0.5 flex items-center justify-center">
            <div className="w-full h-full rounded-[lg] bg-primary/10 flex items-center justify-center text-primary">
              <UserCircle size={24} />
            </div>
          </div>
          <button 
            onClick={() => setShowDemoMenu(!showDemoMenu)}
            className={cn(
              "p-2 rounded-xl transition-all active:scale-90 border border-transparent",
              showDemoMenu ? "bg-primary text-white" : "hover:bg-surface-low text-charcoal/60"
            )}
          >
            <Settings size={20} />
          </button>
        </div>

        {/* Discreet Demo Menu */}
        <AnimatePresence>
          {showDemoMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="absolute top-full right-6 mt-4 w-64 bg-white rounded-3xl shadow-2xl border border-surface-highest p-4 z-[60]"
            >
              <div className="mb-4 pb-4 border-b border-surface-highest">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Presenter Controls</h4>
                <p className="text-[10px] font-bold text-charcoal/40">Demo Mode: Live Pilot Preview</p>
              </div>

              <div className="space-y-2">
                <button 
                  onClick={() => { onResetDemo(); setShowDemoMenu(false); }}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-red-50 text-red-500 transition-colors text-left"
                >
                  <RefreshCw size={16} />
                  <span className="text-xs font-bold">Reset to First Run</span>
                </button>
                
                <button 
                  onClick={() => { onWithdrawConsent(); setShowDemoMenu(false); }}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-orange-50 text-orange-600 transition-colors text-left"
                >
                  <ShieldAlert size={16} />
                  <span className="text-xs font-bold">Withdraw Consent</span>
                </button>

                <div className="py-2 px-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-charcoal/20">Quick Switch Role</span>
                </div>

                <button 
                  onClick={() => { onSwitchRole('student'); setShowDemoMenu(false); }}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-2xl transition-colors text-left",
                    userProfile?.role === 'student' ? "bg-primary/10 text-primary" : "hover:bg-surface-low text-charcoal/60"
                  )}
                >
                  <UserCircle size={16} />
                  <span className="text-xs font-bold">Switch to Student</span>
                </button>

                <button 
                  onClick={() => { onSwitchRole('faculty'); setShowDemoMenu(false); }}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-2xl transition-colors text-left",
                    isAdmin ? "bg-teal/10 text-teal" : "hover:bg-surface-low text-charcoal/60"
                  )}
                >
                  <Shield size={16} />
                  <span className="text-xs font-bold">Switch to Faculty</span>
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-surface-highest">
                <p className="text-[8px] font-bold text-charcoal/20 text-center uppercase tracking-widest">
                  Changes apply only to local session
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
      <nav className="fixed bottom-0 left-0 w-full z-50 px-4 pb-8 pt-4 bg-white/90 backdrop-blur-2xl border-t border-surface-highest/20 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
        <div className="max-w-md mx-auto flex justify-between items-center px-4">
          {(!userProfile?.firstName) && (
            <NavButton 
              active={activeScreen === 'welcome'} 
              onClick={() => setActiveScreen('welcome')}
              icon={<Sparkles size={20} />}
              label="Intro"
            />
          )}
          <NavButton 
            active={activeScreen === 'chat'} 
            onClick={() => setActiveScreen('chat')}
            icon={<MessageSquare size={20} />}
            label="Home"
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
          {isAdmin && (
            <NavButton 
              active={activeScreen === 'admin'} 
              onClick={() => setActiveScreen('admin')}
              icon={<ShieldCheck size={20} />}
              label="Admin"
            />
          )}
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
        "flex flex-col items-center justify-center px-4 py-1 transition-all duration-300 rounded-2xl relative group",
        active ? "text-primary scale-110" : "text-charcoal/40 hover:text-charcoal"
      )}
    >
      <div
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center transition-all mb-1",
          active ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-transparent group-hover:bg-surface-low"
        )}
      >
        {icon}
      </div>
      <span className={cn("text-[9px] font-black uppercase tracking-widest transition-opacity", active ? "opacity-100" : "opacity-40")}>{label}</span>
      {active && (
        <motion.div 
          layoutId="active-indicator"
          className="absolute -bottom-2 w-1.5 h-1.5 rounded-full bg-primary"
        />
      )}
    </button>
  );
}
