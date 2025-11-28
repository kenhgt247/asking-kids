"use client";

import { Suspense } from 'react';
import { QnASection } from '@/components/QnASection';
import { useSearchParams } from 'next/navigation';

function QnAContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  return <QnASection initialQuestionId={id} />;
}

export default function QnAPage() {
  return (
    <Suspense>
      <QnAContent />
    </Suspense>
  );
}