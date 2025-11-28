"use client";
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X } from 'lucide-react';

export const AuthModal = () => {
  const { showAuthModal, setShowAuthModal, login } = useApp();
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!showAuthModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-200">
        <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-gray-900 mb-2">{authMode === 'LOGIN' ? 'Chào Bạn!' : 'Đăng Ký Mới'}</h2>
            <p className="text-gray-500">Tham gia cộng đồng cha mẹ thông thái.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
              <input 
                type="email" required 
                value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-kid-blue focus:border-transparent outline-none transition-all" 
                placeholder="email@example.com" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Mật khẩu</label>
              <input 
                type="password" required 
                value={password} onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-kid-blue focus:border-transparent outline-none transition-all" 
                placeholder="••••••••" 
              />
            </div>
            
            <button type="submit" className="w-full bg-kid-blue text-white font-bold py-4 rounded-xl hover:bg-blue-600 transition-colors shadow-lg mt-4">
              {authMode === 'LOGIN' ? 'Đăng Nhập' : 'Tạo Tài Khoản'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => setAuthMode(authMode === 'LOGIN' ? 'REGISTER' : 'LOGIN')}
              className="text-kid-pink font-bold hover:underline"
            >
              {authMode === 'LOGIN' ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};