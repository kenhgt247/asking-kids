
import React, { useState, useEffect } from 'react';
import { Save, X, Image as ImageIcon, FileText, UploadCloud, GraduationCap, Users } from 'lucide-react';
import { AdminWorksheet } from './WorksheetTable';

interface WorksheetFormProps {
  initialData?: AdminWorksheet | null;
  onSubmit: (data: AdminWorksheet) => void;
  onCancel: () => void;
}

export const WorksheetForm: React.FC<WorksheetFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Partial<AdminWorksheet>>({
    title: '',
    subject: 'Tiếng Việt',
    age: '3-5 tuổi',
    description: '',
    imageUrl: '',
    pdfUrl: '',
    downloads: 0
  });

  const [fileName, setFileName] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setFileName(initialData.pdfUrl ? 'document.pdf' : '');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    const finalData: AdminWorksheet = {
      id: initialData?.id || Date.now().toString(),
      title: formData.title || '',
      subject: formData.subject || 'Chung',
      age: formData.age || 'All',
      description: formData.description || '',
      imageUrl: formData.imageUrl || `https://picsum.photos/300/400?random=${Date.now()}`,
      pdfUrl: formData.pdfUrl || '#',
      downloads: initialData?.downloads || 0
    };

    onSubmit(finalData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if(e.target.files && e.target.files[0]) {
          setFileName(e.target.files[0].name);
          // Simulate upload
          setFormData({...formData, pdfUrl: URL.createObjectURL(e.target.files[0])});
      }
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 animate-in slide-in-from-right duration-300">
      <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-100">
        <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
          <FileText className="text-kid-green" />
          {initialData ? 'Chỉnh Sửa Tài Liệu' : 'Upload Tài Liệu Mới'}
        </h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <X size={28} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column: Info */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Tên tài liệu</label>
            <input 
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-kid-green focus:outline-none font-bold text-lg"
              placeholder="Ví dụ: Tập tô chữ A..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <GraduationCap size={16}/> Môn học
                </label>
                <select 
                    value={formData.subject}
                    onChange={e => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-kid-green focus:outline-none"
                >
                    <option>Tiếng Việt</option>
                    <option>Toán</option>
                    <option>Tiếng Anh</option>
                    <option>Tư duy</option>
                    <option>Mỹ thuật</option>
                </select>
             </div>
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Users size={16}/> Độ tuổi
                </label>
                <select 
                    value={formData.age}
                    onChange={e => setFormData({...formData, age: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-kid-green focus:outline-none"
                >
                    <option>2-3 tuổi</option>
                    <option>3-5 tuổi</option>
                    <option>4-6 tuổi</option>
                    <option>6-8 tuổi</option>
                    <option>8-10 tuổi</option>
                </select>
             </div>
          </div>

          <div>
             <label className="block text-sm font-bold text-gray-700 mb-2">Mô tả nội dung</label>
             <textarea 
               rows={5}
               value={formData.description}
               onChange={e => setFormData({...formData, description: e.target.value})}
               className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-kid-green focus:outline-none"
               placeholder="Giới thiệu về bài tập, kỹ năng bé sẽ học được..."
             />
          </div>
        </div>

        {/* Right Column: Files */}
        <div className="space-y-6">
           
           {/* Upload Box */}
           <div className="bg-green-50/50 p-6 rounded-2xl border-2 border-dashed border-green-200 text-center">
              <label className="cursor-pointer block">
                  <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 text-kid-green">
                      <UploadCloud size={32} />
                  </div>
                  <h3 className="font-bold text-gray-700 mb-1">Upload file PDF</h3>
                  <p className="text-xs text-gray-500 mb-4">Kéo thả hoặc click để chọn file</p>
                  <input type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
              </label>
              {fileName && (
                  <div className="bg-white px-4 py-2 rounded-lg inline-flex items-center gap-2 text-sm font-bold text-kid-green shadow-sm">
                      <FileText size={16}/> {fileName}
                  </div>
              )}
           </div>

           <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                 <ImageIcon size={16}/> Ảnh bìa (Thumbnail URL)
              </label>
              <input 
                type="text"
                value={formData.imageUrl}
                onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                className="w-full px-4 py-2 mb-3 rounded-xl border border-gray-200 focus:outline-none focus:border-kid-green text-sm"
                placeholder="https://..."
              />
              <div className="rounded-xl overflow-hidden bg-gray-100 border border-gray-200 h-48 w-36 mx-auto flex items-center justify-center relative shadow-sm">
                 {formData.imageUrl ? (
                   <img 
                    src={formData.imageUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover" 
                    onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150x200?text=No+Img')}
                   />
                 ) : (
                   <span className="text-xs text-gray-400 font-bold">Preview</span>
                 )}
              </div>
           </div>

           <div className="pt-4 flex flex-col gap-3">
             <button 
               type="submit"
               className="w-full py-4 bg-kid-green text-white font-bold rounded-xl shadow-lg hover:bg-green-600 transition-all active:scale-95 flex items-center justify-center gap-2"
             >
               <Save size={20} /> Lưu Tài Liệu
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
