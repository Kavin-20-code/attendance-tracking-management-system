
import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { Trash2, Plus, Calendar, X } from 'lucide-react';
import { formatDisplayDate } from '../utils/shiftUtils';

const AdminHolidays: React.FC = () => {
  const { holidays, addHoliday, removeHoliday } = useAttendance();
  const [newH, setNewH] = useState({ date: '', name: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newH.date || !newH.name) return;
    addHoliday({ id: Math.random().toString(36).substr(2, 9), ...newH });
    setNewH({ date: '', name: '' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to remove this holiday? This action cannot be undone.')) {
      removeHoliday(id);
    }
  };

  const sortedHolidays = [...holidays].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Manage Holidays</h1>
        <p className="text-gray-500 font-medium">Configure global holidays for the organization.</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-[40px] border border-gray-100 shadow-sm mb-12">
         <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
           <div className="bg-blue-100 p-2 rounded-xl">
            <Plus className="text-blue-600" size={20} />
           </div>
           Add New Holiday
         </h3>
         <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 px-1">Holiday Name</label>
              <input 
                type="text" placeholder="e.g. Independence Day" required
                value={newH.name} onChange={e => setNewH({...newH, name: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 px-6 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 transition-all font-bold text-gray-700"
              />
            </div>
            <div className="relative">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 px-1">Date</label>
              <input 
                type="date" required
                value={newH.date} onChange={e => setNewH({...newH, date: e.target.value})}
                className="bg-gray-50 border border-gray-100 px-6 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 transition-all font-bold text-gray-700 cursor-pointer min-w-[200px]"
              />
            </div>
            <div className="flex items-end">
              <button type="submit" className="w-full md:w-auto bg-gray-900 text-white font-bold px-8 py-4 h-[60px] rounded-2xl flex items-center justify-center gap-2 hover:bg-black transition-all shadow-xl shadow-gray-100 active:scale-95">
                 <Plus size={20} /> Add
              </button>
            </div>
         </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {sortedHolidays.map(h => (
           <div key={h.id} className="bg-white p-6 rounded-[32px] border border-gray-100 flex items-center justify-between shadow-sm group hover:shadow-lg transition-all transform hover:-translate-y-1">
              <div className="flex items-center gap-4">
                 <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                   <Calendar size={24}/>
                 </div>
                 <div className="overflow-hidden">
                    <p className="font-black text-gray-800 text-lg leading-tight truncate">{h.name}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{formatDisplayDate(h.date)}</p>
                 </div>
              </div>
              <button 
                onClick={() => handleDelete(h.id)}
                className="p-4 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all active:scale-90"
                title="Remove Holiday"
              >
                <Trash2 size={22}/>
              </button>
           </div>
         ))}
         
         {sortedHolidays.length === 0 && (
           <div className="col-span-full py-20 bg-gray-50 border border-dashed border-gray-200 rounded-[40px] flex flex-col items-center justify-center text-gray-400">
             <Calendar size={48} className="mb-4 opacity-10" />
             <p className="font-black tracking-tight text-lg">No holidays configured</p>
             <p className="text-sm font-medium mt-1">Start by adding a holiday above.</p>
           </div>
         )}
      </div>
    </div>
  );
};

export default AdminHolidays;
