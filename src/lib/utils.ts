import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function incrementCounter(key: string) {
  const current = localStorage.getItem(`roar_metric_${key}`) || '0';
  localStorage.setItem(`roar_metric_${key}`, (parseInt(current) + 1).toString());
}

export function getCounter(key: string): number {
  const current = localStorage.getItem(`roar_metric_${key}`) || '0';
  return parseInt(current);
}

export function logROARActivity(actionName: string) {
  try {
    const studentId = localStorage.getItem('roar_unique_id') || 'unidentified';
    const logRaw = localStorage.getItem('roar_usage_log');
    const logs = logRaw ? JSON.parse(logRaw) : [];
    logs.push({
      student_id: studentId,
      action: actionName,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('roar_usage_log', JSON.stringify(logs));
  } catch (e) {
    console.error('Error logging ROAR activity:', e);
  }
}
