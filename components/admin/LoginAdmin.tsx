
import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginAdminProps {
  onLogin: () => void;
}

export const LoginAdmin: React.FC<LoginAdminProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      // Simple mock validation (accepts anything for demo purposes, or enforce specific creds if needed)
      if (email && password) {
        onLogin();
      } else {
        setError('Vui lòng nhập đầy đủ thông tin');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl w-full max-w-md border-4 border-white animate-in zoom-in-95 duration-300">
        
        <div className="text-center mb-10">
           <div className="w-20 h-20 bg-gradient-to-tr from-kid-blue to-kid-purple rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg transform -rotate-6">
             <ShieldCheck size={40} />
           </div>
           <h1 className="text-3xl font-black text-gray-800 mb-2">Admin Portal</h1>
           <p className="text-gray-500 font-medium">Đăng nhập hệ thống quản trị Asking Kids</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
           <div>
             <label className="block text-sm font-bold text-gray-700 mb-2">Email quản trị</label>
             <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-100 focus:border-kid-blue focus:outline-none transition-colors bg-gray-50 focus:bg-white font-bold text-gray-700"
                  placeholder="admin@askingkids.vn"
                />
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
             </div>
           </div>

           <div>
             <label className="block text-sm font-bold text-gray-700 mb-2">Mật khẩu</label>
             <div className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-100 focus:border-kid-blue focus:outline-none transition-colors bg-gray-50 focus:bg-white font-bold text-gray-700"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
             </div>
           </div>

           {error && (
             <div className="text-red-500 text-sm font-bold text-center bg-red-50 py-2 rounded-lg">
               {error}
             </div>
           )}

           <button 
             type="submit" 
             disabled={isLoading}
             className="w-full bg-kid-blue text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-600 hover:shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-2"
           >
             {isLoading ? (
               <span className="flex items-center gap-2">
                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                 Đang xử lý...
               </span>
             ) : (
               <>
                 Đăng Nhập <ArrowRight size={20} />
               </>
             )}
           </button>
        </form>

        <div className="mt-8 text-center">
           <a href="#" className="text-gray-400 hover:text-kid-blue text-sm font-bold transition-colors">
             Quên mật khẩu?
           </a>
        </div>
      </div>
    </div>
  );
};
