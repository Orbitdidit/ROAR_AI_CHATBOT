import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, Sparkles, SendHorizontal, BookOpen, MessageSquare, 
  HelpCircle, Zap, ShieldCheck, Database, Plus, ChevronRight,
  MoreVertical, Info, AlertTriangle, RefreshCcw
} from 'lucide-react';
import { cn, incrementCounter, logROARActivity } from '../lib/utils';
import { UserProfile, Message } from '../types';
import { geminiService } from '../services/geminiService';

const SOURCES = [
  {
    id: 'math-1314-college-algebra',
    name: 'MATH 1314 - College Algebra',
    summary: 'College Algebra covers fundamental concepts including linear equations, quadratic functions, polynomials, and logarithms. Students learn to model real-world scenarios through algebraic expressions and solve complex systems of equations.',
    simplify: 'Think of College Algebra as the rulebook for numbers. It teaches you how to find missing pieces in a puzzle (equations), how to map out paths on a graph (functions), and how to predict how things grow or shrink over time.'
  }
];

const SHORTCUTS = [
  { id: 'study', label: "Help me study for my class", icon: <BookOpen size={16} /> },
  { id: 'simplify', label: "Make this easier to understand", icon: <Zap size={16} /> },
  { id: 'quiz', label: "Quiz me on this topic", icon: <HelpCircle size={16} /> },
  { id: 'summary', label: "Summarize key findings", icon: <Database size={16} /> },
];

const NO_SOURCE_REPLY = "Please add or select study materials first";

interface ChatScreenProps {
  userProfile: UserProfile;
  activeSourceId: string;
  setActiveSourceId: (id: string) => void;
  setActiveScreen: (screen: any) => void;
  setStudyMode: (mode: 'cards' | 'quiz' | null) => void;
}

export default function ChatScreen({ 
  userProfile, 
  activeSourceId, 
  setActiveSourceId, 
  setActiveScreen,
  setStudyMode
}: ChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Welcome to ROAR. I answer using only the study materials your instructor has approved. Pick an active source on the left to get started, or use a shortcut.",
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [errorStatus, setErrorStatus] = useState<'RATE_LIMIT' | 'API_KEY' | 'GENERAL' | null>(null);
  
  const [facultyUploads, setFacultyUploads] = useState<any[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('roar_faculty_uploads');
      if (raw) {
        setFacultyUploads(JSON.parse(raw));
      }
    } catch (e) {}
  }, []);

  const dynamicSources = [
    ...SOURCES,
    ...facultyUploads.map(up => ({
      id: up.id,
      name: `MATH 1314 - ${up.name}`,
      uploader: up.facultyName,
      type: up.materialType,
      desc: up.description,
      summary: `Course Pack: ${up.name}. Material Type: ${up.materialType}. Uploaded by faculty sponsor: ${up.facultyName}. ${up.description ? `Description/Syllabus context: ${up.description}` : 'Algebra reference resource.'}`,
      simplify: `This is a faculty-approved study pack upload named ${up.name} for college algebra. Study this closely.`
    }))
  ];

  const scrollRef = useRef<HTMLDivElement>(null);
  const activeSource = dynamicSources.find(s => s.id === activeSourceId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isThinking]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isThinking) return;

    setErrorStatus(null);
    incrementCounter('promptVolume');
    logROARActivity('SENT_PROMPT');

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);

    try {
      let reply = "";
      const lowerText = text.toLowerCase();
      const SAFETY_KEYWORDS = ["self-harm", "suicide", "kill myself", "harm others", "depressed", "anxious", "therapist", "hurt myself", "want to die", "suicidal", "depression", "anxiety", "clinical advice", "therapy", "mental health"];
      const containsSafetyKeyword = SAFETY_KEYWORDS.some(kw => lowerText.includes(kw));

      if (containsSafetyKeyword) {
        reply = "I cannot provide clinical, medical, or mental health advice. ROAR AI is designed strictly for academic course preparation. If you are experiencing thoughts of self-harm, a mental health emergency, or emotional distress, please contact the 988 Suicide & Crisis Lifeline by calling or texting 988 immediately (available 24/7), or contact the TSU Counseling Center at 713-313-7804.";
      } else if (!activeSourceId) {
        reply = NO_SOURCE_REPLY;
      } else {
        const src = activeSource!;
        const isShortcut = SHORTCUTS.find(s => s.label === text);
        
        let promptText = text;
        if (isShortcut) {
          switch (isShortcut.id) {
            case 'study': promptText = `Provide a study summary for ${src.name}. Focus on ${src.summary}`; break;
            case 'simplify': promptText = `Simplify this topic for me: ${src.name}. Context: ${src.simplify}`; break;
            case 'quiz': 
              // Special case: navigation
              setTimeout(() => {
                setStudyMode('quiz');
                setActiveScreen('study');
              }, 1200);
              reply = `Switching you to the Study tab — quiz starting on ${src.name}.`;
              incrementCounter('studySessions');
              break;
            case 'summary': promptText = `Summarize the key findings from ${src.name}`; break;
          }
        }

        if (!reply) {
          const sysPrompt = `You are ROAR, a helpful institutional AI assistant for TSU students. 
          Use ONLY the provided SOURCE MATERIAL to answer. 
          If the answer is not in the source, say "I don't have that specific info in your current study pack, but focusing on [related topic from source] might help."
          
          SOURCE MATERIAL:
          ${src.name}: ${src.summary}
          Additional simplification: ${src.simplify}
          
          Student Profile:
          Name: ${userProfile.firstName}
          Course: ${userProfile.courseSection}
          Style: ${userProfile.commStyle}
          `;

          reply = await geminiService.chat(promptText, undefined, sysPrompt);
        }
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply,
        timestamp: new Date().toISOString()
      }]);
    } catch (error: any) {
      if (error.message === 'RATE_LIMIT_EXCEEDED') {
        setErrorStatus('RATE_LIMIT');
      } else if (error.message === 'API_KEY_ISSUE') {
        setErrorStatus('API_KEY');
      } else {
        setErrorStatus('GENERAL');
      }
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8 h-full">
      <aside className="col-span-12 lg:col-span-3 space-y-6 lg:space-y-8 flex flex-col shrink-0">
        <div className="space-y-3 lg:space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-charcoal/30 px-1">Source Material</label>
          <div className="relative group">
            <select 
              value={activeSourceId}
              onChange={(e) => setActiveSourceId(e.target.value)}
              className="w-full bg-white border border-surface-highest p-4 rounded-2xl focus:ring-2 focus:ring-primary/10 text-xs font-black text-charcoal cursor-pointer appearance-none"
            >
              <option value="">Select MATH 1314 - College Algebra...</option>
              {SOURCES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              {facultyUploads.length > 0 && (
                <optgroup label="Faculty Uploads Under MATH 1314">
                  {facultyUploads.map(up => (
                    <option key={up.id} value={up.id}>
                      ↳ {up.name} ({up.materialType})
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-charcoal/30 px-1">Quick actions</label>
          <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 gap-2 lg:space-y-2 no-scrollbar">
            {SHORTCUTS.map(s => (
              <button
                key={s.id}
                onClick={() => handleSend(s.label)}
                className="flex-shrink-0 lg:w-full flex items-center gap-3 p-3 lg:p-4 rounded-2xl bg-surface text-charcoal hover:bg-surface-low transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-charcoal/20 group-hover:text-primary transition-colors shadow-sm">
                  {s.icon}
                </div>
                <span className="text-xs font-bold leading-tight whitespace-nowrap lg:whitespace-normal">{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="hidden lg:flex p-6 bg-teal/5 border border-teal/10 rounded-[2rem] items-start gap-4">
          <ShieldCheck size={20} className="text-teal shrink-0 mt-0.5" />
          <p className="text-[10px] font-bold text-teal leading-relaxed">
            ROAR answers using only verified study packs from your class.
          </p>
        </div>
      </aside>

      <main className="col-span-12 lg:col-span-9 bg-white rounded-[3rem] border border-surface-highest/50 shadow-sm flex flex-col overflow-hidden min-h-[400px] lg:min-h-0 flex-1">
        <header className="p-6 border-b border-surface-highest/30 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white border border-surface-highest overflow-hidden flex items-center justify-center p-1 shadow-sm">
              <img src="/roar-tiger-mech.png" alt="ROAR Tiger" className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className="text-sm font-black text-charcoal">ROAR Assistant</h3>
              <p className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest">
                {activeSource ? `Active: ${activeSource.name}` : "No active source selected"}
              </p>
            </div>
          </div>
          <div className="px-3 py-1 bg-teal/5 rounded-full border border-teal/10 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-widest text-teal">Source-grounded</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-4 max-w-[85%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full overflow-hidden flex items-center justify-center shrink-0 shadow-sm border",
                msg.role === 'user' ? "bg-teal/10 text-teal border-teal/10 text-[10px] font-black" : "bg-white border-surface-highest"
              )}>
                {msg.role === 'user' ? "YOU" : <img src="/roar-tiger-mech.png" alt="ROAR" className="w-6 h-6 object-contain" />}
              </div>
              <div className={cn(
                "p-5 rounded-3xl text-sm font-medium leading-relaxed shadow-sm",
                msg.role === 'user' ? "bg-primary text-white rounded-tr-sm" : "bg-surface text-charcoal rounded-tl-sm"
              )}>
                {msg.content}
              </div>
            </motion.div>
          ))}
          {isThinking && (
            <div className="flex gap-4 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-white border border-surface-highest overflow-hidden flex items-center justify-center shrink-0">
                <img src="/roar-tiger-mech.png" alt="ROAR" className="w-6 h-6 object-contain" />
              </div>
              <div className="p-5 rounded-3xl bg-surface text-charcoal rounded-tl-sm flex gap-1 items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-charcoal/20 animate-bounce" />
                <div className="w-1.5 h-1.5 rounded-full bg-charcoal/20 animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 rounded-full bg-charcoal/20 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}

          {errorStatus && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 rounded-3xl bg-red-50 border border-red-100 flex items-start gap-4 max-w-sm mx-auto"
            >
              <AlertTriangle className="text-red-500 shrink-0" size={20} />
              <div className="space-y-3">
                <h4 className="text-xs font-black text-red-900 uppercase tracking-widest">
                  {errorStatus === 'RATE_LIMIT' ? 'Rate Limit Exceeded' : errorStatus === 'API_KEY' ? 'AI Connection Issue' : 'Something went wrong'}
                </h4>
                <p className="text-[11px] font-bold text-red-700 leading-relaxed">
                  {errorStatus === 'RATE_LIMIT' 
                    ? "Wow, lots of ROAR usage! The AI needs a quick breather. Please wait 30-60 seconds and try your question again." 
                    : errorStatus === 'API_KEY'
                    ? "There's a connection issue with the AI system. Please check your AI API key in the platform settings."
                    : "The AI is momentarily unavailable. Tap below to try again."}
                </p>
                <button 
                  onClick={() => handleSend(messages[messages.length - 1].content)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-red-200 text-[10px] font-black uppercase tracking-widest text-red-600 hover:bg-red-100 transition-colors"
                >
                  <RefreshCcw size={12} /> Retry Action
                </button>
              </div>
            </motion.div>
          )}
        </div>

        <div className="p-6 pt-0">
          <div className="relative">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
              placeholder="Ask about your study materials..."
              className="w-full bg-white text-charcoal p-6 pr-16 rounded-[2rem] border border-surface-highest focus:ring-4 focus:ring-primary/5 text-sm font-bold placeholder:text-charcoal/20"
            />
            <button 
              onClick={() => handleSend(input)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 transition-all"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
