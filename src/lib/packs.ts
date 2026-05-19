import { StudyPack, Category } from '../types';

const STORAGE_KEY = 'roar_deployed_packs';

const DEFAULT_PACKS: StudyPack[] = [
  { id: 'bio-midterm', category: 'Biology', title: 'Biology Midterm Pack', description: 'Cellular biology, mitosis, and genetic foundations.', fileSize: '14.2 MB' },
  { id: 'alg-prep', category: 'Math', title: 'Algebra Quiz Prep', description: 'Quadratic equations and linear functions mastery.', fileSize: '8.5 MB' },
  { id: 'pol-concepts', category: 'Politics', title: 'U.S. Politics Key Concepts', description: 'Constitutional framework and legislative processes.', fileSize: '11.1 MB' },
  { id: 'writing-basics', category: 'Writing', title: 'Writing Support Basics', description: 'Thesis construction and structural clarity guides.', fileSize: '5.2 MB' },
  { id: 'wellness-script', category: 'Mental Wellness', title: 'Wellness Breathe Session', description: 'Mindfulness scripts and focus restoration guides.', fileSize: '2.1 MB' },
  { id: 'study-skills', category: 'General Study Skills', title: 'Academic Utility Belt', description: 'Time management and specialized note-taking methods.', fileSize: '4.8 MB' },
];

export const getPacks = (): StudyPack[] => {
  if (typeof window === 'undefined') return DEFAULT_PACKS;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return DEFAULT_PACKS;
  try {
    const userPacks = JSON.parse(stored);
    return [...DEFAULT_PACKS, ...userPacks];
  } catch (e) {
    return DEFAULT_PACKS;
  }
};

export const deployPack = (pack: StudyPack) => {
  if (typeof window === 'undefined') return;
  const stored = localStorage.getItem(STORAGE_KEY);
  let userPacks: StudyPack[] = [];
  if (stored) {
    try {
      userPacks = JSON.parse(stored);
    } catch (e) {}
  }
  
  const existingIndex = userPacks.findIndex(p => p.id === pack.id);
  if (existingIndex > -1) {
    userPacks[existingIndex] = { ...pack, isDeletable: true };
  } else {
    userPacks.push({ ...pack, isDeletable: true });
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(userPacks));
};

export const deletePack = (id: string) => {
  if (typeof window === 'undefined') return;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return;
  try {
    const userPacks = JSON.parse(stored);
    const filtered = userPacks.filter((p: any) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {}
};

export const CATEGORIES: Category[] = ['Biology', 'Math', 'Politics', 'Writing', 'Mental Wellness', 'General Study Skills'];
