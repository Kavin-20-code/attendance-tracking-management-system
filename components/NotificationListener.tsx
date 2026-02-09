
import React, { useEffect, useRef } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { LeaveRequest, PermissionRequest } from '../types';

/**
 * Background component that watches for state changes 
 * and triggers toast notifications when status updates occur.
 */
const NotificationListener: React.FC = () => {
  const { leaves, permissions, broadcasts } = useAttendance();
  const { user } = useAuth();
  const { showNotification } = useNotifications();
  
  // Track previously known statuses to detect changes
  const prevLeavesRef = useRef<Record<string, string>>({});
  const prevPermsRef = useRef<Record<string, string>>({});
  const prevBroadcastsRef = useRef<number>(broadcasts.length);

  useEffect(() => {
    if (!user) return;

    // Check Leaves
    leaves.filter(l => l.userId === user.id).forEach(leave => {
      const prevStatus = prevLeavesRef.current[leave.id];
      if (prevStatus === 'PENDING' && leave.status !== 'PENDING') {
        const type = leave.status === 'APPROVED' ? 'SUCCESS' : 'ERROR';
        showNotification(
          type, 
          `Leave ${leave.status}`, 
          `Your ${leave.type.toLowerCase()} leave for ${leave.startDate} has been ${leave.status.toLowerCase()}.`
        );
      }
      prevLeavesRef.current[leave.id] = leave.status;
    });

    // Check Permissions
    permissions.filter(p => p.userId === user.id).forEach(perm => {
      const prevStatus = prevPermsRef.current[perm.id];
      if (prevStatus === 'PENDING' && perm.status !== 'PENDING') {
        const type = perm.status === 'APPROVED' ? 'SUCCESS' : 'ERROR';
        showNotification(
          type, 
          `Permission ${perm.status}`, 
          `Your short permission for ${perm.date} has been ${perm.status.toLowerCase()}.`
        );
      }
      prevPermsRef.current[perm.id] = perm.status;
    });

    // Check Broadcasts
    if (broadcasts.length > prevBroadcastsRef.current) {
      const latest = broadcasts[broadcasts.length - 1];
      showNotification('INFO', 'New Broadcast', latest.title);
    }
    prevBroadcastsRef.current = broadcasts.length;

  }, [leaves, permissions, broadcasts, user, showNotification]);

  return null;
};

export default NotificationListener;
