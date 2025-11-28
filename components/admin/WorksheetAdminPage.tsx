
import React, { useState } from 'react';
import { Plus, Search, ArrowLeft, BookOpen } from 'lucide-react';
import { WorksheetTable, AdminWorksheet } from './WorksheetTable';
import { WorksheetForm } from './WorksheetForm';

export const WorksheetAdminPage: React.FC = () => {
  const [view, setView] = useState<'LIST' | 'FORM'>('LIST');
  const [editingWorksheet, setEditingWorksheet] = useState<AdminWorksheet | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock Data
  const [worksheets, setWorksheets] = useState<AdminWorksheet[]>([
    { 
        id: '1', 
        title: 'Tập tô chữ cái A-Z', 
        subject: 'Tiếng Việt', 
        age: '3-5 tuổi', 
        imageUrl: 'https://picsum.photos/300/400?random=1', 
        description: 'Bộ tài liệu giúp bé làm quen với bảng chữ cái Tiếng Việt.', 
        pdfUrl: '#',
        downloads: 1250 
    },
    { 
        id: '2', 
        title: 'Nối hình con vật', 
        subject: 'Tư duy', 
        age: '2-4 tuổi', 
        imageUrl: 'https://picsum.photos/300/400?random=2', 
        description: 'Bài tập rèn luyện khả năng quan sát và logic.', 
        pdfUrl: '#',
        downloads: 890 
    },
    { 
        id: '3', 
        title: 'Toán cộng trong phạm vi 10', 
        subject: 'Toán', 
        age: '5-6 tuổi', 
        imageUrl: 'https://picsum.photos/300/400?random=3', 
        description: 'Các bài tập toán cơ bản giúp bé lớp 1 làm quen với phép cộng.', 
        pdfUrl: '#',
        downloads: 2100 
    }
  ]);

  const filteredWorksheets = worksheets.filter(ws => 
    ws.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ws.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddNew = () => {
    setEditingWorksheet(null);
    setView('FORM');
  };

  const handleEdit = (ws: AdminWorksheet) => {
    setEditingWorksheet(ws);
    setView('FORM');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tài liệu này không?')) {
      setWorksheets(worksheets.filter(ws => ws.id !== id));
    }
  };

  const handleSave = (data: AdminWorksheet) => {
    if (editingWorksheet) {
      // Update existing
      setWorksheets(worksheets.map(ws => ws.id === data.id ? data : ws));
    } else {
      // Add new
      setWorksheets([data, ...worksheets]);
    }
    setView('LIST');
    setEditingWorksheet(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
             <BookOpen className="text-kid-green" size={32} /> Quản Lý Tài Liệu (PDF)
          </h1>
          <p className="text-gray-500">Upload và quản lý kho học liệu cho bé.</p>
        </div>
        
        {view === 'LIST' && (
          <button 
            onClick={handleAddNew}
            className="bg-kid-green text-white font-bold px-6 py-3 rounded-full shadow-lg hover:bg-green-600 transition-all flex items-center gap-2 transform active:scale-95"
          >
            <Plus size={20} /> Upload PDF Mới
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
                   placeholder="Tìm kiếm tài liệu..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-kid-green/50"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
             </div>
          </div>

          <WorksheetTable 
            worksheets={filteredWorksheets} 
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
          <WorksheetForm 
             initialData={editingWorksheet} 
             onSubmit={handleSave} 
             onCancel={() => setView('LIST')} 
          />
        </div>
      )}
    </div>
  );
};
