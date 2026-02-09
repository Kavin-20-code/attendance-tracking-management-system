
import React from 'react';
import AttendanceCard from '../components/AttendanceCard';
import { useAuth } from '../context/AuthContext';
import { useAttendance } from '../context/AttendanceContext';
import { 
  Calendar, 
  Clock, 
  Award,
  ArrowRight,
  TrendingUp,
  Briefcase
} from 'lucide-react';
import { Link } from 'react-router-dom';

const UserDashboard: React.FC = () => {
<<<<<<< HEAD
  const { user: authUser } = useAuth();
  const { records, users } = useAttendance();
  
  // Use context-driven user data as source of truth for real-time updates (like leave balance changes)
  const user = users.find(u => u.id === authUser?.id) || authUser;
=======
  const { user } = useAuth();
  const { records } = useAttendance();
>>>>>>> da66adcd18e78518c81158028a20413fbe508c02

  const userRecords = records.filter(r => r.userId === user?.id);
  const presentDays = userRecords.filter(r => r.status === 'PRESENT' || r.status === 'LATE PRESENT').length;
  const attendancePercentage = userRecords.length > 0 ? Math.round((presentDays / userRecords.length) * 100) : 0;

  const stats = [
    { label: 'Casual Leaves', value: user?.leaveBalance.casual, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Attendance Rate', value: `${attendancePercentage}%`, icon: Award, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Permissions (Month)', value: `${user?.permissionsUsed}/2`, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Howdy, {user?.name}!</h1>
          <p className="text-gray-500 font-medium">Keep track of your productivity today.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 flex items-center gap-2 shadow-sm">
             <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
             <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Active Session</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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

      <AttendanceCard />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {/* Quick Actions / Summary Card */}
        <div className="bg-white p-6 sm:p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col justify-between">
           <div>
              <div className="bg-indigo-50 text-indigo-600 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp size={24} className="sm:size-28" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">Requests & Time Off</h3>
              <p className="text-sm sm:text-base text-gray-500 font-medium mb-8">Need a break or leaving early? Submit your requests to management instantly.</p>
           </div>
           
           <Link 
            to="/leaves"
            className="group bg-gray-900 text-white px-6 sm:px-8 py-4 sm:py-5 rounded-[24px] font-black text-base sm:text-lg flex items-center justify-between hover:bg-black transition-all active:scale-[0.98]"
           >
             Manage Applications
             <ArrowRight className="group-hover:translate-x-1 transition-transform" />
           </Link>
        </div>

        {/* Profile Snapshot */}
        <div className="bg-blue-600 p-6 sm:p-8 rounded-[40px] shadow-xl shadow-blue-100 relative overflow-hidden text-white">
           <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="flex justify-between items-start">
                 <div>
                    <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest mb-1">Employment Details</p>
                    <h3 className="text-xl sm:text-2xl font-black">{user?.department}</h3>
                 </div>
                 <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                    <Briefcase size={24} />
                 </div>
              </div>
              
              <div className="mt-8 sm:mt-12 space-y-3 sm:space-y-4">
                 <div className="flex justify-between items-center py-2.5 sm:py-3 border-b border-white/10">
                    <span className="text-blue-100 text-sm font-medium">Employee ID</span>
                    <span className="font-bold text-sm sm:text-base">EMP-{user?.id.padStart(4, '0')}</span>
                 </div>
                 <div className="flex justify-between items-center py-2.5 sm:py-3 border-b border-white/10">
                    <span className="text-blue-100 text-sm font-medium">Work Shift</span>
                    <span className="font-bold text-sm sm:text-base">Day/Regular</span>
                 </div>
                 <div className="flex justify-between items-center py-2.5 sm:py-3">
                    <span className="text-blue-100 text-sm font-medium">Reporting To</span>
                    <span className="font-bold text-sm sm:text-base">Admin Panel</span>
                 </div>
              </div>
           </div>
           {/* Decorative circles */}
           <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
           <div className="absolute -left-10 -top-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
