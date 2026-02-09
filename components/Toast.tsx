
import React from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { ToastType, useNotifications } from '../context/NotificationContext';

const Toast: React.FC<{ id: string; type: ToastType; title: string; message: string }> = ({ id, type, title, message }) => {
  const { removeNotification } = useNotifications();

  const config = {
    SUCCESS: {
      icon: <CheckCircle className="text-green-500" size={24} />,
      bg: 'bg-green-50',
      border: 'border-green-100',
      accent: 'bg-green-500'
    },
    ERROR: {
      icon: <XCircle className="text-red-500" size={24} />,
      bg: 'bg-red-50',
      border: 'border-red-100',
      accent: 'bg-red-500'
    },
    INFO: {
      icon: <Info className="text-blue-500" size={24} />,
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      accent: 'bg-blue-500'
    }
  };

  const { icon, bg, border, accent } = config[type];

  return (
    <div className={`w-80 sm:w-96 ${bg} border ${border} rounded-3xl p-5 shadow-2xl shadow-gray-200/50 flex items-start gap-4 animate-in slide-in-from-right-10 fade-in duration-300 relative overflow-hidden pointer-events-auto`}>
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${accent}`}></div>
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-black text-gray-900 mb-1 truncate">{title}</h4>
        <p className="text-xs font-medium text-gray-500 leading-relaxed">{message}</p>
      </div>
      <button 
        onClick={() => removeNotification(id)}
        className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors"
      >
        <X size={16} />
      </button>
      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-0.5 bg-gray-900/10 w-full">
        <div className={`h-full ${accent} animate-[shrink_5s_linear_forwards]`}></div>
      </div>
      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts } = useNotifications();

  return (
    <div className="fixed top-6 right-6 z-[100] flex flex-col gap-4 pointer-events-none">
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
};
