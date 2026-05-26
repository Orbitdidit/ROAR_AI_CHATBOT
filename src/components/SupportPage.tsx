import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, Heart, ExternalLink, Info, Phone, AlertTriangle, 
  Smile, Frown, Meh, Zap, Moon, Clock, CheckCircle2, ShieldCheck, X, Send, Check
} from 'lucide-react';
import { cn, incrementCounter, logROARActivity } from '../lib/utils';
import { UserProfile } from '../types';

export default function SupportPage({ userProfile }: { userProfile: UserProfile }) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showAssessment, setShowAssessment] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<'success' | 'warning' | 'urgent' | null>(null);

  const tier1Moods = [
    { label: "Motivated", icon: <Zap className="w-4 h-4" /> },
    { label: "Content", icon: <Smile className="w-4 h-4" /> },
    { label: "Happy", icon: <Smile className="w-4 h-4" /> },
    { label: "Life is great", icon: <Heart className="w-4 h-4" /> }
  ];

  const tier2Moods = [
    { label: "Anxious", icon: <Meh className="w-4 h-4" />, urgent: false },
    { label: "Sad", icon: <Frown className="w-4 h-4" />, urgent: false },
    { label: "I need help", icon: <AlertTriangle className="w-4 h-4" />, urgent: true }
  ];

  const handleMoodClick = (label: string) => {
    setSelectedMood(label);
    incrementCounter('wellnessParticipation');
    logROARActivity('mood_selected');

    if (label === "I need help") {
      incrementCounter('urgentSupportClicks');
      setFeedbackMsg("Support materials activated. Immediate student support options are loaded directly below.");
      setFeedbackType("urgent");
      setTimeout(() => {
        const resourcesSection = document.getElementById('resources-section');
        resourcesSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    } else if (["Anxious", "Sad"].includes(label)) {
      setFeedbackMsg("Mood logged. Take a breath and be kind to yourself today.");
      setFeedbackType("warning");
    } else {
      setFeedbackMsg("Thank you for sharing. Keep up the great work in your studies!");
      setFeedbackType("success");
    }
  };

  const isUrgent = selectedMood === "I need help";

  const scrollToAssessment = () => {
    const assessmentSection = document.getElementById('assessment-section');
    assessmentSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <header className="space-y-8">
        <div className="flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full mb-4 border border-primary/10 w-fit">
          <ShieldCheck size={14} className="text-primary" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">ROAR Wellness</span>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-primary leading-[0.8] font-display">
            ROAR Wellness <span className="text-charcoal italic font-light">Check-In</span>
          </h1>
          
          <div className="bg-white border border-surface-highest rounded-[2rem] p-8 md:p-10 space-y-6 shadow-sm max-w-4xl relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <p className="text-charcoal text-lg md:text-xl font-black leading-tight tracking-tight font-display">
                First: Complete this check-in so support resources can be tailored to your experience during the ROAR program.
              </p>
              <div className="space-y-4 text-charcoal/60 text-sm font-medium leading-relaxed max-w-2xl">
                <p>
                  This short wellness check-in uses a standard questionnaire (the Depression, Anxiety, and Stress Scale) to help better understand how students may experience stress during academically demanding periods.
                </p>
                <p>
                  Your participation is voluntary, and your responses help improve student support resources and the overall ROAR experience.
                </p>
              </div>
              <div className="pt-4 border-t border-surface-highest">
                <p className="text-primary font-black uppercase tracking-widest text-[10px]">
                  Non-Clinical Navigation Resource · IRB Approved Pilot
                </p>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/[0.02] rounded-full translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button 
            onClick={() => {
              setShowAssessment(true);
              incrementCounter('dass8Completions');
            }}
            className="p-10 rounded-[2.5rem] bg-primary text-white shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-left group cursor-pointer relative overflow-hidden border border-primary/10"
          >
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/10">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-widest mb-1 font-display">Start Wellness Check-In</h3>
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Optional Check-In</p>
            </div>
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-110 transition-transform" />
          </button>
          <button 
            onClick={() => {
               const reflectionSection = document.getElementById('reflection-section');
               reflectionSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="p-10 rounded-[2.5rem] bg-charcoal text-white shadow-2xl shadow-charcoal/20 hover:scale-[1.02] active:scale-95 transition-all text-left group cursor-pointer relative overflow-hidden border border-white/5"
          >
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/10">
                <Heart size={32} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-widest mb-1 font-display">Daily Mood Check-In</h3>
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Optional Exercise</p>
            </div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </header>

      <section id="resources-section" className="space-y-8">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-black text-charcoal tracking-tight font-display">Immediate Support Resources</h2>
          <div className="h-px flex-1 bg-surface-highest/50" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <CrisisResourceCard 
            icon={<Phone size={24} />}
            title="Call 988"
            desc="24/7 National Support"
            href="tel:988"
            variant="maroon"
          />
          <CrisisResourceCard 
            icon={<MessageSquare size={24} />}
            title="Text 988"
            desc="24/7 Text Line"
            href="sms:988"
            variant="maroon"
          />
          <CrisisResourceCard 
            icon={<Heart size={24} />}
            title="TSU Counseling"
            desc="713-313-7804"
            href="tel:7133137804"
            variant="teal"
          />
          <CrisisResourceCard 
            icon={<Clock size={24} />}
            title="After-Hours"
            desc="713-313-7863"
            href="tel:7133137863"
            variant="charcoal"
          />
        </div>

        <div className="p-6 rounded-3xl bg-white border border-surface-highest shadow-sm flex items-start gap-4">
          <div className="p-3 bg-primary/5 rounded-2xl text-primary shrink-0">
            <AlertTriangle size={24} />
          </div>
          <p className="text-xs md:text-sm font-bold text-charcoal/60 leading-relaxed">
            <span className="text-primary font-black">Lifeline Notice:</span> 24/7 crisis support is available through the 988 Suicide & Crisis Lifeline. If you are experiencing emotional distress, thoughts of self-harm, or a mental health emergency, please seek immediate assistance.
          </p>
        </div>
      </section>

      <section id="reflection-section" className="space-y-8 pt-8 border-t border-surface-highest/50">
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-charcoal tracking-tight">Daily Mood Check-In</h3>
            <p className="text-sm font-medium text-charcoal/60 leading-relaxed max-w-3xl">
              This mood check-in allows students to quickly log their current mood during the ROAR program. Responses help our research team understand student engagement and improve services. Please do not use this space to report emergencies.
            </p>
          </div>

          <div className="space-y-4 mt-8">
            <h3 className="text-xl font-black text-charcoal tracking-tight font-display">How are you feeling?</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {tier1Moods.map((mood) => (
                <button
                  key={mood.label}
                  onClick={() => handleMoodClick(mood.label)}
                  className={cn(
                    "px-5 py-3 rounded-xl text-xs font-black border transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer",
                    selectedMood === mood.label
                      ? "bg-teal text-white border-teal shadow-lg shadow-teal/20"
                      : "bg-white border-surface-highest text-charcoal hover:border-teal hover:bg-teal/5"
                  )}
                >
                  {mood.icon}
                  <span>{mood.label}</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              {tier2Moods.map((mood) => (
                <button
                  key={mood.label}
                  onClick={() => handleMoodClick(mood.label)}
                  className={cn(
                    "px-5 py-3 rounded-xl text-xs font-black border transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer",
                    selectedMood === mood.label
                      ? "academic-gradient-maroon text-white border-primary shadow-lg shadow-primary/20"
                      : "bg-white border-primary/20 text-primary hover:border-primary hover:bg-primary/5"
                  )}
                >
                  {mood.icon}
                  <span>{mood.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <AnimatePresence>
              {feedbackMsg && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={cn(
                    "p-5 rounded-2xl border text-sm font-bold text-center",
                    feedbackType === 'success' ? "bg-teal/5 border-teal/10 text-teal" :
                    feedbackType === 'warning' ? "bg-amber-50 border-amber-100 text-amber-800" :
                    "bg-primary/5 border-primary/10 text-primary"
                  )}
                >
                  {feedbackMsg}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence>
          {isUrgent && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="p-8 md:p-12 rounded-[3rem] academic-gradient-maroon text-white relative overflow-hidden shadow-2xl"
            >
              <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto space-y-6">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center">
                  <AlertTriangle size={32} className="text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-black tracking-tight mb-2">You are not alone. Help is available.</h3>
                  <p className="text-white/60 font-bold uppercase tracking-widest text-xs">Tap any option below to call directly.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                  <CrisisButton tel="tel:988" label="988 Crisis Lifeline" sub="National Support" />
                  <CrisisButton tel="tel:7133137863" label="TSU After-Hours" sub="713-313-7863" />
                  <CrisisButton tel="tel:7133137000" label="TSU Police" sub="713-313-7000" />
                  <CrisisButton tel="tel:911" label="Emergency Services" sub="Call 911" />
                </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Assessment Modal */}
      <DASS8Assessment 
        isOpen={showAssessment} 
        onClose={() => setShowAssessment(false)} 
        userProfile={userProfile}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-12">
        <div className="p-8 rounded-[2.5rem] bg-white border-l-4 border-teal shadow-xl shadow-primary/5 flex flex-col justify-between">
          <div>
            <h4 className="text-xl font-black text-charcoal mb-4">University Counseling Center</h4>
            <div className="space-y-4 text-sm font-medium text-charcoal/40 leading-relaxed">
              <p>Inside the University Health Center</p>
              <p>4110 Tierwester St., Houston, TX 77004</p>
              <div className="flex items-center gap-2 text-charcoal">
                <Clock size={16} className="text-teal" />
                <span>Mon–Fri 8 AM – 5 PM</span>
              </div>
              <p className="text-primary font-black text-xl tracking-tight">713-313-7804</p>
            </div>
          </div>
          <a 
            href="https://tsu.edu/student-services/departments/counseling-center/index.php" 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={() => incrementCounter('counselingClicks')}
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-teal hover:translate-x-2 transition-transform mt-8"
          >
            Visit Counseling Center <ExternalLink size={14} />
          </a>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-white border border-surface-highest shadow-xl shadow-primary/5">
          <h4 className="text-xl font-black text-charcoal mb-4">Wellness Navigation Resource</h4>
          <p className="text-sm font-medium text-charcoal/40 leading-relaxed mb-8">
            These resources are provided to assist students with navigating wellness support during the ROAR program.
          </p>
          <div className="p-6 bg-surface rounded-2xl">
            <p className="text-[10px] font-black uppercase tracking-widest text-charcoal/20 mb-2">Student Support Hub</p>
            <div className="flex gap-4">
              <div className="h-2 w-12 bg-charcoal/10 rounded-full" />
              <div className="h-2 w-12 bg-charcoal/10 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      <footer className="pt-12 border-t border-surface-highest text-center pb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-black/[0.03] rounded-full mb-6">
          <ShieldCheck size={14} className="text-charcoal/40" />
          <span className="text-[10px] font-black uppercase tracking-widest text-charcoal/40">
            Institutional Support Navigation
          </span>
        </div>
        <p className="text-[9px] font-bold text-charcoal/40 uppercase tracking-[0.2em] max-w-xl mx-auto leading-relaxed mb-4">
          ROAR AI provides educational support, resource navigation, and optional wellness check-ins. It is not a clinical service, medical diagnosis tool, or emergency response system.
        </p>
        <p className="text-[8px] font-medium text-charcoal/20 uppercase tracking-[0.1em] max-w-lg mx-auto">
          Pilot Phase: Approved for educational use only.
        </p>
      </footer>
    </div>
  );
}

function CrisisResourceCard({ icon, title, desc, href, variant }: { icon: React.ReactNode, title: string, desc: string, href: string, variant: 'maroon' | 'teal' | 'charcoal' }) {
  const bgMap = {
    maroon: "bg-primary text-white shadow-primary/20",
    teal: "bg-teal text-white shadow-teal/20",
    charcoal: "bg-charcoal text-white shadow-charcoal/20"
  };

  return (
    <a 
      href={href}
      onClick={() => incrementCounter('resourceClicks')}
      className={cn(
        "p-6 rounded-[2rem] flex flex-col items-center text-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl",
        bgMap[variant]
      )}
    >
      <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-black uppercase tracking-widest">{title}</h4>
        <p className="text-[10px] font-bold opacity-70 mt-1">{desc}</p>
      </div>
    </a>
  );
}

function CrisisButton({ tel, label, sub }: { tel: string, label: string, sub: string }) {
  const handleClick = () => {
    incrementCounter('resourceClicks');
    if (label.includes('988')) {
      incrementCounter('hotline988Clicks');
    }
    if (label.includes('After-Hours')) {
      incrementCounter('afterHoursClicks');
    }
  };

  return (
    <a 
      href={tel}
      onClick={handleClick}
      className="flex flex-col items-center p-6 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 transition-all group"
    >
      <Phone size={20} className="mb-3 text-white/60 group-hover:text-white transition-colors" />
      <span className="text-sm font-black mb-1 text-center">{label}</span>
      <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{sub}</span>
    </a>
  );
}

const DASS8_QUESTIONS = [
  { text: "I found it difficult to work up the initiative to do things", category: 'depression' },
  { text: "I felt that I was using a lot of nervous energy", category: 'stress' },
  { text: "I was worried about situations in which I might panic and make a fool of myself", category: 'anxiety' },
  { text: "I found it difficult to relax", category: 'stress' },
  { text: "I felt down-hearted and blue", category: 'depression' },
  { text: "I felt I was close to panic", category: 'anxiety' },
  { text: "I was unable to become enthusiastic about anything", category: 'depression' },
  { text: "I felt scared without any good reason", category: 'anxiety' }
];

const SCALE_LABELS = [
  "Did not apply to me at all",
  "Applied to me to some degree, or some of the time",
  "Applied to me to a considerable degree, or a good part of the time",
  "Applied to me very much, or most of the time"
];

function DASS8Assessment({ isOpen, onClose, userProfile }: { isOpen: boolean; onClose: () => void; userProfile: UserProfile }) {
  const [step, setStep] = useState(0); // 0 = Intro, 1-8 = Questions, 9 = Result
  const [responses, setResponses] = useState<number[]>(new Array(8).fill(-1));

  const handleNext = () => {
    if (step === 8) {
      calculateAndSave();
      setStep(9);
    } else {
      setStep(step + 1);
    }
  };

  const calculateAndSave = () => {
    const dep = responses[0] + responses[4] + responses[6];
    const anx = responses[2] + responses[5] + responses[7];
    const str = responses[1] + responses[3];
    const total = dep + anx + str;

    const completion = {
      timestamp: new Date().toISOString(),
      student_id: userProfile.studentId || userProfile.id,
      email: userProfile.email,
      class: userProfile.courseSection || "Not Specified",
      instructor: userProfile.instructor || "Not Specified",
      cohort: userProfile.cohort || "Not Specified",
      usage_group: userProfile.usageGroup || "Pilot A",
      gender: userProfile.gender || "Not Specified",
      gpa_band: userProfile.gpaBand || "Not Specified",
      academic_status: userProfile.academicStatus || "Not Specified",
      responses,
      depression_score: dep,
      anxiety_score: anx,
      stress_score: str,
      total_score: total
    };

    const existing = JSON.parse(localStorage.getItem('roar_dass8_completions') || '[]');
    localStorage.setItem('roar_dass8_completions', JSON.stringify([...existing, completion]));
  };

  const getScores = () => {
    const dep = responses[0] + responses[4] + responses[6];
    const anx = responses[2] + responses[5] + responses[7];
    const str = responses[1] + responses[3];
    return { dep, anx, str };
  };

  const showSupportStrip = () => {
    const { dep, anx, str } = getScores();
    return dep >= 7 || anx >= 7 || str >= 5;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
        >
          <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-md" onClick={onClose} />
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
          >
            <header className="p-8 border-b border-surface-highest/30 flex justify-between items-center bg-primary text-white shrink-0">
              <div>
                <h3 className="text-xl font-black uppercase tracking-widest">Wellness Check-In</h3>
                {step > 0 && step < 9 && (
                  <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Question {step} of 8</p>
                )}
                {step === 9 && (
                  <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Check-In Recorded</p>
                )}
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 no-scrollbar touch-pan-y relative mb-20">
              {step === 0 && (
                <div className="space-y-6">
                  <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10">
                    <p className="text-sm font-bold text-primary leading-relaxed mb-4">
                      First: Complete this check-in so support resources can be tailored to your experience during the ROAR program. Please answer honestly.
                    </p>
                    <p className="text-xs font-medium text-charcoal/60 leading-relaxed mb-4">
                      This short wellness check-in uses a standard questionnaire (the Depression, Anxiety, and Stress Scale) to help better understand how students may experience stress during academically demanding periods.
                    </p>
                    <p className="text-xs font-medium text-charcoal/60 leading-relaxed">
                      Your participation is voluntary, and your responses help improve student support resources and the overall ROAR experience.
                    </p>
                  </div>

                  <div className="p-6 bg-surface rounded-2xl flex gap-4 items-start border border-surface-highest">
                    <ShieldCheck className="text-teal shrink-0" size={20} />
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest text-charcoal mb-1">Wellness Notice</h4>
                      <p className="text-[11px] font-bold text-charcoal/40 leading-relaxed italic">
                        This optional check-in is not a medical diagnosis and does not replace professional mental health care.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={() => setStep(1)}
                      className="flex-1 p-5 rounded-2xl bg-primary text-white font-black uppercase text-xs tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      Begin Wellness Check-In
                    </button>
                    <button 
                      onClick={onClose}
                      className="flex-1 p-5 rounded-2xl bg-surface text-charcoal font-black uppercase text-xs tracking-widest hover:bg-surface-highest transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {step >= 1 && step <= 8 && (
                <div className="space-y-8">
                  <div className="w-full bg-surface-highest h-2 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(step / 8) * 100}%` }}
                      className="h-full bg-primary"
                    />
                  </div>

                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <span className="text-xl font-black text-primary/20 shrink-0">#{step}</span>
                      <h4 className="text-2xl font-black text-charcoal leading-tight">
                        {DASS8_QUESTIONS[step - 1].text}
                      </h4>
                    </div>

                    <div className="space-y-3">
                      {SCALE_LABELS.map((label, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            const newRes = [...responses];
                            newRes[step - 1] = idx;
                            setResponses(newRes);
                          }}
                          className={cn(
                            "w-full p-6 rounded-2xl border text-left transition-all active:scale-[0.98] flex items-center justify-between group",
                            responses[step - 1] === idx 
                              ? "bg-primary border-primary text-white shadow-xl shadow-primary/20" 
                              : "bg-white border-surface-highest text-charcoal hover:border-primary/20"
                          )}
                        >
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "w-8 h-8 rounded-full border-2 flex items-center justify-center font-black",
                              responses[step - 1] === idx ? "bg-white text-primary border-white" : "border-surface-highest group-hover:border-primary/20"
                            )}>
                              {idx}
                            </div>
                            <span className="text-sm font-bold">{label}</span>
                          </div>
                          {responses[step - 1] === idx && <CheckCircle2 size={20} />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 9 && (
                <div className="space-y-8">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 size={40} className="text-teal" />
                    </div>
                    <h3 className="text-3xl font-black text-charcoal tracking-tighter">Thank you for completing your wellness check-in</h3>
                    <p className="text-charcoal/60 font-medium leading-relaxed">
                      Your wellness check-in has been recorded. Your responses help ROAR tailor support resources and improve student services.
                    </p>
                  </div>

                  {showSupportStrip() && (
                    <div className="p-6 rounded-3xl bg-teal/5 border border-teal/10 flex items-start gap-4">
                      <Heart className="text-teal shrink-0 mt-1" size={20} />
                      <p className="text-sm font-bold text-teal leading-relaxed">
                        Based on your check-in, you may find these support resources helpful.
                      </p>
                    </div>
                  )}

                  <div className="p-6 bg-surface rounded-3xl space-y-4">
                    <p className="text-xs font-bold text-charcoal/40 text-center leading-relaxed">
                      If you would like to talk with someone, TSU Counseling Center is available. If you need immediate help, call or text 988 anytime — it is free, confidential, and available 24/7.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <a 
                        href="https://tsu.edu/student-services/departments/counseling-center/index.php" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-4 rounded-xl bg-white border border-surface-highest text-[10px] font-black uppercase tracking-widest text-charcoal hover:border-teal transition-all flex items-center justify-center gap-2 text-center"
                      >
                        Visit Counseling Center
                      </a>
                      <a 
                        href="tel:988"
                        className="p-4 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all text-center"
                      >
                        Contact 988 Now
                      </a>
                    </div>
                  </div>
                  
                  <button 
                    onClick={onClose}
                    className="w-full p-5 rounded-2xl bg-surface text-charcoal font-black uppercase text-xs tracking-widest hover:bg-surface-highest transition-all"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>

            {step >= 1 && step <= 8 && (
              <div className="p-6 border-t border-surface-highest/30 bg-surface/50 flex justify-between items-center absolute bottom-0 left-0 w-full shrink-0">
                <button 
                  onClick={() => setStep(step - 1)}
                  disabled={step === 1}
                  className="px-6 py-3 rounded-xl bg-white border border-surface-highest text-xs font-black uppercase tracking-widest text-charcoal/60 disabled:opacity-30 disabled:pointer-events-none hover:bg-surface transition-all"
                >
                  Back
                </button>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/30">
                  Question {step} of 8
                </p>
                <button 
                  onClick={handleNext}
                  disabled={responses[step - 1] === -1}
                  className="px-8 py-3 rounded-xl bg-primary text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 disabled:opacity-30 hover:scale-105 active:scale-95 transition-all"
                >
                  {step === 8 ? "Submit Check-In" : "Next"}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
