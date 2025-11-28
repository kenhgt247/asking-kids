
"use client";

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Download, FileText, Send, X, ArrowLeft, Star, Share2, Search } from 'lucide-react';
import { Worksheet, WorksheetReview } from '../types';

interface WorksheetLibraryProps {
  initialWorksheetId?: string | null;
}

type ExtendedWorksheet = Worksheet & { description: string, downloads: number };

export const WorksheetLibrary: React.FC<WorksheetLibraryProps> = ({ initialWorksheetId }) => {
  const { user, addNotification, updateUserPoints, setShowAuthModal } = useApp();
  const [selectedWorksheet, setSelectedWorksheet] = useState<ExtendedWorksheet | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Reviews state
  const [userRating, setUserRating] = useState(0);
  const [reviewContent, setReviewContent] = useState('');

  // Request form state
  const [requestSubject, setRequestSubject] = useState('');
  const [requestAge, setRequestAge] = useState('');

  const [worksheets, setWorksheets] = useState<ExtendedWorksheet[]>([
    { 
        id: '1', title: 'Tập tô chữ cái A-Z', subject: 'Tiếng Việt', age: '3-5 tuổi', imageUrl: 'https://picsum.photos/300/400?random=1', description: 'Bộ tài liệu giúp bé làm quen với bảng chữ cái Tiếng Việt.', downloads: 1250,
        reviews: [
            { id: 'r1', author: 'Mẹ Bông', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bong', rating: 5, content: 'Tài liệu rất đẹp!', timestamp: '2 ngày trước' }
        ]
    },
    { id: '2', title: 'Nối hình con vật', subject: 'Tư duy', age: '2-4 tuổi', imageUrl: 'https://picsum.photos/300/400?random=2', description: 'Bài tập rèn luyện khả năng quan sát.', downloads: 890, reviews: [] },
    { id: '3', title: 'Toán cộng phạm vi 10', subject: 'Toán', age: '5-6 tuổi', imageUrl: 'https://picsum.photos/300/400?random=3', description: 'Bài tập toán lớp 1.', downloads: 2100, reviews: [] },
  ]);

  useEffect(() => {
    if (initialWorksheetId) {
      const found = worksheets.find(w => w.id === initialWorksheetId);
      if (found) {
        setSelectedWorksheet(found);
        window.scrollTo(0, 0);
      }
    }
  }, [initialWorksheetId]);

  const handleDownload = (ws: Worksheet) => {
    addNotification("Bắt đầu tải xuống...", "SUCCESS");
    // Simulate download window
    window.open('', '_blank')?.document.write(`<h1>Downloading ${ws.title}...</h1>`);
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setShowRequestModal(false);
    addNotification("Yêu cầu đã được gửi thành công!", "SUCCESS");
    setRequestSubject('');
  };

  const handleSubmitReview = () => {
    if (!selectedWorksheet) return;
    if (!user) {
        setShowAuthModal(true);
        return;
    }
    if (userRating === 0) return;

    const newReview: WorksheetReview = {
        id: Date.now().toString(),
        author: user.name,
        avatar: user.avatar,
        rating: userRating,
        content: reviewContent,
        timestamp: 'Vừa xong'
    };

    const updatedWorksheet = {
        ...selectedWorksheet,
        reviews: [newReview, ...(selectedWorksheet.reviews || [])]
    };

    setWorksheets(prev => prev.map(w => w.id === selectedWorksheet.id ? updatedWorksheet : w));
    setSelectedWorksheet(updatedWorksheet);
    setUserRating(0);
    setReviewContent('');
    updateUserPoints(5);
    addNotification("Đánh giá thành công! (+5 điểm)", "SUCCESS");
  };

  const filteredWorksheets = worksheets.filter(ws => ws.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const calculateAverageRating = (reviews?: WorksheetReview[]) => {
      if (!reviews || reviews.length === 0) return 0;
      return (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);
  };

  // --- DETAIL VIEW ---
  if (selectedWorksheet) {
    const avgRating = calculateAverageRating(selectedWorksheet.reviews);
    
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-8">
         <button onClick={() => setSelectedWorksheet(null)} className="group text-gray-500 hover:text-kid-blue mb-8 font-bold flex items-center gap-2">
            <ArrowLeft size={20} /> Quay lại kho tài liệu
         </button>

         <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row mb-12">
            <div className="w-full md:w-1/3 bg-gray-50 p-6 flex items-center justify-center border-r border-gray-100">
                <img src={selectedWorksheet.imageUrl} alt={selectedWorksheet.title} className="w-full h-auto rounded shadow-lg" />
            </div>
            <div className="w-full md:w-2/3 p-8 flex flex-col">
               <div className="flex gap-2 mb-4">
                  <span className="bg-blue-100 text-blue-600 font-bold px-3 py-1 rounded-full text-sm">{selectedWorksheet.subject}</span>
                  <span className="bg-green-100 text-green-600 font-bold px-3 py-1 rounded-full text-sm">{selectedWorksheet.age}</span>
               </div>
               <h1 className="text-3xl font-black text-gray-800 mb-4">{selectedWorksheet.title}</h1>
               <p className="text-gray-500 text-lg mb-8">{selectedWorksheet.description}</p>
               <div className="flex items-center gap-6 mb-8 text-gray-400 font-bold text-sm">
                   <span className="flex items-center gap-2"><Download size={18}/> {selectedWorksheet.downloads} lượt tải</span>
                   <span className="flex items-center gap-2"><Star size={18} className="text-kid-yellow fill-current"/> {avgRating}/5</span>
               </div>
               <div className="mt-auto flex gap-4">
                  <button onClick={() => handleDownload(selectedWorksheet)} className="flex-1 bg-kid-blue text-white font-bold py-4 rounded-xl hover:bg-blue-600 shadow-lg flex items-center justify-center gap-2 text-lg">
                     <Download size={24} /> Tải Xuống
                  </button>
               </div>
            </div>
         </div>

         {/* Reviews */}
         <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-16">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Đánh giá</h3>
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map(star => (
                        <button key={star} onClick={() => setUserRating(star)} className="focus:outline-none">
                            <Star size={28} className={`${star <= userRating ? 'text-kid-yellow fill-current' : 'text-gray-300'}`} />
                        </button>
                    ))}
                </div>
                <textarea 
                    value={reviewContent}
                    onChange={e => setReviewContent(e.target.value)}
                    placeholder="Viết đánh giá của bạn..."
                    className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none bg-white mb-4"
                />
                <button onClick={handleSubmitReview} className="bg-kid-yellow text-gray-800 font-bold px-6 py-2 rounded-xl hover:bg-yellow-400">Gửi Đánh Giá</button>
            </div>
            
            <div className="space-y-6">
                {selectedWorksheet.reviews?.map(review => (
                    <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                        <div className="flex items-start gap-4">
                            <img src={review.avatar} alt="avt" className="w-10 h-10 rounded-full" />
                            <div>
                                <h5 className="font-bold text-gray-800 text-sm">{review.author}</h5>
                                <div className="flex gap-1 my-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={12} className={`${i < review.rating ? 'text-kid-yellow fill-current' : 'text-gray-200'}`} />
                                    ))}
                                </div>
                                <p className="text-gray-600 text-sm">{review.content}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
         </div>
      </div>
    );
  }

  // --- GRID VIEW ---
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Kho Tài Liệu</h2>
        <div className="max-w-md mx-auto relative">
           <input 
              type="text" placeholder="Tìm kiếm..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-gray-200 focus:border-kid-green focus:outline-none"
           />
           <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredWorksheets.map((ws) => (
            <div key={ws.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all cursor-pointer" onClick={() => setSelectedWorksheet(ws)}>
              <div className="h-64 overflow-hidden bg-gray-100"><img src={ws.imageUrl} alt={ws.title} className="w-full h-full object-cover" /></div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{ws.title}</h3>
                <p className="text-sm text-gray-500">{ws.description}</p>
                <div className="mt-4 flex items-center justify-between">
                   <span className="text-xs font-bold text-kid-blue bg-blue-50 px-2 py-1 rounded">{ws.subject}</span>
                   <button onClick={(e) => { e.stopPropagation(); handleDownload(ws); }} className="text-kid-green font-bold text-sm flex items-center gap-1"><Download size={16}/> Tải PDF</button>
                </div>
              </div>
            </div>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <button onClick={() => setShowRequestModal(true)} className="bg-kid-green text-white font-bold px-8 py-3 rounded-full hover:bg-green-500">Yêu cầu tài liệu mới</button>
      </div>

      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 relative">
                <button onClick={() => setShowRequestModal(false)} className="absolute top-4 right-4"><X size={24} /></button>
                <h3 className="text-2xl font-bold mb-6">Yêu cầu tài liệu</h3>
                <form onSubmit={handleSubmitRequest} className="space-y-4">
                    <input type="text" required placeholder="Môn học / Chủ đề" className="w-full px-4 py-3 rounded-xl border border-gray-200" value={requestSubject} onChange={e => setRequestSubject(e.target.value)} />
                    <select className="w-full px-4 py-3 rounded-xl border border-gray-200" value={requestAge} onChange={e => setRequestAge(e.target.value)}>
                        <option value="">Chọn độ tuổi</option>
                        <option>3-5 tuổi</option>
                        <option>6-8 tuổi</option>
                    </select>
                    <button type="submit" className="w-full bg-kid-green text-white font-bold py-3 rounded-xl">Gửi Ngay</button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};
