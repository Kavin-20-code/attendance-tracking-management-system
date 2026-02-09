
import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, AlertTriangle, ArrowRightCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAttendance } from '../context/AttendanceContext';
import { detectShift, formatTime, formatDate, calculateLate, isSunday, SHIFT_TIMES } from '../utils/shiftUtils';
import { AttendanceRecord, ShiftType } from '../types';

const AttendanceCard: React.FC = () => {
  const { user } = useAuth();
  const { addRecord, records, holidays } = useAttendance();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const todayStr = formatDate(new Date());
  const todayRecord = records.find(r => r.userId === user?.id && r.date === todayStr);
  
  const assignedShiftType = user?.assignedShift || ShiftType.GENERAL;
  const detectedShiftType = detectShift(formatTime(currentTime));
  
  const isOffDay = isSunday(todayStr);
  const holiday = holidays.find(h => h.date === todayStr);

  const handleCheckIn = () => {
    if (todayRecord) return;
    const timeStr = formatTime(new Date());
    const shiftToUse = user?.assignedShift || detectedShiftType;
    const lateMinutes = calculateLate(timeStr, shiftToUse);
    
    const newRecord: AttendanceRecord = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user!.id,
      date: todayStr,
      checkIn: timeStr,
      checkOut: null,
      shift: shiftToUse,
      status: lateMinutes > 0 ? 'LATE PRESENT' : 'PRESENT',
      lateMinutes
    };

    addRecord(newRecord);
  };

  const handleCheckOut = () => {
    if (!todayRecord || todayRecord.checkOut) return;
    const timeStr = formatTime(new Date());
    addRecord({ ...todayRecord, checkOut: timeStr });
  };

  const getShiftDisplay = (shift: ShiftType) => {
    if (isOffDay) return { name: 'Week Off', time: 'Sunday Rest' };
    if (holiday) return { name: holiday.name, time: 'Public Holiday' };
    return { 
      name: shift, 
      time: SHIFT_TIMES[shift]?.label || '' 
    };
  };

  const shiftInfo = getShiftDisplay(todayRecord?.shift || assignedShiftType);
  const isLate = todayRecord?.status === 'LATE PRESENT';

  return (
    <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-6 md:p-10 animate-scale-in">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="text-center lg:text-left">
          <h2 className="text-gray-400 font-black uppercase text-[10px] tracking-widest mb-2">Live Status</h2>
          <p className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter tabular-nums">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
          <p className="text-gray-500 font-bold text-sm mt-2 flex items-center justify-center lg:justify-start gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
            {currentTime.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="w-full lg:w-auto">
          {!todayRecord ? (
            <button
              onClick={handleCheckIn}
              disabled={isOffDay || !!holiday}
              className="w-full lg:w-auto px-10 py-6 bg-blue-600 text-white rounded-[24px] font-black shadow-2xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 group"
            >
              <CheckCircle2 size={24} className="group-hover:scale-110 transition-transform" />
              Check In ({assignedShiftType.split(' ')[0]})
            </button>
          ) : !todayRecord.checkOut ? (
            <button
              onClick={handleCheckOut}
              className="w-full lg:w-auto px-10 py-6 bg-orange-500 text-white rounded-[24px] font-black shadow-2xl shadow-orange-200 hover:bg-orange-600 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 active:scale-95 group"
            >
              <ArrowRightCircle size={24} className="group-hover:rotate-90 transition-transform" />
              Check Out Shift
            </button>
          ) : (
            <div className="w-full lg:w-auto px-10 py-6 bg-green-50 text-green-600 rounded-[24px] font-black border border-green-100 flex items-center justify-center gap-3 animate-fade-in">
              <CheckCircle2 size={24} />
              Shift Logged Successfully
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        <div className="bg-gray-50/50 rounded-[32px] p-6 border border-gray-100 transition-all hover:bg-white hover:shadow-xl hover:shadow-gray-100 group">
          <div className="flex items-center gap-3 text-gray-500 mb-3">
            <Clock size={18} className="text-blue-500 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Schedule</span>
          </div>
          <p className="text-xl font-black text-gray-900">
            {shiftInfo.name}
          </p>
          <p className="text-xs font-bold text-blue-600/80 mt-1">{shiftInfo.time}</p>
        </div>

        <div className="bg-gray-50/50 rounded-[32px] p-6 border border-gray-100 transition-all hover:bg-white hover:shadow-xl hover:shadow-gray-100 group">
          <div className="flex items-center gap-3 text-gray-500 mb-3">
            <Clock size={18} className="text-indigo-500 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Entry Logs</span>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-xl font-black text-gray-900 tabular-nums">
              {todayRecord?.checkIn || '--:--'}
            </p>
            {isLate && (
              <span className="flex items-center gap-1 bg-red-100 text-red-600 text-[9px] font-black px-2 py-0.5 rounded-lg animate-pulse">
                <AlertCircle size={10} />
                LATE
              </span>
            )}
          </div>
          <p className="text-xs font-bold text-gray-400 mt-1">
            {todayRecord?.checkOut ? `Exited at ${todayRecord.checkOut}` : 'Awaiting exit log'}
          </p>
        </div>

        <div className="bg-gray-50/50 rounded-[32px] p-6 border border-gray-100 transition-all hover:bg-white hover:shadow-xl hover:shadow-gray-100 group sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3 text-gray-500 mb-3">
            <AlertTriangle size={18} className={`${isLate ? 'text-red-500 animate-bounce' : 'text-green-500'} transition-colors`} />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Real-time Stats</span>
          </div>
          <p className={`text-xl font-black ${isLate ? 'text-red-600' : todayRecord?.status === 'PRESENT' ? 'text-green-600' : 'text-gray-900'}`}>
            {todayRecord ? (isLate ? 'Delayed Attendance' : 'Punctual Entry') : 'Pending Session'}
          </p>
          {todayRecord?.lateMinutes ? (
            <p className="text-xs font-black text-red-500 mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
              {todayRecord.lateMinutes} minutes deficit
            </p>
          ) : (
            <p className="text-xs font-bold text-gray-400 mt-1">Maintaining full productivity</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceCard;
