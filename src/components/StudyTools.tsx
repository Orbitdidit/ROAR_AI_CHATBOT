import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Layers, ArrowLeft, ArrowRight, Info, RotateCw, Check, ChevronRight, FileText, BookOpen, Sparkles, Zap, CheckCircle } from 'lucide-react';
import { cn } from '../lib/utils';

export default function StudyTools() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Header */}
      <section className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-teal font-bold tracking-widest text-xs uppercase mb-2 block">Personalized Academic Assistant</span>
            <h2 className="text-5xl font-extrabold tracking-tighter leading-tight">Study smarter</h2>
            <p className="text-charcoal/60 max-w-md mt-4 text-lg leading-relaxed">
              Leverage generative intelligence to condense complex research into interactive mastery tools.
            </p>
          </div>
          <div className="flex gap-3">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all"
            >
              <Plus size={18} />
              Generate New
            </motion.button>
          </div>
        </div>
      </section>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Flashcard Generator */}
        <div className="md:col-span-7 bg-surface-lowest rounded-3xl p-8 flex flex-col relative overflow-hidden group border border-surface-highest/30 shadow-sm">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
          
          <div className="flex justify-between items-start mb-10 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Zap size={20} className="text-teal" />
                <h3 className="font-bold text-xl tracking-tight">Flashcard Generator</h3>
              </div>
              <p className="text-sm text-charcoal/40">32 cards generated from 'Cognitive Psychology Vol. 1'</p>
            </div>
            <button className="text-teal font-bold text-xs uppercase tracking-widest hover:underline">View All</button>
          </div>

          {/* Flashcard UI */}
          <div className="flex-1 flex flex-col items-center justify-center py-6 relative z-10">
            <motion.div 
              className="w-full max-w-md aspect-[4/3] relative cursor-pointer perspective-1000"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                className="w-full h-full relative preserve-3d"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Front */}
                <div className="absolute inset-0 backface-hidden bg-surface rounded-2xl shadow-md border border-teal/10 flex flex-col items-center justify-center p-10 text-center">
                  <div className="absolute top-4 right-4 opacity-30">
                    <Info size={16} />
                  </div>
                  <h4 className="text-3xl font-extrabold text-primary mb-4">Neuroplasticity</h4>
                  <div className="absolute bottom-6 flex items-center gap-2 text-teal/60 text-[10px] font-bold uppercase tracking-widest">
                    <RotateCw size={12} />
                    Click to reveal definition
                  </div>
                </div>

                {/* Back */}
                <div 
                  className="absolute inset-0 backface-hidden bg-teal text-white rounded-2xl shadow-md flex flex-col items-center justify-center p-10 text-center"
                  style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
                >
                  <p className="text-lg font-medium leading-relaxed">
                    The ability of the brain to form and reorganize synaptic connections, especially in response to learning or experience.
                  </p>
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"
                  ></motion.div>
                </div>
              </motion.div>
            </motion.div>

            <div className="flex gap-4 mt-8">
              <button className="w-12 h-12 rounded-full flex items-center justify-center bg-surface-low text-charcoal hover:bg-surface-highest transition-colors">
                <ArrowLeft size={20} />
              </button>
              <div className="flex items-center gap-2 px-4 bg-surface-low rounded-full text-xs font-bold text-charcoal/60">
                04 <span className="opacity-30">/</span> 32
              </div>
              <button className="w-12 h-12 rounded-full flex items-center justify-center bg-teal text-white hover:bg-teal/90 transition-colors shadow-lg shadow-teal/20">
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Quiz Generator */}
        <div className="md:col-span-5 flex flex-col gap-6">
          <div className="bg-charcoal rounded-3xl p-8 text-white flex flex-col justify-between h-1/2 relative overflow-hidden shadow-xl">
            <div className="relative z-10">
              <span className="bg-teal px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider mb-4 inline-block">Active Quiz</span>
              <h3 className="text-2xl font-bold tracking-tight mb-2">Quiz Generator</h3>
              <p className="text-white/60 text-sm">Deep learning assessment: Architecture of Neural Networks</p>
            </div>
            <div className="mt-6 flex items-center justify-between relative z-10">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-charcoal bg-teal flex items-center justify-center text-[10px] font-bold">12</div>
                <div className="w-8 h-8 rounded-full border-2 border-charcoal bg-surface-highest flex items-center justify-center text-[10px] font-bold text-charcoal">Q</div>
              </div>
              <button className="bg-white text-charcoal px-5 py-2.5 rounded-xl font-extrabold text-sm hover:bg-surface-low transition-all">Resume Quiz</button>
            </div>
            <div className="absolute bottom-0 right-0 w-48 h-48 opacity-10 pointer-events-none translate-x-12 translate-y-12">
              <Sparkles size={120} />
            </div>
          </div>

          {/* Upcoming Goals */}
          <div className="bg-surface-low rounded-3xl p-8 flex-1 flex flex-col justify-between border border-surface-highest/30">
            <h4 className="font-bold text-charcoal mb-6">Upcoming Goals</h4>
            <div className="space-y-4">
              <GoalItem icon={<FileText size={18} />} title="Ethics in AI Paper" status="Summary Ready" />
              <GoalItem icon={<BookOpen size={18} />} title="Quantum Mechanics" status="Quiz Pending" />
            </div>
          </div>
        </div>

        {/* Practice Session */}
        <div className="md:col-span-12 bg-surface-low rounded-3xl p-8 border border-surface-highest/30">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/3">
              <h3 className="text-2xl font-extrabold tracking-tight mb-2">Practice Session</h3>
              <p className="text-charcoal/60 text-sm mb-6">Subject: Advanced Macroeconomics</p>
              
              <div className="bg-surface-lowest p-6 rounded-2xl border border-teal/5 shadow-sm">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-teal mb-2">
                  <span>Session Mastery</span>
                  <span>82%</span>
                </div>
                <div className="w-full h-2 bg-surface-highest rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '82%' }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-teal"
                  ></motion.div>
                </div>
                <div className="mt-6 flex items-center gap-2 text-teal">
                  <CheckCircle size={16} />
                  <span className="text-xs font-bold">Success Glow Active: +5% Efficiency</span>
                </div>
              </div>
            </div>

            <div className="md:w-2/3">
              <div className="p-8 rounded-2xl bg-surface-lowest border-l-4 border-teal shadow-sm">
                <h5 className="font-bold text-xl mb-6 leading-snug">Which of the following best describes the 'Liquidity Trap' in Keynesian economics?</h5>
                <div className="space-y-3">
                  <QuizOption text="A scenario where monetary policy becomes ineffective as interest rates approach zero." />
                  <QuizOption text="An oversupply of liquid assets leads to rapid hyperinflation." />
                  <QuizOption text="The preference for cash over interest-bearing assets despite rising rates." selected />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Glow Feedback */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-24 right-8 pointer-events-none z-40"
      >
        <div className="bg-teal/10 border border-teal/20 backdrop-blur-md px-4 py-3 rounded-2xl flex items-center gap-3 shadow-xl">
          <div className="w-2 h-2 rounded-full bg-teal animate-pulse shadow-[0_0_10px_rgba(49,118,115,0.5)]"></div>
          <span className="text-xs font-bold text-teal uppercase tracking-tight">Intelligence Engine Synced</span>
        </div>
      </motion.div>
    </div>
  );
}

function GoalItem({ icon, title, status }: { icon: React.ReactNode; title: string; status: string }) {
  return (
    <div className="flex items-center gap-4 group cursor-pointer">
      <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center text-teal group-hover:bg-teal group-hover:text-white transition-all">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold">{title}</p>
        <p className="text-[10px] text-charcoal/40 uppercase tracking-widest font-bold">{status}</p>
      </div>
      <ChevronRight size={16} className="text-charcoal/20 group-hover:text-teal transition-colors" />
    </div>
  );
}

function QuizOption({ text, selected }: { text: string; selected?: boolean }) {
  return (
    <button className={cn(
      "w-full text-left p-4 rounded-xl transition-all text-sm font-medium flex justify-between items-center group",
      selected 
        ? "bg-teal/10 border border-teal/20 text-teal font-bold" 
        : "bg-surface-low hover:bg-teal/5 hover:border-teal/20 border border-transparent"
    )}>
      <span>{text}</span>
      <div className={cn(
        "w-5 h-5 rounded-full flex items-center justify-center transition-all",
        selected ? "bg-teal" : "border border-charcoal/20 group-hover:border-teal"
      )}>
        {selected && <Check size={12} className="text-white" />}
      </div>
    </button>
  );
}
