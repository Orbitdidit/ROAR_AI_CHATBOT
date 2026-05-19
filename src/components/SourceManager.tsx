import React from 'react';
import { motion } from 'motion/react';
import { 
  FileText, Globe, Link as LinkIcon, Database, 
  Plus, X, FileSpreadsheet, FileVideo, 
  Cloud, MoreHorizontal, GraduationCap,
  ChevronRight, Search
} from 'lucide-react';
import { Source, SourceType, StudyPack, Category } from '../types';
import { cn } from '../lib/utils';
import { getPacks, CATEGORIES } from '../lib/packs';

interface SourceManagerProps {
  activeSources: Source[];
  removeSource: (id: string) => void;
  addSource: (source: Source) => void;
  handleUpload: (type: SourceType, name: string, format?: Source['format']) => void;
  isCompact?: boolean;
}

export default function SourceManager({ 
  activeSources, 
  removeSource, 
  addSource,
  handleUpload,
  isCompact = false
}: SourceManagerProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<Category>(CATEGORIES[0]);
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const packs = React.useMemo(() => getPacks(), []);
  
  const isPackActive = (packId: string) => activeSources.some(s => s.id === packId);

  const togglePack = (pack: StudyPack) => {
    if (isPackActive(pack.id)) {
      removeSource(pack.id);
    } else {
      const source: Source = {
        id: pack.id,
        type: 'pack',
        name: pack.title,
        details: pack.category,
        size: pack.fileSize,
        addedAt: new Date().toISOString()
      };
      addSource(source);
    }
  };

  const filteredPacks = packs.filter(p => 
    p.category === selectedCategory && 
    (p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     p.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getTypeIcon = (source: Source) => {
    switch (source.format) {
      case 'xlsx':
      case 'csv':
        return <FileSpreadsheet className="text-teal" size={16} />;
      case 'link':
        return <Globe className="text-teal" size={16} />;
      case 'note':
        return <Edit3 className="text-teal" size={16} />;
      case 'gdrive':
        return <Cloud className="text-teal" size={16} />;
      default:
        return <FileText className="text-teal" size={16} />;
    }
  };

  return (
    <div className={cn("flex flex-col h-full", isCompact ? "" : "p-4")}>
      {/* Active Sources List */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4 px-2">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Active Materials ({activeSources.length})</h4>
          {activeSources.length > 0 && <span className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest">Grounding Active</span>}
        </div>
        
        {activeSources.length === 0 ? (
          <div className="bg-surface-low/50 border-2 border-dashed border-surface-highest rounded-[2rem] p-8 text-center">
            <Database size={32} className="mx-auto text-charcoal/10 mb-4" />
            <p className="text-xs font-bold text-charcoal/40 leading-relaxed">
              No materials loaded. Your AI needs grounding to provide accurate answers and study tools.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {activeSources.map(source => (
              <motion.div 
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                key={source.id}
                className="group flex items-center gap-3 p-3 bg-white border border-surface-highest/60 rounded-2xl hover:shadow-lg hover:shadow-primary/5 transition-all"
              >
                <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
                  {getTypeIcon(source)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-charcoal truncate">{source.name}</p>
                  <p className="text-[10px] font-bold text-charcoal/40 uppercase tracking-tight">{source.details} • {source.size}</p>
                </div>
                <button 
                  onClick={() => removeSource(source.id)}
                  className="p-2 text-charcoal/20 hover:text-primary transition-colors hover:bg-primary/5 rounded-lg opacity-0 group-hover:opacity-100"
                >
                  <X size={14} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add New Header */}
      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4 px-2">Add New Materials</h4>

      {/* Format Grid */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <AddButton 
          icon={<FileText size={18} />} 
          label="PDF/DOC/TXT" 
          onClick={() => handleUpload('file', 'Lecture Notes.pdf', 'pdf')}
        />
        <AddButton 
          icon={<FileSpreadsheet size={18} />} 
          label="Excel/CSV" 
          onClick={() => handleUpload('spreadsheet', 'Lab Data.csv', 'csv')}
        />
        <AddButton 
          icon={<Globe size={18} />} 
          label="Web Link" 
          onClick={() => handleUpload('link', 'Research Article', 'link')}
        />
        <AddButton 
          icon={<Cloud size={18} />} 
          label="Google Drive" 
          onClick={() => handleUpload('drive', 'Team Presentation', 'gdrive')}
        />
        <AddButton 
          icon={<Plus size={18} />} 
          label="Paste Note" 
          onClick={() => handleUpload('note', 'Key Quotes', 'note')}
          className="col-span-2"
        />
      </div>

      {/* Quick Load Pack Browser */}
      <div className="flex items-center justify-between mb-4 px-2">
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Faculty Study Packs</h4>
      </div>

      <div className="bg-surface-low rounded-[2rem] p-4 border border-surface-highest/50">
        <div className="flex overflow-x-auto gap-2 pb-4 scrollbar-hide no-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all",
                selectedCategory === cat ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white text-charcoal/40 hover:text-charcoal"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-2 mt-2">
          {filteredPacks.length === 0 ? (
            <div className="py-8 text-center text-[10px] font-bold text-charcoal/30 uppercase tracking-widest italic">
              No packs found in this category
            </div>
          ) : (
            filteredPacks.map(pack => (
              <button
                key={pack.id}
                onClick={() => togglePack(pack)}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-xl transition-all border",
                  isPackActive(pack.id) 
                    ? "bg-primary/5 border-primary/20 text-primary" 
                    : "bg-white border-transparent hover:border-primary/10 text-charcoal"
                )}
              >
                <div className="flex items-center gap-3 text-left">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", isPackActive(pack.id) ? "bg-primary/10" : "bg-surface-low")}>
                    <GraduationCap size={16} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold truncate max-w-[140px]">{pack.title}</p>
                    <p className="text-[9px] font-black text-charcoal/30 uppercase tracking-widest">{pack.fileSize}</p>
                  </div>
                </div>
                {isPackActive(pack.id) ? (
                  <CheckCircle2 size={16} className="text-primary" />
                ) : (
                  <Plus size={16} className="text-charcoal/20" />
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function AddButton({ icon, label, onClick, className }: { icon: React.ReactNode; label: string; onClick: () => void; className?: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center p-4 bg-white border border-surface-highest rounded-[1.5rem] hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all text-charcoal active:scale-95 group",
        className
      )}
    >
      <div className="text-primary/40 group-hover:text-primary transition-colors mb-2">
        {icon}
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest text-center">{label}</span>
    </button>
  );
}

import { CheckCircle2, Edit3 } from 'lucide-react';
