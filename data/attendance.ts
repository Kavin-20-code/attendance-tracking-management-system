
import { AttendanceRecord, ShiftType } from '../types';

const getRelativeDate = (daysAgo: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

// Generate a mix of recent records
export const DUMMY_ATTENDANCE: AttendanceRecord[] = [
  // Kavin's History (User ID: 1)
  {
    id: 'rec_k1',
    userId: '1',
    date: getRelativeDate(1), // Yesterday
    checkIn: '04:44',
    checkOut: '06:50',
    shift: ShiftType.C,
    status: 'LATE PRESENT',
    lateMinutes: 374
  },
  {
    id: 'rec_k2',
    userId: '1',
    date: getRelativeDate(2),
    checkIn: '09:20',
    checkOut: '17:35',
    shift: ShiftType.GENERAL,
    status: 'PRESENT',
    lateMinutes: 0
  },
  {
    id: 'rec_k3',
    userId: '1',
    date: getRelativeDate(3),
    checkIn: '22:25',
    checkOut: '06:35',
    shift: ShiftType.C,
    status: 'PRESENT',
    lateMinutes: 0
  },
  {
    id: 'rec_k4',
    userId: '1',
    date: getRelativeDate(4),
    checkIn: '09:40',
    checkOut: '17:45',
    shift: ShiftType.GENERAL,
    status: 'LATE PRESENT',
    lateMinutes: 10
  },
  
  // Arun's History (User ID: 2)
  {
    id: 'rec_a1',
    userId: '2',
    date: getRelativeDate(1),
    checkIn: '06:25',
    checkOut: '14:35',
    shift: ShiftType.A,
    status: 'PRESENT',
    lateMinutes: 0
  },
  {
    id: 'rec_a2',
    userId: '2',
    date: getRelativeDate(2),
    checkIn: '07:15',
    checkOut: '14:45',
    shift: ShiftType.A,
    status: 'LATE PRESENT',
    lateMinutes: 45
  },

  // Meena's History (User ID: 3)
  {
    id: 'rec_m1',
    userId: '3',
    date: getRelativeDate(1),
    checkIn: '14:20',
    checkOut: '22:35',
    shift: ShiftType.B,
    status: 'PRESENT',
    lateMinutes: 0
  },
  {
    id: 'rec_m2',
    userId: '3',
    date: getRelativeDate(2),
    checkIn: '15:45',
    checkOut: '23:00',
    shift: ShiftType.B,
    status: 'LATE PRESENT',
    lateMinutes: 75
  }
];
