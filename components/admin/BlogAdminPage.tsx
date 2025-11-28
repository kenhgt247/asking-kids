
import React, { useState } from 'react';
import { Plus, Search, Filter, ArrowLeft } from 'lucide-react';
import { BlogTable, AdminBlogPost } from './BlogTable';
import { BlogForm } from './BlogForm';

export const BlogAdminPage: React.FC = () => {
  const [view, setView] = useState<'LIST' | 'FORM'>('LIST');
  const [editingPost, setEditingPost] = useState<AdminBlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock Data
  const [posts, setPosts] = useState<AdminBlogPost[]>([
    {
      id: '1',
      title: 'Phương pháp Montessori tại nhà cho trẻ 3 tuổi',
      category: 'Giáo dục sớm',
      excerpt: 'Làm sao để áp dụng triết lý Montessori mà không cần mua giáo cụ đắt tiền?',
      content: 'Nội dung chi tiết...',
      image: 'https://picsum.photos/600/400?random=10',
      status: 'PUBLISHED',
      date: '20/10/2023',
      likes: 156,
      comments: []
    },
    {
      id: '2',
      title: '10 cách cai nghiện điện thoại cho trẻ hiệu quả',
      category: 'Sức khỏe',
      excerpt: 'Trẻ xem TV quá nhiều? Hãy thử quy tắc vùng không công nghệ.',
      content: 'Nội dung chi tiết...',
      image: 'https://picsum.photos/600/400?random=11',
      status: 'DRAFT',
      date: '18/10/2023',
      likes: 89,
      comments: []
    }
  ]);

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddNew = () => {
    setEditingPost(null);
    setView('FORM');
  };

  const handleEdit = (post: AdminBlogPost) => {
    setEditingPost(post);
    setView('FORM');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) {
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  const handleSave = (postData: AdminBlogPost) => {
    if (editingPost) {
      // Update existing
      setPosts(posts.map(p => p.id === postData.id ? postData : p));
    } else {
      // Add new
      setPosts([postData, ...posts]);
    }
    setView('LIST');
    setEditingPost(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-800">Quản Lý Blog</h1>
          <p className="text-gray-500">Quản lý các bài viết, tin tức chia sẻ cho phụ huynh.</p>
        </div>
        
        {view === 'LIST' && (
          <button 
            onClick={handleAddNew}
            className="bg-kid-pink text-white font-bold px-6 py-3 rounded-full shadow-lg hover:bg-pink-600 transition-all flex items-center gap-2 transform active:scale-95"
          >
            <Plus size={20} /> Thêm Bài Viết
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
                   placeholder="Tìm kiếm bài viết..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-kid-blue/50"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
             </div>
             <button className="px-4 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-600 flex items-center gap-2 hover:bg-gray-50">
                <Filter size={18} /> Lọc
             </button>
          </div>

          <BlogTable 
            posts={filteredPosts} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        </>
      ) : (
        <div className="max-w-5xl mx-auto">
          <button 
             onClick={() => setView('LIST')}
             className="mb-4 text-gray-500 hover:text-gray-800 font-bold flex items-center gap-2"
          >
             <ArrowLeft size={20}/> Quay lại danh sách
          </button>
          <BlogForm 
             initialData={editingPost} 
             onSubmit={handleSave} 
             onCancel={() => setView('LIST')} 
          />
        </div>
      )}
    </div>
  );
};
