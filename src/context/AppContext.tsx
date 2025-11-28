"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Notification, calculateRank } from '../types';

interface AppContextType {
  user: User | null;
  notifications: Notification[];
  login: (email: string) => void;
  logout: () => void;
  updateUserPoints: (points: number) => void;
  addNotification: (message: string, type?: 'INFO' | 'SUCCESS' | 'WARNING') => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Hydrate user from local storage
  useEffect(() => {
    const saved = localStorage.getItem('ak_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse user");
      }
    }
  }, []);

  const addNotification = (message: string, type: 'INFO' | 'SUCCESS' | 'WARNING' = 'INFO') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  const login = (email: string) => {
    const mockUser: User = {
      id: 'u-' + Date.now(),
      name: email.split('@')[0],
      email: email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      rank: 'Thành viên mới',
      points: 50,
      badges: ['🌱'],
      role: email.includes('admin') ? 'ADMIN' : 'USER'
    };
    mockUser.rank = calculateRank(mockUser.points);
    
    setUser(mockUser);
    localStorage.setItem('ak_user', JSON.stringify(mockUser));
    setShowAuthModal(false);
    addNotification(`Xin chào ${mockUser.name}!`, 'SUCCESS');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ak_user');
    addNotification('Đã đăng xuất.', 'INFO');
  };

  const updateUserPoints = (pointsToAdd: number) => {
    if (!user) return;
    const newPoints = user.points + pointsToAdd;
    const newRank = calculateRank(newPoints);
    let badges = [...user.badges];

    if (newRank !== user.rank) {
      addNotification(`🎉 Thăng hạng lên "${newRank}"`, 'SUCCESS');
      if (newRank === 'Chuyên gia' && !badges.includes('👑')) badges.push('👑');
    } else {
      addNotification(`+${pointsToAdd} điểm uy tín!`, 'SUCCESS');
    }

    const updatedUser = { ...user, points: newPoints, rank: newRank, badges };
    setUser(updatedUser);
    localStorage.setItem('ak_user', JSON.stringify(updatedUser));
  };

  return (
    <AppContext.Provider value={{ user, notifications, login, logout, updateUserPoints, addNotification, showAuthModal, setShowAuthModal }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};