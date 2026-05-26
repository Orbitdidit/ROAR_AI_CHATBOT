import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, TrendingDown, Users, BookOpen, MessageSquare, 
  ShieldCheck, Activity, Download, Wrench, Plus, ChevronRight, Settings, 
  Filter, User, BarChart3, Clock, Heart, Search, ChevronDown, Monitor,
  AlertCircle, Database, X, Trash2, FileText, Link as LinkIcon, Edit3, Check, Phone,
  Upload
} from 'lucide-react';
import { cn } from '../lib/utils';
import { UserProfile } from '../types';

const PILOT_METRICS = {
  activeStudents: 0,
  promptVolume: 0,
  studySessions: 0,
  resourceClicks: 0,
  dass8Completions: 0,
  urgentSupportClicks: 0,
  hotline988Clicks: 0,
  counselingClicks: 0,
  afterHoursClicks: 0,
  wellnessParticipation: 0,
  flashcardsGenerated: 0,
  quizzesGenerated: 0
};
// PILOT NOTE: All counts default to 0. Real values populate as the pilot collects events.

export default function AdminDashboard({ userProfile }: { userProfile: UserProfile }) {
  const [activeTab, setActiveTab] = useState<'engagement' | 'wellness' | 'cohorts'>('engagement');
  const [metrics, setMetrics] = useState(PILOT_METRICS);

  React.useEffect(() => {
    const keys = [
      'activeStudents',
      'promptVolume',
      'studySessions',
      'resourceClicks',
      'dass8Completions',
      'urgentSupportClicks',
      'hotline988Clicks',
      'counselingClicks',
      'afterHoursClicks',
      'wellnessParticipation'
    ];
    setMetrics(prev => {
      const newMetrics = { ...prev };
      keys.forEach(k => {
        const val = localStorage.getItem(`roar_metric_${k}`);
        if (val) (newMetrics as any)[k] = parseInt(val);
      });
      return newMetrics;
    });
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <div className="flex items-center gap-2 px-3 py-1 bg-teal/5 rounded-full mb-4 border border-teal/10 w-fit">
            <Activity size={14} className="text-teal" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-teal">Pilot Evaluation Mode</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-charcoal font-display">
            Program <span className="text-primary italic font-light">Engagement Dashboard</span>
          </h1>
          <p className="text-charcoal/40 text-lg mt-2 font-bold leading-tight max-w-2xl">
            Aggregate engagement, study activity, and resource utilization for the ROAR pilot program.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['PDF', 'CSV', 'XLSX', 'JSON'].map(format => (
            <button 
              key={format}
              className="px-4 py-2 bg-surface-lowest border border-surface-highest/50 rounded-xl text-[10px] font-black uppercase tracking-widest text-charcoal/60 hover:bg-surface hover:text-charcoal transition-all flex items-center gap-2"
            >
              <Download size={14} />
              Export {format}
            </button>
          ))}
        </div>
      </header>

      <div className="flex flex-col items-center justify-center py-6 border-y border-surface-highest/30">
        <img 
          src="/roar-wordmark.png" 
          alt="ROAR" 
          className="max-w-[200px] opacity-20 grayscale pointer-events-none" 
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            const fallback = e.currentTarget.parentElement?.querySelector('.logo-fallback');
            if (fallback) (fallback as HTMLElement).style.display = 'flex';
          }}
        />
        <div className="logo-fallback hidden flex-col items-center opacity-20 grayscale">
          <div className="text-3xl font-black tracking-tighter text-charcoal italic">ROAR</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard 
          label="Students Engaged" 
          value={metrics.activeStudents} 
          icon={<Users size={20} />} 
          variant="primary"
        />
        <MetricCard 
          label="Resource Utilization" 
          value={metrics.promptVolume} 
          icon={<MessageSquare size={20} />} 
        />
        <MetricCard 
          label="Study Sessions" 
          value={metrics.studySessions} 
          icon={<BookOpen size={20} />} 
        />
        <MetricCard 
          label="Support Resource Clicks" 
          value={metrics.resourceClicks} 
          icon={<Activity size={20} />} 
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard 
          label="DASS-8 Submissions" 
          value={metrics.dass8Completions} 
          icon={<Heart size={20} />} 
          variant="teal"
        />
        <MetricCard 
          label="Urgent Requests" 
          value={metrics.urgentSupportClicks} 
          icon={<AlertCircle size={20} />} 
          variant="teal"
        />
        <MetricCard 
          label="988 Dialed" 
          value={metrics.hotline988Clicks} 
          icon={<Phone size={20} />} 
          variant="teal"
        />
        <MetricCard 
          label="Counseling Clicks" 
          value={metrics.counselingClicks} 
          icon={<ShieldCheck size={20} />} 
          variant="teal"
        />
      </div>

      <div className="bg-white rounded-[3rem] p-10 border border-surface-highest/50 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <ShieldCheck size={20} className="text-teal" />
              <h3 className="text-2xl font-black text-charcoal font-display">Aggregate Engagement Trends</h3>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-teal bg-teal/5 border border-teal/10 px-2.5 py-1 rounded-full">Pilot Phase 1</span>
          </div>
          <p className="text-charcoal/40 text-[11px] font-bold mb-10 px-1 max-w-2xl leading-relaxed">
            Aggregated indicators for pilot evaluation and program improvement. Individual-level clinical interpretation is outside the scope of Phase 1. Data remains anonymized for large-scale trend analysis.
          </p>

          <DASS8IndicatorBoard />
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal/[0.02] rounded-full translate-x-1/3 -translate-y-1/2" />
      </div>

      <FacultyUploadPortal userProfile={userProfile} />

      <ResearchUsageTracker />

      <div className="bg-white rounded-[3rem] p-8 border border-surface-highest/50 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <h3 className="text-xl font-black text-charcoal">Search & Filter</h3>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <FilterSelect label="Target Class" options={["All classes", "MATH 1314 - College Algebra"]} />
          <FilterSelect label="Classification" options={["All", "Freshman", "Sophomore", "Junior", "Senior"]} />
          <FilterSelect label="GPA Band" options={["All", "Below 2.0", "2.0–2.99", "3.0–3.49", "3.5+"]} />
          <FilterSelect label="Cohort" options={["All", "Pilot A", "Pilot B", "Comparison"]} />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8">
          <EmptyPanel 
            title="Student Engagement Over Time" 
            subtitle="Daily active learning behaviors" 
            height={280} 
            icon={<TrendingUp size={24} />}
          />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <EmptyPanel 
            title="Engagement Survey Activity" 
            subtitle="Participation this week" 
            height={280} 
            icon={<Heart size={24} />}
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <EmptyPanel 
            title="Source Materials Used" 
            subtitle="Top accessed by class" 
            height={200} 
            icon={<Database size={24} />}
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <EmptyPanel 
            title="Program Engagement by Area" 
            subtitle="Engagement by classification, GPA band, cohort" 
            height={200} 
            icon={<BarChart3 size={24} />}
          />
        </div>
      </div>

      <footer className="p-10 rounded-[3rem] bg-primary/5 border border-primary/10 flex flex-col md:flex-row items-center gap-6">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm border border-primary/10 shrink-0">
          <ShieldCheck size={32} />
        </div>
        <div className="flex-1">
          <h4 className="text-primary font-black uppercase text-xs tracking-widest mb-1">Privacy & Data Usage</h4>
          <p className="text-primary-dark font-bold text-sm leading-relaxed mb-4">
            Dashboard views are intended for aggregate pilot evaluation and program improvement. 
            Individual-level clinical interpretation is outside the scope of Phase 1. 
            Numbers shown above use honest empty states until approved cohort data collection begins.
          </p>
          <p className="text-charcoal/30 font-bold text-[10px] uppercase tracking-widest bg-white/50 w-fit px-4 py-2 rounded-full border border-primary/5">
            Note: Admin Demo Access (roar.admin@demo.com) is active for evaluation. Credentials can be replaced with university-approved accounts before launch.
          </p>
        </div>
      </footer>
    </div>
  );
}

function MetricCard({ label, value, icon, variant = 'white' }: { 
  label: string, 
  value: number, 
  icon: React.ReactNode, 
  variant?: 'white' | 'primary' | 'teal' 
}) {
  return (
    <div className={cn(
      "p-10 rounded-[2.5rem] border transition-all flex flex-col justify-between group h-full",
      variant === 'primary' ? "academic-gradient-maroon text-white border-transparent shadow-2xl shadow-primary/20" :
      variant === 'teal' ? "bg-teal text-white border-transparent shadow-2xl shadow-teal/20" : "bg-white border-surface-highest text-charcoal shadow-sm hover:shadow-md"
    )}>
      <div className={cn("mb-8 w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-sm", 
        variant === 'white' ? "bg-primary/5 text-primary" : "bg-white/10 text-white"
      )}>
        {icon}
      </div>
      <div>
        <h4 className={cn("text-[10px] font-black uppercase tracking-widest mb-1", variant === 'white' ? "text-charcoal/30" : "text-white/60")}>{label}</h4>
        <div className="text-5xl font-black tracking-tighter mb-4 font-display">{value}</div>
        <div className={cn("text-[8px] font-bold uppercase tracking-[0.2em]", variant === 'white' ? "text-charcoal/20" : "text-white/30")}>
          Live Pilot Data
        </div>
      </div>
    </div>
  );
}

function EmptyPanel({ title, subtitle, height, icon }: { title: string, subtitle: string, height: number, icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-surface-highest shadow-sm h-full flex flex-col">
      <div className="mb-8">
        <h4 className="text-lg font-black text-charcoal">{title}</h4>
        <p className="text-xs font-bold text-charcoal/30">{subtitle}</p>
      </div>
      <div 
        className="flex-1 bg-surface-low rounded-[2rem] border border-dashed border-charcoal/10 flex flex-col items-center justify-center text-center p-8 gap-4"
        style={{ minHeight: height }}
      >
        <div className="p-4 bg-white rounded-2xl text-charcoal/20 shadow-sm">
          {icon}
        </div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-charcoal/20">No activity collected yet</p>
      </div>
    </div>
  );
}

function FilterSelect({ label, options }: { label: string, options: string[] }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-charcoal/20 px-1">{label}</label>
      <div className="relative group">
        <select className="w-full bg-white text-charcoal appearance-none p-4 rounded-xl border border-surface-highest focus:ring-2 focus:ring-primary/20 text-xs font-black cursor-pointer">
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/20 pointer-events-none group-hover:text-charcoal/40 transition-colors" size={14} />
      </div>
    </div>
  );
}

function DASS8IndicatorBoard() {
  const [completions, setCompletions] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    class: 'All',
    cohort: 'All',
    gender: 'All',
    gpa: 'All',
    status: 'All',
    group: 'All'
  });

  React.useEffect(() => {
    const data = JSON.parse(localStorage.getItem('roar_dass8_completions') || '[]');
    setCompletions(data);
  }, []);

  const filtered = completions.filter(c => {
    if (filters.class !== 'All' && c.class !== filters.class) return false;
    if (filters.cohort !== 'All' && c.cohort !== filters.cohort) return false;
    if (filters.gender !== 'All' && c.gender !== filters.gender) return false;
    if (filters.gpa !== 'All' && c.gpa_band !== filters.gpa) return false;
    if (filters.status !== 'All' && c.academic_status !== filters.status) return false;
    if (filters.group !== 'All' && c.usage_group !== filters.group) return false;
    return true;
  });

  const getAvg = (key: string) => {
    if (filtered.length === 0) return 0;
    const sum = filtered.reduce((acc, curr) => acc + (curr[key] || 0), 0);
    return (sum / filtered.length).toFixed(1);
  };

  const getFollowUpCount = () => {
    // Latest completion for each student
    const latestByStudent = filtered.reduce((acc: any, curr) => {
      if (!acc[curr.student_id] || new Date(curr.timestamp) > new Date(acc[curr.student_id].timestamp)) {
        acc[curr.student_id] = curr;
      }
      return acc;
    }, {});

    return Object.values(latestByStudent).filter((c: any) => 
      c.depression_score >= 7 || c.anxiety_score >= 7 || c.stress_score >= 5
    ).length;
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricBox label="Assessment Total" value={filtered.length} />
        <MetricBox label="Avg Scalar A" value={getAvg('depression_score')} />
        <MetricBox label="Avg Scalar B" value={getAvg('anxiety_score')} />
        <MetricBox label="Avg Scalar C" value={getAvg('stress_score')} />
        <MetricBox label="Avg Aggregate" value={getAvg('total_score')} />
        <MetricBox label="Priority Context" value={getFollowUpCount()} variant="warning" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-6 bg-surface rounded-3xl border border-surface-highest/50">
        <TinyFilter label="Class" options={['All', 'BIOL-1301-01', 'HIST-1301-02']} value={filters.class} onChange={(v) => setFilters({...filters, class: v})} />
        <TinyFilter label="Cohort" options={['All', 'Summer Bridge 2024', 'Nursing 2025']} value={filters.cohort} onChange={(v) => setFilters({...filters, cohort: v})} />
        <TinyFilter label="Gender" options={['All', 'Man', 'Woman', 'Non-binary', 'Prefer not to say']} value={filters.gender} onChange={(v) => setFilters({...filters, gender: v})} />
        <TinyFilter label="GPA Band" options={['All', '3.5 - 4.0', '3.0 - 3.49', '2.5 - 2.99', '2.0 - 2.49', 'Below 2.0']} value={filters.gpa} onChange={(v) => setFilters({...filters, gpa: v})} />
        <TinyFilter label="Status" options={['All', 'Good Standing', 'Academic Warning', 'Probation', 'Dean\'s List']} value={filters.status} onChange={(v) => setFilters({...filters, status: v})} />
        <TinyFilter label="Usage Group" options={['All', 'Pilot A', 'Pilot B', 'Comparison Group']} value={filters.group} onChange={(v) => setFilters({...filters, group: v})} />
      </div>

      <div className="p-8 bg-surface-low rounded-3xl border border-dashed border-charcoal/10 flex flex-col items-center justify-center text-center gap-4">
        <TrendingUp className="text-charcoal/10" size={32} />
        <p className="text-[10px] font-black uppercase tracking-widest text-charcoal/20">Assessment Engagement Trend Over Time (Visualized on Data Ingress)</p>
      </div>
    </div>
  );
}

function MetricBox({ label, value, variant = 'default' }: { label: string, value: string | number, variant?: 'default' | 'warning' }) {
  return (
    <div className={cn(
      "p-5 rounded-2xl border transition-all",
      variant === 'warning' ? "bg-primary/5 border-primary/20 text-primary" : "bg-white border-surface-highest text-charcoal"
    )}>
      <h5 className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1">{label}</h5>
      <div className="text-2xl font-black">{value}</div>
    </div>
  );
}

function TinyFilter({ label, options, value, onChange }: { label: string, options: string[], value: string, onChange: (v: string) => void }) {
  return (
    <div className="space-y-1">
      <label className="text-[8px] font-black uppercase tracking-[0.2em] text-charcoal/30 px-1">{label}</label>
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white border border-surface-highest/50 rounded-lg p-2 text-[10px] font-bold text-charcoal focus:ring-1 focus:ring-teal/30 focus:border-teal/50"
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function FacultyUploadPortal({ userProfile }: { userProfile: UserProfile }) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [course, setCourse] = useState('MATH 1314 - College Algebra');
  const [materialType, setMaterialType] = useState('Syllabus');
  const [facultyName, setFacultyName] = useState(() => {
    return `${userProfile?.firstName || 'Dr.'} ${userProfile?.lastName || 'Williams'}`.trim();
  });
  const [description, setDescription] = useState('');
  
  const [upProgress, setUpProgress] = useState<{ [key: string]: number }>({});
  const [upStatus, setUpStatus] = useState<'idle' | 'uploading' | 'success'>('idle');
  const [uploadsList, setUploadsList] = useState<any[]>(() => {
    const raw = localStorage.getItem('roar_faculty_uploads');
    return raw ? JSON.parse(raw) : [];
  });

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const validFiles = files.filter((f: any) => f.size <= 25 * 1024 * 1024); // 25 MB
      if (validFiles.length < files.length) {
        alert("Some files exceed the 25 MB size limit and were excluded.");
      }
      setSelectedFiles(prev => [...prev, ...validFiles]);
    }
  };

  const removeSelectedFile = (idx: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const handleUploadFiles = () => {
    if (selectedFiles.length === 0) return;
    setUpStatus('uploading');
    
    // Simulate uploads sequentially
    let currentIdx = 0;
    
    const uploadNext = () => {
      if (currentIdx >= selectedFiles.length) {
        // Complete uploads
        const existingRaw = localStorage.getItem('roar_faculty_uploads');
        const existing = existingRaw ? JSON.parse(existingRaw) : [];
        
        const newUploads = selectedFiles.map((file, idx) => ({
          id: 'upl-' + (Date.now() + idx),
          name: file.name,
          course: course,
          materialType: materialType,
          facultyName: facultyName,
          description: description,
          uploadedAt: new Date().toISOString(),
          status: 'Active'
        }));
        
        const updated = [...newUploads, ...existing];
        localStorage.setItem('roar_faculty_uploads', JSON.stringify(updated));
        
        // Update local state list
        setUploadsList(updated);
        
        setUpStatus('success');
        setSelectedFiles([]);
        setDescription('');
        
        // Reset progress counters
        setUpProgress({});
        setTimeout(() => setUpStatus('idle'), 3000);
        return;
      }

      const file = selectedFiles[currentIdx];
      let p = 0;
      const interval = setInterval(() => {
        p += 20;
        setUpProgress(prev => ({ ...prev, [file.name]: p }));
        if (p >= 100) {
          clearInterval(interval);
          currentIdx++;
          uploadNext();
        }
      }, 150);
    };

    uploadNext();
  };

  return (
    <div className="bg-white rounded-[3rem] p-10 border border-surface-highest/50 shadow-sm space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Database size={20} className="text-primary" />
            <h3 className="text-2xl font-black text-charcoal font-display">Faculty Source Uploads</h3>
          </div>
          <p className="text-charcoal/40 text-xs font-bold leading-relaxed max-w-2xl">
            Upload course materials students will study from. Files become part of the active source library after approval.
          </p>
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 border border-primary/10 px-2.5 py-1 rounded-full">
          Faculty Active Link
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* File Drag/Drop or select zone */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-charcoal/10 rounded-[2rem] p-8 text-center hover:border-primary/30 transition-all hover:bg-surface-low/20 cursor-pointer flex flex-col items-center justify-center gap-4 group"
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              multiple 
              onChange={handleFileChange} 
              accept=".pdf,.pptx,.docx,.txt" 
              className="hidden" 
            />
            <div className="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <Upload size={20} />
            </div>
            <div>
              <p className="text-xs font-black text-charcoal">Drag and drop course files here, or click to browse</p>
              <p className="text-[10px] font-bold text-charcoal/30 mt-1">Accepts PDF, PPTX, DOCX, TXT (Max 25 MB per file)</p>
            </div>
          </div>

          {/* Selected Files Preview Queue */}
          {selectedFiles.length > 0 && (
            <div className="space-y-3 bg-surface p-6 rounded-2xl border border-surface-highest/50">
              <h5 className="text-[10px] font-black uppercase tracking-widest text-charcoal/40">Queue to Upload ({selectedFiles.length})</h5>
              <div className="space-y-2 max-h-[150px] overflow-y-auto">
                {selectedFiles.map((f, i) => (
                  <div key={i} className="flex items-center justify-between text-xs font-bold text-charcoal bg-white p-3 rounded-xl border border-surface-highest/30">
                    <div className="flex items-center gap-2 overflow-hidden mr-2">
                      <FileText size={14} className="text-primary shrink-0" />
                      <span className="truncate">{f.name}</span>
                      <span className="text-[10px] text-charcoal/30 font-bold shrink-0">({(f.size / 1024 / 1024).toFixed(1)} MB)</span>
                    </div>
                    {upStatus === 'uploading' ? (
                      <span className="text-[10px] font-black text-primary">{upProgress[f.name] || 0}%</span>
                    ) : (
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeSelectedFile(i); }}
                        className="text-charcoal/30 hover:text-primary transition-colors cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Metadata Inputs */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-charcoal/30 px-1">Active Course</label>
              <select 
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full bg-surface text-charcoal appearance-none p-3.5 rounded-xl border border-surface-highest focus:ring-2 focus:ring-primary/20 text-xs font-black cursor-pointer"
              >
                <option value="MATH 1314 - College Algebra">MATH 1314 - College Algebra</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-charcoal/30 px-1">Material Type</label>
              <select 
                value={materialType}
                onChange={(e) => setMaterialType(e.target.value)}
                className="w-full bg-surface text-charcoal p-3.5 rounded-xl border border-surface-highest focus:ring-2 focus:ring-primary/20 text-xs font-black cursor-pointer"
              >
                <option value="Syllabus">Syllabus</option>
                <option value="Lecture slides">Lecture slides</option>
                <option value="Reading">Reading</option>
                <option value="Practice problems">Practice problems</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-widest text-charcoal/30 px-1">Faculty Name</label>
            <input 
              type="text" 
              value={facultyName}
              onChange={(e) => setFacultyName(e.target.value)}
              className="w-full bg-surface text-charcoal p-3.5 rounded-xl border border-surface-highest focus:ring-2 focus:ring-primary/20 text-xs font-black"
              placeholder="e.g. Dr. Joan"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-widest text-charcoal/30 px-1">Brief Description (Optional)</label>
            <textarea 
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-surface text-charcoal p-3.5 rounded-xl border border-surface-highest focus:ring-2 focus:ring-primary/20 text-xs font-bold"
              placeholder="e.g. Chapter 3 quadratic formulae slides"
            />
          </div>

          <button 
            disabled={selectedFiles.length === 0 || upStatus === 'uploading'}
            onClick={handleUploadFiles}
            className="w-full py-4 rounded-xl bg-primary text-white font-black uppercase text-[10px] tracking-widest transition-all academic-gradient-maroon disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary/10"
          >
            {upStatus === 'uploading' ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Uploading Materials...
              </>
            ) : upStatus === 'success' ? (
              <>
                <Check size={14} />
                Successfully Uploaded!
              </>
            ) : (
              <>
                <Upload size={14} />
                Upload Course Packs
              </>
            )}
          </button>
        </div>
      </div>

      {/* Recent Uploads List */}
      <div className="pt-4 border-t border-surface-highest/50">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-charcoal/30 mb-4 px-1">Recent Uploads</h4>
        {uploadsList.length === 0 ? (
          <p className="text-xs font-bold text-charcoal/20 px-1 italic">No custom course materials have been uploaded yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-surface-highest/40 bg-surface-low/20">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-surface-highest text-[9px] uppercase tracking-widest text-charcoal/40 font-black bg-surface">
                  <th className="p-4 w-12 text-center">Icon</th>
                  <th className="p-4">File Name</th>
                  <th className="p-4">Course</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Faculty Sponsor</th>
                  <th className="p-4">Uploaded</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-highest/30 text-xs font-bold text-charcoal/70">
                {uploadsList.map((up: any) => (
                  <tr key={up.id} className="hover:bg-white transition-all">
                    <td className="p-4 text-center text-primary">
                      <FileText size={16} className="mx-auto" />
                    </td>
                    <td className="p-4 font-black text-charcoal">{up.name}</td>
                    <td className="p-4">{up.course}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-primary/5 text-primary text-[9px] font-black uppercase tracking-wider">{up.materialType}</span>
                    </td>
                    <td className="p-4">{up.facultyName}</td>
                    <td className="p-4 text-charcoal/40">{new Date(up.uploadedAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal/5 text-teal text-[9px] font-black uppercase tracking-widest border border-teal/10">
                        <span className="w-1 h-1 rounded-full bg-teal animate-pulse" />
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function ResearchUsageTracker() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const loadLogs = () => {
      try {
        const raw = localStorage.getItem('roar_usage_log');
        if (raw) {
          setLogs(JSON.parse(raw));
        } else {
          setLogs([]);
        }
      } catch (e) {}
    };

    loadLogs();
    const interval = setInterval(loadLogs, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleClearLogs = () => {
    if (confirm("Are you sure you want to clear all research study logs?")) {
      localStorage.removeItem('roar_usage_log');
      setLogs([]);
    }
  };

  return (
    <div className="bg-white rounded-[3rem] p-10 border border-surface-highest/50 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Clock size={20} className="text-primary animate-pulse" />
            <h3 className="text-2xl font-black text-charcoal font-display">Research Usage Frequency</h3>
          </div>
          <p className="text-charcoal/40 text-xs font-bold leading-relaxed max-w-xl mt-1">
            Real-time track of academic prompts, user check-ins, study actions, and student engagement events.
          </p>
        </div>
        
        {logs.length > 0 && (
          <button 
            onClick={handleClearLogs}
            className="px-4 py-2 hover:bg-red-50 text-red-500 hover:text-red-700 border border-red-100 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 self-start sm:self-center"
          >
            <Trash2 size={12} />
            Reset Log
          </button>
        )}
      </div>

      {logs.length === 0 ? (
        <div className="p-12 text-center bg-surface-low/20 border-2 border-dashed border-charcoal/10 rounded-2xl">
          <Database size={32} className="mx-auto text-charcoal/10 mb-3" />
          <h4 className="text-xs font-black text-charcoal uppercase tracking-widest mb-1">No activity events logged</h4>
          <p className="text-[10px] font-bold text-charcoal/30">Ask the ROAR Assistant a study question, log a mood, or start an assessment to see real-time triggers.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-surface-highest/40 bg-surface-low/20">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-highest text-[9px] uppercase tracking-widest text-charcoal/40 font-black bg-surface">
                <th className="p-4">Timestamp</th>
                <th className="p-4">Student Unique ID</th>
                <th className="p-4">Action Event</th>
                <th className="p-4">Subject Course</th>
                <th className="p-4 text-right">Integrity Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-highest/30 text-xs font-bold text-charcoal/70">
              {logs.map((log: any, index: number) => {
                const isPrompt = log.action === 'SENT_PROMPT';
                const isMood = log.action === 'mood_selected';
                const isDass = log.action === 'dass8_completed';
                
                return (
                  <tr key={index} className="hover:bg-white transition-all">
                    <td className="p-4 text-charcoal/40 font-mono">
                      {new Date(log.timestamp).toLocaleString(undefined, {
                        month: '2-digit',
                        day: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </td>
                    <td className="p-4 font-black text-charcoal font-mono">
                      {log.studentId}
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-wider",
                        isPrompt ? "bg-primary/5 text-primary border border-primary/10" :
                        isMood ? "bg-teal/5 text-teal border border-teal/10" :
                        "bg-charcoal/5 text-charcoal border border-charcoal/10"
                      )}>
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 text-charcoal/60">{log.subject || 'MATH 1314'}</td>
                    <td className="p-4 text-right">
                      <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-teal">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal" />
                        Verified
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
