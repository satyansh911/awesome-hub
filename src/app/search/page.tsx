import React, { Suspense } from 'react';
import SearchClient from './SearchClient';

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading search...</div>}>
      {/* Client component uses useSearchParams/useRouter and must be wrapped in Suspense */}
      <SearchClient />
    </Suspense>
  );
}
