
import React, { useState } from 'react';
import { Plus, Search, ArrowLeft, Gamepad2 } from 'lucide-react';
import { GameTable, AdminGame } from './GameTable';
import { GameForm } from './GameForm';

export const GameAdminPage: React.FC = () => {
  const [view, setView] = useState<'LIST' | 'FORM'>('LIST');
  const [editingGame, setEditingGame] = useState<AdminGame | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock Data (Based on existing games in GameHub)
  const [games, setGames] = useState<AdminGame[]>([
    {
      id: '1',
      name: 'Học Màu Sắc (Colors)',
      description: 'Trò chơi giúp bé nhận biết các màu sắc cơ bản thông qua hình ảnh sinh động.',
      coverImage: 'https://via.placeholder.com/300/F72585/FFFFFF?text=Colors',
      gameUrl: '/games/color-match',
      status: 'ACTIVE'
    },
    {
      id: '2',
      name: 'Toán Lớp 1 (Math)',
      description: 'Luyện tập phép cộng trừ trong phạm vi 10, 20 cho học sinh tiểu học.',
      coverImage: 'https://via.placeholder.com/300/4CC9F0/FFFFFF?text=Math',
      gameUrl: '/games/math-class-1',
      status: 'ACTIVE'
    },
    {
      id: '3',
      name: 'Luyện Phát Âm AI',
      description: 'Sử dụng công nghệ AI để chấm điểm phát âm tiếng Anh cho bé.',
      coverImage: 'https://via.placeholder.com/300/7209B7/FFFFFF?text=Speaking',
      gameUrl: '/games/ai-speaking',
      status: 'ACTIVE'
    },
    {
      id: '4',
      name: 'Ghép Hình Động Vật',
      description: 'Kéo thả các mảnh ghép để hoàn thiện hình ảnh các con vật đáng yêu.',
      coverImage: 'https://via.placeholder.com/300/FFD60A/000000?text=Puzzle',
      gameUrl: '/games/animal-puzzle',
      status: 'MAINTENANCE'
    }
  ]);

  const filteredGames = games.filter(g => 
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddNew = () => {
    setEditingGame(null);
    setView('FORM');
  };

  const handleEdit = (game: AdminGame) => {
    setEditingGame(game);
    setView('FORM');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa trò chơi này không?')) {
      setGames(games.filter(g => g.id !== id));
    }
  };

  const handleSave = (gameData: AdminGame) => {
    if (editingGame) {
      // Update existing
      setGames(games.map(g => g.id === gameData.id ? gameData : g));
    } else {
      // Add new
      setGames([gameData, ...games]);
    }
    setView('LIST');
    setEditingGame(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
             <Gamepad2 className="text-kid-purple" size={32} /> Quản Lý Game
          </h1>
          <p className="text-gray-500">Thêm, sửa, xóa các trò chơi trong hệ thống.</p>
        </div>
        
        {view === 'LIST' && (
          <button 
            onClick={handleAddNew}
            className="bg-kid-purple text-white font-bold px-6 py-3 rounded-full shadow-lg hover:bg-purple-600 transition-all flex items-center gap-2 transform active:scale-95"
          >
            <Plus size={20} /> Thêm Game Mới
          </button>
        )}
      </div>

      {view === 'LIST' ? (
        <>
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
             <div className="relative flex-grow max-w-lg">
                <input 
                   type="text"
                   placeholder="Tìm kiếm trò chơi..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-kid-purple/50"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
             </div>
          </div>

          <GameTable 
            games={filteredGames} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        </>
      ) : (
        <div className="max-w-4xl mx-auto">
          <button 
             onClick={() => setView('LIST')}
             className="mb-4 text-gray-500 hover:text-gray-800 font-bold flex items-center gap-2"
          >
             <ArrowLeft size={20}/> Quay lại danh sách
          </button>
          <GameForm 
             initialData={editingGame} 
             onSubmit={handleSave} 
             onCancel={() => setView('LIST')} 
          />
        </div>
      )}
    </div>
  );
};
