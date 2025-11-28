
import React, { useState } from 'react';
import { Settings, Save, Bell, Globe, Mail, Phone, Shield, Power } from 'lucide-react';

export const SettingsAdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'GENERAL' | 'CONTACT' | 'SEO'>('GENERAL');
  
  // General Settings State
  const [siteName, setSiteName] = useState('Asking Kids');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [allowRegistration, setAllowRegistration] = useState(true);
  const [announcement, setAnnouncement] = useState('');

  // Contact Settings State
  const [email, setEmail] = useState('hotro@askingkids.vn');
  const [phone, setPhone] = useState('1900 123 456');
  const [address, setAddress] = useState('Quận 1, TP.HCM');

  // Notification State
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
       {/* Header */}
       <div>
         <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
            <Settings className="text-gray-600" size={32} /> Cài Đặt Hệ Thống
         </h1>
         <p className="text-gray-500">Cấu hình chung, thông tin liên hệ và bảo trì.</p>
       </div>

       {/* Tabs */}
       <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100 w-fit">
          <TabButton 
             active={activeTab === 'GENERAL'} 
             label="Chung" 
             icon={Globe} 
             onClick={() => setActiveTab('GENERAL')} 
          />
          <TabButton 
             active={activeTab === 'CONTACT'} 
             label="Liên hệ" 
             icon={Mail} 
             onClick={() => setActiveTab('CONTACT')} 
          />
          <TabButton 
             active={activeTab === 'SEO'} 
             label="SEO & Meta" 
             icon={Shield} 
             onClick={() => setActiveTab('SEO')} 
          />
       </div>

       <form onSubmit={handleSave} className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
          
          {/* GENERAL TAB */}
          {activeTab === 'GENERAL' && (
             <div className="space-y-6 animate-in fade-in">
                <div>
                   <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Thông tin cơ bản</h3>
                   <div className="grid gap-6">
                      <div>
                         <label className="block text-sm font-bold text-gray-700 mb-2">Tên Website</label>
                         <input 
                            type="text" 
                            value={siteName}
                            onChange={e => setSiteName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-kid-blue focus:outline-none"
                         />
                      </div>
                      <div>
                         <label className="block text-sm font-bold text-gray-700 mb-2">Thông báo toàn trang (Banner)</label>
                         <div className="flex gap-2">
                            <Bell className="text-kid-yellow mt-3" size={24} />
                            <textarea 
                                rows={3}
                                value={announcement}
                                onChange={e => setAnnouncement(e.target.value)}
                                placeholder="Nhập thông báo hiển thị đầu trang chủ..."
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-kid-yellow focus:outline-none"
                            />
                         </div>
                      </div>
                   </div>
                </div>

                <div>
                   <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                      <Power size={20} /> Trạng thái hệ thống
                   </h3>
                   <div className="space-y-4">
                      <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                         <div>
                            <div className="font-bold text-gray-800">Chế độ bảo trì</div>
                            <div className="text-xs text-gray-500">Chỉ admin mới có thể truy cập website.</div>
                         </div>
                         <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={maintenanceMode} onChange={e => setMaintenanceMode(e.target.checked)} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                         </label>
                      </div>

                      <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                         <div>
                            <div className="font-bold text-gray-800">Cho phép đăng ký mới</div>
                            <div className="text-xs text-gray-500">Người dùng mới có thể tạo tài khoản.</div>
                         </div>
                         <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={allowRegistration} onChange={e => setAllowRegistration(e.target.checked)} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                         </label>
                      </div>
                   </div>
                </div>
             </div>
          )}

          {/* CONTACT TAB */}
          {activeTab === 'CONTACT' && (
             <div className="space-y-6 animate-in fade-in">
                <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Thông tin liên hệ (Footer)</h3>
                <div className="grid gap-6">
                   <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><Mail size={16}/> Email hỗ trợ</label>
                      <input 
                         type="email" 
                         value={email}
                         onChange={e => setEmail(e.target.value)}
                         className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-kid-blue focus:outline-none"
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><Phone size={16}/> Hotline</label>
                      <input 
                         type="text" 
                         value={phone}
                         onChange={e => setPhone(e.target.value)}
                         className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-kid-blue focus:outline-none"
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Địa chỉ văn phòng</label>
                      <input 
                         type="text" 
                         value={address}
                         onChange={e => setAddress(e.target.value)}
                         className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-kid-blue focus:outline-none"
                      />
                   </div>
                </div>
             </div>
          )}

          {/* SEO TAB */}
          {activeTab === 'SEO' && (
             <div className="space-y-6 animate-in fade-in">
                <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Cấu hình SEO</h3>
                <div className="grid gap-6">
                   <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Meta Title Mặc định</label>
                      <input 
                         type="text" 
                         defaultValue="Asking Kids - Nền tảng giáo dục & giải trí cho bé"
                         className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-kid-blue focus:outline-none text-gray-500"
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Meta Description</label>
                      <textarea 
                         rows={4}
                         defaultValue="Website học tập, trò chơi trí tuệ và cộng đồng cha mẹ lớn nhất Việt Nam..."
                         className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-kid-blue focus:outline-none text-gray-500"
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Google Analytics ID</label>
                      <input 
                         type="text" 
                         placeholder="UA-XXXXXXXXX"
                         className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-kid-blue focus:outline-none"
                      />
                   </div>
                </div>
             </div>
          )}

          {/* Action Bar */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
              {isSaved && (
                  <span className="text-green-500 font-bold animate-pulse flex items-center gap-2">
                     <Save size={18} /> Đã lưu thay đổi!
                  </span>
              )}
              <div className="ml-auto">
                 <button 
                    type="submit"
                    className="bg-kid-blue text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:bg-blue-600 transition-all active:scale-95 flex items-center gap-2"
                 >
                    <Save size={20} /> Lưu Cấu Hình
                 </button>
              </div>
          </div>
       </form>
    </div>
  );
};

const TabButton = ({ active, label, icon: Icon, onClick }: any) => (
  <button 
    type="button"
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
      active 
        ? 'bg-kid-blue text-white shadow-sm' 
        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
    }`}
  >
    <Icon size={18} /> {label}
  </button>
);
