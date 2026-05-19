import { UserProfile, WellnessSurvey } from '../types';

export type EventType = 
  | 'onboarding_complete' 
  | 'prompt_sent' 
  | 'tool_generated' 
  | 'wellness_checkin' 
  | 'resource_click'
  | 'support_resource_click'
  | 'study_pack_selected'
  | 'source_added'
  | 'source_viewed'
  | 'quiz_completed';

export interface AnalyticsEvent {
  id: string;
  type: EventType;
  timestamp: string;
  userId: string;
  userEmail: string;
  userRole: string;
  payload?: any;
  // Included directly for easier aggregation without multi-pass lookups
  userClassification?: string;
  userGPABand?: string;
  userAcademicStatus?: string;
  userGender?: string;
  userMajor?: string;
  userStudentId?: string;
  userCourseSection?: string;
  userInstructor?: string;
  userCohort?: string;
  userUsageGroup?: string;
  userPilotGroup?: string;
  userStudyHallHours?: number;
}

const STORAGE_KEY = 'roar_pilot_events';

export const trackEvent = (
  type: EventType, 
  user: UserProfile, 
  payload?: any
) => {
  const event: AnalyticsEvent = {
    id: 'evt_' + Math.random().toString(36).substr(2, 9),
    type,
    timestamp: new Date().toISOString(),
    userId: user.id,
    userEmail: user.email,
    userRole: user.role,
    payload,
    userClassification: user.classification,
    userGPABand: user.gpaBand,
    userAcademicStatus: user.academicStatus,
    userGender: user.gender,
    userMajor: user.major,
    userStudentId: user.studentId,
    userCourseSection: user.courseSection,
    userInstructor: user.instructor,
    userCohort: user.cohort,
    userUsageGroup: user.usageGroup,
    userPilotGroup: user.pilotGroup,
    userStudyHallHours: user.studyHallHours
  };

  try {
    const existingEvents = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...existingEvents, event]));
  } catch (e) {
    console.error('Failed to store analytics event', e);
  }
};

export const getStoredEvents = (): AnalyticsEvent[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch (e) {
    return [];
  }
};

export const clearStoredEvents = () => {
  localStorage.removeItem(STORAGE_KEY);
};
