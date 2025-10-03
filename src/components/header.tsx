'use client'

import Link from 'next/link'
import { Star, BookOpen } from 'lucide-react'
import { useBookmarks } from '@/hooks/useBookmarks'

export function Header() {
  const { bookmarks } = useBookmarks()

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AwesomeHub
            </span>
          </Link>
          
          <Link
            href="/bookmarks"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white font-medium rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
          >
            <Star className="w-4 h-4" />
            <span>Bookmarks</span>
            {bookmarks.length > 0 && (
              <span className="ml-1 bg-white/20 text-xs px-2 py-0.5 rounded-full">
                {bookmarks.length}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}