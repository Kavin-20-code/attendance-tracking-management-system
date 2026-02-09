
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  History, 
  CalendarDays, 
  Users, 
  FileBarChart, 
  LogOut, 
  Clock,
  UserCheck,
  CheckSquare,
  Bell,
  LucideIcon,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAttendance } from '../context/AttendanceContext';

interface NavLink {
  name: string;
  path: string;
  icon: LucideIcon;
  badge?: number | boolean;
}

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { broadcasts, leaves, permissions } = useAttendance();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // User side: Notifications for approvals/rejections and broadcasts
  const personalUpdatesCount = [
    ...leaves.filter(l => l.userId === user?.id && l.status !== 'PENDING'),
    ...permissions.filter(p => p.userId === user?.id && p.status !== 'PENDING')
  ].length;

  const totalNotifications = broadcasts.length + personalUpdatesCount;

  // Admin side: Count of pending requests requiring action
  const pendingApprovalsCount = [
    ...leaves.filter(l => l.status === 'PENDING'),
    ...permissions.filter(p => p.status === 'PENDING')
  ].length;

  const userLinks: NavLink[] = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Attendance History', path: '/history', icon: History },
    { name: 'Leaves & Permission', path: '/leaves', icon: CalendarDays },
    { name: 'Holidays', path: '/holidays', icon: UserCheck },
    { name: 'Notifications', path: '/notifications', icon: Bell, badge: totalNotifications },
  ];

  const adminLinks: NavLink[] = [
    { name: 'Admin Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Approvals', path: '/admin/approvals', icon: CheckSquare, badge: pendingApprovalsCount },
    { name: 'Employee List', path: '/admin/employees', icon: Users },
    { name: 'Reports', path: '/admin/reports', icon: FileBarChart },
    { name: 'Manage Holidays', path: '/admin/holidays', icon: CalendarDays },
  ];

  const links = user?.role === 'ADMIN' ? adminLinks : userLinks;

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 z-40 transition-all">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white shadow-lg shadow-blue-100">
            <Clock size={18} />
          </div>
          <h1 className="font-black text-lg text-gray-800 tracking-tight">Smart Attendance</h1>
        </div>
        <button 
          onClick={toggleSidebar}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-all active:scale-90"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={`
        fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-100 flex flex-col z-50 transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        <div className="p-6 hidden lg:flex items-center gap-3">
          <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-xl shadow-blue-100">
            <Clock size={24} />
          </div>
          <h1 className="font-black text-xl text-gray-900 leading-tight">Smart<br/><span className="text-blue-600">Attendance</span></h1>
        </div>

        <div className="p-6 lg:hidden flex items-center justify-between border-b border-gray-50">
          <div className="flex items-center gap-2 text-blue-600 font-black">
            <Clock size={20} />
            <span>Smart Attendance</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 p-2">
            <X size={20} />
          </button>
        </div>

        <div className="px-4 py-4 border-b border-gray-50 bg-white">
          <div className="bg-gray-50 rounded-2xl p-3 mb-3 group transition-all hover:bg-blue-50/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shadow-lg shadow-blue-100 group-hover:scale-105 transition-transform">
                {user?.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-black text-gray-800 truncate">{user?.name}</p>
                <p className="text-[10px] text-blue-600/70 uppercase tracking-widest font-black">{user?.role}</p>
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-50 rounded-xl transition-all font-black text-xs active:scale-95 group"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span>Logout Account</span>
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            const hasBadge = link.badge !== undefined && link.badge !== false && (typeof link.badge === 'number' ? link.badge > 0 : link.badge);
            
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative group ${
                  isActive 
                    ? 'bg-blue-600 text-white font-black shadow-lg shadow-blue-100 translate-x-1' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-bold hover:translate-x-1'
                }`}
              >
                <Icon size={20} className={`${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform`} />
                <span className="text-sm">{link.name}</span>
                {hasBadge && (
                  <span className={`absolute top-1/2 -translate-y-1/2 right-4 text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[20px] h-5 flex items-center justify-center animate-bounce ${
                    isActive ? 'bg-white text-blue-600' : 'bg-red-500 text-white'
                  }`}>
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
