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
