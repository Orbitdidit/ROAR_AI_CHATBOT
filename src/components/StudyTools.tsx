import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, CheckCircle2, RotateCw, ArrowLeft, ArrowRight, 
  HelpCircle, Check, Trash2, ShieldCheck, ChevronRight,
  Upload, FileText, Link, GraduationCap, LayoutGrid, Plus,
  FileSpreadsheet, ClipboardList
} from 'lucide-react';
import { cn, incrementCounter } from '../lib/utils';
import { UserProfile } from '../types';

const SOURCES = [
  {
    id: 'math-1314-college-algebra',
    name: 'MATH 1314 - College Algebra',
    cards: [
      { q: "What is a Quadratic Equation?", a: "An equation of the second degree, meaning it contains at least one term that is squared." },
      { q: "Define a Function", a: "A relationship or expression involving one or more variables where each input has exactly one output." },
      { q: "What is the Slope-Intercept Form?", a: "y = mx + b, where m is the slope and b is the y-intercept." }
    ],
    quiz: [
      { q: "What is the value of x if 2x + 5 = 15?", opts: ["x = 5", "x = 10", "x = 7.5", "x = 2.5"], correct: 0 },
      { q: "Which of these represents a linear equation?", opts: ["y = x^2", "y = 2x + 3", "y = 1/x", "y = |x|"], correct: 1 }
    ]
  }
];

interface StudyToolsProps {
  userProfile: UserProfile;
  activeSourceId: string;
  setActiveSourceId: (id: string) => void;
  studyMode: 'cards' | 'quiz' | null;
  setStudyMode: (mode: 'cards' | 'quiz' | null) => void;
}

export default function StudyTools({ 
  userProfile, 
  activeSourceId, 
  setActiveSourceId, 
  studyMode, 
  setStudyMode 
}: StudyToolsProps) {
  const [cardIdx, setCardIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [activeModal, setActiveModal] = useState<'upload' | 'link' | null>(null);
  const [selectedUploadType, setSelectedUploadType] = useState<string>('');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

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
      name: `MATH 1314 - ${up.name} (${up.materialType})`,
      cards: SOURCES[0].cards,
      quiz: SOURCES[0].quiz
    }))
  ];

  const activeSource = dynamicSources.find(s => s.id === activeSourceId);

  useEffect(() => {
    setCardIdx(0);
    setRevealed(false);
    setQuizIdx(0);
    setPicked(null);
    setScore(0);
    setStatusMsg(null);
  }, [activeSourceId]);

  const handleFacultyCardClick = (label: string) => {
    if (['Lecture Slides', 'Course Notes', 'Study Guide'].includes(label)) {
      setSelectedUploadType(label);
      setActiveModal('upload');
    } else if (label === 'Web Link') {
      setActiveModal('link');
    } else if (label === 'Flashcards') {
      setStudyMode('cards');
      setStatusMsg(`Flashcards generated from MATH 1314 - College Algebra study materials.`);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    } else if (label === 'Practice Quiz') {
      setStudyMode('quiz');
      setStatusMsg(`Practice quiz generated from MATH 1314 - College Algebra study materials.`);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-12 pb-20 relative">
      {/* Modals */}
      <AnimatePresence>
        {activeModal === 'upload' && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl border border-surface-highest"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mb-6">
                  <Upload size={32} />
                </div>
                <h3 className="text-2xl font-black text-charcoal tracking-tight mb-2">Add Faculty Material</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-6">{selectedUploadType} for MATH 1314</p>
                
                <div className="w-full p-8 border-2 border-dashed border-surface-highest rounded-[2rem] bg-surface/50 mb-8 flex flex-col items-center gap-3">
                  <Plus size={24} className="text-charcoal/20" />
                  <p className="text-xs font-bold text-charcoal/40 max-w-[180px]">
                    Faculty upload connection will be enabled for approved course materials.
                  </p>
                </div>

                <button 
                  onClick={() => setActiveModal(null)}
                  className="w-full p-5 rounded-2xl bg-charcoal text-white font-black uppercase text-[10px] tracking-widest shadow-xl shadow-charcoal/10 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {activeModal === 'link' && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl border border-surface-highest"
            >
              <div className="space-y-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-teal/5 rounded-2xl flex items-center justify-center text-teal mb-6">
                    <Link size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-charcoal tracking-tight mb-2">Add Course Web Link</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-teal mb-4">MATH 1314 - College Algebra</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-charcoal/30 px-1">Resource URL</label>
                  <input 
                    type="text" 
                    placeholder="Paste approved course resource link"
                    className="w-full bg-surface-low border border-surface-highest p-4 rounded-xl text-sm font-bold placeholder:text-charcoal/20 focus:ring-2 focus:ring-teal/20 outline-none"
                  />
                  <p className="text-[9px] font-bold text-charcoal/20 italic px-1">
                    “Only approved faculty-provided resources should be added for the pilot.”
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => setActiveModal(null)}
                    className="flex-1 p-5 rounded-2xl bg-surface text-charcoal/40 font-black uppercase text-[10px] tracking-widest hover:bg-surface-low transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => setActiveModal(null)}
                    className="flex-2 p-5 rounded-2xl bg-teal text-white font-black uppercase text-[10px] tracking-widest shadow-xl shadow-teal/10 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    Save Demo Link
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <header className="space-y-6">
        <div className="flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full mb-4 border border-primary/10 w-fit">
          <GraduationCap size={14} className="text-primary" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Academic Success Platform</span>
        </div>
        
        <div className="max-w-4xl space-y-4">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-primary leading-[0.8] font-display">
            Faculty-guided study tools <span className="text-charcoal italic font-light">for ROAR students</span>
          </h1>
          <p className="text-charcoal/60 text-sm md:text-lg font-medium leading-relaxed max-w-3xl">
            Faculty materials are transformed into student-friendly study guides, flashcards, and practice quizzes that help students prepare with more confidence.
          </p>
        </div>
      </header>

      {/* Faculty Study Materials Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-black text-charcoal tracking-tight font-display">Faculty Materials</h2>
          <div className="h-px flex-1 bg-surface-highest/50" />
          <span className="text-[10px] font-bold text-charcoal/30 uppercase tracking-widest italic">Institutional alignment</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FacultyActionCard onClick={() => handleFacultyCardClick('Flashcards')} icon={<LayoutGrid size={18} />} label="Flashcards" variant="primary" />
          <FacultyActionCard onClick={() => handleFacultyCardClick('Practice Quiz')} icon={<CheckCircle2 size={18} />} label="Practice Quiz" variant="teal" />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-[10px] font-bold text-charcoal/40 uppercase tracking-widest bg-surface/50 w-fit px-4 py-2 rounded-full border border-surface-highest">
            <ShieldCheck size={12} className="text-teal" />
            Faculty-uploaded materials help keep study tools aligned with course content.
          </div>
          
          <AnimatePresence>
            {statusMsg && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-2 text-[10px] font-black text-teal uppercase tracking-widest bg-teal/5 w-fit px-4 py-2 rounded-full border border-teal/10"
              >
                <Check size={12} />
                {statusMsg}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Study Interface */}
      <div className="grid grid-cols-12 gap-8">
        <aside className="col-span-12 lg:col-span-3 space-y-8">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-charcoal/30 px-1">Select Active Course Pack</label>
            <div className="relative group">
              <select 
                value={activeSourceId}
                onChange={(e) => setActiveSourceId(e.target.value)}
                className="w-full bg-white border border-surface-highest p-4 rounded-2xl focus:ring-2 focus:ring-primary/10 text-xs font-black text-charcoal cursor-pointer appearance-none shadow-sm"
              >
                <option value="">Choose a study subject...</option>
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
            <label className="text-[10px] font-black uppercase tracking-widest text-charcoal/30 px-1">Study Tools</label>
            <button 
              disabled={!activeSourceId}
              onClick={() => {
                setStudyMode('cards');
                incrementCounter('studySessions');
              }}
              className={cn(
                "w-full p-6 rounded-3xl text-left border transition-all flex flex-col gap-2 relative overflow-hidden group",
                studyMode === 'cards' ? "bg-primary text-white border-primary shadow-xl shadow-primary/20" : "bg-white border-surface-highest text-charcoal hover:border-primary/20 disabled:opacity-40"
              )}
            >
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-1", studyMode === 'cards' ? "bg-white/20" : "bg-primary/5")}>
                <BookOpen size={20} className={cn(studyMode === 'cards' ? "text-white" : "text-primary")} />
              </div>
              <h4 className="text-sm font-black uppercase tracking-widest">Review Flashcards</h4>
              <p className={cn("text-[10px] font-bold uppercase opacity-40", studyMode === 'cards' && "opacity-60")}>Master key concepts</p>
            </button>
            
            <button 
              disabled={!activeSourceId}
              onClick={() => {
                setStudyMode('quiz');
                incrementCounter('studySessions');
              }}
              className={cn(
                "w-full p-6 rounded-3xl text-left border transition-all flex flex-col gap-2 relative overflow-hidden group",
                studyMode === 'quiz' ? "bg-teal text-white border-teal shadow-xl shadow-teal/20" : "bg-white border-surface-highest text-charcoal hover:border-teal/20 disabled:opacity-40"
              )}
            >
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-1", studyMode === 'quiz' ? "bg-white/20" : "bg-teal/5")}>
                <HelpCircle size={20} className={cn(studyMode === 'quiz' ? "text-white" : "text-teal")} />
              </div>
              <h4 className="text-sm font-black uppercase tracking-widest">Take Practice Quiz</h4>
              <p className={cn("text-[10px] font-bold uppercase opacity-40", studyMode === 'quiz' && "opacity-60")}>Evaluate preparation</p>
            </button>
          </div>

          <div className="p-6 bg-primary/5 border border-primary/10 rounded-[2rem] flex items-start gap-4">
            <ShieldCheck size={20} className="text-primary shrink-0 mt-0.5" />
            <p className="text-[10px] font-bold text-primary leading-relaxed">
              These study aids are strictly based on instructor-provided source material.
            </p>
          </div>
        </aside>

        <main className="col-span-12 lg:col-span-9 bg-white rounded-[3rem] border border-surface-highest/50 shadow-sm p-8 min-h-[480px] flex flex-col">
          <AnimatePresence mode="wait">
            {!activeSourceId ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center text-center p-12"
              >
                <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center text-primary mb-6">
                  <GraduationCap size={40} />
                </div>
                <h3 className="text-xl font-black text-charcoal mb-2">Select MATH 1314 - College Algebra to Begin</h3>
                <p className="text-charcoal/30 font-bold max-w-xs leading-relaxed text-sm">
                  Choose MATH 1314 - College Algebra from the faculty-guided library to access flashcards and practice quizzes.
                </p>
              </motion.div>
            ) : !studyMode ? (
              <motion.div 
                key="ready"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center text-center p-12"
              >
                <div className="px-3 py-1 bg-teal/5 rounded-full mb-4 border border-teal/10">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-teal">Course Pack Active</span>
                </div>
                <h3 className="text-3xl font-black text-primary mb-4 tracking-tighter">{activeSource?.name}</h3>
                <p className="text-charcoal/40 font-bold max-w-sm leading-relaxed text-sm">
                  Choose Review Flashcards or Take Practice Quiz on the left to start your success session.
                </p>
              </motion.div>
            ) : studyMode === 'cards' ? (
              <motion.div 
                key="cards"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="flex-1 flex flex-col"
              >
                <div className="flex justify-between items-center mb-12">
                  <div className="flex gap-2 items-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-charcoal/40">Card {cardIdx + 1} of {activeSource?.cards.length}</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary/40 truncate max-w-[200px]">{activeSource?.name}</span>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center -mt-12">
                  <motion.div 
                    className={cn(
                      "w-full max-w-lg min-h-[300px] rounded-[3.5rem] p-12 flex flex-col items-center justify-center text-center transition-all cursor-pointer relative shadow-2xl",
                      revealed ? "bg-teal text-white shadow-teal/20" : "bg-white border border-surface-highest text-charcoal"
                    )}
                    onClick={() => setRevealed(!revealed)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="absolute top-8 text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
                      {revealed ? "The Definition" : "The Term"}
                    </span>
                    <p className="text-2xl font-black tracking-tight leading-tight px-4">
                      {revealed ? activeSource?.cards[cardIdx].a : activeSource?.cards[cardIdx].q}
                    </p>
                    <div className="absolute bottom-8 flex flex-col items-center gap-1">
                      <div className="flex gap-1">
                        <div className={cn("w-1.5 h-1.5 rounded-full", revealed ? "bg-white" : "bg-primary")} />
                        <div className={cn("w-1.5 h-1.5 rounded-full opacity-20", revealed ? "bg-white" : "bg-primary")} />
                      </div>
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-30">Flip Card</p>
                    </div>
                  </motion.div>

                  <div className="flex items-center gap-6 mt-12 w-full max-w-lg">
                    <button 
                      disabled={cardIdx === 0}
                      onClick={() => { setCardIdx(cardIdx - 1); setRevealed(false); }}
                      className="p-5 rounded-2xl bg-surface text-charcoal/40 hover:bg-surface-low disabled:opacity-20 transition-all flex items-center justify-center group"
                    >
                      <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    
                    <button 
                      onClick={() => setRevealed(!revealed)}
                      className="flex-1 p-5 rounded-2xl bg-primary text-white font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/10 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      {revealed ? "Switch to Term" : "Reveal Definition"}
                    </button>

                    <button 
                      disabled={cardIdx === (activeSource?.cards.length || 1) - 1}
                      onClick={() => { setCardIdx(cardIdx + 1); setRevealed(false); }}
                      className="p-5 rounded-2xl bg-surface text-charcoal/40 hover:bg-surface-low disabled:opacity-20 transition-all flex items-center justify-center group"
                    >
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="quiz"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="flex-1 flex flex-col"
              >
                {quizIdx < (activeSource?.quiz.length || 0) ? (
                  <>
                    <div className="flex justify-between items-center mb-12">
                      <div className="flex gap-2 items-center">
                        <div className="w-2 h-2 rounded-full bg-teal" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-charcoal/40">Question {quizIdx + 1} of {activeSource?.quiz.length}</span>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-teal/40 truncate max-w-[200px]">{activeSource?.name}</span>
                    </div>

                    <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full">
                      <h3 className="text-2xl font-black text-charcoal tracking-tight leading-tight mb-12">{activeSource?.quiz[quizIdx].q}</h3>
                      
                      <div className="space-y-3">
                        {activeSource?.quiz[quizIdx].opts.map((opt, i) => {
                          const isCorrect = i === activeSource?.quiz[quizIdx].correct;
                          const isPicked = picked === i;
                          return (
                            <button
                              key={i}
                              disabled={picked !== null}
                              onClick={() => {
                                setPicked(i);
                                if (isCorrect) setScore(score + 1);
                              }}
                              className={cn(
                                "w-full p-6 rounded-2xl border-2 text-left transition-all font-bold group flex justify-between items-center relative overflow-hidden",
                                picked === null ? "bg-white border-surface-highest hover:border-teal/40 text-charcoal/60" :
                                isCorrect ? "bg-teal text-white border-teal" :
                                isPicked ? "bg-primary text-white border-primary" : "bg-surface border-transparent opacity-40 text-charcoal/40"
                              )}
                            >
                              <span className="relative z-10">{opt}</span>
                              <div className="relative z-10">
                                {picked !== null && isCorrect && <CheckCircle2 size={18} />}
                                {picked === i && !isCorrect && <Trash2 size={18} />}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-12 flex justify-end">
                        <AnimatePresence>
                          {picked !== null && (
                            <motion.button
                              initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                              onClick={() => { setQuizIdx(quizIdx + 1); setPicked(null); }}
                              className="bg-charcoal text-white px-8 py-5 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-charcoal/20 hover:scale-105 transition-all flex items-center gap-2"
                            >
                              {quizIdx === (activeSource?.quiz.length || 1) - 1 ? "Review Results" : "Next Question"} <ArrowRight size={14} />
                            </motion.button>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                    <div className="px-3 py-1 bg-teal/5 rounded-full mb-8 border border-teal/10">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-teal">Assessment Complete</span>
                    </div>
                    <div className="text-[120px] font-black italic text-primary tracking-tighter leading-none mb-4">
                      {score}<span className="text-[40px] opacity-20 text-charcoal not-italic">/{activeSource?.quiz.length}</span>
                    </div>
                    <p className="text-charcoal/40 font-bold uppercase tracking-widest text-xs mb-12">Accuracy Rate · {Math.round((score / (activeSource?.quiz.length || 1)) * 100)}%</p>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => { setQuizIdx(0); setPicked(null); setScore(0); }}
                        className="bg-primary text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                      >
                        Try Again
                      </button>
                      <button 
                        onClick={() => setStudyMode(null)}
                        className="bg-charcoal text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:scale-105 transition-all"
                      >
                        Exit Session
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function FacultyActionCard({ icon, label, onClick, variant = 'default' }: { icon: React.ReactNode, label: string, onClick?: () => void, variant?: 'default' | 'primary' | 'teal' }) {
  const styles = {
    default: "bg-white border-surface-highest text-charcoal hover:border-primary/30",
    primary: "bg-primary text-white border-primary shadow-lg shadow-primary/20 hover:scale-[1.05]",
    teal: "bg-teal text-white border-teal shadow-lg shadow-teal/20 hover:scale-[1.05]"
  };

  const iconStyles = {
    default: "bg-surface text-charcoal/40 group-hover:text-primary transition-colors",
    primary: "bg-white/20 text-white",
    teal: "bg-white/20 text-white"
  };

  return (
    <button 
      onClick={onClick}
      aria-label={`Access ${label}`}
      className={cn(
        "p-5 rounded-[2rem] border flex flex-col items-center text-center gap-3 transition-all group active:scale-95 cursor-pointer",
        styles[variant]
      )}
    >
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", iconStyles[variant])}>
        {icon}
      </div>
      <span className="text-[10px] font-black uppercase tracking-tight leading-tight">{label}</span>
    </button>
  );
}
