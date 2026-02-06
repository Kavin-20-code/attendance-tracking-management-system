
import React from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { Calendar, Heart } from 'lucide-react';
import { formatDisplayDate } from '../utils/shiftUtils';

const Holidays: React.FC = () => {
  const { holidays } = useAttendance();
  const sortedHolidays = [...holidays].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Upcoming Holidays</h1>
        <p className="text-gray-500 font-medium">Scheduled government and organizational holidays.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedHolidays.length === 0 ? (
          <div className="col-span-full py-20 text-center text-gray-400 font-medium">No upcoming holidays scheduled.</div>
        ) : (
          sortedHolidays.map(h => (
            <div key={h.id} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex items-center gap-6 group hover:shadow-md transition-all">
               <div className="bg-red-50 text-red-600 p-4 rounded-3xl group-hover:bg-red-600 group-hover:text-white transition-all">
                  <Heart size={24} />
               </div>
               <div>
                  <h3 className="text-lg font-black text-gray-800 leading-tight">{h.name}</h3>
                  <div className="flex items-center gap-2 text-gray-400 mt-1">
                    <Calendar size={14} />
                    <span className="text-sm font-black uppercase tracking-widest">{formatDisplayDate(h.date)}</span>
                  </div>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Holidays;
