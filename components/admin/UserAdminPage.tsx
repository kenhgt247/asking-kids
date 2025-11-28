
import React, { useState } from 'react';
import { Search, Shield, ShieldCheck, ShieldAlert, User, MoreVertical, Trash2, Mail, Calendar, Filter, CheckCircle } from 'lucide-react';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'ADMIN' | 'USER';
  joinDate: string;
  rank: string;
  points: number;
  status: 'ACTIVE' | 'BANNED';
}

export const UserAdminPage: React.FC = () => {
  const [filterRole, setFilterRole] = useState<'ALL' | 'ADMIN' | 'USER'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock Data
  const [users, setUsers] = useState<AdminUser[]>([
    {
      id: '1',
      name: 'Admin Manager',
      email: 'admin@askingkids.vn',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
      role: 'ADMIN',
      joinDate: '01/01/2023',
      rank: 'Quản trị viên',
      points: 9999,
      status: 'ACTIVE'
    },
    {
      id: '2',
      name: 'Mẹ Bắp',
      email: 'mebap@gmail.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bap',
      role: 'USER',
      joinDate: '15/10/2023',
      rank: 'Chuyên gia',
      points: 1250,
      status: 'ACTIVE'
    },
    {
      id: '3',
      name: 'Bố Ken',
      email: 'boken123@yahoo.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ken',
      role: 'USER',
      joinDate: '20/10/2023',
      rank: 'Thành viên tích cực',
      points: 450,
      status: 'ACTIVE'
    },
    {
      id: '4',
      name: 'Nguyễn Văn A',
      email: 'anguyen@company.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=A',
      role: 'USER',
      joinDate: '22/10/2023',
      rank: 'Thành viên mới',
      points: 50,
      status: 'BANNED'
    },
    {
      id: '5',
      name: 'Cô Giáo Thảo',
      email: 'thaoteacher@edu.vn',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thao',
      role: 'USER',
      joinDate: '05/09/2023',
      rank: 'Người hiểu biết',
      points: 890,
      status: 'ACTIVE'
    }
  ]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterRole === 'ALL' || user.role === filterRole;
    return matchesSearch && matchesFilter;
  });

  const handleToggleRole = (id: string) => {
    const user = users.find(u => u.id === id);
    if (!user) return;
    
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    if (window.confirm(`Bạn có chắc muốn đổi quyền của "${user.name}" thành ${newRole}?`)) {
      setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
    }
  };

  const handleDeleteUser = (id: string) => {
    if (window.confirm('Cảnh báo: Hành động này không thể hoàn tác. Xóa người dùng này?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
           <User className="text-kid-blue" size={32} /> Quản Lý Người Dùng
        </h1>
        <p className="text-gray-500">Xem danh sách, phân quyền và quản lý tài khoản thành viên.</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
         
         {/* Filter Tabs */}
         <div className="flex bg-gray-100 p-1 rounded-xl">
            <button 
              onClick={() => setFilterRole('ALL')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filterRole === 'ALL' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Tất cả
            </button>
            <button 
              onClick={() => setFilterRole('USER')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filterRole === 'USER' ? 'bg-white text-kid-blue shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Người dùng
            </button>
            <button 
              onClick={() => setFilterRole('ADMIN')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filterRole === 'ADMIN' ? 'bg-white text-kid-purple shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Quản trị viên
            </button>
         </div>

         {/* Search */}
         <div className="relative w-full md:w-96">
            <input 
               type="text"
               placeholder="Tìm theo tên, email..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-kid-blue/50 bg-gray-50 focus:bg-white transition-colors"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
         </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-50/50 text-gray-600 text-sm uppercase tracking-wider border-b border-gray-100">
                <th className="p-6 font-bold">Thành viên</th>
                <th className="p-6 font-bold">Vai trò</th>
                <th className="p-6 font-bold">Ngày tham gia</th>
                <th className="p-6 font-bold">Trạng thái</th>
                <th className="p-6 font-bold text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredUsers.map((user) => (
                <tr 
                  key={user.id} 
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                         <img 
                           src={user.avatar} 
                           alt={user.name} 
                           className="w-12 h-12 rounded-full border border-gray-200 bg-white"
                         />
                         {user.role === 'ADMIN' && (
                           <div className="absolute -bottom-1 -right-1 bg-kid-purple text-white rounded-full p-0.5 border-2 border-white" title="Admin">
                             <Shield size={10} fill="currentColor"/>
                           </div>
                         )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                           <h4 className="font-bold text-gray-900">{user.name}</h4>
                           <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                              user.rank === 'Chuyên gia' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 'bg-gray-100 text-gray-500 border-gray-200'
                           }`}>
                             {user.rank}
                           </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                           <Mail size={12}/> {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="p-6">
                    {user.role === 'ADMIN' ? (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-kid-purple to-purple-600 px-3 py-1.5 rounded-full w-fit shadow-sm">
                        <ShieldCheck size={14} /> Admin
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full w-fit">
                        <User size={14} /> User
                      </span>
                    )}
                  </td>
                  
                  <td className="p-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar size={16} className="text-gray-300" />
                      {user.joinDate}
                    </div>
                  </td>

                  <td className="p-6">
                     {user.status === 'ACTIVE' ? (
                        <span className="text-green-500 font-bold text-xs flex items-center gap-1">
                           <span className="w-2 h-2 rounded-full bg-green-500"></span> Active
                        </span>
                     ) : (
                        <span className="text-red-500 font-bold text-xs flex items-center gap-1">
                           <span className="w-2 h-2 rounded-full bg-red-500"></span> Banned
                        </span>
                     )}
                  </td>
                  
                  <td className="p-6 text-right">
                     <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => handleToggleRole(user.id)}
                          className="text-xs font-bold text-kid-blue hover:text-blue-700 hover:underline"
                        >
                           {user.role === 'ADMIN' ? 'Gỡ quyền Admin' : 'Cấp quyền Admin'}
                        </button>
                        <button 
                           onClick={() => handleDeleteUser(user.id)}
                           className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                           title="Xóa người dùng"
                        >
                           <Trash2 size={16} />
                        </button>
                     </div>
                  </td>
                </tr>
              ))}
              
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-400 font-medium">
                     Không tìm thấy người dùng nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
