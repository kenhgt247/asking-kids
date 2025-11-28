"use client";

import { Suspense } from 'react';
import { GameHub } from '@/components/GameHub';
import { useSearchParams } from 'next/navigation';
import { GameType } from '@/types';

function GameContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type') as GameType;
  return <GameHub initialGame={type || GameType.NONE} />;
}

export default function GamesPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 font-bold text-gray-400">Đang tải trò chơi...</div>}>
      <GameContent />
    </Suspense>
  );
}