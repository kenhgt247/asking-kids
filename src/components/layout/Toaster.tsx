"use client";
import { useApp } from '../../context/AppContext';
import { Bell } from 'lucide-react';

export const Toaster = () => {
  const { notifications } = useApp();

  return (
    <div className="fixed top-24 right-4 z-[60] flex flex-col gap-2 pointer-events-none">
      {notifications.map(n => (
        <div key={n.id} className={`pointer-events-auto bg-white border-l-4 p-4 rounded-r shadow-2xl flex items-center gap-3 min-w-[300px] animate-in slide-in-from-right fade-in duration-300 ${
          n.type === 'SUCCESS' ? 'border-green-500' : n.type === 'WARNING' ? 'border-yellow-500' : 'border-blue-500'
        }`}>
           <Bell size={20} className={n.type === 'SUCCESS' ? 'text-green-500' : 'text-blue-500'} />
           <p className="font-bold text-gray-700 text-sm">{n.message}</p>
        </div>
      ))}
    </div>
  );
};