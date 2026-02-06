
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAttendance } from '../context/AttendanceContext';
import { Calendar, Filter, Download, ArrowLeft, ArrowRight, AlertTriangle } from 'lucide-react';

const AttendanceHistory: React.FC = () => {
  const { user } = useAuth();
  const { getRecordsByUser } = useAttendance();
  
  // Get current YYYY-MM for default filter
  const currentMonthYear = new Date().toISOString().substring(0, 7);
  const [month, setMonth] = useState(currentMonthYear);

  const userRecords = getRecordsByUser(user!.id)
    .filter(r => r.date.startsWith(month))
    .slice()
    .reverse();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Your History</h1>
          <p className="text-gray-500 font-medium">Review your past records and status.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-gray-100 p-2 rounded-2xl flex items-center gap-2 shadow-sm">
            <Filter size={18} className="text-gray-400 ml-2" />
            <input 
              type="month" 
              value={month}
              onChange={e => setMonth(e.target.value)}
              className="border-none outline-none font-bold text-gray-600 pr-4 bg-transparent cursor-pointer"
            />
          </div>
          <button className="bg-gray-900 text-white p-4 rounded-2xl font-bold hover:bg-black transition-all shadow-lg shadow-gray-200">
            <Download size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="p-6 font-black text-xs text-gray-400 uppercase tracking-widest">Date</th>
                <th className="p-6 font-black text-xs text-gray-400 uppercase tracking-widest">Shift Window</th>
                <th className="p-6 font-black text-xs text-gray-400 uppercase tracking-widest">Check In</th>
                <th className="p-6 font-black text-xs text-gray-400 uppercase tracking-widest">Check Out</th>
                <th className="p-6 font-black text-xs text-gray-400 uppercase tracking-widest">Late Marks</th>
                <th className="p-6 font-black text-xs text-gray-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {userRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center text-gray-400 font-medium">No records found for {month}.</td>
                </tr>
              ) : (
                userRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-100 p-2 rounded-xl text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                          <Calendar size={16} />
                        </div>
                        <span className="font-bold text-gray-900">{record.date}</span>
                      </div>
                    </td>
                    <td className="p-6 font-medium text-gray-500">{record.shift}</td>
                    <td className="p-6 font-bold text-gray-800">{record.checkIn || '--:--'}</td>
                    <td className="p-6 font-bold text-gray-800">{record.checkOut || '--:--'}</td>
                    <td className="p-6">
                      {record.lateMinutes > 0 ? (
                        <span className="text-red-500 font-black flex items-center gap-1">
                          <AlertTriangle size={14} className="animate-pulse" />
                          {record.lateMinutes}m
                        </span>
                      ) : (
                        <span className="text-gray-300">None</span>
                      )}
                    </td>
                    <td className="p-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        record.status === 'PRESENT' ? 'bg-green-100 text-green-600' :
                        record.status === 'LATE PRESENT' ? 'bg-orange-100 text-orange-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {record.status === 'LATE PRESENT' ? 'Late Check-in' : record.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-6 bg-gray-50 flex items-center justify-between border-t border-gray-100">
          <p className="text-sm font-bold text-gray-400">Showing records for {month}</p>
          <div className="flex gap-2">
            <button className="p-2 rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-gray-600 transition-all">
              <ArrowLeft size={18} />
            </button>
            <button className="p-2 rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-gray-600 transition-all">
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceHistory;
