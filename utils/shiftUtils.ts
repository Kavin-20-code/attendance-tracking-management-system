
import { ShiftType } from '../types';

export const SHIFT_TIMES = {
  [ShiftType.GENERAL]: { start: '09:30', end: '17:30', label: '09:30 AM - 05:30 PM' },
  [ShiftType.A]: { start: '06:30', end: '14:30', label: '06:30 AM - 02:30 PM' },
  [ShiftType.B]: { start: '14:30', end: '22:30', label: '02:30 PM - 10:30 PM' },
  [ShiftType.C]: { start: '22:30', end: '06:30', label: '10:30 PM - 06:30 AM' },
};

export const detectShift = (timeStr: string): ShiftType => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes;

  if (totalMinutes >= 1350 || totalMinutes < 390) return ShiftType.C;
  if (totalMinutes >= 390 && totalMinutes < 570) return ShiftType.A;
  if (totalMinutes >= 570 && totalMinutes < 870) return ShiftType.GENERAL;
  return ShiftType.B;
};

export const calculateLate = (checkIn: string, shift: ShiftType): number => {
  if (shift === ShiftType.OFF) return 0;
  
  const [checkH, checkM] = checkIn.split(':').map(Number);
  const checkTotal = checkH * 60 + checkM;
  
  const [shiftH, shiftM] = SHIFT_TIMES[shift].start.split(':').map(Number);
  const shiftTotal = shiftH * 60 + shiftM;

  if (shift === ShiftType.C) {
    if (checkTotal >= shiftTotal) return checkTotal - shiftTotal;
    if (checkTotal < 390) return (1440 - shiftTotal) + checkTotal;
    return 0;
  }

  const diff = checkTotal - shiftTotal;
  return diff > 0 ? diff : 0;
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const formatTime = (date: Date): string => {
  return date.toTimeString().split(' ')[0].substring(0, 5);
};

/**
 * Formats a YYYY-MM-DD string into a readable format.
 * Uses local time construction to avoid timezone shifting bugs.
 */
export const formatDisplayDate = (dateStr: string): string => {
  if (!dateStr) return 'N/A';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // 0-indexed
  const day = parseInt(parts[2], 10);
  
  const date = new Date(year, month, day);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

export const isSunday = (dateStr: string): boolean => {
  return new Date(dateStr).getDay() === 0;
};
