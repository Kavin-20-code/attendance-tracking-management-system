
import React, { useState } from 'react';
import { 
  Users, 
  Clock, 
  CalendarCheck, 
  AlertCircle,
  TrendingUp,
  PieChart as PieChartIcon,
  Send,
  BellRing,
  Download
} from 'lucide-react';
import { useAttendance } from '../context/AttendanceContext';
import { useAuth } from '../context/AuthContext';
import { formatDate, SHIFT_TIMES } from '../utils/shiftUtils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const AdminDashboard: React.FC = () => {
  const { records, leaves, sendBroadcast, users } = useAttendance();
  const { user } = useAuth();
  const todayStr = formatDate(new Date());
  
  const [broadcastForm, setBroadcastForm] = useState({ title: '', message: '' });

  const presentToday = records.filter(r => r.date === todayStr && r.checkIn).length;
  const pendingLeaves = leaves.filter(l => l.status === 'PENDING').length;
  const lateCheckins = records.filter(r => r.status === 'LATE PRESENT').length;

  const stats = [
    { label: 'Total Employees', value: users.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Present Today', value: presentToday, icon: CalendarCheck, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Pending Leaves', value: pendingLeaves, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Total Late Marks', value: lateCheckins, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  const handleDownloadReport = () => {
    if (records.length === 0) {
      alert("No attendance records found to export.");
      return;
    }

    const headers = ['Date', 'Employee', 'Department', 'Shift', 'Check In', 'Check Out', 'Status', 'Late Minutes'];
    const rows = records.map(r => {
      const emp = users.find(u => u.id === r.userId);
      return [
        r.date,
        emp?.name || 'Unknown',
        emp?.department || 'N/A',
        r.shift,
        r.checkIn || 'N/A',
        r.checkOut || 'N/A',
        r.status,
        r.lateMinutes
      ].map(val => `"${val}"`).join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Full_Attendance_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastForm.title || !broadcastForm.message) return;
    
    sendBroadcast({
      id: Math.random().toString(36).substr(2, 9),
      senderId: user?.id || 'admin',
      title: broadcastForm.title,
      message: broadcastForm.message,
      timestamp: new Date().toISOString()
    });
    
    setBroadcastForm({ title: '', message: '' });
    alert('Broadcast sent to all employees!');
  };

  const attendanceData = [
    { name: 'Mon', count: 8 },
    { name: 'Tue', count: 12 },
    { name: 'Wed', count: 10 },
    { name: 'Thu', count: 15 },
    { name: 'Fri', count: 13 },
    { name: 'Sat', count: 5 },
  ];

  const shiftDistribution = [
    { name: 'General', value: 40 },
    { name: 'A Shift', value: 20 },
    { name: 'B Shift', value: 25 },
    { name: 'C Shift', value: 15 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">System Overview</h1>
          <p className="text-gray-500 font-medium">Real-time attendance analytics & monitoring.</p>
        </div>
        <button 
          onClick={handleDownloadReport}
          className="bg-gray-900 text-white px-6 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-95"
        >
          <TrendingUp size={18} />
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-gray-100 flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow">
            <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
        <div className="xl:col-span-2 space-y-6 sm:space-y-8">
          <div className="bg-white p-6 sm:p-8 rounded-[40px] border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-gray-900">Attendance Trends</h3>
              <select className="bg-gray-50 border-none rounded-xl px-4 py-2 text-sm font-bold text-gray-600 outline-none">
                <option>Last 7 Days</option>
                <option>Last Month</option>
              </select>
            </div>
            <div className="h-[250px] sm:h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 600, fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 600, fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-gray-900">Live Today</h3>
              <span className="flex items-center gap-2 text-green-500 font-bold text-[10px] uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Live Updates
              </span>
            </div>
            <div className="overflow-x-auto -mx-6 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full text-left px-6 sm:px-0">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="pb-4 font-black text-[10px] text-gray-400 uppercase tracking-widest px-6 sm:px-4">Employee</th>
                      <th className="pb-4 font-black text-[10px] text-gray-400 uppercase tracking-widest px-4">Check In</th>
                      <th className="pb-4 font-black text-[10px] text-gray-400 uppercase tracking-widest px-4">Shift</th>
                      <th className="pb-4 font-black text-[10px] text-gray-400 uppercase tracking-widest px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {records.filter(r => r.date === todayStr).length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-gray-400 font-medium italic">Waiting for check-ins...</td>
                      </tr>
                    ) : (
                      records.filter(r => r.date === todayStr).map((record) => {
                        const emp = users.find(u => u.id === record.userId);
                        return (
                          <tr key={record.id} className="group hover:bg-gray-50 transition-all">
                            <td className="py-4 px-6 sm:px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-100 text-blue-600 font-black flex items-center justify-center text-sm">
                                  {emp?.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-bold text-gray-900 text-sm">{emp?.name}</p>
                                  <p className="text-[10px] text-gray-400 font-medium">{emp?.department}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4 font-bold text-gray-800 text-sm">{record.checkIn}</td>
                            <td className="py-4 px-4">
                              <p className="text-[11px] font-black text-gray-700 uppercase">{record.shift.split(' ')[0]}</p>
                              <p className="text-[9px] text-gray-400 uppercase font-black">{SHIFT_TIMES[record.shift]?.label.split(' - ')[0]}</p>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                record.status === 'LATE PRESENT' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                              }`}>
                                {record.status === 'LATE PRESENT' ? 'Late' : 'Present'}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 sm:space-y-8">
          <div className="bg-white p-6 sm:p-8 rounded-[40px] border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-gray-900">Shift Split</h3>
              <PieChartIcon className="text-gray-400" size={20} />
            </div>
            <div className="h-[220px] sm:h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={shiftDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {shiftDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                     contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-[40px] border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-indigo-100 text-indigo-600 p-3 rounded-2xl">
                <BellRing size={20} />
              </div>
              <h3 className="text-xl font-black text-gray-900">Broadcast</h3>
            </div>
            <form onSubmit={handleBroadcast} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Subject</label>
                <input 
                  type="text" 
                  value={broadcastForm.title} 
                  onChange={e => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
                  placeholder="e.g. System Maintenance" 
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-3.5 rounded-2xl outline-none focus:border-indigo-500 font-bold text-gray-700 text-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Message</label>
                <textarea 
                  rows={3}
                  value={broadcastForm.message} 
                  onChange={e => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
                  placeholder="Important message for everyone..." 
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-3.5 rounded-2xl outline-none focus:border-indigo-500 font-medium text-gray-700 text-sm resize-none"
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 active:scale-95"
              >
                <Send size={18} />
                Send Notification
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
