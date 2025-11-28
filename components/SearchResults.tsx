import React, { useMemo } from 'react';
import { GameType, BlogPost, Question, Worksheet, QnACategory } from '../types';
import { Search, Rocket, Coffee, MessageCircleQuestion, BookOpen, ArrowRight } from 'lucide-react';

interface SearchResultsProps {
  query: string;
  onGameSelect: (type: GameType) => void;
  onBlogSelect: (id: string) => void;
  onQuestionSelect: (id: string) => void;
  onWorksheetSelect: (id: string) => void; 
}

export const SearchResults: React.FC<SearchResultsProps> = ({ query, onGameSelect, onBlogSelect, onQuestionSelect, onWorksheetSelect }) => {
  
  // --- MOCK DATABASE FOR SEARCH (In a real app, this would come from a backend or central store) ---
  
  const GAMES = [
    { type: GameType.COLOR, title: 'Học Màu Sắc', desc: 'Chọn đúng màu sắc theo tên gọi!' },
    { type: GameType.MATH, title: 'Toán Lớp 1', desc: 'Phép cộng trừ đơn giản cho bé.' },
    { type: GameType.SPEAKING, title: 'Luyện Phát Âm', desc: 'Bé nói tiếng Anh cùng AI nào!' }
  ];

  const BLOGS: BlogPost[] = [
    { id: '1', title: 'Phương pháp Montessori tại nhà cho trẻ 3 tuổi', category: 'Giáo dục sớm', excerpt: 'Làm sao để áp dụng triết lý Montessori mà không cần mua giáo cụ đắt tiền?', content: '', image: 'https://picsum.photos/600/400?random=10', author: 'Dr. Asking Kids', date: '20/10/2023', likes: 156, comments: [] },
    { id: '2', title: '10 cách cai nghiện điện thoại cho trẻ hiệu quả', category: 'Sức khỏe', excerpt: 'Trẻ xem TV quá nhiều? Hãy thử quy tắc "vùng không công nghệ".', content: '', image: 'https://picsum.photos/600/400?random=11', author: 'Mẹ Bắp', date: '18/10/2023', likes: 89, comments: [] },
    { id: '3', title: 'Thực đơn tăng chiều cao cho bé lớp 1', category: 'Dinh dưỡng', excerpt: 'Những nhóm chất vàng giúp bé phát triển chiều cao vượt trội.', content: '', image: 'https://picsum.photos/600/400?random=12', author: 'Chuyên gia Dinh dưỡng', date: '15/10/2023', likes: 210, comments: [] },
    { id: '4', title: 'Dạy con tự lập từ những việc nhỏ', category: 'Giáo dục sớm', excerpt: 'Hướng dẫn bé tự gấp quần áo, dọn đồ chơi.', content: '', image: 'https://picsum.photos/600/400?random=13', author: 'Dr. Asking Kids', date: '10/10/2023', likes: 134, comments: [] }
  ];

  const QUESTIONS: Question[] = [
    { id: '1', title: 'Bé 3 tuổi không chịu ăn rau, các mẹ có cách nào không?', content: 'Bé nhà mình cứ thấy rau là nhè ra...', category: QnACategory.PARENTS, author: 'Mẹ SuSu', avatar: '', likes: 12, views: 105, timestamp: '2 giờ trước', tags: ['Dinh dưỡng', 'Biếng ăn'], answers: [] },
    { id: '2', title: 'Học bổng du học Úc cần chuẩn bị từ lớp mấy?', content: 'Em đang học lớp 9, muốn xin học bổng du học Úc...', category: QnACategory.ABROAD, author: 'Minh Anh', avatar: '', likes: 24, views: 340, timestamp: '5 giờ trước', tags: ['Du học Úc', 'Học bổng'], answers: [] },
    { id: '3', title: 'App học tiếng Anh nào tốt cho bé 5 tuổi?', content: 'Ngoài Asking Kids ra thì còn app nào...', category: QnACategory.EDUCATION, author: 'Cô Thảo', avatar: '', likes: 8, views: 89, timestamp: '1 ngày trước', tags: ['Tiếng Anh', 'Công nghệ'], answers: [] },
    { id: '4', title: 'Làm sao để bé tự ngủ mà không cần ru?', content: 'Mỗi lần cho con ngủ là một cuộc chiến...', category: QnACategory.PARENTS, author: 'Mẹ Bỉm Sữa', avatar: '', likes: 15, views: 200, timestamp: '3 giờ trước', tags: ['Giấc ngủ', 'Kỹ năng'], answers: [] }
  ];

  const WORKSHEETS: Worksheet[] = [
    { id: '1', title: 'Tập tô chữ cái A-Z', subject: 'Tiếng Việt', age: '3-5 tuổi', imageUrl: '' },
    { id: '2', title: 'Nối hình con vật', subject: 'Tư duy', age: '2-4 tuổi', imageUrl: '' },
    { id: '3', title: 'Toán cộng trong phạm vi 10', subject: 'Toán', age: '5-6 tuổi', imageUrl: '' },
    { id: '4', title: 'Flashcard Màu sắc (Song ngữ)', subject: 'Tiếng Anh', age: '2-6 tuổi', imageUrl: '' }
  ];

  // --- SEARCH LOGIC ---

  const results = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return { games: [], blogs: [], questions: [], worksheets: [] };

    return {
      games: GAMES.filter(g => g.title.toLowerCase().includes(q) || g.desc.toLowerCase().includes(q)),
      blogs: BLOGS.filter(b => b.title.toLowerCase().includes(q) || b.excerpt.toLowerCase().includes(q) || b.category.toLowerCase().includes(q)),
      questions: QUESTIONS.filter(qu => 
        qu.title.toLowerCase().includes(q) || 
        qu.content.toLowerCase().includes(q) || 
        qu.tags.some(t => t.toLowerCase().includes(q))
      ),
      worksheets: WORKSHEETS.filter(w => w.title.toLowerCase().includes(q) || w.subject.toLowerCase().includes(q))
    };
  }, [query]);

  const totalResults = results.games.length + results.blogs.length + results.questions.length + results.worksheets.length;

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen">
      <div className="mb-10 text-center">
         <div className="inline-block p-4 rounded-full bg-gray-100 mb-4">
             <Search size={32} className="text-gray-500"/>
         </div>
         <h2 className="text-3xl font-black text-gray-800 mb-2">Kết quả tìm kiếm cho: "{query}"</h2>
         <p className="text-gray-500 font-medium">Tìm thấy {totalResults} kết quả phù hợp</p>
      </div>

      {totalResults === 0 && (
         <div className="text-center py-20 opacity-50">
            <p className="text-xl text-gray-400 font-bold">Không tìm thấy nội dung nào. Hãy thử từ khóa khác!</p>
         </div>
      )}

      <div className="space-y-12">
        {/* GAMES */}
        {results.games.length > 0 && (
          <section>
            <h3 className="flex items-center gap-2 text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
               <Rocket className="text-kid-pink" /> Trò Chơi
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {results.games.map((g, i) => (
                 <div key={i} onClick={() => onGameSelect(g.type)} className="bg-white p-6 rounded-2xl shadow-md border-b-4 border-kid-pink cursor-pointer hover:-translate-y-1 transition-transform">
                    <h4 className="text-xl font-bold mb-2">{g.title}</h4>
                    <p className="text-gray-500 text-sm">{g.desc}</p>
                 </div>
              ))}
            </div>
          </section>
        )}

        {/* QUESTIONS */}
        {results.questions.length > 0 && (
          <section>
            <h3 className="flex items-center gap-2 text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
               <MessageCircleQuestion className="text-kid-purple" /> Hỏi Đáp Cộng Đồng
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {results.questions.map(q => (
                 <div key={q.id} onClick={() => onQuestionSelect(q.id)} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:bg-purple-50 transition-colors">
                    <h4 className="text-lg font-bold text-gray-800 mb-1">{q.title}</h4>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-2">{q.content}</p>
                    <div className="flex gap-2">
                       {q.tags.map(t => <span key={t} className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded">#{t}</span>)}
                    </div>
                 </div>
              ))}
            </div>
          </section>
        )}

        {/* BLOGS */}
        {results.blogs.length > 0 && (
          <section>
            <h3 className="flex items-center gap-2 text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
               <Coffee className="text-kid-blue" /> Blog Cha Mẹ
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.blogs.map(b => (
                 <div key={b.id} onClick={() => onBlogSelect(b.id)} className="flex gap-4 bg-white p-4 rounded-2xl shadow-sm cursor-pointer group">
                    <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                       <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                       <span className="text-xs font-bold text-kid-blue uppercase">{b.category}</span>
                       <h4 className="font-bold text-gray-800 group-hover:text-kid-blue transition-colors line-clamp-2 mb-1">{b.title}</h4>
                       <p className="text-xs text-gray-400 line-clamp-2">{b.excerpt}</p>
                    </div>
                 </div>
              ))}
            </div>
          </section>
        )}

        {/* WORKSHEETS */}
        {results.worksheets.length > 0 && (
          <section>
            <h3 className="flex items-center gap-2 text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
               <BookOpen className="text-kid-green" /> Tài Liệu Học Tập
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {results.worksheets.map(w => (
                 <div key={w.id} onClick={() => onWorksheetSelect(w.id)} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all">
                    <h4 className="font-bold text-gray-800 text-sm mb-1">{w.title}</h4>
                    <p className="text-xs text-gray-400">{w.subject} • {w.age}</p>
                    <div className="mt-2 text-kid-green text-xs font-bold flex items-center gap-1">
                       Xem chi tiết <ArrowRight size={12}/>
                    </div>
                 </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};