"use client";

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { generateBlogArticle } from '../services/geminiService';
import { BlogPost, BlogComment } from '../types';
import { BookOpen, User as UserIcon, Clock, Sparkles, PenTool, Image as ImageIcon, Send, ArrowLeft, Calendar, Search, Heart, MessageSquare, CornerDownRight, ThumbsUp } from 'lucide-react';

interface BlogProps {
  initialPostId?: string | null;
}

export const ParentingBlog: React.FC<BlogProps> = ({ initialPostId }) => {
  const { user, addNotification, updateUserPoints } = useApp();
  
  // ... Full logic from previous ParentingBlog.tsx
  
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
        <h2 className="text-3xl font-bold mb-6">Blog Nuôi Dạy Con (Next.js)</h2>
        {/* ... Rest of Blog UI ... */}
    </div>
  );
};