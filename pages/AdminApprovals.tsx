
import React from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { Check, X, Calendar, Clock } from 'lucide-react';

const AdminApprovals: React.FC = () => {
  const { leaves, permissions, updateLeaveStatus, updatePermissionStatus, users } = useAttendance();

  const pendingLeaves = leaves.filter(l => l.status === 'PENDING');
  const pendingPerms = permissions.filter(p => p.status === 'PENDING');

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-black text-gray-900">Approval Queue</h1>
        <p className="text-gray-500">Review pending leave and permission requests.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Leave Requests */}
        <div className="space-y-6">
           <div className="flex items-center gap-3">
              <Calendar className="text-blue-600" />
              <h2 className="text-xl font-black text-gray-800">Leave Requests</h2>
              <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">{pendingLeaves.length} Pending</span>
           </div>

           {pendingLeaves.length === 0 ? (
              <div className="p-10 bg-white border border-dashed border-gray-200 rounded-[32px] text-center text-gray-400">
                All leave requests processed.
              </div>
           ) : (
             pendingLeaves.map(leave => {
               const emp = users.find(u => u.id === leave.userId);
               return (
                 <div key={leave.id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">{emp?.name.charAt(0)}</div>
                        <div>
                          <p className="font-bold text-gray-900">{emp?.name}</p>
                          <p className="text-xs font-black text-blue-600 uppercase">{leave.type}</p>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-gray-700 mb-2">{leave.startDate} to {leave.endDate}</p>
                      <p className="text-xs text-gray-400 italic">"{leave.reason}"</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button onClick={() => updateLeaveStatus(leave.id, 'APPROVED')} className="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all"><Check size={20}/></button>
                      <button onClick={() => updateLeaveStatus(leave.id, 'REJECTED')} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"><X size={20}/></button>
                    </div>
                 </div>
               )
             })
           )}
        </div>

        {/* Permission Requests */}
        <div className="space-y-6">
           <div className="flex items-center gap-3">
              <Clock className="text-orange-600" />
              <h2 className="text-xl font-black text-gray-800">Permission Requests</h2>
              <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full">{pendingPerms.length} Pending</span>
           </div>

           {pendingPerms.length === 0 ? (
              <div className="p-10 bg-white border border-dashed border-gray-200 rounded-[32px] text-center text-gray-400">
                All permission requests processed.
              </div>
           ) : (
             pendingPerms.map(perm => {
               const emp = users.find(u => u.id === perm.userId);
               return (
                 <div key={perm.id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-black">{emp?.name.charAt(0)}</div>
                        <div>
                          <p className="font-bold text-gray-900">{emp?.name}</p>
                          <p className="text-xs font-black text-orange-600 uppercase">Short Leave</p>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-gray-700 mb-2">{perm.date} | {perm.startTime} - {perm.endTime}</p>
                      <p className="text-xs text-gray-400 italic">"{perm.reason}"</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button onClick={() => updatePermissionStatus(perm.id, 'APPROVED')} className="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all"><Check size={20}/></button>
                      <button onClick={() => updatePermissionStatus(perm.id, 'REJECTED')} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"><X size={20}/></button>
                    </div>
                 </div>
               )
             })
           )}
        </div>
      </div>
    </div>
  );
};

export default AdminApprovals;
