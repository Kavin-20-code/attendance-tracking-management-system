
export type Role = 'ADMIN' | 'USER';

export enum ShiftType {
  GENERAL = 'General Shift',
  A = 'A Shift',
  B = 'B Shift',
  C = 'C Shift',
  OFF = 'Week Off'
}

export interface User {
  id: string;
  username: string;
  password?: string;
  role: Role;
  name: string;
  department: string;
  assignedShift: ShiftType;
  leaveBalance: {
    casual: number;
    sick: number;
  };
  permissionsUsed: number; // monthly
}

export interface Holiday {
  id: string;
  date: string; // YYYY-MM-DD
  name: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  shift: ShiftType;
  status: 'PRESENT' | 'ABSENT' | 'WEEK_OFF' | 'HOLIDAY' | 'LATE PRESENT';
  lateMinutes: number;
}

export interface LeaveRequest {
  id: string;
  userId: string;
  type: 'CASUAL' | 'SICK';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  updatedAt?: string;
}

export interface PermissionRequest {
  id: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  updatedAt?: string;
}

export interface BroadcastMessage {
  id: string;
  senderId: string;
  title: string;
  message: string;
  timestamp: string;
}
