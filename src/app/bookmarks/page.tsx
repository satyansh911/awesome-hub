'use client'

import { useBookmarks } from '@/hooks/useBookmarks' 
import { RepoCard } from '@/components/repo-card'   
import { useEffect, useState } from 'react'

export default function BookmarksPage() {
  const { bookmarks } = useBookmarks() 

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true) 
  }, [])

  if (!mounted) return null

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No bookmarks yet. Start adding your favorites!
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Your Bookmarked Repositories</h2>

      <div className="grid grid-cols-1 gap-6" key={bookmarks.length}>
        {bookmarks.map(repo => (
          <RepoCard key={repo.id} repo={repo} /> 
        ))}
      </div>
    </div>
  )
}
