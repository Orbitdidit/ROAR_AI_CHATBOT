import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Check, Sparkles, User, GraduationCap, BookOpen, MessageSquare, CheckCircle2 } from 'lucide-react';
import { cn, incrementCounter } from '../lib/utils';
import { UserProfile, Classification, GPABand, CommunicationStyle } from '../types';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [isExited, setIsExited] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    studentId: '',
    classification: '' as Classification,
    gpaBand: '' as GPABand,
    courses: [] as string[],
    commStyle: '' as CommunicationStyle
  });

  const coursesList = [
    "MATH 1314 - College Algebra"
  ];

  const commStyles = [
    { id: 'Academic and direct', title: 'Direct', desc: '"Just give me the answer"', icon: <Check className="w-5 h-5" /> },
    { id: 'Supportive and conversational', title: 'Conversational', desc: '"Talk it through with me"', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'Student-friendly and relatable', title: 'Detailed', desc: '"Explain every step"', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'Concise coach style', title: 'Quick', desc: '"Short and punchy"', icon: <Sparkles className="w-5 h-5" /> }
  ] as { id: CommunicationStyle, title: string, desc: string, icon: React.ReactNode }[];

  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({ email: '', password: '' });
  const [adminError, setAdminError] = useState(false);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminCredentials.email === 'roar.admin@demo.com' && adminCredentials.password === 'RoarPilot#2026') {
      const profile: UserProfile = {
        id: 'admin-demo',
        email: 'roar.admin@demo.com',
        firstName: 'ROAR',
        lastName: 'Admin',
        role: 'admin',
        permissionLevel: 'Superuser',
        department: 'TSU Pilot Program',
        firstLoginDate: new Date().toISOString()
      };
      
      // Also auto-agree to consent for demo admin
      const consentObj = {
        agreed: true,
        timestamp: new Date().toISOString(),
        student_id: 'admin-demo',
        consent_version: 'v1.0_pilot'
      };
      localStorage.setItem('roar_consent', JSON.stringify(consentObj));
      
      onComplete(profile);
    } else {
      setAdminError(true);
      setTimeout(() => setAdminError(false), 2000);
    }
  };

  const handleNext = () => {
    if (step === 0) {
      // Step 0 handles consent differently now
      handleConsent(true);
      return;
    }
    if (step < 4) {
      setStep(step + 1);
    } else {
      incrementCounter('activeStudents');
      const profile: UserProfile = {
        id: 'user-' + Date.now(),
        email: formData.studentId + '@student.tsu.edu',
        firstName: formData.firstName,
        studentId: formData.studentId,
        role: 'student',
        classification: formData.classification,
        gpaBand: formData.gpaBand,
        courseSections: formData.courses,
        commStyle: formData.commStyle,
        firstLoginDate: new Date().toISOString()
      };
      onComplete(profile);
    }
  };

  const handleBack = () => setStep(step - 1);

  const handleConsent = (agreed: boolean) => {
    const consentObj = {
      agreed,
      timestamp: new Date().toISOString(),
      student_id: formData.studentId || 'demo_user',
      consent_version: 'v1.0_pending_legal'
    };
    localStorage.setItem('roar_consent', JSON.stringify(consentObj));
    
    if (agreed) {
      setStep(1);
    } else {
      setIsExited(true);
    }
  };

  const toggleCourse = (course: string) => {
    setFormData(prev => ({
      ...prev,
      courses: prev.courses.includes(course) 
        ? prev.courses.filter(c => c !== course)
        : [...prev.courses, course]
    }));
  };

  const isStepValid = () => {
    if (step === 0) return true; // Consent is just a review screen for now
    if (step === 1) return formData.firstName.length > 1 && formData.studentId.length > 4;
    if (step === 2) return formData.classification && formData.gpaBand;
    if (step === 3) return formData.courses.length > 0;
    if (step === 4) return formData.commStyle;
    return false;
  };

  if (isExited) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-xl bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-surface-highest/50"
        >
          <div className="w-20 h-20 bg-charcoal/5 rounded-full flex items-center justify-center mx-auto mb-8">
            <Check size={40} className="text-charcoal/20" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-charcoal mb-6">Thank you for your time</h1>
          <p className="text-charcoal/60 font-bold leading-relaxed mb-12">
            Participation in ROAR is voluntary. Because you did not consent to participate, you cannot access the pilot at this time. If you change your mind, you may return and complete the consent process. Your decision will not affect your grades, academic standing, or access to TSU services in any way.<br /><br />
            If you need support resources, you can contact TSU Counseling Center at 713-313-7804, or call/text 988 for 24/7 crisis support.
          </p>
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => setIsExited(false)}
              className="w-full p-5 rounded-2xl bg-charcoal text-white font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all"
            >
              Return to consent screen
            </button>
            <button 
              onClick={() => window.location.href = 'https://tsu.edu'}
              className="w-full p-5 rounded-2xl bg-white border-2 border-surface-highest text-charcoal font-black uppercase text-[10px] tracking-widest hover:bg-surface transition-all"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 pb-24">
      <div className="mb-12 relative flex flex-col items-center">
        <img 
          src="/roar-wordmark.png" 
          alt="ROAR Wordmark"
          className="h-12 w-auto object-contain"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            const fallback = e.currentTarget.parentElement?.querySelector('.logo-fallback');
            if (fallback) (fallback as HTMLElement).style.display = 'flex';
          }}
        />
        <div className="logo-fallback hidden flex-col items-center">
          <div className="text-3xl font-black tracking-tighter text-primary italic leading-none">ROAR</div>
          <div className="text-[8px] font-bold text-charcoal/40 uppercase tracking-[0.3em] mt-1 text-center">
            Rising Over All Roadblocks
          </div>
        </div>
      </div>

      <div className="w-full max-w-xl">
        <div className="mb-8 flex flex-col items-center">
          <div className="px-3 py-1 bg-primary/5 rounded-full mb-4 border border-primary/10">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Step {step + 1} of 5</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-charcoal text-center">
            {isAdminLogin ? "ROAR Admin Demo Access" : (
              <>
                {step === 0 && "Research Consent"}
                {step === 1 && "Welcome, Tiger"}
                {step === 2 && "Tell us about you"}
                {step === 3 && "What classes are you taking?"}
                {step === 4 && "How do you like to learn?"}
              </>
            )}
          </h1>
          <p className="text-charcoal/40 font-bold mt-2 text-center">
            {isAdminLogin ? "Log in with demo credentials for tonight's meeting" : (
              <>
                {step === 0 && "Review the pilot terms to begin."}
                {step === 1 && "Start by introducing yourself to the pilot."}
                {step === 2 && "This helps us tailor your ROAR experience."}
                {step === 3 && "Select all courses you want ROAR to help with."}
                {step === 4 && "Pick the style that works best for your study flow."}
              </>
            )}
          </p>
        </div>

        <motion.div 
          className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-primary/5 border border-surface-highest/50 relative overflow-hidden"
          layout
        >
          <AnimatePresence mode="wait">
            {isAdminLogin ? (
              <motion.form 
                key="admin-login"
                onSubmit={handleAdminLogin}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-charcoal/30 px-1">Demo Email</label>
                  <input 
                    type="email"
                    required
                    value={adminCredentials.email}
                    onChange={e => setAdminCredentials({ ...adminCredentials, email: e.target.value })}
                    className="w-full bg-white text-charcoal p-5 rounded-2xl border border-surface-highest focus:ring-2 focus:ring-primary/20 text-lg font-bold"
                    placeholder="roar.admin@demo.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-charcoal/30 px-1">Demo Password</label>
                  <input 
                    type="password"
                    required
                    value={adminCredentials.password}
                    onChange={e => setAdminCredentials({ ...adminCredentials, password: e.target.value })}
                    className="w-full bg-white text-charcoal p-5 rounded-2xl border border-surface-highest focus:ring-2 focus:ring-primary/20 text-lg font-bold"
                    placeholder="••••••••"
                  />
                </div>

                {adminError && (
                  <p className="text-center text-[10px] font-black uppercase tracking-widest text-red-500 animate-pulse">
                    Invalid Demo Credentials
                  </p>
                )}

                <div className="space-y-3">
                  <button 
                    type="submit"
                    className="w-full p-5 rounded-2xl bg-teal text-white font-black uppercase text-[10px] tracking-widest shadow-xl shadow-teal/20 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    Login to Admin Panel
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsAdminLogin(false)}
                    className="w-full p-4 rounded-xl bg-surface text-charcoal/40 font-black uppercase text-[9px] tracking-widest hover:bg-surface-low transition-all"
                  >
                    Back to Student Onboarding
                  </button>
                </div>

                <p className="text-center text-[9px] font-bold text-charcoal/20 leading-relaxed italic">
                  “Temporary demo credentials can be replaced with university-approved admin accounts before pilot launch.”
                </p>
              </motion.form>
            ) : step === 0 ? (
              <motion.div 
                key="step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="max-h-[400px] overflow-y-auto pr-2 space-y-6 custom-scrollbar">
                  <div className="space-y-2">
                    <h2 className="text-xl font-black text-charcoal tracking-tight font-display">ROAR AI Consent, Limitations, and User Acknowledgement</h2>
                    <p className="text-xs font-bold text-charcoal/40 italic">Please review and acknowledge the following before proceeding.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-5 bg-primary/5 rounded-2xl border border-primary/10">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">1. Not For Emergencies</h3>
                      <p className="text-xs font-bold text-charcoal/70 leading-relaxed">
                        ROAR AI is not monitored in real time and is not intended for crisis intervention or emergency response. If you are experiencing a medical emergency, mental health crisis, or thoughts of self-harm, immediately contact 911, the 988 Suicide & Crisis Lifeline, or the TSU Counseling Center at 713-313-7804.
                      </p>
                    </div>

                    <div className="p-5 bg-charcoal/5 rounded-2xl border border-surface-highest">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-charcoal/40 mb-2">2. Informational Purposes Only</h3>
                      <p className="text-xs font-bold text-charcoal/70 leading-relaxed">
                        ROAR AI provides general educational, wellness, and support-related information only. It is not a substitute for professional medical advice, mental health treatment, counseling, diagnosis, or emergency services. Always seek the advice of a qualified healthcare or mental health professional regarding any medical or psychological condition.
                      </p>
                    </div>

                    <div className="p-5 bg-charcoal/5 rounded-2xl border border-surface-highest">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-charcoal/40 mb-2">3. No Professional or Clinical Relationship</h3>
                      <p className="text-xs font-bold text-charcoal/70 leading-relaxed">
                        Use of ROAR AI does not establish a counselor-patient, therapist-patient, physician-patient, or other professional relationship with Texas Southern University or its employees, contractors, or affiliates.
                      </p>
                    </div>

                    <div className="p-5 bg-teal/5 rounded-2xl border border-teal/10">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-teal mb-3">4. AI Limitations and Privacy Notice</h3>
                      
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-[9px] font-black uppercase tracking-widest text-teal/60 mb-1">Accuracy</h4>
                          <p className="text-[11px] font-bold text-charcoal/70">
                            AI responses may occasionally be inaccurate, incomplete, or inappropriate. Users should not rely solely on these responses for health, safety, legal, or academic decisions.
                          </p>
                        </div>
                        <div>
                          <h4 className="text-[9px] font-black uppercase tracking-widest text-teal/60 mb-1">Privacy</h4>
                          <p className="text-[11px] font-bold text-charcoal/70">
                            Interactions may be logged or reviewed by authorized personnel for safety, compliance, or quality improvement purposes. Do not submit sensitive personal, medical, or confidential information.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-surface-highest">
                    <p className="text-[11px] font-bold text-charcoal/60 leading-relaxed">
                      I have read, listened to, and understand the above disclaimer and acknowledge that ROAR AI is not a crisis intervention or emergency response service.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <button 
                    onClick={() => handleConsent(true)}
                    className="w-full p-5 rounded-2xl bg-primary text-white font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    I Accept and Proceed
                  </button>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setIsAdminLogin(true)}
                      className="flex-1 p-4 rounded-xl bg-teal/5 border border-teal/20 text-teal font-black uppercase text-[9px] tracking-widest hover:bg-teal/10 transition-all font-display"
                    >
                      Admin Access
                    </button>
                    <button 
                      onClick={() => handleConsent(false)}
                      className="flex-1 p-4 rounded-xl bg-surface text-charcoal/40 font-black uppercase text-[9px] tracking-widest hover:bg-surface-low transition-all"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : step === 1 ? (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-charcoal/30 px-1">First Name</label>
                  <input 
                    type="text"
                    value={formData.firstName}
                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full bg-white text-charcoal p-5 rounded-2xl border border-surface-highest focus:ring-2 focus:ring-primary/20 text-lg font-bold"
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-charcoal/30 px-1">Student ID (T-Number)</label>
                  <input 
                    type="text"
                    value={formData.studentId}
                    onChange={e => setFormData({ ...formData, studentId: e.target.value })}
                    className="w-full bg-white text-charcoal p-5 rounded-2xl border border-surface-highest focus:ring-2 focus:ring-primary/20 text-lg font-bold font-mono"
                    placeholder="T00000000"
                  />
                </div>
              </motion.div>
            ) : null}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-charcoal/30 px-1">Classification</label>
                  <div className="flex flex-wrap gap-2">
                    {['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'].map(c => (
                      <button
                        key={c}
                        onClick={() => setFormData({ ...formData, classification: c as Classification })}
                        className={cn(
                          "px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                          formData.classification === c ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-surface text-charcoal/40 hover:bg-surface-low"
                        )}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-charcoal/30 px-1">GPA Band</label>
                  <div className="flex flex-wrap gap-2">
                    {['Below 2.0', '2.0 - 2.49', '2.5 - 2.99', '3.0 - 3.49', '3.5 - 4.0'].map(g => (
                      <button
                        key={g}
                        onClick={() => setFormData({ ...formData, gpaBand: g as GPABand })}
                        className={cn(
                          "px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                          formData.gpaBand === g ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-surface text-charcoal/40 hover:bg-surface-low"
                        )}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <label className="text-[10px] font-black uppercase tracking-widest text-charcoal/30 px-1">Active Courses</label>
                <div className="grid grid-cols-2 gap-3">
                  {coursesList.map(c => (
                    <button
                      key={c}
                      onClick={() => toggleCourse(c)}
                      className={cn(
                        "p-4 rounded-2xl text-xs font-black border-2 transition-all flex items-center justify-between",
                        formData.courses.includes(c) ? "bg-teal/5 border-teal text-teal" : "bg-surface border-transparent text-charcoal/40 hover:bg-surface-low"
                      )}
                    >
                      {c}
                      {formData.courses.includes(c) && <Check size={16} />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {commStyles.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setFormData({ ...formData, commStyle: s.id })}
                    className={cn(
                      "p-6 rounded-[2rem] border-2 text-left transition-all group",
                      formData.commStyle === s.id ? "bg-teal/5 border-teal" : "bg-surface border-transparent hover:border-teal/20"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors",
                      formData.commStyle === s.id ? "bg-teal text-white" : "bg-white text-charcoal/20 group-hover:text-teal/40"
                    )}>
                      {s.icon}
                    </div>
                    <h4 className={cn("text-sm font-black uppercase tracking-widest mb-1", formData.commStyle === s.id ? "text-teal" : "text-charcoal")}>{s.title}</h4>
                    <p className="text-[10px] font-bold text-charcoal/40">{s.desc}</p>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="mt-12 flex flex-col items-center space-y-8">
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4].map(s => (
              <div 
                key={s} 
                className={cn(
                  "h-1.5 transition-all duration-500 rounded-full",
                  s === step ? "w-8 bg-primary" : "w-1.5 bg-surface-highest"
                )} 
              />
            ))}
          </div>

          <div className="flex w-full gap-4">
            {step > 0 && (
              <button 
                onClick={handleBack}
                className="flex-1 p-5 rounded-2xl bg-surface-low text-charcoal font-black uppercase text-[10px] tracking-widest hover:bg-surface-highest transition-all flex items-center justify-center gap-2"
              >
                <ChevronLeft size={16} /> Back
              </button>
            )}
            {step > 0 && (
              <button 
                disabled={!isStepValid()}
                onClick={handleNext}
                className={cn(
                  "flex-[2] p-5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl",
                  isStepValid() 
                    ? "bg-primary text-white shadow-primary/20 hover:scale-105" 
                    : "bg-surface-low text-charcoal/20 cursor-not-allowed shadow-none"
                )}
              >
                {step === 4 ? "Enter ROAR" : "Continue"} <ChevronRight size={16} />
              </button>
            )}
          </div>
          
          <p className="text-[9px] font-bold text-charcoal/30 uppercase tracking-[0.2em] text-center max-w-xs leading-relaxed">
            Final consent and research review processes are TSU-approved. Your information stays inside the pilot.
          </p>
        </div>
      </div>
    </div>
  );
}
