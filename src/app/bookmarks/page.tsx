'use client'

import { useBookmarks } from '@/hooks/useBookmarks' 
import { RepoCard } from '@/components/repo-card'   
import { Header } from '@/components/header'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function BookmarksPage() {
  const { bookmarks } = useBookmarks() 

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true) 
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">Your Bookmarked Repositories</h2>

          {bookmarks.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                No bookmarks yet. Start exploring and save your favorites!
              </div>
              <Link 
                href="/" 
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                Discover Awesome Repos
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6" key={bookmarks.length}>
              {bookmarks.map(repo => (
                <RepoCard key={repo.id} repo={repo} /> 
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
