'use client'

import { useState, useCallback, useRef, KeyboardEvent } from 'react'
import { Search, Filter, Loader2, AlertCircle } from 'lucide-react'
import { SearchResults } from './search-results'
import { SearchApiClient, type Repository, type SearchResponse } from '@/lib/search-api'

export function SearchSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchResults, setSearchResults] = useState<Repository[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const abortControllerRef = useRef<AbortController | null>(null)

  const categories = [
    'all', 'javascript', 'python', 'react', 'node', 'machine-learning', 
    'css', 'go', 'rust', 'security', 'devops', 'data-science'
  ]

  const searchRepositories = useCallback(async (query: string, category: string, page: number = 1, append: boolean = false) => {
    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new AbortController for this request
    abortControllerRef.current = new AbortController()

    try {
      if (page === 1) {
        setIsLoading(true)
        setError(null)
      } else {
        setIsLoadingMore(true)
      }

      const data = await SearchApiClient.searchRepositories(
        {
          query: query || 'awesome',
          category: category !== 'all' ? category : undefined,
          page,
        },
        abortControllerRef.current.signal
      )

      if (append && page > 1) {
        setSearchResults((prev: Repository[]) => [...prev, ...data.repos])
      } else {
        setSearchResults(data.repos)
      }

      setCurrentPage(data.pagination.page)
      setHasMore(data.pagination.hasMore)
      setHasSearched(true)
      setError(null)
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Request was cancelled, don't update state
        return
      }
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to search repositories'
      setError(errorMessage)
      console.error('Search error:', err)
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }, [])

  const handleSearch = useCallback(() => {
    if (searchQuery.trim() === '' && selectedCategory === 'all') {
      setError('Please enter a search term or select a category')
      return
    }
    
    setCurrentPage(1)
    searchRepositories(searchQuery, selectedCategory, 1, false)
  }, [searchQuery, selectedCategory, searchRepositories])

  const handleLoadMore = useCallback(() => {
    if (hasMore && !isLoadingMore) {
      const nextPage = currentPage + 1
      searchRepositories(searchQuery, selectedCategory, nextPage, true)
    }
  }, [hasMore, isLoadingMore, currentPage, searchQuery, selectedCategory, searchRepositories])

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleClearResults = () => {
    setSearchResults([])
    setHasSearched(false)
    setError(null)
    setCurrentPage(1)
    setHasMore(false)
  }

  return (
    <>
      <section className="mb-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search awesome repositories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  disabled={isLoading}
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white appearance-none bg-white cursor-pointer"
                  disabled={isLoading}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : `awesome-${category}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-700 dark:text-red-400">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={handleSearch}
                disabled={isLoading}
                className="flex-1 sm:flex-initial px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  'Search Awesome Repos'
                )}
              </button>
              
              {hasSearched && (
                <button 
                  onClick={handleClearResults}
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                >
                  Clear Results
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {hasSearched && (
        <SearchResults 
          results={searchResults}
          isLoading={isLoading}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          onLoadMore={handleLoadMore}
          searchQuery={searchQuery}
          category={selectedCategory}
        />
      )}
    </>
  )
}