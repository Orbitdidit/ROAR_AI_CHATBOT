import { AnalyticsEvent } from './analytics';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';

export interface PilotReportData {
  onboardingTotal: number;
  activeUsers: number;
  lowEngagementUsers: number;
  toolEngagement: Record<string, number>;
  promptTrends: { date: string; count: number }[];
  wellnessSummary: {
    avgPulse: number;
    totalCheckins: number;
    topConcern?: string;
  };
  cohortSummary: Record<string, number>;
  eventsByType: Record<string, number>;
}

export function generateReportData(events: AnalyticsEvent[]): PilotReportData {
  const onboardingEvents = events.filter(e => e.type === 'onboarding_complete');
  const userIds = new Set(onboardingEvents.map(e => e.userId));
  const activeUserIds = new Set(events.filter(e => e.type !== 'onboarding_complete').map(e => e.userId));
  
  const toolUsage: Record<string, number> = {};
  events.filter(e => e.type === 'tool_generated').forEach(e => {
    const tool = e.payload?.tool || 'Unknown';
    toolUsage[tool] = (toolUsage[tool] || 0) + 1;
  });

  const promptsByDate: Record<string, number> = {};
  events.filter(e => e.type === 'prompt_sent').forEach(e => {
    const date = new Date(e.timestamp).toLocaleDateString();
    promptsByDate[date] = (promptsByDate[date] || 0) + 1;
  });

  const promptTrends = Object.entries(promptsByDate)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const wellnessEvents = events.filter(e => e.type === 'wellness_checkin');
  const avgPulse = wellnessEvents.length > 0 
    ? Math.round((wellnessEvents.reduce((acc, e) => acc + (e.payload?.mood || 3), 0) / (wellnessEvents.length * 5)) * 100)
    : 0;

  const cohorts: Record<string, number> = {};
  onboardingEvents.forEach(e => {
    const cohort = e.userCohort || e.userClassification || 'General';
    cohorts[cohort] = (cohorts[cohort] || 0) + 1;
  });

  const eventsByType: Record<string, number> = {};
  events.forEach(e => {
    eventsByType[e.type] = (eventsByType[e.type] || 0) + 1;
  });

  return {
    onboardingTotal: onboardingEvents.length,
    activeUsers: activeUserIds.size,
    lowEngagementUsers: onboardingEvents.length - activeUserIds.size,
    toolEngagement: toolUsage,
    promptTrends,
    wellnessSummary: {
      avgPulse,
      totalCheckins: wellnessEvents.length
    },
    cohortSummary: cohorts,
    eventsByType
  };
}

export function exportToCSV(events: AnalyticsEvent[]) {
  const headers = ['Timestamp', 'User Email', 'Student ID', 'Event Type', 'Role', 'Classification', 'GPA Band', 'Status', 'Class', 'Instructor', 'Cohort', 'Group', 'Pilot Group', 'Study Hall Hours', 'Details'];
  const rows = events.map(e => [
    e.timestamp,
    e.userEmail,
    e.userStudentId || '',
    e.type,
    e.userRole,
    e.userClassification || '',
    e.userGPABand || '',
    e.userAcademicStatus || '',
    e.userCourseSection || '',
    e.userInstructor || '',
    e.userCohort || '',
    e.userUsageGroup || '',
    e.userPilotGroup || '',
    e.userStudyHallHours || 0,
    JSON.stringify(e.payload || {})
  ]);

  const csvContent = [headers, ...rows].map(row => row.map(v => `"${v}"`).join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `ROAR_Pilot_Data_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToXLSX(events: AnalyticsEvent[]) {
  const data = events.map(e => ({
    Timestamp: e.timestamp,
    'User Email': e.userEmail,
    'Student ID': e.userStudentId || '',
    'Event Type': e.type,
    Role: e.userRole,
    Classification: e.userClassification || '',
    'GPA Band': e.userGPABand || '',
    'Academic Status': e.userAcademicStatus || '',
    'Course Section': e.userCourseSection || '',
    Instructor: e.userInstructor || '',
    Cohort: e.userCohort || '',
    'Usage Group': e.userUsageGroup || '',
    'Pilot Group': e.userPilotGroup || '',
    'Study Hall Hours': e.userStudyHallHours || 0,
    Payload: JSON.stringify(e.payload || {})
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Pilot Events');
  XLSX.writeFile(workbook, `ROAR_Pilot_Analysis_${new Date().toISOString().split('T')[0]}.xlsx`);
}

export function generatePDFReport(data: PilotReportData, instructorName: string) {
  const doc = new jsPDF();
  const date = new Date().toLocaleDateString();
  
  // Header
  doc.setFontSize(22);
  doc.setTextColor(110, 0, 0); // Maroon
  doc.text('ROAR AI Assistant - Pilot Analysis Report', 20, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${date}`, 20, 30);
  doc.text(`Instructor/Admin: ${instructorName}`, 20, 35);
  doc.text('Texas Southern University - Phase 1 Pilot Stage', 20, 40);
  
  // Horizontal Line
  doc.setDrawColor(110, 0, 0);
  doc.line(20, 45, 190, 45);
  
  // Executive Summary
  doc.setFontSize(16);
  doc.setTextColor(37, 39, 39); // Charcoal
  doc.text('Executive Summary', 20, 60);
  
  doc.setFontSize(11);
  doc.setTextColor(80);
  const summaryText = `This report summarizes the engagement metrics recorded during the Phase 1 Pilot of the ROAR AI Assistant. A total of ${data.onboardingTotal} students successfully onboarded onto the platform, with ${data.activeUsers} students actively engaging with AI tools and chat features.`;
  doc.text(doc.splitTextToSize(summaryText, 170), 20, 70);
  
  // Metrics Grid
  doc.setFontSize(14);
  doc.setTextColor(37, 39, 39);
  doc.text('Engagement Metrics', 20, 95);
  
  doc.setFontSize(10);
  doc.text(`Total Onboarded: ${data.onboardingTotal}`, 25, 105);
  doc.text(`Active Users: ${data.activeUsers}`, 25, 112);
  doc.text(`Low Engagement: ${data.lowEngagementUsers}`, 25, 119);
  doc.text(`Avg Wellness Pulse: ${data.wellnessSummary.avgPulse}%`, 25, 126);
  
  // Tool Usage
  doc.setFontSize(14);
  doc.text('Tool Utilization', 110, 95);
  doc.setFontSize(10);
  let yPos = 105;
  Object.entries(data.toolEngagement).forEach(([tool, count]) => {
    doc.text(`${tool}: ${count} generations`, 115, yPos);
    yPos += 7;
  });
  
  // Cohort Distribution
  doc.setFontSize(14);
  doc.text('Cohort Distribution', 20, 145);
  doc.setFontSize(10);
  yPos = 155;
  Object.entries(data.cohortSummary).forEach(([cohort, count]) => {
    doc.text(`${cohort}: ${count} students`, 25, yPos);
    yPos += 7;
  });

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text('This data is for internal university pilot evaluation only. Metadata captured via ROAR AI Analytics Engine.', 20, 280);
  
  doc.save(`ROAR_Narrative_Report_${new Date().toISOString().split('T')[0]}.pdf`);
}
