'use client'

import { Star, GitFork, ExternalLink, Calendar } from 'lucide-react'

import { useBookmarks } from '@/hooks/useBookmarks'

import { Repository } from './featured-repos'

interface RepoCardProps {
  repo: Repository
}

export function RepoCard({ repo }: RepoCardProps) {
  const { bookmarks, addBookmark, removeBookmark } = useBookmarks()

  // Check if the current repo is already bookmarked
  const isBookmarked = bookmarks.some(b => b.id === repo.id)

  const formatNumber = (num: number) => {
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`
    return num.toString()
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{repo.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{repo.fullName}</p>
        </div>

        <button
          aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          onClick={() =>
            isBookmarked ? removeBookmark(repo.id) : addBookmark(repo)
          }
        >
          <Star
            size={20}
            className={`ml-2 mt-1 transition-colors ${isBookmarked ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`}
          />
        </button>

       
        <a
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2">{repo.description}</p>

      <div className="flex flex-wrap gap-1 mb-4">
        {repo.topics.slice(0, 3).map(topic => (
          <span
            key={topic}
            className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
          >
            {topic}
          </span>
        ))}
        {repo.topics.length > 3 && (
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
            +{repo.topics.length - 3}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4" />
            <span>{formatNumber(repo.stars)}</span>
          </div>
          <div className="flex items-center gap-1">
            <GitFork className="w-4 h-4" />
            <span>{formatNumber(repo.forks)}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(repo.updatedAt)}</span>
        </div>
      </div>

      {repo.language && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <span className="inline-flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"></div>
            {repo.language}
          </span>
        </div>
      )}
    </div>
  )
}
