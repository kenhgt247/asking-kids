
import React from 'react';
import { Edit, Trash2, Play, Power, ExternalLink } from 'lucide-react';

export interface AdminGame {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  gameUrl: string;
  status: 'ACTIVE' | 'MAINTENANCE';
}

interface GameTableProps {
  games: AdminGame[];
  onEdit: (game: AdminGame) => void;
  onDelete: (id: string) => void;
}

export const GameTable: React.FC<GameTableProps> = ({ games, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-purple-50/50 text-gray-600 text-sm uppercase tracking-wider border-b border-gray-100">
              <th className="p-6 font-bold">Trò chơi</th>
              <th className="p-6 font-bold">Mô tả</th>
              <th className="p-6 font-bold">Trạng thái</th>
              <th className="p-6 font-bold">Đường dẫn</th>
              <th className="p-6 font-bold text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {games.map((game) => (
              <tr 
                key={game.id} 
                className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors group"
              >
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 shadow-sm border border-gray-100 relative group-hover:scale-105 transition-transform">
                      <img 
                        src={game.coverImage} 
                        alt={game.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150?text=Game')}
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <Play className="text-white fill-current" size={24} />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg mb-1">
                        {game.name}
                      </h4>
                      <p className="text-xs text-gray-400 font-bold">ID: {game.id}</p>
                    </div>
                  </div>
                </td>
                
                <td className="p-6 max-w-xs">
                  <p className="text-sm text-gray-500 line-clamp-2">{game.description}</p>
                </td>
                
                <td className="p-6">
                  {game.status === 'ACTIVE' ? (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full w-fit">
                      <Power size={14} /> Hoạt động
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-orange-500 bg-orange-50 px-3 py-1.5 rounded-full w-fit">
                      <Power size={14} /> Bảo trì
                    </span>
                  )}
                </td>
                
                <td className="p-6">
                  <div className="flex items-center gap-2 text-sm text-blue-500 font-bold bg-blue-50 px-3 py-1 rounded-lg w-fit">
                    <ExternalLink size={14} />
                    {game.gameUrl}
                  </div>
                </td>
                
                <td className="p-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => onEdit(game)}
                      className="w-10 h-10 rounded-full bg-blue-50 text-kid-blue flex items-center justify-center hover:bg-kid-blue hover:text-white transition-all shadow-sm"
                      title="Chỉnh sửa"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => onDelete(game.id)}
                      className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                      title="Xóa"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            
            {games.length === 0 && (
              <tr>
                <td colSpan={5} className="p-12 text-center text-gray-400 font-medium">
                  Chưa có trò chơi nào. Hãy thêm trò chơi mới!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
