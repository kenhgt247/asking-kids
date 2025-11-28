"use client";

import { Suspense } from 'react';
import { ParentingBlog } from '@/components/ParentingBlog';
import { useSearchParams } from 'next/navigation';

function BlogContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  return <ParentingBlog initialPostId={id} />;
}

export default function BlogPage() {
  return (
    <Suspense>
      <BlogContent />
    </Suspense>
  );
}