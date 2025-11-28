"use client";

import { Suspense } from 'react';
import { WorksheetLibrary } from '@/components/WorksheetLibrary';
import { useSearchParams } from 'next/navigation';

function WorksheetContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  return <WorksheetLibrary initialWorksheetId={id} />;
}

export default function WorksheetsPage() {
  return (
    <Suspense>
      <WorksheetContent />
    </Suspense>
  );
}