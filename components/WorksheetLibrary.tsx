
import React, { useState, useEffect } from 'react';
import { Download, FileText, Printer, Send, X, ArrowLeft, Star, Share2, Search, User as UserIcon } from 'lucide-react';
import { Worksheet, WorksheetReview, User } from '../types';

interface WorksheetLibraryProps {
  initialWorksheetId?: string | null;
  user?: User | null;
  addNotification?: (msg: string, type: 'INFO' | 'SUCCESS' | 'WARNING') => void;
  onRequestLogin?: () => void;
  onUpdateUserPoints?: (points: number) => void;
}

// Define the extended worksheet type used in this component
type ExtendedWorksheet = Worksheet & { description: string, downloads: number };

export const WorksheetLibrary: React.FC<WorksheetLibraryProps> = ({ 
    initialWorksheetId, 
    user, 
    addNotification, 
    onRequestLogin, 
    onUpdateUserPoints 
}) => {
  // Use ExtendedWorksheet type for selectedWorksheet to ensure compatibility with worksheets state
  const [selectedWorksheet, setSelectedWorksheet] = useState<ExtendedWorksheet | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestSubject, setRequestSubject] = useState('');
  const [requestAge, setRequestAge] = useState('');
  const [requestNote, setRequestNote] = useState('');
  const [submitStatus, setSubmitStatus] = useState<'IDLE' | 'SENT'>('IDLE');
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Review State
  const [userRating, setUserRating] = useState(0);
  const [reviewContent, setReviewContent] = useState('');

  // Extended Mock Data with descriptions
  const [worksheets, setWorksheets] = useState<ExtendedWorksheet[]>([
    { 
        id: '1', title: 'Tập tô chữ cái A-Z', subject: 'Tiếng Việt', age: '3-5 tuổi', imageUrl: 'https://picsum.photos/300/400?random=1', description: 'Bộ tài liệu giúp bé làm quen với bảng chữ cái Tiếng Việt qua các hình ảnh sinh động. Bao gồm 29 chữ cái với hướng dẫn viết chi tiết.', downloads: 1250,
        reviews: [
            { id: 'r1', author: 'Mẹ Bông', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bong', rating: 5, content: 'Tài liệu rất đẹp, bé nhà mình rất thích!', timestamp: '2 ngày trước' }
        ]
    },
    { id: '2', title: 'Nối hình con vật', subject: 'Tư duy', age: '2-4 tuổi', imageUrl: 'https://picsum.photos/300/400?random=2', description: 'Bài tập rèn luyện khả năng quan sát và logic. Bé sẽ nối các con vật với bóng của chúng hoặc thức ăn yêu thích.', downloads: 890, reviews: [] },
    { id: '3', title: 'Toán cộng trong phạm vi 10', subject: 'Toán', age: '5-6 tuổi', imageUrl: 'https://picsum.photos/300/400?random=3', description: 'Các bài tập toán cơ bản giúp bé lớp 1 làm quen với phép cộng. Hình ảnh minh họa trực quan giúp bé dễ hiểu.', downloads: 2100, reviews: [] },
    { id: '4', title: 'Flashcard Màu sắc (Song ngữ)', subject: 'Tiếng Anh', age: '2-6 tuổi', imageUrl: 'https://picsum.photos/300/400?random=4', description: 'Bộ thẻ học màu sắc song ngữ Anh-Việt. Có thể in ra và cắt thành từng thẻ để chơi cùng bé.', downloads: 3400, reviews: [] },
    { id: '5', title: 'Mê cung tìm đường về nhà', subject: 'Tư duy', age: '4-8 tuổi', imageUrl: 'https://picsum.photos/300/400?random=5', description: 'Trò chơi mê cung giúp phát triển tư duy không gian và sự kiên nhẫn cho trẻ.', downloads: 1500, reviews: [] },
    { id: '6', title: 'Luyện viết nét cơ bản', subject: 'Tiếng Việt', age: '4-5 tuổi', imageUrl: 'https://picsum.photos/300/400?random=6', description: 'Trước khi viết chữ, bé cần luyện các nét cơ bản: nét thẳng, nét xiên, nét móc... Tài liệu này chuẩn bị hành trang vào lớp 1.', downloads: 980, reviews: [] },
  ]);

  // Handle Deep Linking
  useEffect(() => {
    if (initialWorksheetId) {
      const found = worksheets.find(w => w.id === initialWorksheetId);
      if (found) {
        setSelectedWorksheet(found);
        window.scrollTo(0, 0);
      }
    }
  }, [initialWorksheetId]);

  const calculateAverageRating = (reviews?: WorksheetReview[]) => {
      if (!reviews || reviews.length === 0) return 0;
      const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
      return (sum / reviews.length).toFixed(1);
  };

  const handleDownload = (ws: Worksheet) => {
    // Simulate download/print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${ws.title}</title>
            <style>
              body { font-family: sans-serif; text-align: center; padding: 40px; }
              h1 { color: #333; }
              .box { border: 2px dashed #ccc; padding: 40px; margin: 20px auto; width: 80%; height: 600px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #999; }
              .btn { display: none; }
              @media print { .no-print { display: none; } }
            </style>
          </head>
          <body>
            <h1 class="no-print">Asking Kids - Worksheet</h1>
            <h2>${ws.title}</h2>
            <p>Subject: ${ws.subject} | Age: ${ws.age}</p>
            <div class="box">
               [ Nội dung bài tập PDF mô phỏng cho "${ws.title}" ]
               <br/>
               <img src="${ws.imageUrl}" style="max-width:100%; max-height: 400px; opacity: 0.5; margin-top: 20px;" />
            </div>
            <button onclick="window.print()" style="padding: 10px 20px; font-size: 16px; cursor: pointer;" class="no-print">🖨️ In Ngay</button>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('SENT');
    setTimeout(() => {
        setShowRequestModal(false);
        setSubmitStatus('IDLE');
        setRequestSubject('');
        setRequestAge('');
        setRequestNote('');
        if(addNotification) addNotification("Yêu cầu của bạn đã được gửi thành công!", "SUCCESS");
    }, 1500);
  };

  const handleSubmitReview = () => {
    if (!selectedWorksheet) return;
    if (!user && onRequestLogin) {
        onRequestLogin();
        return;
    }
    if (userRating === 0) {
        if(addNotification) addNotification("Vui lòng chọn số sao đánh giá!", "WARNING");
        return;
    }

    const newReview: WorksheetReview = {
        id: Date.now().toString(),
        author: user ? user.name : 'Khách',
        avatar: user ? user.avatar : `https://api.dicebear.com/7.x/avataaars/svg?seed=Guest${Date.now()}`,
        rating: userRating,
        content: reviewContent,
        timestamp: 'Vừa xong'
    };

    const updatedWorksheet: ExtendedWorksheet = {
        ...selectedWorksheet,
        reviews: [newReview, ...(selectedWorksheet.reviews || [])]
    };

    // Update state
    setWorksheets(prev => prev.map(w => w.id === selectedWorksheet.id ? updatedWorksheet : w));
    setSelectedWorksheet(updatedWorksheet);
    
    // Reset form
    setUserRating(0);
    setReviewContent('');
    
    if(addNotification) addNotification("Cảm ơn bạn đã đánh giá!", "SUCCESS");
    if(onUpdateUserPoints) onUpdateUserPoints(5); // Reward 5 points
  };

  // Filter logic
  const filteredWorksheets = worksheets.filter(ws => 
    ws.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ws.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ws.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- DETAIL VIEW ---
  if (selectedWorksheet) {
    // Find related worksheets
    const related = worksheets.filter(w => w.subject === selectedWorksheet.subject && w.id !== selectedWorksheet.id).slice(0, 3);
    // Detail worksheet is already ExtendedWorksheet
    const detailWorksheet = selectedWorksheet;
    const avgRating = calculateAverageRating(detailWorksheet.reviews);
    const reviewCount = detailWorksheet.reviews?.length || 0;

    return (
      <div className="max-w-6xl mx-auto p-4 md:p-8">
         <button 
          onClick={() => setSelectedWorksheet(null)}
          className="group text-gray-500 hover:text-kid-blue mb-8 font-bold flex items-center gap-2 transition-colors"
        >
          <div className="bg-gray-100 p-2 rounded-full group-hover:bg-blue-50 transition-colors">
            <ArrowLeft size={20} />
          </div>
          Quay lại kho tài liệu
        </button>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row mb-12">
            {/* Left: Image Preview */}
            <div className="w-full md:w-1/3 bg-gray-50 p-6 flex items-center justify-center border-r border-gray-100">
                <div className="relative shadow-2xl rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-500 bg-white p-2">
                   <img src={detailWorksheet.imageUrl} alt={detailWorksheet.title} className="w-full h-auto rounded border border-gray-200" />
                   <div className="absolute top-4 right-4 bg-kid-yellow text-xs font-black px-3 py-1 rounded shadow-sm text-gray-800">PDF</div>
                </div>
            </div>

            {/* Right: Info */}
            <div className="w-full md:w-2/3 p-8 md:p-12 flex flex-col">
               <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-blue-100 text-blue-600 font-bold px-3 py-1 rounded-full text-sm">{detailWorksheet.subject}</span>
                  <span className="bg-green-100 text-green-600 font-bold px-3 py-1 rounded-full text-sm">{detailWorksheet.age}</span>
               </div>
               
               <h1 className="text-3xl md:text-4xl font-black text-gray-800 mb-4">{detailWorksheet.title}</h1>
               <p className="text-gray-500 text-lg mb-8 leading-relaxed">{detailWorksheet.description}</p>

               <div className="flex items-center gap-6 mb-8 text-gray-400 font-bold text-sm">
                   <span className="flex items-center gap-2"><Download size={18}/> {detailWorksheet.downloads} lượt tải</span>
                   <span className="flex items-center gap-2">
                       <Star size={18} className="text-kid-yellow fill-current"/> {avgRating}/5 ({reviewCount} đánh giá)
                   </span>
               </div>

               <div className="mt-auto flex gap-4">
                  <button 
                    onClick={() => handleDownload(detailWorksheet)}
                    className="flex-1 bg-kid-blue text-white font-bold py-4 rounded-xl hover:bg-blue-600 shadow-lg shadow-blue-200 hover:shadow-xl transition-all flex items-center justify-center gap-2 text-lg"
                  >
                     <Download size={24} /> Tải Xuống Ngay (Miễn Phí)
                  </button>
                  <button className="px-6 py-4 rounded-xl border-2 border-gray-200 text-gray-500 font-bold hover:border-kid-pink hover:text-kid-pink transition-colors">
                     <Share2 size={24} />
                  </button>
               </div>
            </div>
        </div>

        {/* REVIEWS SECTION */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-16">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Star className="text-kid-yellow fill-current" /> Đánh giá từ phụ huynh
            </h3>
            
            {/* Input Form */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
                <h4 className="font-bold text-gray-700 mb-4">Viết đánh giá của bạn</h4>
                {!user && (
                    <div className="text-sm text-gray-500 mb-3 italic">
                        Bạn chưa đăng nhập. <button onClick={onRequestLogin} className="text-kid-blue font-bold hover:underline">Đăng nhập</button> để tích điểm khi đánh giá.
                    </div>
                )}
                <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map(star => (
                        <button key={star} onClick={() => setUserRating(star)} className="focus:outline-none transform hover:scale-110 transition-transform">
                            <Star 
                                size={28} 
                                className={`${star <= userRating ? 'text-kid-yellow fill-current' : 'text-gray-300'}`} 
                            />
                        </button>
                    ))}
                    <span className="ml-2 text-sm font-bold text-gray-400 mt-1">{userRating > 0 ? `${userRating} sao` : ''}</span>
                </div>
                <textarea 
                    value={reviewContent}
                    onChange={e => setReviewContent(e.target.value)}
                    placeholder="Tài liệu này có hữu ích với bé không?..."
                    className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-kid-yellow/50 bg-white mb-4"
                    rows={3}
                />
                <div className="flex justify-end">
                    <button 
                        onClick={handleSubmitReview}
                        disabled={userRating === 0}
                        className="bg-kid-yellow text-gray-800 font-bold px-6 py-2 rounded-xl hover:bg-yellow-400 shadow-sm disabled:opacity-50 transition-colors"
                    >
                        Gửi Đánh Giá
                    </button>
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
                {detailWorksheet.reviews && detailWorksheet.reviews.length > 0 ? (
                    detailWorksheet.reviews.map(review => (
                        <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                            <div className="flex items-start gap-4">
                                <img src={review.avatar} alt={review.author} className="w-10 h-10 rounded-full border border-gray-200" />
                                <div>
                                    <h5 className="font-bold text-gray-800 text-sm">{review.author}</h5>
                                    <div className="flex gap-1 my-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={12} className={`${i < review.rating ? 'text-kid-yellow fill-current' : 'text-gray-200'}`} />
                                        ))}
                                    </div>
                                    <p className="text-gray-600 text-sm mt-1">{review.content}</p>
                                    <span className="text-xs text-gray-400 font-medium mt-2 block">{review.timestamp}</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400 text-center italic py-4">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
                )}
            </div>
        </div>

        {/* Related Section */}
        {related.length > 0 && (
           <div className="mt-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Tài liệu tương tự</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                 {related.map(ws => (
                    <div key={ws.id} onClick={() => setSelectedWorksheet(ws)} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all flex gap-4 items-center">
                        <img src={ws.imageUrl} className="w-20 h-24 object-cover rounded-lg bg-gray-100" alt={ws.title}/>
                        <div>
                           <h4 className="font-bold text-gray-800 line-clamp-2 mb-1 group-hover:text-kid-blue">{ws.title}</h4>
                           <span className="text-xs text-gray-400">{ws.age}</span>
                        </div>
                    </div>
                 ))}
              </div>
           </div>
        )}
      </div>
    );
  }

  // --- LIBRARY GRID VIEW ---
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Kho Tài Liệu Miễn Phí 📚</h2>
        <p className="text-lg text-gray-600">Tải và in bài tập cho bé luyện tập tại nhà mỗi ngày.</p>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-10 relative">
         <input 
            type="text" 
            placeholder="Tìm kiếm tài liệu, môn học..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-gray-200 focus:border-kid-green focus:outline-none shadow-sm text-lg"
         />
         <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredWorksheets.length > 0 ? (
          filteredWorksheets.map((ws) => (
            <div key={ws.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all group flex flex-col h-full">
              <div className="relative h-64 overflow-hidden bg-gray-100 cursor-pointer" onClick={() => setSelectedWorksheet(ws)}>
                 <img src={ws.imageUrl} alt={ws.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                 <div className="absolute top-0 right-0 bg-kid-yellow text-xs font-bold px-3 py-1 rounded-bl-lg">
                   MIỄN PHÍ
                 </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                   <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded">{ws.subject}</span>
                   <span className="text-gray-400 text-xs font-medium">{ws.age}</span>
                </div>
                <h3 
                  className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 cursor-pointer hover:text-kid-blue transition-colors"
                  onClick={() => setSelectedWorksheet(ws)}
                >
                    {ws.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{ws.description}</p>
                
                <div className="mt-auto">
                   <div className="flex items-center gap-1 mb-3 text-xs text-gray-400 font-bold">
                        <Star size={14} className="text-kid-yellow fill-current"/> 
                        <span>{calculateAverageRating(ws.reviews)} ({ws.reviews?.length || 0})</span>
                   </div>
                  <button 
                      onClick={() => handleDownload(ws)}
                      className="w-full flex items-center justify-center gap-2 bg-white border-2 border-kid-blue text-kid-blue font-bold py-3 rounded-xl hover:bg-kid-blue hover:text-white transition-colors"
                  >
                      <Download size={18} /> Tải PDF
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-10">
             <p className="text-xl text-gray-400 font-bold">Không tìm thấy tài liệu nào phù hợp.</p>
          </div>
        )}
      </div>
      
      <div className="mt-12 bg-kid-green/10 rounded-3xl p-8 text-center border-2 border-kid-green/20">
        <h3 className="text-2xl font-bold text-kid-green mb-2">Bạn cần tài liệu gì?</h3>
        <p className="text-gray-600 mb-6">Chúng tôi cập nhật tài liệu mới hàng tuần theo yêu cầu của phụ huynh.</p>
        <button 
            onClick={() => setShowRequestModal(true)}
            className="bg-kid-green text-white font-bold px-8 py-3 rounded-full hover:bg-green-500 transition-colors"
        >
          Gửi yêu cầu
        </button>
      </div>

      {/* Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 relative animate-in zoom-in-95">
                <button onClick={() => setShowRequestModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <X size={24} />
                </button>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <FileText className="text-kid-green"/> Yêu cầu tài liệu
                </h3>

                {submitStatus === 'SENT' ? (
                     <div className="flex flex-col items-center justify-center py-10 text-kid-green">
                         <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                             <Send size={32} />
                         </div>
                         <p className="font-bold text-lg">Đang gửi yêu cầu...</p>
                     </div>
                ) : (
                    <form onSubmit={handleSubmitRequest} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Môn học / Chủ đề</label>
                            <input 
                                type="text" required 
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-kid-green focus:outline-none"
                                placeholder="Ví dụ: Toán tư duy, Tiếng Anh..."
                                value={requestSubject}
                                onChange={(e) => setRequestSubject(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Độ tuổi của bé</label>
                            <select 
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-kid-green focus:outline-none"
                                value={requestAge}
                                onChange={(e) => setRequestAge(e.target.value)}
                            >
                                <option value="">Chọn độ tuổi</option>
                                <option value="2-3">2 - 3 tuổi</option>
                                <option value="4-5">4 - 5 tuổi</option>
                                <option value="6-8">6 - 8 tuổi</option>
                                <option value="9-10">9 - 10 tuổi</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Ghi chú thêm</label>
                            <textarea 
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-kid-green focus:outline-none"
                                rows={3}
                                placeholder="Ví dụ: Bé thích hình con vật, xe cộ..."
                                value={requestNote}
                                onChange={(e) => setRequestNote(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="w-full bg-kid-green text-white font-bold py-3 rounded-xl hover:bg-green-600 shadow-md mt-4">
                            Gửi Ngay
                        </button>
                    </form>
                )}
            </div>
        </div>
      )}
    </div>
  );
};
