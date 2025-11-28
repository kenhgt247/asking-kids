
import React from 'react';
import { Edit, Trash2, FileText, Download, Eye } from 'lucide-react';

export interface AdminWorksheet {
  id: string;
  title: string;
  subject: string;
  age: string;
  description: string;
  imageUrl: string;
  pdfUrl: string;
  downloads: number;
}

interface WorksheetTableProps {
  worksheets: AdminWorksheet[];
  onEdit: (ws: AdminWorksheet) => void;
  onDelete: (id: string) => void;
}

export const WorksheetTable: React.FC<WorksheetTableProps> = ({ worksheets, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-green-50/50 text-gray-600 text-sm uppercase tracking-wider border-b border-gray-100">
              <th className="p-6 font-bold">Tài liệu</th>
              <th className="p-6 font-bold">Môn học / Tuổi</th>
              <th className="p-6 font-bold">Mô tả</th>
              <th className="p-6 font-bold">Thống kê</th>
              <th className="p-6 font-bold text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {worksheets.map((ws) => (
              <tr 
                key={ws.id} 
                className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors group"
              >
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 shadow-sm border border-gray-200 relative group-hover:scale-105 transition-transform">
                      <img 
                        src={ws.imageUrl} 
                        alt={ws.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-0 right-0 bg-kid-green text-white text-[8px] font-bold px-1.5 py-0.5 rounded-bl">PDF</div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-base mb-1 line-clamp-2 max-w-[200px]">
                        {ws.title}
                      </h4>
                      <a href={ws.pdfUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline flex items-center gap-1">
                         View PDF
                      </a>
                    </div>
                  </div>
                </td>
                
                <td className="p-6">
                  <div className="flex flex-col gap-1">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 w-fit">
                      {ws.subject}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-600 w-fit">
                      {ws.age}
                    </span>
                  </div>
                </td>
                
                <td className="p-6 max-w-xs">
                   <p className="text-sm text-gray-500 line-clamp-2">{ws.description}</p>
                </td>
                
                <td className="p-6">
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                    <Download size={16} className="text-gray-400" />
                    {ws.downloads}
                  </div>
                </td>
                
                <td className="p-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => onEdit(ws)}
                      className="w-10 h-10 rounded-full bg-blue-50 text-kid-blue flex items-center justify-center hover:bg-kid-blue hover:text-white transition-all shadow-sm"
                      title="Chỉnh sửa"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => onDelete(ws.id)}
                      className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                      title="Xóa"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            
            {worksheets.length === 0 && (
              <tr>
                <td colSpan={5} className="p-12 text-center text-gray-400">
                  Chưa có tài liệu nào. Hãy upload PDF mới!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
