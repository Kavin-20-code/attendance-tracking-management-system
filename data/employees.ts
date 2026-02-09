
import { User, ShiftType } from '../types';

export const DUMMY_USERS: User[] = [
  {
    id: '1',
    username: 'Kavin',
    password: '1234',
    role: 'USER',
    name: 'Kavin Kumar',
    department: 'Engineering',
    assignedShift: ShiftType.GENERAL,
    leaveBalance: { casual: 5, sick: 4 },
    permissionsUsed: 0
  },
  {
    id: '2',
    username: 'Arun',
    password: '1234',
    role: 'USER',
    name: 'Arun Raj',
    department: 'Product',
    assignedShift: ShiftType.A,
    leaveBalance: { casual: 5, sick: 4 },
    permissionsUsed: 1
  },
  {
    id: '3',
    username: 'Meena',
    password: '1234',
    role: 'USER',
    name: 'Meena Kumari',
    department: 'Design',
    assignedShift: ShiftType.B,
    leaveBalance: { casual: 5, sick: 4 },
    permissionsUsed: 0
  },
  {
    id: '4',
    username: 'Ravi',
    password: '1234',
    role: 'USER',
    name: 'Ravi Teja',
    department: 'Sales',
    assignedShift: ShiftType.C,
    leaveBalance: { casual: 5, sick: 4 },
    permissionsUsed: 0
  },
  {
    id: '5',
    username: 'Priya',
    password: '1234',
    role: 'USER',
    name: 'Priya Sharma',
    department: 'HR',
    assignedShift: ShiftType.GENERAL,
    leaveBalance: { casual: 5, sick: 4 },
    permissionsUsed: 0
  },
  {
    id: 'admin',
    username: 'Admin',
    password: '1234',
    role: 'ADMIN',
    name: 'Systems Administrator',
    department: 'IT',
    assignedShift: ShiftType.GENERAL,
    leaveBalance: { casual: 99, sick: 99 },
    permissionsUsed: 0
  }
];
