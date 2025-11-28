
import React, { useState } from 'react';
import { Search, MessageCircle, Trash2, Eye, CheckCircle, XCircle, Filter, Tag } from 'lucide-react';
import { Question, QnACategory } from '../../types';

// Extended type for Admin
interface AdminQuestion extends Question {
  status: 'ACTIVE' | 'HIDDEN';
  reports: number;
}

export const QnAAdminPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  // Mock Data
  const [questions, setQuestions] = useState<AdminQuestion[]>([
    {
      id: '1',
      title: 'Bé 3 tuổi không chịu ăn rau, các mẹ có cách nào không?',
      content: 'Bé nhà mình cứ thấy rau là nhè ra, xay nhuyễn cũng biết. Mình stress quá!',
      category: QnACategory.PARENTS,
      author: 'Mẹ SuSu',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Susu',
      likes: 12,
      views: 105,
      timestamp: '2 giờ trước',
      tags: ['Dinh dưỡng', 'Biếng ăn'],
      answers: [], // Simplified for table
      status: 'ACTIVE',
      reports: 0
    },
    {
      id: '2',
      title: 'Học bổng du học Úc cần chuẩn bị từ lớp mấy?',
      content: 'Em đang học lớp 9, muốn xin học bổng du học Úc thì cần chuẩn bị hồ sơ gì từ bây giờ ạ?',
      category: QnACategory.ABROAD,
      author: 'Minh Anh',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Minh',
      likes: 24,
      views: 340,
      timestamp: '5 giờ trước',
      tags: ['Du học Úc', 'Học bổng'],
      answers: [],
      status: 'ACTIVE',
      reports: 0
    },
    {
      id: '3',
      title: 'Spam quảng cáo game bài...',
      content: 'Link tải game tại đây...',
      category: QnACategory.TECH,
      author: 'User123',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Spam',
      likes: 0,
      views: 12,
      timestamp: '10 phút trước',
      tags: ['Spam'],
      answers: [],
      status: 'HIDDEN',
      reports: 5
    }
  ]);

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          q.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'ALL' || q.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleToggleStatus = (id: string) => {
    setQuestions(questions.map(q => {
      if (q.id === id) {
        return { ...q, status: q.status === 'ACTIVE' ? 'HIDDEN' : 'ACTIVE' };
      }
      return q;
    }));
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa vĩnh viễn câu hỏi này?')) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
           <MessageCircle className="text-kid-purple" size={32} /> Quản Lý Hỏi Đáp
        </h1>
        <p className="text-gray-500">Kiểm duyệt nội dung, quản lý câu hỏi từ cộng đồng.</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
         <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            <Filter size={20} className="text-gray-400 mr-2 flex-shrink-0" />
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold focus:outline-none focus:border-kid-purple bg-white"
            >
              <option value="ALL">Tất cả chủ đề</option>
              {Object.values(QnACategory).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
         </div>

         <div className="relative w-full md:w-96">
            <input 
               type="text"
               placeholder="Tìm nội dung câu hỏi..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-kid-purple/50 bg-gray-50 focus:bg-white transition-colors"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
         </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-purple-50/50 text-gray-600 text-sm uppercase tracking-wider border-b border-gray-100">
                <th className="p-6 font-bold">Câu hỏi</th>
                <th className="p-6 font-bold">Danh mục</th>
                <th className="p-6 font-bold">Tương tác</th>
                <th className="p-6 font-bold">Trạng thái</th>
                <th className="p-6 font-bold text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredQuestions.map((q) => (
                <tr 
                  key={q.id} 
                  className={`border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors ${q.reports > 0 ? 'bg-red-50 hover:bg-red-100' : ''}`}
                >
                  <td className="p-6 max-w-sm">
                    <div className="flex items-start gap-3">
                       <img src={q.avatar} alt={q.author} className="w-10 h-10 rounded-full border border-gray-200 flex-shrink-0" />
                       <div>
                          <h4 className="font-bold text-gray-900 line-clamp-2 mb-1">{q.title}</h4>
                          <p className="text-xs text-gray-500 mb-2">Bởi: {q.author} • {q.timestamp}</p>
                          <div className="flex gap-1 flex-wrap">
                            {q.tags.map(t => (
                              <span key={t} className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                <Tag size={8}/> {t}
                              </span>
                            ))}
                          </div>
                          {q.reports > 0 && (
                            <div className="mt-2 text-red-500 text-xs font-bold flex items-center gap-1">
                               <XCircle size={12}/> {q.reports} báo cáo vi phạm
                            </div>
                          )}
                       </div>
                    </div>
                  </td>
                  
                  <td className="p-6">
                     <span className="bg-purple-50 text-kid-purple px-3 py-1 rounded-full text-xs font-bold">
                       {q.category}
                     </span>
                  </td>
                  
                  <td className="p-6">
                    <div className="flex flex-col gap-1 text-sm text-gray-500">
                      <span className="flex items-center gap-2"><Eye size={14}/> {q.views} xem</span>
                      <span className="flex items-center gap-2"><MessageCircle size={14}/> {q.answers.length} trả lời</span>
                    </div>
                  </td>

                  <td className="p-6">
                     {q.status === 'ACTIVE' ? (
                        <span className="text-green-500 font-bold text-xs flex items-center gap-1 bg-green-50 px-2 py-1 rounded w-fit">
                           <CheckCircle size={14}/> Hiển thị
                        </span>
                     ) : (
                        <span className="text-gray-500 font-bold text-xs flex items-center gap-1 bg-gray-100 px-2 py-1 rounded w-fit">
                           <XCircle size={14}/> Đã ẩn
                        </span>
                     )}
                  </td>
                  
                  <td className="p-6 text-right">
                     <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => handleToggleStatus(q.id)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                             q.status === 'ACTIVE' 
                               ? 'bg-orange-50 text-orange-500 hover:bg-orange-100' 
                               : 'bg-green-50 text-green-500 hover:bg-green-100'
                          }`}
                        >
                           {q.status === 'ACTIVE' ? 'Ẩn bài' : 'Hiện bài'}
                        </button>
                        <button 
                           onClick={() => handleDelete(q.id)}
                           className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                           title="Xóa vĩnh viễn"
                        >
                           <Trash2 size={16} />
                        </button>
                     </div>
                  </td>
                </tr>
              ))}
              
              {filteredQuestions.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-400 font-medium">
                     Không tìm thấy câu hỏi nào.
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
