
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAttendance } from '../context/AttendanceContext';
import { 
  Calendar, 
  Clock, 
  Send, 
  Plus,
  History,
  Info,
  ChevronRight,
  Sticker,
  Activity
} from 'lucide-react';
import { formatDisplayDate, formatDate } from '../utils/shiftUtils';

const LeavesPermissions: React.FC = () => {
  const { user: authUser } = useAuth();
  const { leaves, permissions, requestLeave, requestPermission, users } = useAttendance();
  
  // Fetch real-time user data to pick up balance changes from context
  const user = users.find(u => u.id === authUser?.id) || authUser;

  const [leaveType, setLeaveType] = useState<'CASUAL' | 'SICK'>('CASUAL');
  const [leaveDates, setLeaveDates] = useState({ start: '', end: '', reason: '' });
  const [permDetails, setPermDetails] = useState({ date: '', start: '', end: '', reason: '' });
  const [showPermForm, setShowPermForm] = useState(false);

  const userLeaves = leaves.filter(l => l.userId === user?.id);
  const userPerms = permissions.filter(p => p.userId === user?.id);

  const today = formatDate(new Date());

  const handleLeaveRequest = (e: React.FormEvent) => {
    e.preventDefault();
    requestLeave({
      id: Math.random().toString(36).substr(2, 9),
      userId: user!.id,
      type: leaveType,
      startDate: leaveDates.start,
      endDate: leaveDates.end,
      reason: leaveDates.reason,
      status: 'PENDING'
    });
    setLeaveDates({ start: '', end: '', reason: '' });
    alert('Leave request submitted!');
  };

  const handlePermRequest = (e: React.FormEvent) => {
    e.preventDefault();
    requestPermission({
      id: Math.random().toString(36).substr(2, 9),
      userId: user!.id,
      date: permDetails.date,
      startTime: permDetails.start,
      endTime: permDetails.end,
      reason: permDetails.reason,
      status: 'PENDING'
    });
    setPermDetails({ date: '', start: '', end: '', reason: '' });
    setShowPermForm(false);
    alert('Permission request submitted!');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Leaves & Permissions</h1>
          <p className="text-gray-500 font-medium">Manage your time off and short-duration absence requests.</p>
        </div>
      </div>

      {/* Leave Balance Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-blue-600 rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl shadow-blue-100 group transition-all hover:scale-[1.02]">
           <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest mb-1">Casual Leave Balance</p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-5xl font-black tracking-tighter">{user?.leaveBalance.casual ?? 5}</h2>
                  <span className="text-blue-100 font-bold text-sm">Days Available</span>
                </div>
              </div>
              <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md group-hover:rotate-12 transition-transform">
                <Sticker size={32} />
              </div>
           </div>
           <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        </div>

        <div className="bg-red-500 rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl shadow-red-100 group transition-all hover:scale-[1.02]">
           <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-red-100 text-[10px] font-black uppercase tracking-widest mb-1">Sick Leave Balance</p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-5xl font-black tracking-tighter">{user?.leaveBalance.sick ?? 4}</h2>
                  <span className="text-red-100 font-bold text-sm">Days Available</span>
                </div>
              </div>
              <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md group-hover:-rotate-12 transition-transform">
                <Activity size={32} />
              </div>
           </div>
           <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Leave Section */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-2xl">
                <Plus size={22} />
              </div>
              <h3 className="text-xl font-black text-gray-900">Request Leave</h3>
            </div>
            
            <form onSubmit={handleLeaveRequest} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setLeaveType('CASUAL')}
                  className={`py-4 rounded-2xl font-bold transition-all ${leaveType === 'CASUAL' ? 'bg-gray-900 text-white shadow-lg shadow-gray-200' : 'bg-gray-50 text-gray-500 border border-gray-100 hover:bg-gray-100'}`}
                >
                  Casual Leave
                </button>
                <button
                  type="button"
                  onClick={() => setLeaveType('SICK')}
                  className={`py-4 rounded-2xl font-bold transition-all ${leaveType === 'SICK' ? 'bg-gray-900 text-white shadow-lg shadow-gray-200' : 'bg-gray-50 text-gray-500 border border-gray-100 hover:bg-gray-100'}`}
                >
                  Sick Leave
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Start Date</label>
                  <input 
                    type="date" required value={leaveDates.start}
                    min={today}
                    onChange={e => setLeaveDates({...leaveDates, start: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 px-6 py-4 rounded-2xl outline-none focus:border-blue-500 font-bold text-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">End Date</label>
                  <input 
                    type="date" required value={leaveDates.end}
                    min={leaveDates.start || today}
                    onChange={e => setLeaveDates({...leaveDates, end: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 px-6 py-4 rounded-2xl outline-none focus:border-blue-500 font-bold text-gray-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Reason</label>
                <textarea 
                  rows={3} required value={leaveDates.reason}
                  onChange={e => setLeaveDates({...leaveDates, reason: e.target.value})}
                  placeholder="Provide a brief explanation for your leave..."
                  className="w-full bg-gray-50 border border-gray-200 px-6 py-4 rounded-2xl outline-none focus:border-blue-500 resize-none font-medium text-gray-700"
                ></textarea>
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-100 active:scale-95">
                <Send size={18} /> Submit Application
              </button>
            </form>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-purple-100 text-purple-600 p-3 rounded-2xl">
                <History size={22} />
              </div>
              <h3 className="text-xl font-black text-gray-900">Application History</h3>
            </div>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {userLeaves.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                  <Info className="mx-auto text-gray-300 mb-2" size={32} />
                  <p className="text-gray-400 font-bold">No applications found.</p>
                </div>
              )}
              {userLeaves.slice().reverse().map(l => (
                <div key={l.id} className="p-5 bg-gray-50 rounded-3xl border border-gray-100 flex items-center justify-between group hover:bg-white hover:shadow-md transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-10 rounded-full ${l.type === 'SICK' ? 'bg-red-400' : 'bg-blue-400'}`}></div>
                    <div>
                      <p className="text-sm font-black text-gray-900">{l.type} Leave</p>
                      <p className="text-xs font-bold text-gray-500">{formatDisplayDate(l.startDate)} - {formatDisplayDate(l.endDate)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      l.status === 'PENDING' ? 'bg-orange-100 text-orange-600' : 
                      l.status === 'APPROVED' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {l.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Permission Section */}
        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col h-full">
           <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 text-orange-600 p-3 rounded-2xl">
                <Clock size={22} />
              </div>
              <h3 className="text-xl font-black text-gray-900">Short Permission</h3>
            </div>
            <button 
              onClick={() => setShowPermForm(!showPermForm)}
              className={`text-xs font-black px-5 py-2.5 rounded-2xl transition-all flex items-center gap-2 ${showPermForm ? 'bg-gray-100 text-gray-600' : 'bg-orange-600 text-white shadow-lg shadow-orange-100'}`}
            >
              {showPermForm ? 'View List' : <><Plus size={14}/> New Request</>}
            </button>
          </div>

          {showPermForm ? (
             <form onSubmit={handlePermRequest} className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Permission Date</label>
                  <input 
                    type="date" required 
                    value={permDetails.date} 
                    min={today}
                    onChange={e => setPermDetails({...permDetails, date: e.target.value})} 
                    className="w-full bg-gray-50 border border-gray-200 px-6 py-4 rounded-2xl outline-none font-bold text-gray-700" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Start Time</label>
                     <input type="time" required value={permDetails.start} onChange={e => setPermDetails({...permDetails, start: e.target.value})} className="w-full bg-gray-50 border border-gray-200 px-6 py-4 rounded-2xl outline-none font-bold text-gray-700" />
                   </div>
                   <div>
                     <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">End Time</label>
                     <input type="time" required value={permDetails.end} onChange={e => setPermDetails({...permDetails, end: e.target.value})} className="w-full bg-gray-50 border border-gray-200 px-6 py-4 rounded-2xl outline-none font-bold text-gray-700" />
                   </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Reason</label>
                  <input type="text" required placeholder="Reason for short leave" value={permDetails.reason} onChange={e => setPermDetails({...permDetails, reason: e.target.value})} className="w-full bg-gray-50 border border-gray-200 px-6 py-4 rounded-2xl outline-none font-bold text-gray-700" />
                </div>
                <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 mb-4">
                  <p className="text-xs text-orange-700 font-bold flex items-center gap-2">
                    <Info size={14} /> Maximum 2 hours per permission. 2 permissions per month.
                  </p>
                </div>
                <button type="submit" className="w-full bg-orange-600 text-white font-black py-5 rounded-2xl hover:bg-orange-700 shadow-xl shadow-orange-100 active:scale-95 transition-all">
                  Request Permission
                </button>
             </form>
          ) : (
            <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
              {userPerms.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
                  <Clock className="mx-auto text-gray-300 mb-4" size={48} />
                  <p className="text-gray-400 font-black">No permission requests found.</p>
                </div>
              )}
              {userPerms.slice().reverse().map(p => (
                <div key={p.id} className="p-6 bg-gray-50 rounded-[32px] border border-gray-100 flex items-center justify-between group hover:bg-white hover:shadow-lg transition-all">
                  <div className="flex items-center gap-4">
                    <div className="bg-orange-100 text-orange-600 p-3 rounded-2xl group-hover:bg-orange-600 group-hover:text-white transition-all">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-900">{formatDisplayDate(p.date)}</p>
                      <p className="text-xs font-bold text-gray-500">{p.startTime} - {p.endTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      p.status === 'PENDING' ? 'bg-orange-100 text-orange-600' : 
                      p.status === 'APPROVED' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {p.status}
                    </span>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-900 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeavesPermissions;
