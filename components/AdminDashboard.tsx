
import React, { useState } from 'react';
import { LayoutDashboard, FileText, Gamepad2, BookOpen, Users, MessageCircle, Settings, LogOut, TrendingUp, UserPlus, FilePlus } from 'lucide-react';
import { BlogAdminPage } from './admin/BlogAdminPage';
import { GameAdminPage } from './admin/GameAdminPage';
import { WorksheetAdminPage } from './admin/WorksheetAdminPage';
import { UserAdminPage } from './admin/UserAdminPage';
import { QnAAdminPage } from './admin/QnAAdminPage';
import { SettingsAdminPage } from './admin/SettingsAdminPage';
import { LoginAdmin } from './admin/LoginAdmin';

// Admin Views Enum
enum AdminView {
  DASHBOARD = 'DASHBOARD',
  BLOGS = 'BLOGS',
  GAMES = 'GAMES',
  WORKSHEETS = 'WORKSHEETS',
  USERS = 'USERS',
  QNA = 'QNA',
  SETTINGS = 'SETTINGS'
}

export const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<AdminView>(AdminView.DASHBOARD);

  // --- Auth Check ---
  if (!isAuthenticated) {
    return <LoginAdmin onLogin={() => setIsAuthenticated(true)} />;
  }

  // --- Dashboard Logic ---
  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        setIsAuthenticated(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-gray-800">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed h-full z-10">
        <div className="h-20 flex items-center px-8 border-b border-gray-100">
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-kid-blue rounded-lg flex items-center justify-center text-white font-black">A</div>
              <span className="font-black text-xl text-gray-800">Admin</span>
           </div>
        </div>

        <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
           <AdminNavItem 
              active={currentView === AdminView.DASHBOARD} 
              label="Tổng quan" 
              icon={LayoutDashboard} 
              onClick={() => setCurrentView(AdminView.DASHBOARD)} 
           />
           <div className="pt-4 pb-2 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Nội dung</div>
           <AdminNavItem 
              active={currentView === AdminView.BLOGS} 
              label="Quản lý Blog" 
              icon={FileText} 
              onClick={() => setCurrentView(AdminView.BLOGS)} 
           />
           <AdminNavItem 
              active={currentView === AdminView.GAMES} 
              label="Quản lý Game" 
              icon={Gamepad2} 
              onClick={() => setCurrentView(AdminView.GAMES)} 
           />
           <AdminNavItem 
              active={currentView === AdminView.WORKSHEETS} 
              label="Quản lý Tài liệu" 
              icon={BookOpen} 
              onClick={() => setCurrentView(AdminView.WORKSHEETS)} 
           />
           
           <div className="pt-4 pb-2 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Cộng đồng</div>
           <AdminNavItem 
              active={currentView === AdminView.USERS} 
              label="Người dùng" 
              icon={Users} 
              onClick={() => setCurrentView(AdminView.USERS)} 
           />
           <AdminNavItem 
              active={currentView === AdminView.QNA} 
              label="Hỏi đáp (Q&A)" 
              icon={MessageCircle} 
              onClick={() => setCurrentView(AdminView.QNA)} 
           />

           <div className="pt-4 pb-2 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Hệ thống</div>
           <AdminNavItem 
              active={currentView === AdminView.SETTINGS} 
              label="Cài đặt" 
              icon={Settings} 
              onClick={() => setCurrentView(AdminView.SETTINGS)} 
           />
        </nav>

        <div className="p-4 border-t border-gray-100">
           <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-colors"
           >
             <LogOut size={20} /> Đăng xuất
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow md:ml-64 p-4 md:p-8">
         {currentView === AdminView.DASHBOARD && <DashboardHome />}
         {currentView === AdminView.BLOGS && <BlogAdminPage />}
         {currentView === AdminView.GAMES && <GameAdminPage />}
         {currentView === AdminView.WORKSHEETS && <WorksheetAdminPage />}
         {currentView === AdminView.USERS && <UserAdminPage />}
         {currentView === AdminView.QNA && <QnAAdminPage />}
         {currentView === AdminView.SETTINGS && <SettingsAdminPage />}
      </main>
    </div>
  );
};

// --- Sub Components ---

const AdminNavItem = ({ active, label, icon: Icon, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
      active 
        ? 'bg-kid-blue text-white shadow-md' 
        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
    }`}
  >
    <Icon size={20} /> {label}
  </button>
);

const DashboardHome = () => {
  return (
    <div className="space-y-8 animate-in fade-in">
       <div>
         <h1 className="text-3xl font-black text-gray-800">Xin chào, Admin! 👋</h1>
         <p className="text-gray-500">Đây là tình hình hoạt động của Asking Kids hôm nay.</p>
       </div>

       {/* Stats Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Tổng người dùng" value="12,345" icon={Users} color="bg-blue-500" trend="+12%" />
          <StatCard title="Bài viết Blog" value="142" icon={FileText} color="bg-pink-500" trend="+5" />
          <StatCard title="Game đã đăng" value="8" icon={Gamepad2} color="bg-purple-500" trend="Active" />
          <StatCard title="Tài liệu PDF" value="89" icon={BookOpen} color="bg-green-500" trend="+3" />
       </div>

       {/* Recent Activity */}
       <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <TrendingUp className="text-kid-blue"/> Hoạt động gần đây
          </h2>
          
          <div className="space-y-6">
             <ActivityItem 
                icon={UserPlus} 
                bg="bg-blue-100 text-blue-600"
                title="Người dùng mới đăng ký"
                desc="Nguyen Van A vừa tạo tài khoản thành viên."
                time="2 phút trước"
             />
             <ActivityItem 
                icon={MessageCircle} 
                bg="bg-purple-100 text-purple-600"
                title="Câu hỏi mới cần duyệt"
                desc="Bé 3 tuổi bị biếng ăn phải làm sao? - Mẹ Bỉm."
                time="15 phút trước"
             />
             <ActivityItem 
                icon={FilePlus} 
                bg="bg-green-100 text-green-600"
                title="Tài liệu mới được tải lên"
                desc="Admin đã thêm tài liệu: Toán tư duy lớp 1."
                time="1 giờ trước"
             />
             <ActivityItem 
                icon={FileText} 
                bg="bg-pink-100 text-pink-600"
                title="Bài viết Blog mới"
                desc="Bản nháp: Dạy con kỹ năng sống - Đã được lưu."
                time="3 giờ trước"
             />
          </div>
       </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
     <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-xl ${color} text-white flex items-center justify-center shadow-lg shadow-gray-200`}>
           <Icon size={24} />
        </div>
        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">{trend}</span>
     </div>
     <h3 className="text-gray-500 font-bold text-sm mb-1">{title}</h3>
     <p className="text-3xl font-black text-gray-800">{value}</p>
  </div>
);

const ActivityItem = ({ icon: Icon, bg, title, desc, time }: any) => (
  <div className="flex items-start gap-4 pb-6 border-b border-gray-50 last:border-0 last:pb-0">
     <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${bg}`}>
        <Icon size={20} />
     </div>
     <div className="flex-grow">
        <h4 className="font-bold text-gray-800 text-sm">{title}</h4>
        <p className="text-gray-500 text-sm">{desc}</p>
     </div>
     <span className="text-xs text-gray-400 font-medium whitespace-nowrap">{time}</span>
  </div>
);
