
import React from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { Bell, Info, Calendar } from 'lucide-react';

const Notifications: React.FC = () => {
  const { broadcasts } = useAttendance();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Notifications</h1>
        <p className="text-gray-500 font-medium">Important updates from the administration.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 max-w-4xl">
        {broadcasts.length === 0 ? (
          <div className="bg-white p-20 rounded-[40px] border border-gray-100 flex flex-col items-center justify-center text-center shadow-sm">
            <div className="bg-gray-50 p-6 rounded-full text-gray-300 mb-6">
              <Bell size={48} />
            </div>
            <h3 className="text-xl font-black text-gray-800 mb-2">No messages yet</h3>
            <p className="text-gray-400 font-medium">When the admin sends a broadcast, it will appear here.</p>
          </div>
        ) : (
          broadcasts.slice().reverse().map((b) => (
            <div key={b.id} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex items-start gap-6 hover:shadow-md transition-shadow">
              <div className="bg-blue-100 text-blue-600 p-4 rounded-3xl">
                <Info size={24} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-black text-gray-900">{b.title}</h3>
                  <div className="flex items-center gap-2 text-gray-400 text-sm font-bold">
                    <Calendar size={14} />
                    {new Date(b.timestamp).toLocaleString()}
                  </div>
                </div>
                <p className="text-gray-600 font-medium leading-relaxed">{b.message}</p>
                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sent By Admin</span>
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
