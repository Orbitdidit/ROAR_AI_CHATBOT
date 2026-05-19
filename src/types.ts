import React from 'react';

export type Screen = 'chat' | 'study' | 'support' | 'admin' | 'onboarding' | 'welcome';

export type Category = 'Biology' | 'Math' | 'Politics' | 'Writing' | 'Mental Wellness' | 'General Study Skills';

export type Classification = 'Freshman' | 'Sophomore' | 'Junior' | 'Senior' | 'Graduate';
export type AcademicStatus = 'Good Standing' | 'Academic Warning' | 'Probation' | 'Dean\'s List';
export type CommunicationStyle = 'Academic and direct' | 'Supportive and conversational' | 'Student-friendly and relatable' | 'Concise coach style' | 'HBCU-Friendly Student Tone';
export type GPABand = '3.5 - 4.0' | '3.0 - 3.49' | '2.5 - 2.99' | '2.0 - 2.49' | 'Below 2.0';

export type UserRole = 'student' | 'faculty' | 'admin' | 'staff';
export type PilotGroup = 'ROAR Access Group' | 'Comparison Group' | 'Non-user / Not Yet Active' | 'Study Hall Qualified' | 'Study Hall Not Yet Qualified';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  role: UserRole;
  
  // Student fields
  gender?: string;
  studentId?: string;
  classification?: Classification;
  gpaBand?: GPABand;
  academicStatus?: AcademicStatus;
  major?: string;
  learningPreference?: string;
  
  // Tracking & Research Fields
  researchConsent?: boolean;
  researchConsentDate?: string;
  courseSections?: string[]; // e.g. ["BIOL-1301-01", "HIST-1301-02"]
  courseSection?: string; // Legacy field for single section
  instructor?: string;    // e.g. Dr. Smith
  cohort?: string;        // e.g. Summer Bridge 2024
  usageGroup?: string;    // e.g. Group A (Control), Group B (Experimental)
  pilotGroup?: PilotGroup; 
  studyHallHours?: number;
  firstLoginDate?: string;
  lastActiveDate?: string;
  
  commStyle?: CommunicationStyle;

  // Faculty/Admin fields
  department?: string;
  facultyRole?: string;
  permissionLevel?: 'Standard' | 'Elevated' | 'Superuser';
}

export type SourceType = 'pack' | 'file' | 'link' | 'note' | 'drive' | 'spreadsheet' | 'document';

export interface Source {
  id: string;
  type: SourceType;
  name: string;
  format?: 'pdf' | 'docx' | 'txt' | 'csv' | 'xlsx' | 'link' | 'note' | 'gdrive';
  details?: string;
  size?: string;
  addedAt: string;
}

export interface WellnessSurvey {
  id: string;
  timestamp: string;
  mood: number; // 1-5
  stressLevel: number; // 1-5
  sleepQuality: number; // 1-5
  focusScore: number; // 1-5
}

export interface StudyPack {
  id: string;
  category: Category;
  title: string;
  description: string;
  fileSize?: string;
  icon?: string;
  sources?: Source[];
  isDeletable?: boolean;
}

export interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: string;
  extra?: React.ReactNode;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  subject: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}
