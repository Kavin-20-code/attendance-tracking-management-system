
import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { Download, FileText, Search, X, Calendar, Clock, User as UserIcon, AlertTriangle, ArrowRight } from 'lucide-react';
import { AttendanceRecord, User } from '../types';
import { SHIFT_TIMES } from '../utils/shiftUtils';

const AdminReports: React.FC = () => {
  const { records, users } = useAttendance();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);

  // Filter records based on employee name or department
  const filteredRecords = records.slice().reverse().filter(r => {
    const emp = users.find(u => u.id === r.userId);
    const searchLower = searchTerm.toLowerCase();
    return (
      emp?.name.toLowerCase().includes(searchLower) ||
      emp?.department.toLowerCase().includes(searchLower) ||
      r.date.includes(searchTerm)
    );
  });

  const downloadReport = () => {
    if (filteredRecords.length === 0) {
      alert("No records found to export.");
      return;
    }

    const headers = ['Date', 'Employee', 'Department', 'Check In', 'Check Out', 'Shift', 'Status', 'Late Minutes'];
    const rows = filteredRecords.map(r => {
      const emp = users.find(u => u.id === r.userId);
      return [
        r.date, 
        emp?.name || 'Unknown', 
        emp?.department || 'N/A', 
        r.checkIn || 'N/A', 
        r.checkOut || 'N/A', 
        r.shift, 
        r.status,
        r.lateMinutes
      ].map(val => `"${val}"`).join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Filtered_Attendance_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const selectedEmployee = selectedRecord ? users.find(u => u.id === selectedRecord.userId) : null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">System Reports</h1>
          <p className="text-gray-500 font-medium">Analyze and export organizational data.</p>
        </div>
        <button 
          onClick={downloadReport}
          className="bg-blue-600 text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95"
        >
          <Download size={20} /> Export to CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
          <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
            <FileText size={24} />
          </div>
          <h3 className="font-black text-gray-800 text-lg">Total Records</h3>
          <p className="text-sm text-gray-400 mb-4 font-medium">Filtered results currently shown.</p>
          <p className="text-5xl font-black text-blue-600 tracking-tighter">{filteredRecords.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-8 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <h3 className="text-xl font-black text-gray-900">Consolidated Logs</h3>
          <div className="flex items-center gap-4">
            <div className="bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 flex items-center gap-3 w-full md:w-80 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <Search size={18} className="text-gray-400" />
              <input 
                type="text" 
                placeholder="Search employee or dept..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-sm font-bold text-gray-700 w-full" 
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="text-gray-400 hover:text-gray-600">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Date</th>
                <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Employee</th>
                <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Shift</th>
                <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Status</th>
                <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-gray-400 font-medium">No records match your search criteria.</td>
                </tr>
              ) : (
                filteredRecords.map(r => {
                  const emp = users.find(u => u.id === r.userId);
                  return (
                    <tr key={r.id} className="group hover:bg-gray-50/80 transition-all">
                      <td className="py-6 px-4 text-sm font-bold text-gray-800">{r.date}</td>
                      <td className="py-6 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-500 font-black flex items-center justify-center text-xs group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                            {emp?.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900 leading-none mb-1">{emp?.name}</p>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{emp?.department}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 px-4">
                        <p className="text-xs font-bold text-gray-700">{r.shift}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{SHIFT_TIMES[r.shift]?.label}</p>
                      </td>
                      <td className="py-6 px-4">
                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          r.status === 'PRESENT' ? 'bg-green-100 text-green-600' : 
                          r.status === 'LATE PRESENT' ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="py-6 px-4 text-right pr-6">
                        <button 
                          onClick={() => setSelectedRecord(r)}
                          className="text-blue-600 text-xs font-black uppercase tracking-widest hover:text-blue-800 flex items-center gap-1 ml-auto group-hover:translate-x-1 transition-all"
                        >
                          View Details <ArrowRight size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setSelectedRecord(null)}></div>
          <div className="bg-white w-full max-w-lg rounded-[48px] shadow-2xl relative z-10 p-10 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-black text-gray-900">Attendance Details</h2>
              <button onClick={() => setSelectedRecord(null)} className="text-gray-400 hover:text-gray-600 bg-gray-100 p-3 rounded-2xl transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-8">
              {/* Employee Info */}
              <div className="flex items-center gap-5 p-6 bg-gray-50 rounded-[32px] border border-gray-100">
                <div className="w-16 h-16 rounded-[24px] bg-blue-600 text-white flex items-center justify-center text-2xl font-black">
                  {selectedEmployee?.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900">{selectedEmployee?.name}</h3>
                  <p className="text-xs font-black text-blue-600 uppercase tracking-widest">{selectedEmployee?.department}</p>
                  <p className="text-[10px] text-gray-400 font-bold mt-1">Employee ID: {selectedEmployee?.id}</p>
                </div>
              </div>

              {/* Status Header */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-gray-100 p-6 rounded-[32px] shadow-sm">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Current Status</p>
                   <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      selectedRecord.status === 'PRESENT' ? 'bg-green-100 text-green-600' : 
                      selectedRecord.status === 'LATE PRESENT' ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {selectedRecord.status}
                    </span>
                </div>
                <div className="bg-white border border-gray-100 p-6 rounded-[32px] shadow-sm">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Shift Assigned</p>
                   <p className="text-sm font-black text-gray-800">{selectedRecord.shift}</p>
                </div>
              </div>

              {/* Timing Grid */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-gray-400" />
                    <span className="text-sm font-bold text-gray-500">Log Date</span>
                  </div>
                  <span className="text-sm font-black text-gray-900">{selectedRecord.date}</span>
                </div>

                <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Clock size={18} className="text-gray-400" />
                    <span className="text-sm font-bold text-gray-500">Check In</span>
                  </div>
                  <span className="text-sm font-black text-gray-900">{selectedRecord.checkIn || '--:--'}</span>
                </div>

                <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Clock size={18} className="text-gray-400" />
                    <span className="text-sm font-bold text-gray-500">Check Out</span>
                  </div>
                  <span className="text-sm font-black text-gray-900">{selectedRecord.checkOut || '--:--'}</span>
                </div>

                {selectedRecord.lateMinutes > 0 && (
                  <div className="flex items-center justify-between p-5 bg-red-50 rounded-2xl border border-red-100">
                    <div className="flex items-center gap-3">
                      <AlertTriangle size={18} className="text-red-500" />
                      <span className="text-sm font-bold text-red-600">Late Duration</span>
                    </div>
                    <span className="text-sm font-black text-red-600">{selectedRecord.lateMinutes} Minutes</span>
                  </div>
                )}
              </div>

              <button 
                onClick={() => setSelectedRecord(null)}
                className="w-full bg-gray-900 text-white py-5 rounded-[24px] font-black text-lg hover:bg-black transition-all active:scale-[0.98]"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReports;
