
import React, { useState, useEffect } from 'react';
import { GameHub } from './components/GameHub';
import { WorksheetLibrary } from './components/WorksheetLibrary';
import { ParentingBlog } from './components/ParentingBlog';
import { QnASection } from './components/QnASection';
import { SearchResults } from './components/SearchResults';
import { Footer } from './components/Footer';
import { StaticPages } from './components/StaticPages';
import { AppView, User, Notification, BlogPost, Question, QnACategory, Worksheet, calculateRank, GameType } from './types';
import { Menu, X, Rocket, BookOpen, Coffee, Heart, MessageCircleQuestion, User as UserIcon, Bell, LogIn, LogOut, ArrowRight, MessageCircle, Star, Download, Play, Search } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [currentStaticPageId, setCurrentStaticPageId] = useState<string>(''); // To track which static page to show
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // States for deep linking from Home
  const [selectedGame, setSelectedGame] = useState<GameType>(GameType.NONE);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [selectedWorksheetId, setSelectedWorksheetId] = useState<string | null>(null);
  
  // State for Global Search
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

  // Mock Login Function
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const mockUser: User = {
      id: 'u1',
      name: authMode === 'LOGIN' ? 'Mẹ Bắp' : 'Người dùng mới',
      email: 'user@example.com',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
      rank: 'Thành viên mới',
      points: 50, // Start with some points
      badges: ['🌱'],
      role: 'USER'
    };
    // Recalculate rank just in case
    mockUser.rank = calculateRank(mockUser.points);
    
    setUser(mockUser);
    setShowAuthModal(false);
    addNotification(`Xin chào ${mockUser.name}! Chào mừng quay trở lại.`, 'SUCCESS');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView(AppView.HOME);
    addNotification('Đã đăng xuất thành công.', 'INFO');
  };

  // Centralized Point System
  const handleUpdateUserPoints = (pointsToAdd: number) => {
    if (!user) return;

    const newPoints = user.points + pointsToAdd;
    const newRank = calculateRank(newPoints);
    let badges = [...user.badges];

    // Notification Logic
    if (newRank !== user.rank) {
      addNotification(`🎉 CHÚC MỪNG! Bạn đã thăng hạng lên "${newRank}"`, 'SUCCESS');
      // Add a badge for reaching Expert
      if (newRank === 'Chuyên gia' && !badges.includes('👑')) {
        badges.push('👑');
      }
    } else {
      // Just notify points
      addNotification(`+${pointsToAdd} điểm uy tín!`, 'SUCCESS');
    }

    setUser({
      ...user,
      points: newPoints,
      rank: newRank,
      badges: badges
    });
  };

  const addNotification = (message: string, type: 'INFO' | 'SUCCESS' | 'WARNING' = 'INFO') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  // Navigation Handlers
  const navigateToView = (view: AppView) => {
    // Reset selections when using standard nav
    setSelectedGame(GameType.NONE);
    setSelectedBlogId(null);
    setSelectedQuestionId(null);
    setSelectedWorksheetId(null);
    // Don't reset query if we are just switching back to search view
    if (view !== AppView.SEARCH) {
       setGlobalSearchQuery(''); 
    }
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  const handleGameSelect = (type: GameType) => {
    setSelectedGame(type);
    setCurrentView(AppView.GAMES);
    window.scrollTo(0, 0);
  };

  const handleBlogSelect = (id: string) => {
    setSelectedBlogId(id);
    setCurrentView(AppView.BLOG);
    window.scrollTo(0, 0);
  };

  const handleQuestionSelect = (id: string) => {
    setSelectedQuestionId(id);
    setCurrentView(AppView.QNA);
    window.scrollTo(0, 0);
  };

  const handleWorksheetSelect = (id: string) => {
    setSelectedWorksheetId(id);
    setCurrentView(AppView.WORKSHEETS);
    window.scrollTo(0, 0);
  };

  const handleGlobalSearch = (query: string) => {
    setGlobalSearchQuery(query);
    setCurrentView(AppView.SEARCH);
    window.scrollTo(0, 0);
  };

  // Handle Footer Navigation
  const handleFooterNavigate = (page: string) => {
    if (['GAMES', 'WORKSHEETS', 'BLOG', 'QNA'].includes(page)) {
      navigateToView(page as AppView);
    } else {
      // It's a static page
      setCurrentStaticPageId(page);
      setCurrentView(AppView.STATIC_PAGE);
      window.scrollTo(0, 0);
    }
  };

  // Bottom Nav Item Component
  const MobileNavItem = ({ view, label, icon: Icon }: { view: AppView; label: string; icon: any }) => (
    <button
      onClick={() => navigateToView(view)}
      className={`flex flex-col items-center justify-center w-full py-2 transition-all ${
        currentView === view ? 'text-kid-blue' : 'text-gray-400 hover:text-gray-600'
      }`}
    >
      <Icon size={24} className={currentView === view ? 'fill-current' : ''} strokeWidth={currentView === view ? 2.5 : 2} />
      <span className="text-[10px] font-bold mt-1">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen font-sans text-gray-800 bg-slate-50 pb-20 md:pb-0 flex flex-col">
      {/* Top Navbar (Desktop) */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo */}
            <div 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={() => navigateToView(AppView.HOME)}
            >
              <div className="w-10 h-10 bg-kid-pink rounded-xl flex items-center justify-center text-white font-black text-xl rotate-3">A</div>
              <div className="w-10 h-10 bg-kid-yellow rounded-xl flex items-center justify-center text-white font-black text-xl -rotate-3">K</div>
              <span className="text-2xl font-black text-gray-800 tracking-tight">Asking Kids</span>
            </div>

            {/* Desktop Menu */}
            <div className="flex gap-1">
              <NavButton view={AppView.HOME} current={currentView} label="Trang Chủ" icon={Heart} setView={navigateToView} />
              <NavButton view={AppView.GAMES} current={currentView} label="Game" icon={Rocket} setView={navigateToView} />
              <NavButton view={AppView.WORKSHEETS} current={currentView} label="Tài Liệu" icon={BookOpen} setView={navigateToView} />
              <NavButton view={AppView.BLOG} current={currentView} label="Blog" icon={Coffee} setView={navigateToView} />
              <NavButton view={AppView.QNA} current={currentView} label="Hỏi Đáp" icon={MessageCircleQuestion} setView={navigateToView} />
            </div>

            {/* User Action */}
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="text-right hidden lg:block">
                    <p className="text-sm font-bold text-gray-900">{user.name}</p>
                    <p className="text-xs text-kid-blue font-bold">{user.rank}</p>
                  </div>
                  <img src={user.avatar} alt="avatar" className="w-10 h-10 rounded-full border-2 border-kid-blue cursor-pointer" />
                  <button onClick={handleLogout} className="text-gray-400 hover:text-red-500" title="Đăng xuất">
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowAuthModal(true)}
                  className="bg-kid-blue text-white px-6 py-2 rounded-full font-bold shadow hover:bg-blue-500 transition-colors flex items-center gap-2"
                >
                  <LogIn size={18} /> Đăng nhập
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Top Bar */}
      <div className="md:hidden sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 p-4 flex justify-between items-center">
         <div className="flex items-center gap-2 font-black text-xl text-gray-800">
            <span className="text-kid-pink">Asking</span>Kids
         </div>
         <div className="flex items-center gap-3">
            {user ? (
               <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full border border-gray-200" />
            ) : (
               <button onClick={() => setShowAuthModal(true)} className="text-kid-blue font-bold text-sm">Đăng nhập</button>
            )}
         </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow relative z-0 pt-4 md:pt-8">
        {currentView === AppView.HOME && (
          <HomeView 
            setView={navigateToView} 
            onGameSelect={handleGameSelect}
            onBlogSelect={handleBlogSelect}
            onQuestionSelect={handleQuestionSelect}
            onWorksheetSelect={handleWorksheetSelect}
            onGlobalSearch={handleGlobalSearch}
            user={user} 
            setShowAuth={setShowAuthModal} 
          />
        )}
        
        <div>
          {currentView === AppView.GAMES && <GameHub initialGame={selectedGame} />}
          {currentView === AppView.WORKSHEETS && (
            <WorksheetLibrary 
              initialWorksheetId={selectedWorksheetId} 
              user={user}
              addNotification={addNotification}
              onRequestLogin={() => setShowAuthModal(true)}
              onUpdateUserPoints={handleUpdateUserPoints}
            />
          )}
          {currentView === AppView.BLOG && (
            <ParentingBlog 
              user={user} 
              addNotification={addNotification} 
              onUpdateUserPoints={handleUpdateUserPoints}
              initialPostId={selectedBlogId}
            />
          )}
          {currentView === AppView.QNA && (
            <QnASection 
              user={user} 
              addNotification={addNotification} 
              onRequestLogin={() => setShowAuthModal(true)} 
              onUpdateUserPoints={handleUpdateUserPoints}
              initialQuestionId={selectedQuestionId}
            />
          )}
          {currentView === AppView.SEARCH && (
             <SearchResults 
                query={globalSearchQuery}
                onGameSelect={handleGameSelect}
                onBlogSelect={handleBlogSelect}
                onQuestionSelect={handleQuestionSelect}
                onWorksheetSelect={handleWorksheetSelect}
             />
          )}
          {currentView === AppView.STATIC_PAGE && (
             <StaticPages pageId={currentStaticPageId} onBack={() => navigateToView(AppView.HOME)} />
          )}
        </div>
      </main>
      
      {/* Footer */}
      <Footer onNavigate={handleFooterNavigate} />

      {/* Mobile Bottom Navigation (Fixed) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-safe">
        <div className="flex justify-around items-center px-2">
          <MobileNavItem view={AppView.HOME} label="Trang Chủ" icon={Heart} />
          <MobileNavItem view={AppView.GAMES} label="Game" icon={Rocket} />
          <div className="relative -top-5">
             <button 
               onClick={() => navigateToView(AppView.QNA)}
               className="bg-kid-pink text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-4 border-white transform active:scale-95 transition-transform"
             >
               <MessageCircleQuestion size={28} />
             </button>
          </div>
          <MobileNavItem view={AppView.BLOG} label="Blog" icon={Coffee} />
          <MobileNavItem view={AppView.WORKSHEETS} label="Tài Liệu" icon={BookOpen} />
        </div>
      </div>

      {/* Notification Toast */}
      <div className="fixed top-24 right-4 z-[60] flex flex-col gap-2 pointer-events-none">
        {notifications.map(n => (
          <div key={n.id} className={`pointer-events-auto bg-white border-l-4 p-4 rounded-r shadow-2xl flex items-center gap-3 min-w-[300px] animate-in slide-in-from-right fade-in duration-300 ${
            n.type === 'SUCCESS' ? 'border-green-500' : n.type === 'WARNING' ? 'border-yellow-500' : 'border-blue-500'
          }`}>
             <Bell size={20} className={n.type === 'SUCCESS' ? 'text-green-500' : 'text-blue-500'} />
             <p className="font-bold text-gray-700 text-sm">{n.message}</p>
          </div>
        ))}
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-gray-900 mb-2">{authMode === 'LOGIN' ? 'Chào Bạn!' : 'Đăng Ký Mới'}</h2>
                <p className="text-gray-500">Tham gia cộng đồng cha mẹ thông thái.</p>
              </div>
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                  <input type="email" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-kid-blue focus:border-transparent outline-none transition-all" placeholder="email@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Mật khẩu</label>
                  <input type="password" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-kid-blue focus:border-transparent outline-none transition-all" placeholder="••••••••" />
                </div>
                
                <button type="submit" className="w-full bg-kid-blue text-white font-bold py-4 rounded-xl hover:bg-blue-600 transition-colors shadow-lg mt-4">
                  {authMode === 'LOGIN' ? 'Đăng Nhập' : 'Tạo Tài Khoản'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button 
                  onClick={() => setAuthMode(authMode === 'LOGIN' ? 'REGISTER' : 'LOGIN')}
                  className="text-kid-pink font-bold hover:underline"
                >
                  {authMode === 'LOGIN' ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
                </button>
              </div>
            </div>
            <div className="bg-gray-50 p-4 text-center text-xs text-gray-400 font-medium">
               An toàn • Bảo mật • Cộng đồng văn minh
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper for Desktop Nav
const NavButton = ({view, current, label, icon: Icon, setView}: any) => (
  <button
    onClick={() => setView(view)}
    className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all ${
      current === view
        ? 'bg-kid-blue/10 text-kid-blue'
        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
    }`}
  >
    <Icon size={18} />
    {label}
  </button>
);

interface HomeViewProps {
  setView: (view: AppView) => void;
  onGameSelect: (type: GameType) => void;
  onBlogSelect: (id: string) => void;
  onQuestionSelect: (id: string) => void;
  onWorksheetSelect: (id: string) => void;
  onGlobalSearch: (query: string) => void;
  user: User | null;
  setShowAuth: any;
}

const HomeView: React.FC<HomeViewProps> = ({setView, onGameSelect, onBlogSelect, onQuestionSelect, onWorksheetSelect, onGlobalSearch, user, setShowAuth}) => {
  const [searchInput, setSearchInput] = useState('');

  // Mock Data for Home Preview
  const FEATURED_BLOGS: BlogPost[] = [
    { id: '1', title: 'Phương pháp Montessori tại nhà cho trẻ 3 tuổi', category: 'Giáo dục sớm', excerpt: 'Làm sao để áp dụng triết lý Montessori mà không cần mua giáo cụ đắt tiền?', content: '', image: 'https://picsum.photos/600/400?random=10', author: 'Dr. Asking Kids', date: '20 T10', likes: 120, comments: [] },
    { id: '2', title: '10 cách cai nghiện điện thoại cho trẻ hiệu quả', category: 'Sức khỏe', excerpt: 'Trẻ xem TV quá nhiều? Hãy thử quy tắc "vùng không công nghệ".', content: '', image: 'https://picsum.photos/600/400?random=11', author: 'Dr. Asking Kids', date: '18 T10', likes: 95, comments: [] }
  ];

  const LATEST_QUESTIONS: Question[] = [
    { id: '1', title: 'Bé 3 tuổi không chịu ăn rau, các mẹ có cách nào không?', content: 'Stress quá các mom ơi...', category: QnACategory.PARENTS, author: 'Mẹ SuSu', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Susu', likes: 12, views: 105, timestamp: '2 giờ trước', tags: ['Biếng ăn'], answers: [] },
    { id: '2', title: 'App học tiếng Anh nào tốt cho bé 5 tuổi?', content: 'Ngoài Asking Kids ra thì còn app nào...', category: QnACategory.EDUCATION, author: 'Cô Thảo', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thao', likes: 8, views: 89, timestamp: '5 giờ trước', tags: ['Công nghệ'], answers: [] }
  ];

  const NEW_WORKSHEETS: Worksheet[] = [
    { id: '1', title: 'Tập tô chữ cái A-Z', subject: 'Tiếng Việt', age: '3-5 tuổi', imageUrl: 'https://picsum.photos/300/400?random=1' },
    { id: '3', title: 'Toán cộng trong phạm vi 10', subject: 'Toán', age: '5-6 tuổi', imageUrl: 'https://picsum.photos/300/400?random=3' },
    { id: '5', title: 'Mê cung tìm đường', subject: 'Tư duy', age: '4-8 tuổi', imageUrl: 'https://picsum.photos/300/400?random=5' },
    { id: '6', title: 'Luyện viết nét cơ bản', subject: 'Tiếng Việt', age: '4-5 tuổi', imageUrl: 'https://picsum.photos/300/400?random=6' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(searchInput.trim()) {
      onGlobalSearch(searchInput);
    }
  };

  return (
    <div className="relative overflow-hidden">
       {/* Hero Section */}
       <div className="relative bg-gradient-to-b from-white to-blue-50/50">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-kid-pink/10 rounded-full blur-[100px] mix-blend-multiply filter pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-kid-blue/10 rounded-full blur-[100px] mix-blend-multiply filter pointer-events-none -translate-x-1/2 translate-y-1/2"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 md:pt-20 md:pb-24 text-center relative z-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-600 font-bold text-xs md:text-sm mb-6 animate-pulse">
              ✨ Nền tảng Giáo dục & Cộng đồng cho bé 2-10 tuổi
            </span>
            <h1 className="text-4xl md:text-7xl font-black text-gray-900 mb-6 md:mb-8 tracking-tight leading-tight">
              Khám phá thế giới <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-kid-pink via-kid-purple to-kid-blue">
                Tri thức sắc màu
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 px-4 leading-relaxed">
              Hệ thống trò chơi giáo dục AI, kho tài liệu miễn phí và cộng đồng hỏi đáp sôi động dành cho cha mẹ.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-10 px-4">
               <form onSubmit={handleSearchSubmit} className="relative group">
                  <input 
                    type="text" 
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Tìm kiếm trò chơi, tài liệu, kiến thức..." 
                    className="w-full pl-6 pr-14 py-4 rounded-full border-4 border-gray-100 shadow-lg focus:outline-none focus:border-kid-blue/50 text-lg font-medium transition-all group-hover:shadow-xl"
                  />
                  <button 
                    type="submit"
                    className="absolute right-2 top-2 bottom-2 bg-kid-blue hover:bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-sm"
                  >
                     <Search size={24} />
                  </button>
               </form>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <button 
                onClick={() => setView(AppView.GAMES)}
                className="px-8 md:px-10 py-4 bg-kid-pink text-white text-lg font-bold rounded-full shadow-xl hover:bg-pink-600 transform hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <Play fill="currentColor" size={20} /> Chơi Ngay
              </button>
              <button 
                onClick={() => setView(AppView.QNA)}
                className="px-8 md:px-10 py-4 bg-white text-gray-700 text-lg font-bold rounded-full shadow-lg border-2 border-gray-100 hover:border-kid-green hover:text-kid-green transition-all flex items-center justify-center gap-2"
              >
                <MessageCircleQuestion size={20} /> Hỏi Đáp Cộng Đồng
              </button>
            </div>
          </div>
       </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 pb-20">
        
        {/* SECTION: GAMES */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-800">Trò Chơi Nổi Bật 🎮</h2>
              <p className="text-gray-500 mt-1">Vừa học vừa chơi, phát triển tư duy.</p>
            </div>
            <button onClick={() => setView(AppView.GAMES)} className="text-kid-blue font-bold flex items-center gap-1 hover:underline">
              Xem tất cả <ArrowRight size={16}/>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div onClick={() => onGameSelect(GameType.COLOR)} className="bg-white rounded-3xl p-6 shadow-lg border-b-4 border-kid-pink cursor-pointer hover:-translate-y-1 transition-transform">
                <div className="w-16 h-16 bg-kid-pink/10 rounded-2xl flex items-center justify-center text-3xl mb-4">🎨</div>
                <h3 className="text-xl font-bold mb-2">Học Màu Sắc</h3>
                <p className="text-gray-500 text-sm">Nhận biết màu sắc qua hình ảnh sinh động.</p>
             </div>
             <div onClick={() => onGameSelect(GameType.MATH)} className="bg-white rounded-3xl p-6 shadow-lg border-b-4 border-kid-blue cursor-pointer hover:-translate-y-1 transition-transform">
                <div className="w-16 h-16 bg-kid-blue/10 rounded-2xl flex items-center justify-center text-3xl mb-4">🔢</div>
                <h3 className="text-xl font-bold mb-2">Toán Lớp 1</h3>
                <p className="text-gray-500 text-sm">Cộng trừ cơ bản trong phạm vi 10, 20.</p>
             </div>
             <div onClick={() => onGameSelect(GameType.SPEAKING)} className="bg-white rounded-3xl p-6 shadow-lg border-b-4 border-kid-purple cursor-pointer hover:-translate-y-1 transition-transform">
                <div className="w-16 h-16 bg-kid-purple/10 rounded-2xl flex items-center justify-center text-3xl mb-4">🎤</div>
                <h3 className="text-xl font-bold mb-2">Luyện Phát Âm</h3>
                <p className="text-gray-500 text-sm">Công nghệ AI chấm điểm giọng nói tiếng Anh.</p>
             </div>
          </div>
        </section>

        {/* SECTION: LATEST Q&A */}
        <section className="bg-gradient-to-br from-purple-50 to-white rounded-3xl p-8 border border-purple-100">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
             <div>
               <span className="text-kid-purple font-bold uppercase tracking-wider text-xs">Cộng đồng sôi nổi</span>
               <h2 className="text-2xl md:text-3xl font-black text-gray-800 mt-1">Hỏi Đáp Mới Nhất 🙋‍♀️</h2>
             </div>
             <button onClick={() => setView(AppView.QNA)} className="bg-kid-purple text-white px-6 py-2 rounded-full font-bold shadow hover:bg-purple-600 transition-colors">
               Tham gia thảo luận
             </button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {LATEST_QUESTIONS.map(q => (
                 <div key={q.id} onClick={() => onQuestionSelect(q.id)} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all flex gap-4">
                    <img src={q.avatar} className="w-12 h-12 rounded-full bg-gray-50" alt="avt" />
                    <div className="flex-1">
                       <h3 className="font-bold text-gray-800 line-clamp-1 mb-1">{q.title}</h3>
                       <p className="text-gray-500 text-sm line-clamp-2 mb-3">{q.content}</p>
                       <div className="flex items-center gap-3 text-xs text-gray-400 font-bold">
                          <span className="text-kid-purple bg-purple-50 px-2 py-0.5 rounded">{q.category}</span>
                          <span>{q.timestamp}</span>
                          <span className="flex items-center gap-1"><MessageCircle size={12}/> 0 trả lời</span>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </section>

        {/* SECTION: BLOG */}
        <section>
           <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-gray-800">Bài Viết Mới Nhất 📰</h2>
                <p className="text-gray-500 mt-1">Kinh nghiệm nuôi dạy con từ chuyên gia.</p>
              </div>
              <button onClick={() => setView(AppView.BLOG)} className="text-kid-pink font-bold flex items-center gap-1 hover:underline">
                Đọc thêm <ArrowRight size={16}/>
              </button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {FEATURED_BLOGS.map(blog => (
                 <div key={blog.id} onClick={() => onBlogSelect(blog.id)} className="group cursor-pointer">
                    <div className="overflow-hidden rounded-2xl mb-4 relative h-64">
                       <img src={blog.image} alt={blog.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                       <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold shadow-sm">
                          {blog.category}
                       </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-kid-pink transition-colors leading-tight">{blog.title}</h3>
                    <p className="text-gray-500 text-sm line-clamp-2">{blog.excerpt}</p>
                 </div>
              ))}
           </div>
        </section>

        {/* SECTION: WORKSHEETS */}
        <section>
           <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-gray-800">Tài Liệu Miễn Phí 📚</h2>
                <p className="text-gray-500 mt-1">Tải và in bài tập cho bé luyện tập.</p>
              </div>
              <button onClick={() => setView(AppView.WORKSHEETS)} className="text-kid-green font-bold flex items-center gap-1 hover:underline">
                Kho tài liệu <ArrowRight size={16}/>
              </button>
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {NEW_WORKSHEETS.map(ws => (
                 <div key={ws.id} onClick={() => onWorksheetSelect(ws.id)} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer group">
                    <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 mb-3 relative">
                       <img src={ws.imageUrl} alt={ws.title} className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Download className="text-white" />
                       </div>
                    </div>
                    <h4 className="font-bold text-gray-800 text-sm line-clamp-1">{ws.title}</h4>
                    <p className="text-xs text-gray-400">{ws.age}</p>
                 </div>
              ))}
           </div>
        </section>

      </div>
    </div>
  );
};

export default App;
