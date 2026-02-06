
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
  const detectedShiftType = detectShift(formatTime(currentTime));
  
  const isOffDay = isSunday(todayStr);
  const holiday = holidays.find(h => h.date === todayStr);

  const handleCheckIn = () => {
    if (todayRecord) return;

    const timeStr = formatTime(new Date());
    const lateMinutes = calculateLate(timeStr, detectedShiftType);
    
    const newRecord: AttendanceRecord = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user!.id,
      date: todayStr,
      checkIn: timeStr,
      checkOut: null,
      shift: detectedShiftType,
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

  const shiftInfo = getShiftDisplay(todayRecord?.shift || detectedShiftType);
  const isLate = todayRecord?.status === 'LATE PRESENT';

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="text-center lg:text-left">
          <h2 className="text-gray-500 font-medium mb-1">Today's Overview</h2>
          <p className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
          <p className="text-gray-400 font-bold text-sm mt-1">
            {currentTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="w-full lg:w-auto">
          {!todayRecord ? (
            <button
              onClick={handleCheckIn}
              disabled={isOffDay || !!holiday}
              className="w-full lg:w-auto px-8 py-5 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              <CheckCircle2 size={22} />
              Check In
            </button>
          ) : !todayRecord.checkOut ? (
            <button
              onClick={handleCheckOut}
              className="w-full lg:w-auto px-8 py-5 bg-orange-500 text-white rounded-2xl font-black shadow-xl shadow-orange-100 hover:bg-orange-600 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              <ArrowRightCircle size={22} />
              Check Out
            </button>
          ) : (
            <div className="w-full lg:w-auto px-8 py-5 bg-green-50 text-green-600 rounded-2xl font-black border border-green-200 flex items-center justify-center gap-3">
              <CheckCircle2 size={22} />
              Shift Completed
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-10">
        <div className="bg-gray-50 rounded-[28px] p-5 border border-gray-100">
          <div className="flex items-center gap-3 text-gray-500 mb-2">
            <Clock size={18} />
            <span className="text-xs font-black uppercase tracking-widest text-gray-400">Detected Shift</span>
          </div>
          <p className="text-lg font-black text-gray-800">
            {shiftInfo.name}
          </p>
          <p className="text-xs font-bold text-blue-600 mt-1">{shiftInfo.time}</p>
        </div>

        <div className="bg-gray-50 rounded-[28px] p-5 border border-gray-100">
          <div className="flex items-center gap-3 text-gray-500 mb-2">
            <Clock size={18} />
            <span className="text-xs font-black uppercase tracking-widest text-gray-400">Entry Logs</span>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-lg font-black text-gray-800">
              {todayRecord?.checkIn || '--:--'}
            </p>
            {isLate && (
              <span className="flex items-center gap-1 bg-red-100 text-red-600 text-[10px] font-black px-2 py-0.5 rounded-full">
                <AlertCircle size={10} />
                LATE
              </span>
            )}
          </div>
          <p className="text-xs font-bold text-gray-400 mt-1">
            {todayRecord?.checkOut ? `Out: ${todayRecord.checkOut}` : 'Waiting for check-out'}
          </p>
        </div>

        <div className="bg-gray-50 rounded-[28px] p-5 border border-gray-100 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3 text-gray-500 mb-2">
            <AlertTriangle size={18} className={isLate ? 'text-orange-500' : ''} />
            <span className="text-xs font-black uppercase tracking-widest text-gray-400">Live Status</span>
          </div>
          <p className={`text-lg font-black ${isLate ? 'text-orange-500' : todayRecord?.status === 'PRESENT' ? 'text-green-600' : 'text-gray-800'}`}>
            {todayRecord ? (isLate ? 'Delayed Entry' : 'On Schedule') : 'Pending Log'}
          </p>
          {todayRecord?.lateMinutes ? (
            <p className="text-xs font-black text-red-500 mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
              Behind by {todayRecord.lateMinutes} mins
            </p>
          ) : (
            <p className="text-xs font-bold text-gray-400 mt-1">Shift window maintained</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceCard;
