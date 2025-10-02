'use client'

import { useBookmarks } from '@/hooks/useBookmarks' // Custom hook for managing bookmarks
import { RepoCard } from '@/components/repo-card'   // Component to display each repository
import { useEffect, useState } from 'react'

export default function BookmarksPage() {
  // Get bookmarks array from custom hook
  const { bookmarks } = useBookmarks() 

  // State to check if component has mounted (for client-only rendering)
  const [mounted, setMounted] = useState(false)

  // useEffect runs only on the client after first render
  useEffect(() => {
    setMounted(true) // Mark as mounted
  }, [])

  // Prevent rendering on the server to avoid hydration errors
  if (!mounted) return null // Wait until client render

  // If no bookmarks, show a friendly message
  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No bookmarks yet. Start adding your favorites!
      </div>
    )
  }

  // Render bookmarked repositories
  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Page heading */}
      <h2 className="text-2xl font-bold mb-4">Your Bookmarked Repositories</h2>

      {/* Grid of RepoCards */}
      <div className="grid grid-cols-1 gap-6" key={bookmarks.length}>
        {bookmarks.map(repo => (
          <RepoCard key={repo.id} repo={repo} /> // Each card is fully reactive
        ))}
      </div>
    </div>
  )
}
