import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Paperclip, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

const SUGGESTED_PROMPTS = [
  "Help me study",
  "Quiz me",
  "Simplify this",
  "Cite sources"
];

export default function ChatScreen() {
  const [input, setInput] = useState('');

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full mb-4">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Active Session</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">ROAR AI Chatbot</h2>
        <p className="text-charcoal/60 font-medium leading-relaxed max-w-lg">
          Supportive, student-friendly assistant. Ready for your deep focus session.
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-8 mb-32 overflow-y-auto no-scrollbar pr-2">
        <ChatMessage 
          role="assistant" 
          content="Welcome back. I've curated your study materials for the Midterms. Ready to crush this session?"
          footer={<span className="text-3xl font-extrabold tracking-tighter text-primary">Let's lock in</span>}
        />
        
        <ChatMessage 
          role="user" 
          content="Definitely. Can you summarize the key concepts for the Advanced Algorithms lecture from yesterday?"
        />

        <ChatMessage 
          role="assistant" 
          content="Analyzing lecture transcript... I've highlighted three core pillars for your review:"
          extra={
            <div className="grid gap-3 mt-4">
              <PillarCard number="01" title="Dynamic Programming Optimization" />
              <PillarCard number="02" title="Heuristic Search Techniques" />
            </div>
          }
        />

        {/* Typing Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-charcoal/40 text-xs font-bold uppercase tracking-widest ml-1"
        >
          <div className="flex gap-1">
            <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1 h-1 bg-charcoal/40 rounded-full"></motion.span>
            <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1 h-1 bg-charcoal/40 rounded-full"></motion.span>
            <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1 h-1 bg-charcoal/40 rounded-full"></motion.span>
          </div>
          ROAR is thinking
        </motion.div>
      </div>

      {/* Input Area */}
      <div className="fixed bottom-24 left-0 w-full px-6 md:px-0">
        <div className="max-w-4xl mx-auto">
          {/* Suggested Prompts */}
          <div className="flex flex-wrap gap-2 mb-4">
            {SUGGESTED_PROMPTS.map((prompt, i) => (
              <motion.button
                key={prompt}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-surface-lowest border border-surface-highest/50 rounded-full text-xs font-bold text-primary shadow-sm hover:shadow-md transition-all"
              >
                {prompt}
              </motion.button>
            ))}
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-primary/5 blur-2xl rounded-3xl group-focus-within:bg-primary/10 transition-all"></div>
            <div className="relative flex items-center bg-surface-lowest/80 backdrop-blur-xl p-2 rounded-2xl border border-surface-highest/30 shadow-xl">
              <button className="p-3 text-charcoal/40 hover:text-primary transition-colors">
                <Paperclip size={20} />
              </button>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question..." 
                className="flex-1 bg-transparent border-none focus:ring-0 px-4 text-charcoal font-medium placeholder:text-charcoal/30"
              />
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:academic-gradient-maroon transition-all"
              >
                <span className="hidden sm:block">Send</span>
                <Send size={18} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatMessage({ role, content, footer, extra }: { role: 'assistant' | 'user'; content: string; footer?: React.ReactNode; extra?: React.ReactNode }) {
  const isAssistant = role === 'assistant';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col gap-2 max-w-[85%]",
        isAssistant ? "mr-auto" : "ml-auto items-end"
      )}
    >
      <div className={cn("flex items-center gap-2", isAssistant ? "ml-1" : "mr-1")}>
        <span className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest">
          {isAssistant ? "ROAR Assistant" : "You"}
        </span>
      </div>
      <div className={cn(
        "p-6 rounded-2xl shadow-sm",
        isAssistant 
          ? "bg-charcoal text-white rounded-tl-none" 
          : "bg-primary text-white rounded-tr-none shadow-primary/10"
      )}>
        <p className="text-lg font-medium leading-relaxed">{content}</p>
        {footer && <div className="mt-4">{footer}</div>}
        {extra}
      </div>
    </motion.div>
  );
}

function PillarCard({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
      <div className="w-10 h-10 rounded-lg bg-teal/20 flex items-center justify-center text-teal group-hover:bg-teal group-hover:text-white transition-all">
        <Sparkles size={18} />
      </div>
      <div>
        <div className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Pillar {number}</div>
        <div className="font-bold tracking-tight">{title}</div>
      </div>
    </div>
  );
}
