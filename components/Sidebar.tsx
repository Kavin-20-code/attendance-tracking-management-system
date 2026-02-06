
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
  badge?: boolean;
}

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { broadcasts } = useAttendance();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const userLinks: NavLink[] = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Attendance History', path: '/history', icon: History },
    { name: 'Leaves & Permission', path: '/leaves', icon: CalendarDays },
    { name: 'Holidays', path: '/holidays', icon: UserCheck },
    { name: 'Notifications', path: '/notifications', icon: Bell, badge: broadcasts.length > 0 },
  ];

  const adminLinks: NavLink[] = [
    { name: 'Admin Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Approvals', path: '/admin/approvals', icon: CheckSquare },
    { name: 'Employee List', path: '/admin/employees', icon: Users },
    { name: 'Reports', path: '/admin/reports', icon: FileBarChart },
    { name: 'Manage Holidays', path: '/admin/holidays', icon: CalendarDays },
  ];

  const links = user?.role === 'ADMIN' ? adminLinks : userLinks;

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile/Tablet Header Toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 z-40">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white">
            <Clock size={18} />
          </div>
          <h1 className="font-bold text-lg text-gray-800 tracking-tight">Smart Attendance</h1>
        </div>
        <button 
          onClick={toggleSidebar}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-all"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Backdrop for mobile/tablet */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        <div className="p-6 hidden lg:flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <Clock size={24} />
          </div>
          <h1 className="font-bold text-xl text-gray-800 leading-tight">Smart<br/><span className="text-blue-600">Attendance</span></h1>
        </div>

        <div className="p-6 lg:hidden flex items-center justify-between border-b border-gray-50 mb-4">
          <div className="flex items-center gap-2 text-blue-600 font-bold">
            <Clock size={20} />
            <span>Smart Attendance</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-gray-400">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-2 lg:py-4 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600 font-bold' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700 font-medium'
                }`}
              >
                <Icon size={20} />
                <span>{link.name}</span>
                {link.badge && (
                  <span className="absolute top-1/2 -translate-y-1/2 right-4 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="bg-gray-50 rounded-2xl p-4 mb-4">
            <div className="flex items-center gap-3 mb-1">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold flex-shrink-0">
                {user?.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-black">{user?.role}</p>
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-50 rounded-xl transition-all font-bold"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
