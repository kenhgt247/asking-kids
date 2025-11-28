"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { ArrowRight, Play, MessageCircleQuestion, Search, Rocket, Coffee, BookOpen } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) router.push(`/search?q=${encodeURIComponent(searchInput)}`);
  };

  return (
    <div className="relative overflow-hidden">
       {/* Hero Section */}
       <div className="relative bg-gradient-to-b from-white to-blue-50/50">
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
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-10 px-4">
               <form onSubmit={handleSearch} className="relative group">
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
              <Link href="/games" className="px-8 md:px-10 py-4 bg-kid-pink text-white text-lg font-bold rounded-full shadow-xl hover:bg-pink-600 transform hover:scale-105 transition-all flex items-center justify-center gap-2">
                <Play fill="currentColor" size={20} /> Chơi Ngay
              </Link>
              <Link href="/qna" className="px-8 md:px-10 py-4 bg-white text-gray-700 text-lg font-bold rounded-full shadow-lg border-2 border-gray-100 hover:border-kid-green hover:text-kid-green transition-all flex items-center justify-center gap-2">
                <MessageCircleQuestion size={20} /> Hỏi Đáp Cộng Đồng
              </Link>
            </div>
          </div>
       </div>

       {/* Features Grid */}
       <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
         <Link href="/games" className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
            <Rocket size={40} className="mb-4 text-kid-pink" />
            <h3 className="text-xl font-bold mb-2 group-hover:text-kid-pink">Trò chơi AI</h3>
            <p className="text-gray-500">Phát âm, Toán học, Màu sắc.</p>
         </Link>
         <Link href="/worksheets" className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
            <BookOpen size={40} className="mb-4 text-kid-green" />
            <h3 className="text-xl font-bold mb-2 group-hover:text-kid-green">Tài liệu PDF</h3>
            <p className="text-gray-500">Worksheet tập tô, tư duy.</p>
         </Link>
         <Link href="/blog" className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
            <Coffee size={40} className="mb-4 text-kid-purple" />
            <h3 className="text-xl font-bold mb-2 group-hover:text-kid-purple">Blog Cha Mẹ</h3>
            <p className="text-gray-500">Kinh nghiệm nuôi dạy con.</p>
         </Link>
       </div>
    </div>
  );
}