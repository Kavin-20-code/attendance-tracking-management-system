
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AttendanceRecord, LeaveRequest, PermissionRequest, Holiday, BroadcastMessage, User } from '../types';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { HOLIDAYS as INITIAL_HOLIDAYS } from '../data/holidays';
import { DUMMY_ATTENDANCE } from '../data/attendance';
import { DUMMY_USERS } from '../data/employees';

interface AttendanceContextType {
  users: User[];
  records: AttendanceRecord[];
  leaves: LeaveRequest[];
  permissions: PermissionRequest[];
  holidays: Holiday[];
  broadcasts: BroadcastMessage[];
  addUser: (user: User) => void;
  removeUser: (id: string) => void;
  addRecord: (record: AttendanceRecord) => void;
  updateRecord: (id: string, updates: Partial<AttendanceRecord>) => void;
  requestLeave: (leave: LeaveRequest) => void;
  requestPermission: (perm: PermissionRequest) => void;
  updateLeaveStatus: (id: string, status: 'APPROVED' | 'REJECTED') => void;
  updatePermissionStatus: (id: string, status: 'APPROVED' | 'REJECTED') => void;
  getRecordsByUser: (userId: string) => AttendanceRecord[];
  addHoliday: (holiday: Holiday) => void;
  removeHoliday: (id: string) => void;
  updateHoliday: (id: string, holiday: Holiday) => void;
  sendBroadcast: (broadcast: BroadcastMessage) => void;
  deleteBroadcast: (id: string) => void;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const AttendanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = storage.get<User[]>(STORAGE_KEYS.USERS, []);
    return saved.length > 0 ? saved : DUMMY_USERS;
  });

  const [records, setRecords] = useState<AttendanceRecord[]>(() => {
    const saved = storage.get<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, []);
    return saved.length > 0 ? saved : DUMMY_ATTENDANCE;
  });
  
  const [leaves, setLeaves] = useState<LeaveRequest[]>(() => storage.get(STORAGE_KEYS.LEAVES, []));
  const [permissions, setPermissions] = useState<PermissionRequest[]>(() => storage.get(STORAGE_KEYS.PERMISSIONS, []));
  const [broadcasts, setBroadcasts] = useState<BroadcastMessage[]>(() => storage.get('ai_smart_broadcasts', []));
  
<<<<<<< HEAD
=======
  // FIXED: Proper initialization for holidays to distinguish between "unset" and "empty list"
>>>>>>> da66adcd18e78518c81158028a20413fbe508c02
  const [holidays, setHolidays] = useState<Holiday[]>(() => {
    const saved = localStorage.getItem('ai_smart_holidays');
    if (saved === null) return INITIAL_HOLIDAYS;
    try {
      return JSON.parse(saved);
    } catch {
      return INITIAL_HOLIDAYS;
    }
  });

  useEffect(() => storage.set(STORAGE_KEYS.USERS, users), [users]);
  useEffect(() => storage.set(STORAGE_KEYS.ATTENDANCE, records), [records]);
  useEffect(() => storage.set(STORAGE_KEYS.LEAVES, leaves), [leaves]);
  useEffect(() => storage.set(STORAGE_KEYS.PERMISSIONS, permissions), [permissions]);
  useEffect(() => storage.set('ai_smart_holidays', holidays), [holidays]);
  useEffect(() => storage.set('ai_smart_broadcasts', broadcasts), [broadcasts]);

  const addUser = (user: User) => {
    setUsers(prev => [...prev, user]);
  };

  const removeUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const addRecord = (record: AttendanceRecord) => {
    setRecords(prev => {
      const filtered = prev.filter(r => !(r.date === record.date && r.userId === record.userId));
      return [...filtered, record];
    });
  };

  const updateRecord = (id: string, updates: Partial<AttendanceRecord>) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const requestLeave = (leave: LeaveRequest) => {
    setLeaves(prev => [...prev, leave]);
  };

  const requestPermission = (perm: PermissionRequest) => {
    setPermissions(prev => [...prev, perm]);
  };

  const updateLeaveStatus = (id: string, status: 'APPROVED' | 'REJECTED') => {
<<<<<<< HEAD
    setLeaves(prev => {
      const leaveIndex = prev.findIndex(l => l.id === id);
      if (leaveIndex === -1) return prev;
      
      const leave = prev[leaveIndex];
      // Only process balance reduction if it was pending and is being approved
      if (leave.status === 'PENDING' && status === 'APPROVED') {
        const s = leave.startDate.split('-').map(Number);
        const e = leave.endDate.split('-').map(Number);
        const startDate = new Date(s[0], s[1] - 1, s[2]);
        const endDate = new Date(e[0], e[1] - 1, e[2]);
        
        const diffTime = endDate.getTime() - startDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        setUsers(prevUsers => prevUsers.map(u => {
          if (u.id === leave.userId) {
            const typeKey = leave.type.toLowerCase() as 'casual' | 'sick';
            return {
              ...u,
              leaveBalance: {
                ...u.leaveBalance,
                [typeKey]: Math.max(0, u.leaveBalance[typeKey] - diffDays)
              }
            };
          }
          return u;
        }));
      }

      return prev.map(l => l.id === id ? { ...l, status, updatedAt: new Date().toISOString() } : l);
    });
  };

  const updatePermissionStatus = (id: string, status: 'APPROVED' | 'REJECTED') => {
    setPermissions(prev => {
      const permIndex = prev.findIndex(p => p.id === id);
      if (permIndex === -1) return prev;

      const perm = prev[permIndex];
      // Only process usage increment if it was pending and is being approved
      if (perm.status === 'PENDING' && status === 'APPROVED') {
        setUsers(prevUsers => prevUsers.map(u => {
          if (u.id === perm.userId) {
            return {
              ...u,
              permissionsUsed: u.permissionsUsed + 1
            };
          }
          return u;
        }));
      }

      return prev.map(p => p.id === id ? { ...p, status, updatedAt: new Date().toISOString() } : p);
    });
=======
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  };

  const updatePermissionStatus = (id: string, status: 'APPROVED' | 'REJECTED') => {
    setPermissions(prev => prev.map(p => p.id === id ? { ...p, status } : p));
>>>>>>> da66adcd18e78518c81158028a20413fbe508c02
  };

  const getRecordsByUser = (userId: string) => {
    return records.filter(r => r.userId === userId);
  };

  const addHoliday = (holiday: Holiday) => setHolidays(prev => [...prev, holiday]);
  
  const removeHoliday = (id: string) => {
    setHolidays(prev => prev.filter(h => h.id !== id));
  };

  const updateHoliday = (id: string, updated: Holiday) => setHolidays(prev => prev.map(h => h.id === id ? updated : h));

  const sendBroadcast = (broadcast: BroadcastMessage) => setBroadcasts(prev => [...prev, broadcast]);
  const deleteBroadcast = (id: string) => setBroadcasts(prev => prev.filter(b => b.id !== id));

  return (
    <AttendanceContext.Provider value={{ 
      users, records, leaves, permissions, holidays, broadcasts,
      addUser, removeUser, addRecord, updateRecord, requestLeave, requestPermission,
      updateLeaveStatus, updatePermissionStatus, getRecordsByUser,
      addHoliday, removeHoliday, updateHoliday, sendBroadcast, deleteBroadcast
    }}>
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) throw new Error('useAttendance must be used within AttendanceProvider');
  return context;
};
