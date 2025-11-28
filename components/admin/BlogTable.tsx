
import React from 'react';
import { Edit, Trash2, Eye, Calendar, CheckCircle, Clock } from 'lucide-react';
import { BlogPost } from '../../types';

// Extended type for Admin purposes (adding status)
export interface AdminBlogPost extends BlogPost {
  status: 'PUBLISHED' | 'DRAFT';
}

interface BlogTableProps {
  posts: AdminBlogPost[];
  onEdit: (post: AdminBlogPost) => void;
  onDelete: (id: string) => void;
}

export const BlogTable: React.FC<BlogTableProps> = ({ posts, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-blue-50/50 text-gray-600 text-sm uppercase tracking-wider border-b border-gray-100">
              <th className="p-6 font-bold">Bài viết</th>
              <th className="p-6 font-bold">Danh mục</th>
              <th className="p-6 font-bold">Trạng thái</th>
              <th className="p-6 font-bold">Ngày đăng</th>
              <th className="p-6 font-bold text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {posts.map((post) => (
              <tr 
                key={post.id} 
                className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors group"
              >
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 shadow-sm">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 line-clamp-1 max-w-[200px] md:max-w-xs mb-1">
                        {post.title}
                      </h4>
                      <p className="text-xs text-gray-400 font-medium">ID: {post.id}</p>
                    </div>
                  </div>
                </td>
                
                <td className="p-6">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
                    {post.category}
                  </span>
                </td>
                
                <td className="p-6">
                  {post.status === 'PUBLISHED' ? (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full w-fit">
                      <CheckCircle size={14} /> Công khai
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full w-fit">
                      <Clock size={14} /> Nháp
                    </span>
                  )}
                </td>
                
                <td className="p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                    <Calendar size={16} />
                    {post.date || 'Chưa đặt'}
                  </div>
                </td>
                
                <td className="p-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => onEdit(post)}
                      className="w-10 h-10 rounded-full bg-blue-50 text-kid-blue flex items-center justify-center hover:bg-kid-blue hover:text-white transition-all shadow-sm"
                      title="Chỉnh sửa"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => onDelete(post.id)}
                      className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                      title="Xóa"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            
            {posts.length === 0 && (
              <tr>
                <td colSpan={5} className="p-12 text-center text-gray-400">
                  Chưa có bài viết nào. Hãy thêm bài viết mới!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
