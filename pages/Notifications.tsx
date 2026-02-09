
import React from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { useAuth } from '../context/AuthContext';
import { Bell, Info, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { formatDisplayDate } from '../utils/shiftUtils';

type NotificationType = 'BROADCAST' | 'LEAVE_UPDATE' | 'PERM_UPDATE';

interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  status?: 'APPROVED' | 'REJECTED' | 'PENDING';
}

const Notifications: React.FC = () => {
  const { broadcasts, leaves, permissions } = useAttendance();
  const { user } = useAuth();

  // Aggregate global broadcasts
  const broadcastNotifs: AppNotification[] = broadcasts.map(b => ({
    id: b.id,
    type: 'BROADCAST',
    title: b.title,
    message: b.message,
    timestamp: b.timestamp
  }));

  // Aggregate user-specific leave updates
  const leaveNotifs: AppNotification[] = leaves
    .filter(l => l.userId === user?.id && l.status !== 'PENDING')
    .map(l => ({
      id: l.id,
      type: 'LEAVE_UPDATE',
      title: `${l.type.charAt(0) + l.type.slice(1).toLowerCase()} Leave ${l.status === 'APPROVED' ? 'Approved' : 'Rejected'}`,
      message: `Your request for ${formatDisplayDate(l.startDate)} to ${formatDisplayDate(l.endDate)} has been ${l.status.toLowerCase()} by the administrator.`,
      timestamp: l.updatedAt || l.startDate,
      status: l.status
    }));

  // Aggregate user-specific permission updates
  const permNotifs: AppNotification[] = permissions
    .filter(p => p.userId === user?.id && p.status !== 'PENDING')
    .map(p => ({
      id: p.id,
      type: 'PERM_UPDATE',
      title: `Short Permission ${p.status === 'APPROVED' ? 'Approved' : 'Rejected'}`,
      message: `Your short permission request for ${formatDisplayDate(p.date)} (${p.startTime} - ${p.endTime}) has been ${p.status.toLowerCase()}.`,
      timestamp: p.updatedAt || p.date,
      status: p.status
    }));

  // Combine and sort by timestamp
  const allNotifications = [...broadcastNotifs, ...leaveNotifs, ...permNotifs].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const getIcon = (notif: AppNotification) => {
    if (notif.type === 'BROADCAST') return <Info size={24} />;
    if (notif.status === 'APPROVED') return <CheckCircle size={24} />;
    if (notif.status === 'REJECTED') return <XCircle size={24} />;
    return <Clock size={24} />;
  };

  const getIconColor = (notif: AppNotification) => {
    if (notif.type === 'BROADCAST') return 'bg-blue-100 text-blue-600';
    if (notif.status === 'APPROVED') return 'bg-green-100 text-green-600';
    if (notif.status === 'REJECTED') return 'bg-red-100 text-red-600';
    return 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Inbox & Updates</h1>
        <p className="text-gray-500 font-medium">Stay updated with broadcasts and application status changes.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 max-w-4xl">
        {allNotifications.length === 0 ? (
          <div className="bg-white p-20 rounded-[40px] border border-gray-100 flex flex-col items-center justify-center text-center shadow-sm">
            <div className="bg-gray-50 p-6 rounded-full text-gray-300 mb-6">
              <Bell size={48} />
            </div>
            <h3 className="text-xl font-black text-gray-800 mb-2">Your inbox is empty</h3>
            <p className="text-gray-400 font-medium">Updates from admin and status of your requests will appear here.</p>
          </div>
        ) : (
          allNotifications.map((n) => (
            <div key={n.id} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex items-start gap-6 hover:shadow-md transition-shadow group">
              <div className={`${getIconColor(n)} p-4 rounded-3xl group-hover:scale-110 transition-transform`}>
                {getIcon(n)}
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                  <h3 className="text-xl font-black text-gray-900">{n.title}</h3>
                  <div className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                    <Calendar size={12} />
                    {new Date(n.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <p className="text-gray-600 font-medium leading-relaxed">{n.message}</p>
                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-4">
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                    n.type === 'BROADCAST' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-500'
                  }`}>
                    {n.type === 'BROADCAST' ? 'Broadcast' : 'Personal Update'}
                  </span>
                  {n.status && (
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                      n.status === 'APPROVED' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {n.status}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
