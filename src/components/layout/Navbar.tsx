"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { Heart, Rocket, BookOpen, Coffee, MessageCircleQuestion, LogIn, LogOut } from 'lucide-react';

export const Navbar = () => {
  const pathname = usePathname();
  const { user, setShowAuthModal, logout } = useApp();

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <div className="w-10 h-10 bg-kid-pink rounded-xl flex items-center justify-center text-white font-black text-xl rotate-3">A</div>
            <div className="w-10 h-10 bg-kid-yellow rounded-xl flex items-center justify-center text-white font-black text-xl -rotate-3">K</div>
            <span className="text-2xl font-black text-gray-800 tracking-tight hidden md:block">Asking Kids</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-1">
            <NavItem href="/" label="Trang Chủ" icon={Heart} active={pathname === '/'} />
            <NavItem href="/games" label="Game" icon={Rocket} active={pathname.startsWith('/games')} />
            <NavItem href="/worksheets" label="Tài Liệu" icon={BookOpen} active={pathname.startsWith('/worksheets')} />
            <NavItem href="/blog" label="Blog" icon={Coffee} active={pathname.startsWith('/blog')} />
            <NavItem href="/qna" label="Hỏi Đáp" icon={MessageCircleQuestion} active={pathname.startsWith('/qna')} />
          </div>

          {/* User Action */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="text-right hidden lg:block">
                  <p className="text-sm font-bold text-gray-900">{user.name}</p>
                  <p className="text-xs text-kid-blue font-bold">{user.rank}</p>
                </div>
                <img src={user.avatar} alt="avatar" className="w-10 h-10 rounded-full border-2 border-kid-blue" />
                <button onClick={logout} className="text-gray-400 hover:text-red-500" title="Đăng xuất">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowAuthModal(true)}
                className="bg-kid-blue text-white px-4 md:px-6 py-2 rounded-full font-bold shadow hover:bg-blue-500 transition-colors flex items-center gap-2 text-sm md:text-base"
              >
                <LogIn size={18} /> <span className="hidden md:inline">Đăng nhập</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavItem = ({ href, label, icon: Icon, active }: any) => (
  <Link
    href={href}
    className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all ${
      active ? 'bg-kid-blue/10 text-kid-blue' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
    }`}
  >
    <Icon size={18} /> {label}
  </Link>
);