"use client";

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SearchResults } from '@/components/SearchResults';
import { GameType } from '@/types';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get('q') || '';

  const handleGameSelect = (type: GameType) => router.push(`/games?type=${type}`);
  const handleBlogSelect = (id: string) => router.push(`/blog?id=${id}`);
  const handleQuestionSelect = (id: string) => router.push(`/qna?id=${id}`);
  const handleWorksheetSelect = (id: string) => router.push(`/worksheets?id=${id}`);

  return (
    <SearchResults 
      query={q} 
      onGameSelect={handleGameSelect}
      onBlogSelect={handleBlogSelect}
      onQuestionSelect={handleQuestionSelect}
      onWorksheetSelect={handleWorksheetSelect}
    />
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}