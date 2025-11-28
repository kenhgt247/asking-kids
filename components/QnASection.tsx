
import React, { useState, useEffect } from 'react';
import { QnACategory, Question, Answer, User, RANK_SYSTEM } from '../types';
import { askAIExpert, generateDiscussionQuestion } from '../services/geminiService';
import { MessageCircle, ThumbsUp, Eye, Star, Award, Zap, Send, Bot, User as UserIcon, Plus, Sparkles, Tag, X, SendHorizontal, Search, Heart, CornerDownRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface QnASectionProps {
  user: User | null;
  addNotification: (msg: string, type: 'INFO' | 'SUCCESS' | 'WARNING') => void;
  onRequestLogin: () => void;
  onUpdateUserPoints: (points: number) => void;
  initialQuestionId?: string | null;
  initialSearchQuery?: string;
}

export const QnASection: React.FC<QnASectionProps> = ({ user, addNotification, onRequestLogin, onUpdateUserPoints, initialQuestionId }) => {
  const [activeCategory, setActiveCategory] = useState<QnACategory | 'ALL'>('ALL');
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [isAsking, setIsAsking] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form States
  const [newQuestionTitle, setNewQuestionTitle] = useState('');
  const [newQuestionContent, setNewQuestionContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
  
  // Answer Form State
  const [newAnswerContent, setNewAnswerContent] = useState('');

  // Reply Answer State
  const [replyingToAnswerId, setReplyingToAnswerId] = useState<string | null>(null);
  const [replyAnswerContent, setReplyAnswerContent] = useState('');

  // Mock Questions Data
  const [questions, setQuestions] = useState<Question[]>([
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
      answers: [
        {
          id: 'a1',
          author: 'Bố Ken',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ken',
          content: 'Bạn thử trang trí món ăn thành hình các con vật xem? Bé nhà mình thích lắm.',
          isAI: false,
          likes: 5,
          timestamp: '1 giờ trước',
          replies: []
        }
      ]
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
      answers: []
    },
    {
      id: '3',
      title: 'App học tiếng Anh nào tốt cho bé 5 tuổi?',
      content: 'Ngoài Asking Kids ra thì còn app nào kết hợp game và học không ạ?',
      category: QnACategory.EDUCATION,
      author: 'Cô Giáo Thảo',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thao',
      likes: 8,
      views: 89,
      timestamp: '1 ngày trước',
      tags: ['Tiếng Anh', 'Công nghệ'],
      answers: []
    },
    {
        id: '4',
        title: 'Làm sao để bé tự ngủ mà không cần ru?',
        content: 'Mỗi lần cho con ngủ là một cuộc chiến, mẹ nào có kinh nghiệm chia sẻ giúp em với ạ.',
        category: QnACategory.PARENTS,
        author: 'Mẹ Bỉm Sữa',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bim',
        likes: 15,
        views: 200,
        timestamp: '3 giờ trước',
        tags: ['Giấc ngủ', 'Kỹ năng'],
        answers: []
    }
  ]);

  // Handle direct navigation from Home
  useEffect(() => {
    if (initialQuestionId) {
      const foundQ = questions.find(q => q.id === initialQuestionId);
      if (foundQ) {
        setSelectedQuestion(foundQ);
      }
    }
  }, [initialQuestionId]);

  // Scroll to top ONLY when the ID of the selected question changes
  // This prevents scrolling to top when interacting with likes/comments on the same question
  useEffect(() => {
    if (selectedQuestion?.id) {
      window.scrollTo(0, 0);
    }
  }, [selectedQuestion?.id]);

  const handleStartAsking = () => {
    if (!user) {
        addNotification('Bạn đang đặt câu hỏi với tư cách là Khách.', 'INFO');
    }
    setIsAsking(true);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim().replace(/^#/, '');
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleAskQuestion = () => {
    if (!newQuestionTitle.trim()) return;
    
    const authorName = user ? user.name : "Khách ẩn danh";
    const authorAvatar = user ? user.avatar : `https://api.dicebear.com/7.x/avataaars/svg?seed=Guest${Date.now()}`;

    const newQ: Question = {
      id: Date.now().toString(),
      title: newQuestionTitle,
      content: newQuestionContent,
      category: activeCategory === 'ALL' ? QnACategory.EDUCATION : activeCategory,
      author: authorName,
      avatar: authorAvatar,
      likes: 0,
      views: 0,
      timestamp: 'Vừa xong',
      tags: tags.length > 0 ? tags : ['Mới'],
      answers: []
    };
    
    setQuestions([newQ, ...questions]);
    setNewQuestionTitle('');
    setNewQuestionContent('');
    setTags([]);
    setIsAsking(false);

    if (user) {
      onUpdateUserPoints(5); // +5 points for asking
    } else {
      addNotification('Câu hỏi của bạn đã được đăng!', 'SUCCESS');
    }

    // Simulate Community Response logic
    setTimeout(() => {
      const mockResponses = [
        "Câu hỏi này rất hay, mình cũng đang thắc mắc vấn đề tương tự!",
        "Theo kinh nghiệm của mình thì bạn nên tham khảo ý kiến chuyên gia.",
        "Mình đã từng gặp trường hợp này, bạn inbox mình chia sẻ thêm nhé.",
        "Cảm ơn bạn đã đặt câu hỏi, cộng đồng sẽ sớm hỗ trợ bạn!"
      ];
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      
      const communityAnswer: Answer = {
        id: 'c-' + Date.now(),
        author: 'Thành viên cộng đồng',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
        content: randomResponse,
        isAI: false,
        likes: 0,
        timestamp: 'Vừa xong',
        replies: []
      };

      setQuestions(currentQuestions => currentQuestions.map(q => {
        if (q.id === newQ.id) {
          return { ...q, answers: [...q.answers, communityAnswer] };
        }
        return q;
      }));

      addNotification(`🔔 Có câu trả lời mới cho: "${newQ.title.substring(0, 30)}..."`, 'INFO');
    }, 6000);
  };

  const handleSuggestAI = async () => {
    setIsGeneratingQuestion(true);
    try {
      const data = await generateDiscussionQuestion(activeCategory);
      setNewQuestionTitle(data.title);
      setNewQuestionContent(data.content);
      setTags(data.tags);
      setIsAsking(true);
      addNotification("Đã tạo nội dung gợi ý từ AI!", "SUCCESS");
    } catch (e) {
      console.error(e);
      addNotification("Không thể tạo gợi ý lúc này, vui lòng thử lại.", "WARNING");
    } finally {
      setIsGeneratingQuestion(false);
    }
  };

  const handleAskAI = async (q: Question) => {
    const loadingId = 'loading-' + Date.now();
    const loadingAnswer: Answer = {
      id: loadingId,
      author: 'AI Chuyên Gia',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=AI',
      content: 'Đang suy nghĩ câu trả lời...',
      isAI: true,
      likes: 0,
      timestamp: 'Đang nhập...',
      replies: []
    };

    const updatedQuestions = questions.map(qu => {
      if (qu.id === q.id) {
        return { ...qu, answers: [...qu.answers, loadingAnswer] };
      }
      return qu;
    });
    setQuestions(updatedQuestions);
    if(selectedQuestion?.id === q.id) {
      setSelectedQuestion({...q, answers: [...q.answers, loadingAnswer]});
    }

    // Call API
    const aiResponse = await askAIExpert(q.title + "\n" + q.content, q.category);

    // Replace loading with real answer
    const realAnswer: Answer = {
      id: Date.now().toString(),
      author: 'AI Chuyên Gia',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=AI',
      content: aiResponse,
      isAI: true,
      likes: 0,
      timestamp: 'Vừa xong',
      isAccepted: true,
      replies: []
    };

    const finalQuestions = questions.map(qu => {
      if (qu.id === q.id) {
         const filtered = qu.answers.filter(a => a.id !== loadingId);
         return { ...qu, answers: [...filtered, realAnswer] };
      }
      return qu;
    });
    
    setQuestions(finalQuestions);
    if(selectedQuestion?.id === q.id) {
       const currentQ = finalQuestions.find(fq => fq.id === q.id);
       if(currentQ) setSelectedQuestion(currentQ);
    }
    addNotification(`🤖 AI Chuyên gia đã trả lời câu hỏi: "${q.title.substring(0, 30)}..."`, 'SUCCESS');
  };

  const handleSubmitAnswer = () => {
    if (!newAnswerContent.trim() || !selectedQuestion) return;

    const authorName = user ? user.name : "Khách ẩn danh";
    const authorAvatar = user ? user.avatar : `https://api.dicebear.com/7.x/avataaars/svg?seed=GuestAns${Date.now()}`;

    const newAnswer: Answer = {
        id: Date.now().toString(),
        author: authorName,
        avatar: authorAvatar,
        content: newAnswerContent,
        isAI: false,
        likes: 0,
        timestamp: 'Vừa xong',
        replies: []
    };

    // Update Global Question List
    const updatedQuestions = questions.map(q => {
        if (q.id === selectedQuestion.id) {
            return { ...q, answers: [...q.answers, newAnswer] };
        }
        return q;
    });

    setQuestions(updatedQuestions);
    
    // Update Local Selected View to show immediately
    setSelectedQuestion(prev => {
        if (!prev) return null;
        return {
            ...prev,
            answers: [...prev.answers, newAnswer]
        };
    });

    setNewAnswerContent('');
    
    if (user) {
        onUpdateUserPoints(10); // +10 points for answering
    } else {
        addNotification('Câu trả lời của bạn đã được đăng! (Đăng nhập để nhận điểm)', 'SUCCESS');
    }
  };

  // Helper function to find and update any answer/reply in the tree
  const updateAnswerInTree = (answers: Answer[], targetId: string, updateFn: (a: Answer) => Answer): Answer[] => {
    return answers.map(a => {
        if (a.id === targetId) {
            return updateFn(a);
        }
        if (a.replies && a.replies.length > 0) {
            return { ...a, replies: updateAnswerInTree(a.replies, targetId, updateFn) };
        }
        return a;
    });
  };

  const handleLikeAnswer = (answerId: string) => {
    if (!selectedQuestion) return;

    const updatedAnswers = updateAnswerInTree(selectedQuestion.answers, answerId, (a) => ({
      ...a,
      likes: a.likes + 1
    }));

    const updatedQuestion = { ...selectedQuestion, answers: updatedAnswers };
    setSelectedQuestion(updatedQuestion);
    setQuestions(questions.map(q => q.id === selectedQuestion.id ? updatedQuestion : q));
    
    if(user && onUpdateUserPoints) onUpdateUserPoints(2); 
  };

  const handleReplyToAnswer = (parentId: string) => {
      if (!selectedQuestion || !replyAnswerContent.trim()) return;

      const authorName = user ? user.name : "Khách ẩn danh";
      const authorAvatar = user ? user.avatar : `https://api.dicebear.com/7.x/avataaars/svg?seed=GuestAns${Date.now()}`;

      const newReply: Answer = {
          id: 'rep-' + Date.now(),
          author: authorName,
          avatar: authorAvatar,
          content: replyAnswerContent,
          isAI: false,
          likes: 0,
          timestamp: 'Vừa xong',
          replies: []
      };

      const updatedAnswers = updateAnswerInTree(selectedQuestion.answers, parentId, (a) => ({
          ...a,
          replies: [...a.replies, newReply]
      }));

      const updatedQuestion = { ...selectedQuestion, answers: updatedAnswers };
      setSelectedQuestion(updatedQuestion);
      setQuestions(questions.map(q => q.id === selectedQuestion.id ? updatedQuestion : q));

      setReplyingToAnswerId(null);
      setReplyAnswerContent('');

      if(user && onUpdateUserPoints) {
        onUpdateUserPoints(5); 
        addNotification('Đã trả lời câu trả lời!', 'SUCCESS');
      }
  };


  // Filter based on Category AND Search Query (Search now mainly handled in SearchResults, but local search still useful)
  const filteredQuestions = questions.filter(q => {
    const matchCategory = activeCategory === 'ALL' || q.category === activeCategory;
    const matchSearch = 
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        q.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchCategory && matchSearch;
  });

  // --- Recursive Answer Renderer with Capped Indentation ---
  const renderAnswers = (answers: Answer[], depth = 0) => {
    // CAP INDENTATION:
    // If depth is 0, margin is 0.
    // If depth is 1, margin is 24px (indent).
    // If depth is 2, margin is 24px (indent).
    // If depth > 2, margin is 0px (stop indenting).
    const shouldIndent = depth > 0 && depth <= 2;
    const marginLeft = shouldIndent ? '24px' : '0px';

    return answers.slice().reverse().map(ans => (
      <div 
        key={ans.id} 
        className={`relative ${depth > 0 ? 'mt-3' : 'mb-6'} rounded-xl transition-all`}
        style={{ marginLeft: marginLeft }}
      >
        {/* Thread connection line for nested replies */}
        {depth > 0 && (
          <div className="absolute -left-4 top-0 bottom-0 w-0.5 bg-gray-200/80"></div>
        )}

        <div className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 ${ans.isAI ? 'border-l-4 border-l-kid-purple bg-purple-50/20' : ''}`}>
           <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                 <img src={ans.avatar} alt="avt" className="w-8 h-8 rounded-full bg-white p-0.5 border border-gray-100" />
                 <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-sm ${ans.isAI ? 'text-kid-purple' : 'text-gray-800'}`}>{ans.author}</span>
                      {ans.isAI && <span className="bg-kid-purple text-white text-[10px] px-1.5 py-0.5 rounded font-bold">BOT</span>}
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium">{ans.timestamp}</span>
                 </div>
              </div>
              {ans.isAccepted && <div className="text-green-500 font-bold text-xs flex items-center gap-1"><Star size={12} fill="currentColor"/> Xác thực</div>}
           </div>
           
           <div className="prose prose-sm max-w-none text-gray-700 mb-3 text-sm">
             {ans.isAI ? <ReactMarkdown>{ans.content}</ReactMarkdown> : <p>{ans.content}</p>}
           </div>
           
           {/* Action Buttons */}
           <div className="flex items-center gap-4 text-xs font-bold text-gray-500 border-t border-gray-50 pt-2">
               <button onClick={() => handleLikeAnswer(ans.id)} className="flex items-center gap-1 hover:text-red-500 transition-colors">
                   <Heart size={14} className={ans.likes > 0 ? "text-red-500 fill-red-500" : ""} /> {ans.likes || 'Thích'}
               </button>
               <button onClick={() => setReplyingToAnswerId(replyingToAnswerId === ans.id ? null : ans.id)} className="flex items-center gap-1 hover:text-kid-blue transition-colors">
                   <MessageCircle size={14} /> Trả lời
               </button>
           </div>

           {/* Reply Form */}
           {replyingToAnswerId === ans.id && (
               <div className="mt-3 flex gap-2 animate-in fade-in slide-in-from-top-2">
                   <input 
                     autoFocus
                     value={replyAnswerContent}
                     onChange={e => setReplyAnswerContent(e.target.value)}
                     placeholder={`Trả lời ${ans.author}...`}
                     className="flex-grow px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-kid-blue min-w-0"
                     onKeyDown={e => e.key === 'Enter' && handleReplyToAnswer(ans.id)}
                   />
                   <button onClick={() => handleReplyToAnswer(ans.id)} className="bg-kid-blue text-white p-2 rounded-xl hover:bg-blue-600 flex-shrink-0">
                     <Send size={14} />
                   </button>
               </div>
           )}
        </div>

        {/* Render nested replies recursively */}
        {ans.replies && ans.replies.length > 0 && (
          <div className="flex flex-col mt-1">
             {renderAnswers(ans.replies, depth + 1)}
          </div>
        )}
      </div>
    ));
  };


  // --- Detail View ---
  if (selectedQuestion) {
    // Determine related questions
    const relatedQuestions = questions
      .filter(q => q.category === selectedQuestion.category && q.id !== selectedQuestion.id)
      .slice(0, 3);

    return (
      <div className="max-w-6xl mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <button onClick={() => setSelectedQuestion(null)} className="mb-4 text-gray-500 hover:text-kid-blue font-bold flex items-center gap-2">
            ← Quay lại
          </button>
          
          {/* Question Main Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-l-4 border-kid-blue">
             <div className="flex items-start gap-4 mb-4">
                <img src={selectedQuestion.avatar} alt="avatar" className="w-12 h-12 rounded-full border-2 border-gray-100" />
                <div>
                   <h1 className="text-2xl font-bold text-gray-900 leading-snug mb-1">{selectedQuestion.title}</h1>
                   <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="font-bold text-gray-700">{selectedQuestion.author}</span>
                      <span>• {selectedQuestion.timestamp}</span>
                      <span className="bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-600">{selectedQuestion.category}</span>
                   </div>
                </div>
             </div>
             <p className="text-gray-700 text-lg mb-6 whitespace-pre-line">{selectedQuestion.content}</p>
             
             {/* Tags in Detail */}
             <div className="flex flex-wrap gap-2 mb-6">
               {selectedQuestion.tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 bg-blue-50 text-kid-blue px-3 py-1 rounded-full text-xs font-bold">
                    <Tag size={12}/> {tag}
                  </span>
               ))}
             </div>

             <div className="flex gap-4 border-t border-gray-100 pt-4">
                <button className="flex items-center gap-2 text-gray-500 hover:text-kid-pink font-medium transition-colors">
                   <ThumbsUp size={18} /> {selectedQuestion.likes} Quan tâm
                </button>
                <button className="flex items-center gap-2 text-gray-500 hover:text-kid-blue font-medium transition-colors">
                   <MessageCircle size={18} /> {selectedQuestion.answers.length} Trả lời
                </button>
                {selectedQuestion.answers.filter(a => a.isAI).length === 0 && (
                  <button 
                    onClick={() => handleAskAI(selectedQuestion)}
                    className="ml-auto flex items-center gap-2 bg-gradient-to-r from-kid-purple to-kid-pink text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-md hover:opacity-90 transition-all"
                  >
                    <Bot size={16} /> Nhờ AI trả lời ngay
                  </button>
                )}
             </div>
          </div>

          {/* Answer Input Section */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
             <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                 <MessageCircle size={20} className="text-kid-green"/> Câu trả lời của bạn
             </h3>
             {!user && (
                 <div className="text-sm text-gray-500 mb-3 bg-gray-50 p-2 rounded-lg italic">
                     Bạn đang trả lời với tư cách là <strong>Khách ẩn danh</strong>. <button onClick={onRequestLogin} className="text-kid-blue font-bold hover:underline">Đăng nhập</button> để lưu điểm thưởng và thăng hạng Chuyên gia.
                 </div>
             )}
             <div className="flex gap-4">
                 <img 
                    src={user ? user.avatar : `https://api.dicebear.com/7.x/avataaars/svg?seed=GuestAns${Date.now()}`} 
                    className="w-10 h-10 rounded-full bg-gray-100" 
                    alt="My Avatar"
                 />
                 <div className="flex-grow">
                     <textarea 
                        value={newAnswerContent}
                        onChange={(e) => setNewAnswerContent(e.target.value)}
                        placeholder="Chia sẻ ý kiến hoặc kinh nghiệm của bạn..."
                        className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-kid-green/50 min-h-[100px] mb-2"
                     />
                     <div className="flex justify-end">
                         <button 
                            onClick={handleSubmitAnswer}
                            disabled={!newAnswerContent.trim()}
                            className="bg-kid-green text-white font-bold px-6 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
                         >
                             <SendHorizontal size={18} /> Gửi trả lời
                         </button>
                     </div>
                 </div>
             </div>
          </div>

          {/* Answers List */}
          <div className="space-y-4 mb-8">
             <h3 className="font-bold text-gray-800 text-lg">Các câu trả lời trước ({selectedQuestion.answers.length})</h3>
             {selectedQuestion.answers.length === 0 ? (
               <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500">
                 Chưa có câu trả lời nào. Hãy là người đầu tiên!
               </div>
             ) : (
                renderAnswers(selectedQuestion.answers)
             )}
          </div>

          {/* Related Questions */}
          {relatedQuestions.length > 0 && (
             <div className="pt-8 border-t border-gray-200">
               <h3 className="font-bold text-gray-800 text-lg mb-4">Câu hỏi liên quan</h3>
               <div className="space-y-3">
                 {relatedQuestions.map(rq => (
                   <div key={rq.id} onClick={() => setSelectedQuestion(rq)} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md cursor-pointer border border-gray-100">
                      <h4 className="font-bold text-gray-800 hover:text-kid-blue mb-1">{rq.title}</h4>
                      <div className="flex gap-2 text-xs text-gray-400">
                         <span>{rq.answers.length} trả lời</span>
                         <span>• {rq.category}</span>
                      </div>
                   </div>
                 ))}
               </div>
             </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="hidden md:block space-y-6">
           {user ? (
               <GamificationCard user={user} />
           ) : (
               <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 text-center">
                   <p className="text-gray-500 mb-4">Đăng nhập để tích điểm và thăng hạng!</p>
                   <button onClick={onRequestLogin} className="text-kid-blue font-bold hover:underline">Đăng nhập ngay</button>
               </div>
           )}
           <div className="bg-gradient-to-br from-kid-blue to-blue-600 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="font-bold text-xl mb-2">Mẹo hay 💡</h3>
              <p className="text-blue-100 text-sm mb-4">Gắn thẻ (tags) chính xác sẽ giúp câu hỏi của bạn tiếp cận đúng chuyên gia hơn.</p>
           </div>
        </div>
      </div>
    );
  }

  // --- Main Feed View ---
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Left Sidebar: Categories & Profile */}
      <div className="space-y-6 hidden lg:block">
        {user ? (
           <GamificationCard user={user} />
        ) : (
          <div className="bg-gradient-to-r from-kid-pink to-pink-600 rounded-2xl p-6 text-white shadow-lg text-center">
            <h3 className="font-bold text-xl mb-2">Tham gia cộng đồng</h3>
            <p className="text-pink-100 text-sm mb-4">Dù là khách, bạn vẫn có thể đặt câu hỏi. Nhưng hãy đăng nhập để tích điểm nhé!</p>
            <button onClick={onRequestLogin} className="bg-white text-kid-pink font-bold px-6 py-2 rounded-full w-full shadow hover:bg-gray-100">Đăng nhập ngay</button>
          </div>
        )}
        
        <div className="bg-white rounded-2xl shadow-md p-4 sticky top-24">
           <h3 className="font-bold text-gray-800 mb-4 px-2">Danh mục hỏi đáp</h3>
           <div className="space-y-1">
             <CategoryButton active={activeCategory === 'ALL'} label="Tất cả chủ đề" icon={Zap} onClick={() => setActiveCategory('ALL')} color="text-gray-600" />
             <CategoryButton active={activeCategory === QnACategory.EDUCATION} label="Giáo dục" icon={Award} onClick={() => setActiveCategory(QnACategory.EDUCATION)} color="text-kid-blue" />
             <CategoryButton active={activeCategory === QnACategory.ABROAD} label="Du học" icon={Send} onClick={() => setActiveCategory(QnACategory.ABROAD)} color="text-kid-purple" />
             <CategoryButton active={activeCategory === QnACategory.TECH} label="Công nghệ" icon={Bot} onClick={() => setActiveCategory(QnACategory.TECH)} color="text-gray-800" />
             <CategoryButton active={activeCategory === QnACategory.PARENTS} label="Cha mẹ" icon={UserIcon} onClick={() => setActiveCategory(QnACategory.PARENTS)} color="text-kid-pink" />
             <CategoryButton active={activeCategory === QnACategory.KIDS} label="Trẻ em" icon={Star} onClick={() => setActiveCategory(QnACategory.KIDS)} color="text-kid-yellow" />
           </div>
        </div>
      </div>

      {/* Main Content: Question Feed */}
      <div className="lg:col-span-3">
        {/* Header Action */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <div className="mb-4 sm:mb-0">
             <h2 className="text-2xl font-bold text-gray-800">Cộng đồng Hỏi Đáp</h2>
             <p className="text-gray-500 text-sm">Nơi chia sẻ kiến thức và kinh nghiệm nuôi dạy trẻ</p>
           </div>
           <div className="flex gap-2">
              <button 
                onClick={handleSuggestAI}
                disabled={isGeneratingQuestion}
                className="bg-white text-kid-purple border-2 border-kid-purple hover:bg-purple-50 font-bold px-4 py-3 rounded-full shadow-md flex items-center gap-2 transition-all transform hover:scale-105 text-sm md:text-base"
              >
                <Sparkles size={20} className={isGeneratingQuestion ? "animate-spin" : ""} /> 
                {isGeneratingQuestion ? "Đang nghĩ..." : "Gợi ý AI"}
              </button>
              <button 
                onClick={() => isAsking ? setIsAsking(false) : handleStartAsking()}
                className="bg-kid-green hover:bg-green-500 text-white font-bold px-6 py-3 rounded-full shadow-lg flex items-center gap-2 transition-all transform hover:scale-105 text-sm md:text-base"
              >
                <Plus size={20} /> Đặt câu hỏi
              </button>
           </div>
        </div>
        
        {/* Search Bar */}
        <div className="mb-6 relative">
          <input 
            type="text" 
            placeholder="Tìm kiếm câu hỏi..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-kid-blue/50"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>

        {/* Ask Form */}
        {isAsking && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border-2 border-kid-green animate-in fade-in slide-in-from-top-4">
             <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-kid-green">Đặt câu hỏi mới</h3>
                {isGeneratingQuestion && <span className="text-xs text-gray-500 animate-pulse">AI đang viết nội dung...</span>}
             </div>

             {!user && (
                 <div className="text-sm text-gray-500 mb-4 bg-gray-50 p-2 rounded-lg border border-gray-200">
                     Bạn đang hỏi với tư cách là <strong>Khách</strong>.
                 </div>
             )}
             
             {/* Title */}
             <div className="mb-3">
               <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Tiêu đề</label>
               <input 
                 type="text" 
                 placeholder="Tiêu đề ngắn gọn..."
                 className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-kid-green/50 font-bold text-gray-700"
                 value={newQuestionTitle}
                 onChange={e => setNewQuestionTitle(e.target.value)}
               />
             </div>

             {/* Tags Input */}
             <div className="mb-3">
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Thẻ (Tags) - Nhấn Enter để thêm</label>
                <div className="flex flex-wrap gap-2 p-2 border border-gray-200 rounded-xl bg-gray-50 focus-within:ring-2 focus-within:ring-kid-green/50 focus-within:bg-white transition-colors">
                   {tags.map(tag => (
                      <span key={tag} className="flex items-center gap-1 bg-kid-green/10 text-kid-green px-2 py-1 rounded-md text-sm font-bold animate-in zoom-in-50">
                        # {tag}
                        <button onClick={() => removeTag(tag)} className="hover:text-red-500"><X size={14}/></button>
                      </span>
                   ))}
                   <input 
                      type="text"
                      placeholder={tags.length === 0 ? "Ví dụ: dinhduong, toanlop1..." : ""}
                      className="bg-transparent outline-none flex-grow min-w-[150px] p-1 text-sm font-medium"
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                   />
                </div>
             </div>

             {/* Content */}
             <div className="mb-4">
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Nội dung chi tiết</label>
                <textarea 
                  rows={4}
                  placeholder="Mô tả chi tiết vấn đề của bạn..."
                  className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-kid-green/50"
                  value={newQuestionContent}
                  onChange={e => setNewQuestionContent(e.target.value)}
                />
             </div>

             <div className="flex justify-end gap-3">
               <button onClick={() => setIsAsking(false)} className="px-4 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-lg">Hủy</button>
               <button onClick={handleAskQuestion} className="px-6 py-2 bg-kid-green text-white font-bold rounded-lg hover:bg-green-600 shadow-md">Gửi câu hỏi</button>
             </div>
          </div>
        )}

        {/* Questions List */}
        <div className="space-y-4">
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
              <div className="text-6xl mb-4">🤔</div>
              <h3 className="text-xl font-bold text-gray-400">Chưa có câu hỏi nào phù hợp.</h3>
              <p className="text-gray-400">Hãy thử tìm từ khóa khác hoặc đặt câu hỏi mới!</p>
            </div>
          ) : (
            filteredQuestions.map(q => (
              <div 
                key={q.id} 
                onClick={() => setSelectedQuestion(q)}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100 cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                   <div className="flex-shrink-0 flex flex-col items-center gap-1 text-gray-400 w-12 pt-1">
                      <div className="flex flex-col items-center">
                        <span className="font-bold text-lg text-gray-700">{q.likes}</span>
                        <ThumbsUp size={16} />
                      </div>
                   </div>
                   <div className="flex-grow">
                      <div className="flex flex-wrap items-center gap-2 text-xs mb-2">
                        <span className={`px-2 py-1 rounded font-bold bg-gray-100 text-gray-600 group-hover:bg-kid-blue/10 group-hover:text-kid-blue transition-colors`}>{q.category}</span>
                        <span className="text-gray-400">• {q.timestamp} • bởi {q.author}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-kid-blue transition-colors line-clamp-2">{q.title}</h3>
                      <p className="text-gray-500 line-clamp-2 text-sm mb-4">{q.content}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1"><MessageCircle size={14} /> {q.answers.length} trả lời</span>
                        <span className="flex items-center gap-1"><Eye size={14} /> {q.views} xem</span>
                        {q.tags.map(tag => (
                          <span key={tag} className="bg-gray-50 text-gray-500 px-2 py-0.5 rounded text-xs">#{tag}</span>
                        ))}
                      </div>
                   </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// --- Helper Components ---

const CategoryButton: React.FC<{active: boolean, label: string, icon: any, onClick: () => void, color: string}> = ({active, label, icon: Icon, onClick, color}) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${active ? 'bg-gray-100 text-gray-900 shadow-inner' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
  >
    <Icon size={20} className={active ? color : 'text-gray-400'} />
    {label}
  </button>
);

const GamificationCard: React.FC<{user: User}> = ({user}) => {
  // Find next rank
  const currentRankIndex = RANK_SYSTEM.findIndex(r => r.name === user.rank);
  const nextRank = RANK_SYSTEM[currentRankIndex + 1];
  const currentRankObj = RANK_SYSTEM[currentRankIndex] || RANK_SYSTEM[0];

  return (
    <div className="bg-gradient-to-r from-kid-yellow to-orange-400 rounded-2xl p-6 text-white shadow-lg transform hover:-translate-y-1 transition-transform">
      <div className="flex items-center gap-4 mb-4">
          <img src={user.avatar} alt="Me" className="w-16 h-16 rounded-full border-4 border-white/30 bg-white" />
          <div>
            <div className="text-xs font-bold uppercase tracking-wider opacity-80">Xin chào</div>
            <div className="text-2xl font-black">{user.name}</div>
          </div>
      </div>
      <div className="flex justify-between items-end mb-4">
          <div>
            <div className="text-sm opacity-90">Hạng:</div>
            <div className="font-bold text-lg flex items-center gap-1">
              {currentRankObj.icon} {user.rank}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-90">Điểm SP:</div>
            <div className="font-black text-2xl">{user.points}</div>
          </div>
      </div>

      {/* Progress Bar to next rank */}
      {nextRank ? (
        <div className="mb-4">
           <div className="flex justify-between text-xs font-bold opacity-80 mb-1">
              <span>{user.points}</span>
              <span>{nextRank.minPoints} (Lên "{nextRank.name}")</span>
           </div>
           <div className="w-full bg-black/20 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-1000" 
                style={{ width: `${Math.min(100, (user.points / nextRank.minPoints) * 100)}%` }}
              ></div>
           </div>
        </div>
      ) : (
        <div className="mb-4 text-xs font-bold opacity-80 text-center bg-white/20 rounded-lg py-1">
           Bạn đã đạt cấp độ tối đa! 👑
        </div>
      )}

      <div className="bg-white/20 rounded-lg p-2 flex gap-2 overflow-x-auto">
          {user.badges.map((b, i) => <span key={i} className="text-xl cursor-help hover:scale-125 transition-transform" title="Huy hiệu">{b}</span>)}
      </div>
    </div>
  );
};
