
import React, { useState, useEffect } from 'react';
import { Save, X, Image as ImageIcon, Gamepad2, Globe } from 'lucide-react';
import { AdminGame } from './GameTable';

interface GameFormProps {
  initialData?: AdminGame | null;
  onSubmit: (data: AdminGame) => void;
  onCancel: () => void;
}

export const GameForm: React.FC<GameFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Partial<AdminGame>>({
    name: '',
    description: '',
    status: 'ACTIVE',
    coverImage: '',
    gameUrl: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.gameUrl) return;

    const finalData: AdminGame = {
      id: initialData?.id || Date.now().toString(),
      name: formData.name || '',
      description: formData.description || '',
      status: formData.status as 'ACTIVE' | 'MAINTENANCE',
      coverImage: formData.coverImage || `https://picsum.photos/300/300?random=${Date.now()}`,
      gameUrl: formData.gameUrl || ''
    };

    onSubmit(finalData);
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 animate-in slide-in-from-right duration-300">
      <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-100">
        <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
          <Gamepad2 className="text-kid-purple" />
          {initialData ? 'Chỉnh Sửa Trò Chơi' : 'Thêm Game Mới'}
        </h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <X size={28} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Tên trò chơi</label>
            <input 
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-kid-purple focus:outline-none font-bold text-lg"
              placeholder="Ví dụ: Học Toán Vui..."
            />
          </div>

          <div>
             <label className="block text-sm font-bold text-gray-700 mb-2">Mô tả ngắn</label>
             <textarea 
               rows={4}
               value={formData.description}
               onChange={e => setFormData({...formData, description: e.target.value})}
               className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-kid-purple focus:outline-none"
               placeholder="Giới thiệu về cách chơi và lợi ích..."
             />
          </div>

          <div>
             <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <Globe size={16} /> Đường dẫn Game (URL)
             </label>
             <input 
               type="text"
               required
               value={formData.gameUrl}
               onChange={e => setFormData({...formData, gameUrl: e.target.value})}
               className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-kid-purple focus:outline-none font-mono text-sm text-blue-600"
               placeholder="/games/math-kids"
             />
             <p className="text-xs text-gray-400 mt-2 font-medium">Nhập đường dẫn nội bộ hoặc link ngoài.</p>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
           <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Trạng thái</label>
              <select 
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value as any})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-kid-green focus:outline-none font-bold"
              >
                <option value="ACTIVE">Hoạt động (Active)</option>
                <option value="MAINTENANCE">Bảo trì (Maintenance)</option>
              </select>
           </div>

           <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                 <ImageIcon size={16}/> Ảnh đại diện (Cover Image)
              </label>
              <input 
                type="text"
                value={formData.coverImage}
                onChange={e => setFormData({...formData, coverImage: e.target.value})}
                className="w-full px-4 py-2 mb-3 rounded-xl border border-gray-200 focus:outline-none focus:border-kid-purple text-sm"
                placeholder="https://example.com/image.png"
              />
              <div className="rounded-2xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 h-48 flex items-center justify-center relative group">
                 {formData.coverImage ? (
                   <img 
                    src={formData.coverImage} 
                    alt="Preview" 
                    className="w-full h-full object-cover" 
                    onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/300?text=Invalid+Image')}
                   />
                 ) : (
                   <div className="text-center text-gray-400">
                      <ImageIcon size={32} className="mx-auto mb-2 opacity-50"/>
                      <span className="text-sm font-bold">Xem trước ảnh</span>
                   </div>
                 )}
              </div>
           </div>

           <div className="pt-4 flex flex-col gap-3">
             <button 
               type="submit"
               className="w-full py-4 bg-kid-purple text-white font-bold rounded-xl shadow-lg hover:bg-purple-600 transition-all active:scale-95 flex items-center justify-center gap-2"
             >
               <Save size={20} /> Lưu Trò Chơi
             </button>
             <button 
               type="button"
               onClick={onCancel}
               className="w-full py-3 bg-white text-gray-500 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
             >
               Hủy bỏ
             </button>
           </div>
        </div>
      </form>
    </div>
  );
};
