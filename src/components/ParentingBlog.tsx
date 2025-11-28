import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { generateBlogArticle } from '../services/geminiService';
import { BlogPost, User, BlogComment } from '../types';
import { BookOpen, User as UserIcon, Clock, Sparkles, PenTool, Image as ImageIcon, Send, ArrowLeft, Calendar, Search, Heart, MessageSquare, CornerDownRight, ThumbsUp } from 'lucide-react';

interface BlogProps {
  initialPostId?: string | null;
}

export const ParentingBlog: React.FC<BlogProps> = ({ initialPostId }) => {
  const { user, addNotification, updateUserPoints } = useApp();
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [isWriting, setIsWriting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState('');

  // Comment Form State (Main)
  const [commentInput, setCommentInput] = useState('');
  
  // Reply State
  const [replyingTo, setReplyingTo] = useState<string | null>(null); // ID of comment being replied to
  const [replyInput, setReplyInput] = useState('');

  // Writing Form State
  const [writeTitle, setWriteTitle] = useState('');
  const [writeCategory, setWriteCategory] = useState('Góc Chia Sẻ');
  const [writeContent, setWriteContent] = useState('');

  const [posts, setPosts] = useState<BlogPost[]>([
    {
      id: '1',
      title: 'Phương pháp Montessori tại nhà cho trẻ 3 tuổi',
      category: 'Giáo dục sớm',
      excerpt: 'Làm sao để áp dụng triết lý Montessori mà không cần mua giáo cụ đắt tiền? Cùng tìm hiểu 5 hoạt động đơn giản.',
      content: '', 
      image: 'https://picsum.photos/600/400?random=10',
      author: 'Dr. Asking Kids',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DrKids',
      date: '20 Tháng 10, 2023',
      likes: 156,
      comments: [
        {
           id: 'c1',
           author: 'Mẹ Bông',
           avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bong',
           content: 'Bài viết rất hữu ích, mình đã áp dụng thử cho bé!',
           timestamp: '10:30 21/10/2023',
           likes: 5,
           replies: []
        }
      ]
    },
    {
      id: '2',
      title: '10 cách cai nghiện điện thoại cho trẻ hiệu quả',
      category: 'Sức khỏe',
      excerpt: 'Trẻ xem TV quá nhiều? Hãy thử quy tắc "vùng không công nghệ" và các trò chơi vận động thay thế.',
      content: '',
      image: 'https://picsum.photos/600/400?random=11',
      author: 'Mẹ Bắp',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bap',
      date: '18 Tháng 10, 2023',
      likes: 89,
      comments: []
    },
    {
      id: '3',
      title: 'Thực đơn tăng chiều cao cho bé lớp 1',
      category: 'Dinh dưỡng',
      excerpt: 'Những nhóm chất vàng giúp bé phát triển chiều cao vượt trội trong giai đoạn tiền dậy thì.',
      content: '',
      image: 'https://picsum.photos/600/400?random=12',
      author: 'Chuyên gia Dinh dưỡng',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nutrition',
      date: '15 Tháng 10, 2023',
      likes: 210,
      comments: []
    },
    {
      id: '4',
      title: 'Dạy con tự lập từ những việc nhỏ',
      category: 'Giáo dục sớm',
      excerpt: 'Hướng dẫn bé tự gấp quần áo, dọn đồ chơi để rèn luyện tính tự giác ngay từ bé.',
      content: '',
      image: 'https://picsum.photos/600/400?random=13',
      author: 'Dr. Asking Kids',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DrKids',
      date: '10 Tháng 10, 2023',
      likes: 134,
      comments: []
    }
  ]);

  // Handle direct navigation from Home
  useEffect(() => {
    if (initialPostId) {
      const foundPost = posts.find(p => p.id === initialPostId);
      if (foundPost) {
        handleReadPost(foundPost);
      }
    }
  }, [initialPostId]);

  // Scroll to top ONLY when a NEW post is selected (by ID change), not when content updates (like likes)
  useEffect(() => {
    if (selectedPost?.id) {
      window.scrollTo(0, 0);
    }
  }, [selectedPost?.id]);

  const handleReadPost = async (post: BlogPost) => {
    setSelectedPost(post);
    setGeneratedContent(null);
    setAiLoading(true);
    // Use stored content if available, else AI generate
    if (post.content && post.content.length > 50) {
      setGeneratedContent(post.content);
      setAiLoading(false);
    } else {
      const content = await generateBlogArticle(post.title);
      setGeneratedContent(content);
      setAiLoading(false);
    }
  };

  const handleLike = () => {
    if(!selectedPost) return;
    
    // Update local state
    const updatedPost = { ...selectedPost, likes: selectedPost.likes + 1 };
    setSelectedPost(updatedPost);

    // Update global list
    setPosts(posts.map(p => p.id === selectedPost.id ? updatedPost : p));

    if(user) {
       updateUserPoints(2); // +2 points for liking
    } else {
       addNotification("Bạn đã thả tim! Đăng nhập để nhận điểm thưởng.", "SUCCESS");
    }
  };

  const createCommentObject = (content: string): BlogComment => ({
    id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
    author: user ? user.name : "Khách thăm",
    avatar: user ? user.avatar : `https://api.dicebear.com/7.x/avataaars/svg?seed=Guest${Date.now()}`,
    content: content,
    timestamp: new Date().toLocaleString('vi-VN'),
    likes: 0,
    replies: []
  });

  const handleSubmitComment = () => {
    if(!selectedPost || !commentInput.trim()) return;

    const newComment = createCommentObject(commentInput);
    const updatedPost = {
       ...selectedPost,
       comments: [newComment, ...selectedPost.comments]
    };

    setSelectedPost(updatedPost);
    setPosts(posts.map(p => p.id === selectedPost.id ? updatedPost : p));
    setCommentInput('');

    if(user) {
        updateUserPoints(5); // +5 points for commenting
        addNotification("Bình luận thành công! (+5 điểm)", "SUCCESS");
    } else {
        addNotification("Bình luận thành công!", "SUCCESS");
    }
  };

  // Logic to recursively find and update a comment (for like or reply)
  const updateCommentInTree = (comments: BlogComment[], targetId: string, updateFn: (c: BlogComment) => BlogComment): BlogComment[] => {
      return comments.map(c => {
          if (c.id === targetId) {
              return updateFn(c);
          }
          if (c.replies.length > 0) {
              return { ...c, replies: updateCommentInTree(c.replies, targetId, updateFn) };
          }
          return c;
      });
  };

  const handleLikeComment = (commentId: string) => {
    if (!selectedPost) return;

    const updatedComments = updateCommentInTree(selectedPost.comments, commentId, (c) => ({
        ...c,
        likes: c.likes + 1
    }));

    const updatedPost = { ...selectedPost, comments: updatedComments };
    setSelectedPost(updatedPost);
    setPosts(posts.map(p => p.id === selectedPost.id ? updatedPost : p));

    if(user) updateUserPoints(1); // +1 point for liking a comment
  };

  const handleReplySubmit = (parentId: string) => {
    if (!selectedPost || !replyInput.trim()) return;

    const newReply = createCommentObject(replyInput);
    const updatedComments = updateCommentInTree(selectedPost.comments, parentId, (c) => ({
        ...c,
        replies: [...c.replies, newReply]
    }));

    const updatedPost = { ...selectedPost, comments: updatedComments };
    setSelectedPost(updatedPost);
    setPosts(posts.map(p => p.id === selectedPost.id ? updatedPost : p));
    
    setReplyingTo(null);
    setReplyInput('');

    if(user) {
        updateUserPoints(5); // +5 points for replying
        addNotification("Trả lời thành công! (+5 điểm)", "SUCCESS");
    }
  };

  const handleSubmitPost = () => {
    if (!writeTitle || !writeContent) return;

    const newPost: BlogPost = {
      id: Date.now().toString(),
      title: writeTitle,
      category: writeCategory,
      excerpt: writeContent.substring(0, 100) + '...',
      content: writeContent,
      image: `https://picsum.photos/600/400?random=${Date.now()}`,
      author: user ? user.name : 'Khách',
      authorAvatar: user?.avatar,
      date: new Date().toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' }),
      likes: 0,
      comments: []
    };

    setPosts([newPost, ...posts]);
    setIsWriting(false);
    setWriteTitle('');
    setWriteContent('');
    addNotification('Bài viết của bạn đã được đăng thành công!', 'SUCCESS');
  };

  const handleSubscribe = () => {
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) {
       addNotification('Vui lòng nhập địa chỉ email hợp lệ.', 'INFO');
       return;
    }
    
    addNotification('Đang xử lý đăng ký...', 'INFO');
    
    setTimeout(() => {
       addNotification('Đăng ký nhận tin thành công! Cảm ơn bạn đã tham gia.', 'SUCCESS');
       setNewsletterEmail('');
       if(user) {
          updateUserPoints(5); // Reward points for newsletter signup
       }
    }, 1500);
  };

  // Filter posts based on search query
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Recursive Comment Renderer with Capped Indentation
  const renderComments = (comments: BlogComment[], depth = 0) => {
      // CAP INDENTATION:
      // If depth is 0, margin is 0.
      // If depth is 1, margin is 32px (indent).
      // If depth is 2, margin is 32px (indent).
      // If depth > 2, margin is 0px (stop indenting, align with previous level).
      // This ensures infinite nesting doesn't squeeze content off screen.
      const shouldIndent = depth > 0 && depth <= 2;
      const marginLeft = shouldIndent ? '24px' : '0px';
      
      return comments.map(comment => (
        <div 
          key={comment.id} 
          className={`flex flex-col relative ${depth > 0 ? 'mt-3' : 'mb-6'}`}
          style={{ marginLeft: marginLeft }} 
        > 
           {/* Visual Thread Line: Always show line if nested, even if not indented */}
           {depth > 0 && (
             <div className="absolute top-0 -left-3 bottom-0 w-0.5 bg-gray-200/70 rounded-full"></div>
           )}

           <div className="flex gap-3">
              <img src={comment.avatar} alt="avt" className={`rounded-full bg-white border border-gray-200 flex-shrink-0 ${depth === 0 ? 'w-10 h-10' : 'w-8 h-8'}`} />
              <div className="flex-grow min-w-0"> 
                  <div className="bg-gray-100/80 p-3 rounded-2xl rounded-tl-none inline-block max-w-full">
                      <h4 className="font-bold text-gray-900 text-sm mb-1">{comment.author}</h4>
                      <p className="text-gray-700 text-sm whitespace-pre-wrap break-words">{comment.content}</p>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-1 ml-2 font-bold">
                      <span>{comment.timestamp}</span>
                      <button onClick={() => handleLikeComment(comment.id)} className="hover:text-red-500 flex items-center gap-1 transition-colors">
                          <Heart size={12} className={comment.likes > 0 ? 'fill-red-500 text-red-500' : ''}/> {comment.likes || 'Thích'}
                      </button>
                      <button onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)} className="hover:text-kid-blue transition-colors">
                          Trả lời
                      </button>
                  </div>

                  {/* Reply Input */}
                  {replyingTo === comment.id && (
                      <div className="mt-2 flex gap-2 animate-in fade-in slide-in-from-top-2">
                        <input 
                          autoFocus
                          value={replyInput}
                          onChange={e => setReplyInput(e.target.value)}
                          placeholder={`Trả lời ${comment.author}...`}
                          className="flex-grow px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-kid-blue w-full min-w-0"
                          onKeyDown={e => e.key === 'Enter' && handleReplySubmit(comment.id)}
                        />
                        <button onClick={() => handleReplySubmit(comment.id)} className="bg-kid-blue text-white p-2 rounded-xl hover:bg-blue-600 flex-shrink-0">
                          <Send size={14} />
                        </button>
                      </div>
                  )}
              </div>
           </div>

           {/* Render Nested Replies */}
           {comment.replies && comment.replies.length > 0 && (
              <div className="flex flex-col">
                  {renderComments(comment.replies, depth + 1)}
              </div>
           )}
        </div>
      ));
  };

  if (selectedPost) {
    // Logic for related posts
    const relatedPosts = posts
      .filter(p => p.category === selectedPost.category && p.id !== selectedPost.id)
      .slice(0, 3);

    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8 bg-white min-h-screen">
        <button 
          onClick={() => setSelectedPost(null)}
          className="group text-gray-500 hover:text-kid-blue mb-8 font-bold flex items-center gap-2 transition-colors"
        >
          <div className="bg-gray-100 p-2 rounded-full group-hover:bg-blue-50 transition-colors">
            <ArrowLeft size={20} />
          </div>
          Quay lại danh sách
        </button>

        <div className="relative h-64 md:h-[400px] rounded-3xl overflow-hidden mb-8 shadow-xl">
           <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
           <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white">
              <span className="bg-kid-pink text-white px-4 py-1.5 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider mb-3 inline-block shadow-sm">
                {selectedPost.category}
              </span>
           </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-gray-100 pb-8">
           <div className="flex items-center gap-4">
              <div className="relative">
                {selectedPost.authorAvatar ? (
                    <img src={selectedPost.authorAvatar} alt="author" className="w-14 h-14 rounded-full border-4 border-white shadow-md bg-gray-100" />
                ) : (
                    <div className="w-14 h-14 rounded-full bg-kid-blue/20 flex items-center justify-center text-kid-blue border-4 border-white shadow-md">
                      <UserIcon size={24} />
                    </div>
                )}
                <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
              </div>
              <div>
                 <p className="text-xs text-gray-400 font-bold uppercase tracking-wide mb-0.5">Tác giả</p>
                 <p className="text-lg font-bold text-gray-900 leading-none">{selectedPost.author || 'Asking Kids Team'}</p>
              </div>
           </div>

           <div className="flex items-center gap-2 text-gray-500 bg-gray-50 px-5 py-3 rounded-2xl">
              <Calendar size={20} className="text-kid-blue"/>
              <span className="font-medium">{selectedPost.date || 'Vừa xong'}</span>
           </div>
        </div>

        <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-8 leading-tight tracking-tight">{selectedPost.title}</h1>

        <div className="prose prose-lg prose-blue max-w-none text-gray-700 leading-relaxed whitespace-pre-line mb-12">
           {aiLoading ? (
             <div className="flex flex-col items-center justify-center py-20 opacity-50 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
               <Sparkles className="animate-spin text-kid-blue w-12 h-12 mb-4" />
               <p className="font-bold text-gray-400">AI đang viết bài...</p>
             </div>
           ) : (
             generatedContent
           )}
        </div>

        <div className="border-t border-gray-100 pt-8 flex items-center justify-between mb-12">
           <p className="text-gray-500 italic hidden md:block">Bạn thấy bài viết này thế nào?</p>
           <button 
             onClick={handleLike}
             className="flex items-center gap-3 bg-red-50 text-red-500 font-bold px-6 py-3 rounded-full hover:bg-red-100 transition-all active:scale-95"
           >
              <Heart size={24} fill="currentColor" /> 
              <span className="text-xl">{selectedPost.likes}</span>
              <span className="text-sm font-normal">Lượt thích</span>
           </button>
        </div>

        {/* COMMENTS SECTION */}
        <div className="bg-white border-t border-gray-100 pt-10 mb-12">
             <h3 className="font-bold text-xl text-gray-800 mb-6 flex items-center gap-2">
                 <MessageSquare size={24} className="text-kid-blue"/> Bình luận ({selectedPost.comments.length})
             </h3>

             {/* Input */}
             <div className="flex gap-4 mb-8">
                 <img 
                    src={user ? user.avatar : `https://api.dicebear.com/7.x/avataaars/svg?seed=Guest${Date.now()}`} 
                    className="w-10 h-10 rounded-full bg-white border border-gray-200"
                    alt="My Avatar"
                 />
                 <div className="flex-grow">
                     <textarea 
                        value={commentInput}
                        onChange={e => setCommentInput(e.target.value)}
                        placeholder="Chia sẻ suy nghĩ của bạn..."
                        className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-kid-blue/50 min-h-[100px] bg-white"
                     />
                     <div className="flex justify-end mt-2">
                         <button 
                            onClick={handleSubmitComment}
                            disabled={!commentInput.trim()}
                            className="bg-kid-blue text-white font-bold px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-all"
                         >
                             Gửi bình luận
                         </button>
                     </div>
                 </div>
             </div>

             {/* List */}
             <div className="space-y-2">
                 {selectedPost.comments.length > 0 ? (
                    renderComments(selectedPost.comments)
                 ) : (
                    <p className="text-center text-gray-400 italic">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
                 )}
             </div>
        </div>

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <div className="border-t-4 border-gray-100 pt-10">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Bài viết cùng chủ đề</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map(post => (
                <div key={post.id} className="cursor-pointer group" onClick={() => handleReadPost(post)}>
                  <div className="h-40 rounded-xl overflow-hidden mb-3">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <h4 className="font-bold text-gray-900 group-hover:text-kid-blue transition-colors line-clamp-2">{post.title}</h4>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
       <div className="text-center mb-10 md:mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Blog Nuôi Dạy Con 👨‍👩‍👧‍👦</h2>
        <p className="text-base md:text-lg text-gray-600 mb-6">Chia sẻ kinh nghiệm, kiến thức và tình yêu thương.</p>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => setIsWriting(!isWriting)}
            className="bg-kid-pink text-white font-bold px-6 py-3 rounded-full shadow-lg hover:bg-pink-600 transition-transform hover:scale-105 flex items-center gap-2"
          >
             <PenTool size={18} /> {isWriting ? 'Đóng khung soạn thảo' : 'Viết bài chia sẻ'}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto mb-12 relative">
         <input 
            type="text" 
            placeholder="Tìm kiếm bài viết..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-gray-200 focus:border-kid-blue focus:outline-none shadow-sm text-lg"
         />
         <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
      </div>

      {/* Writing Section */}
      {isWriting && (
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-12 border border-gray-100 animate-in fade-in slide-in-from-top-4 max-w-3xl mx-auto">
           <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
             <PenTool className="text-kid-pink"/> Viết bài mới
           </h3>
           
           <div className="space-y-4">
             <div>
               <label className="block text-sm font-bold text-gray-700 mb-1">Tiêu đề bài viết</label>
               <input 
                 type="text" 
                 value={writeTitle}
                 onChange={e => setWriteTitle(e.target.value)}
                 className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-kid-pink focus:outline-none font-bold text-lg" 
                 placeholder="Ví dụ: Cách làm bánh ăn dặm cho bé..." 
               />
             </div>
             
             <div className="flex gap-4">
                <div className="w-1/2">
                   <label className="block text-sm font-bold text-gray-700 mb-1">Chuyên mục</label>
                   <select 
                      value={writeCategory}
                      onChange={e => setWriteCategory(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-kid-pink focus:outline-none bg-white"
                   >
                     <option>Góc Chia Sẻ</option>
                     <option>Dinh Dưỡng</option>
                     <option>Sức Khỏe</option>
                     <option>Giáo Dục Sớm</option>
                     <option>Mẹo Vặt</option>
                   </select>
                </div>
                <div className="w-1/2">
                   <label className="block text-sm font-bold text-gray-700 mb-1">Ảnh bìa (Mô phỏng)</label>
                   <div className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-400 flex items-center gap-2 truncate">
                      <ImageIcon size={18}/> Tự động tạo ảnh
                   </div>
                </div>
             </div>

             <div>
               <label className="block text-sm font-bold text-gray-700 mb-1">Nội dung</label>
               <textarea 
                  value={writeContent}
                  onChange={e => setWriteContent(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-kid-pink focus:outline-none min-h-[200px]" 
                  placeholder="Chia sẻ câu chuyện của bạn..."
               />
             </div>

             <div className="flex justify-end gap-3 pt-4">
                <button onClick={() => setIsWriting(false)} className="px-6 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-xl">Hủy bỏ</button>
                <button 
                  onClick={handleSubmitPost}
                  className="px-8 py-3 bg-kid-pink text-white font-bold rounded-xl shadow-md hover:bg-pink-600 flex items-center gap-2"
                >
                  <Send size={18} /> Đăng Bài
                </button>
             </div>
           </div>
        </div>
      )}

      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <div key={post.id} className="flex flex-col gap-4 group cursor-pointer" onClick={() => handleReadPost(post)}>
              <div className="overflow-hidden rounded-2xl shadow-sm relative h-56">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded text-gray-700 shadow-sm">
                  {post.author}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                   <span className="text-kid-purple text-xs font-bold uppercase tracking-wider bg-purple-50 px-2 py-1 rounded">{post.category}</span>
                   <span className="text-gray-400 text-xs font-medium">{post.date}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-kid-blue transition-colors leading-tight">{post.title}</h3>
                <p className="text-gray-500 line-clamp-2 text-sm">{post.excerpt}</p>
                
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-400 font-bold">
                   <span className="flex items-center gap-1"><Heart size={14} className="text-kid-pink"/> {post.likes}</span>
                   <span className="flex items-center gap-1"><MessageSquare size={14} className="text-kid-blue"/> {post.comments.length}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
           <p className="text-gray-400 font-bold">Không tìm thấy bài viết nào phù hợp.</p>
        </div>
      )}

      {/* Newsletter Signup */}
      <div className="mt-20 bg-kid-blue rounded-3xl p-10 md:p-16 text-center text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Nhận bí quyết nuôi dạy con hàng tuần</h3>
          <p className="mb-8 opacity-90">Tham gia cùng hơn 10.000 phụ huynh thông thái khác.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder="Email của bạn..." 
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="px-6 py-3 rounded-full text-gray-800 w-full focus:outline-none focus:ring-4 ring-white/30"
              onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
            />
            <button 
              onClick={handleSubscribe}
              className="bg-kid-pink px-8 py-3 rounded-full font-bold hover:bg-pink-600 transition-colors shadow-lg whitespace-nowrap"
            >
              Đăng ký ngay
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-kid-yellow opacity-10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
      </div>
    </div>
  );
};