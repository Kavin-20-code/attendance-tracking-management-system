
import { User } from '../types';

export const DUMMY_USERS: User[] = [
  {
    id: '1',
    username: 'Kavin',
    password: '1234',
    role: 'USER',
    name: 'Kavin Kumar',
    department: 'Engineering',
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
    leaveBalance: { casual: 99, sick: 99 },
    permissionsUsed: 0
  }
];
