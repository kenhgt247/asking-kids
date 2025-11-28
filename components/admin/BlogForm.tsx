
import React, { useState, useEffect } from 'react';
import { Save, X, Image as ImageIcon, Layout, Type, AlignLeft } from 'lucide-react';
import { AdminBlogPost } from './BlogTable';

interface BlogFormProps {
  initialData?: AdminBlogPost | null;
  onSubmit: (data: AdminBlogPost) => void;
  onCancel: () => void;
}

export const BlogForm: React.FC<BlogFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Partial<AdminBlogPost>>({
    title: '',
    category: 'Giáo dục sớm',
    status: 'DRAFT',
    content: '',
    image: '',
    excerpt: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!formData.title || !formData.content) return;

    // Construct final object
    const finalData: AdminBlogPost = {
      id: initialData?.id || Date.now().toString(),
      title: formData.title || '',
      category: formData.category || 'Chung',
      status: formData.status as 'PUBLISHED' | 'DRAFT',
      content: formData.content || '',
      image: formData.image || `https://picsum.photos/600/400?random=${Date.now()}`,
      excerpt: formData.excerpt || formData.content?.substring(0, 100) + '...' || '',
      date: initialData?.date || new Date().toLocaleDateString('vi-VN'),
      likes: initialData?.likes || 0,
      comments: initialData?.comments || [],
      author: initialData?.author || 'Admin',
      authorAvatar: initialData?.authorAvatar
    };

    onSubmit(finalData);
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 animate-in slide-in-from-right duration-300">
      <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-100">
        <h2 className="text-2xl font-black text-gray-800">
          {initialData ? 'Chỉnh Sửa Bài Viết' : 'Thêm Bài Viết Mới'}
        </h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <X size={28} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <Type size={16} className="text-kid-blue"/> Tiêu đề bài viết
            </label>
            <input 
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-kid-blue focus:outline-none font-bold text-lg"
              placeholder="Nhập tiêu đề hấp dẫn..."
            />
          </div>

          <div>
             <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
               <AlignLeft size={16} className="text-kid-purple"/> Tóm tắt ngắn (Excerpt)
             </label>
             <textarea 
               rows={2}
               value={formData.excerpt}
               onChange={e => setFormData({...formData, excerpt: e.target.value})}
               className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-kid-purple focus:outline-none"
               placeholder="Mô tả ngắn gọn nội dung bài viết..."
             />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Nội dung chi tiết</label>
            <textarea 
              required
              rows={12}
              value={formData.content}
              onChange={e => setFormData({...formData, content: e.target.value})}
              className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-kid-blue focus:outline-none font-medium"
              placeholder="Viết nội dung bài viết ở đây (Hỗ trợ Markdown cơ bản)..."
            />
          </div>
        </div>

        {/* Right Column: Settings & Meta */}
        <div className="space-y-6">
           <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <label className="block text-sm font-bold text-gray-700 mb-2">Trạng thái</label>
              <select 
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value as any})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-kid-green focus:outline-none font-bold"
              >
                <option value="DRAFT">Nháp (Ẩn)</option>
                <option value="PUBLISHED">Công khai (Published)</option>
              </select>
           </div>

           <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                 <Layout size={16}/> Chuyên mục
              </label>
              <select 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-kid-pink focus:outline-none"
              >
                <option>Giáo dục sớm</option>
                <option>Dinh dưỡng</option>
                <option>Sức khỏe</option>
                <option>Tâm lý</option>
                <option>Góc Chia Sẻ</option>
              </select>
           </div>

           <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                 <ImageIcon size={16}/> Ảnh bìa (URL)
              </label>
              <input 
                type="text"
                value={formData.image}
                onChange={e => setFormData({...formData, image: e.target.value})}
                className="w-full px-4 py-2 mb-3 rounded-xl border border-gray-200 focus:outline-none focus:border-kid-blue text-sm"
                placeholder="https://..."
              />
              <div className="rounded-xl overflow-hidden bg-white border border-gray-200 h-40 flex items-center justify-center relative">
                 {formData.image ? (
                   <img src={formData.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/300?text=Error')}/>
                 ) : (
                   <span className="text-gray-400 text-sm font-bold">Xem trước ảnh</span>
                 )}
              </div>
           </div>

           <div className="pt-4 flex flex-col gap-3">
             <button 
               type="submit"
               className="w-full py-4 bg-kid-pink text-white font-bold rounded-xl shadow-lg hover:bg-pink-600 transition-all active:scale-95 flex items-center justify-center gap-2"
             >
               <Save size={20} /> Lưu Bài Viết
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
