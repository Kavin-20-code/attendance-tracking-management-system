
import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { Mail, Phone, MoreHorizontal, UserPlus, X, Shield, User as UserIcon, Trash2 } from 'lucide-react';
import { User, Role } from '../types';

const AdminEmployees: React.FC = () => {
  const { users, addUser, removeUser } = useAttendance();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '1234',
    department: 'Engineering',
    role: 'USER' as Role
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      username: formData.username,
      password: formData.password,
      department: formData.department,
      role: formData.role,
      leaveBalance: { casual: 5, sick: 4 },
      permissionsUsed: 0
    };
    addUser(newUser);
    setShowModal(false);
    setFormData({ name: '', username: '', password: '1234', department: 'Engineering', role: 'USER' });
  };

  return (
    <div className="space-y-8 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Employee Directory</h1>
          <p className="text-gray-500 font-medium">Manage workforce profiles and credentials.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-gray-900 text-white px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-95"
        >
          <UserPlus size={20} /> Add Employee
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {users.map(user => (
          <div key={user.id} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm relative group overflow-hidden hover:shadow-lg transition-all">
             <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button 
                  onClick={() => { if(confirm('Delete this employee?')) removeUser(user.id) }}
                  className="text-red-400 hover:text-red-600 bg-red-50 p-2 rounded-xl transition-colors"
                >
                  <Trash2 size={18} />
                </button>
                <button className="text-gray-400 hover:text-gray-600 bg-gray-50 p-2 rounded-xl"><MoreHorizontal size={18}/></button>
             </div>
             <div className="flex flex-col items-center text-center">
                <div className={`w-20 h-20 rounded-3xl ${user.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-600' : 'bg-blue-100 text-blue-600'} font-black text-3xl flex items-center justify-center mb-6`}>
                   {user.name.charAt(0)}
                </div>
                <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  {user.name}
                  {user.role === 'ADMIN' && <Shield size={14} className="text-indigo-500" />}
                </h3>
                <p className="text-sm font-bold text-blue-600 mb-1 uppercase tracking-widest">{user.department}</p>
                <p className="text-xs text-gray-400 mb-6 font-medium">ID: EMP-{user.id.slice(0, 4).toUpperCase()}</p>
                
                <div className="w-full grid grid-cols-2 gap-3 mb-6">
                   <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Balance</p>
                      <p className="font-bold text-gray-800 text-sm">{user.leaveBalance.casual + user.leaveBalance.sick} Days</p>
                   </div>
                   <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Username</p>
                      <p className="font-bold text-gray-800 text-sm truncate px-1">{user.username}</p>
                   </div>
                </div>

                <div className="flex gap-4 w-full">
                   <button className="flex-1 bg-gray-50 text-gray-600 p-3 rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center border border-gray-100">
                      <Mail size={18} />
                   </button>
                   <button className="flex-1 bg-gray-50 text-gray-600 p-3 rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center border border-gray-100">
                      <Phone size={18} />
                   </button>
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* Add Employee Modal - Improved sizing for tablet */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl relative z-10 p-6 sm:p-10 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 text-white p-3 rounded-2xl">
                  <UserPlus size={24} />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900">New Employee</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 bg-gray-50 p-3 rounded-2xl transition-all">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Full Name</label>
                <input 
                  type="text" required
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 px-6 py-4 rounded-2xl outline-none focus:border-blue-500 font-bold text-gray-700 text-sm sm:text-base"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Username</label>
                  <input 
                    type="text" required
                    value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 px-6 py-4 rounded-2xl outline-none focus:border-blue-500 font-bold text-gray-700 text-sm sm:text-base"
                    placeholder="johndoe"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Department</label>
                  <select 
                    value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 px-6 py-4 rounded-2xl outline-none focus:border-blue-500 font-black text-gray-700 text-sm sm:text-base appearance-none"
                  >
                    <option>Engineering</option>
                    <option>Product</option>
                    <option>Design</option>
                    <option>HR</option>
                    <option>Sales</option>
                    <option>IT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Role</label>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, role: 'USER'})}
                    className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-black transition-all ${formData.role === 'USER' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-gray-50 text-gray-400 border border-gray-200 hover:bg-gray-100'}`}
                  >
                    <UserIcon size={18} />
                    <span className="text-sm">Employee</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, role: 'ADMIN'})}
                    className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-black transition-all ${formData.role === 'ADMIN' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-gray-50 text-gray-400 border border-gray-200 hover:bg-gray-100'}`}
                  >
                    <Shield size={18} />
                    <span className="text-sm">Admin</span>
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-gray-900 text-white font-black py-4 sm:py-5 rounded-2xl hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-[0.98] mt-4"
              >
                Create Account
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEmployees;
