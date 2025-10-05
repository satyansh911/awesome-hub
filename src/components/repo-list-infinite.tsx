"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Star, GitFork, ExternalLink, Calendar, Loader2 } from "lucide-react"
import { useBookmarks } from "../hooks/useBookmarks"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"

export interface Repository {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  stargazers_count: number
  forks_count: number
  language: string | null
  updated_at: string
  topics: string[]
  owner: {
    login: string
    avatar_url: string
  }
}

interface RepoListInfiniteProps {
  searchQuery?: string
  category?: string
}

export function RepoListInfinite({ searchQuery = "awesome", category = "all" }: RepoListInfiniteProps) {
  const [repos, setRepos] = useState<Repository[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { bookmarks, addBookmark, removeBookmark } = useBookmarks()
  const isBookmarked = (id: number) => bookmarks.some((b) => b.id === id)

  const observerTarget = useRef<HTMLDivElement>(null)

  const fetchRepos = useCallback(
    async (pageNum: number, reset = false) => {
      if (loading) return

      try {
        setLoading(true)
        setError(null)

        const params = new URLSearchParams({
          q: searchQuery,
          page: pageNum.toString(),
          per_page: "10", // Load 10 repositories at a time
        })

        if (category && category !== "all") {
          params.append("topic", category)
        }

        const response = await fetch(`/api/search?${params}`)

        if (!response.ok) {
          throw new Error("Failed to fetch repositories")
        }

        const data = await response.json()

        if (reset) {
          setRepos(data.repos)
        } else {
          setRepos((prev) => [...prev, ...data.repos])
        }

        // Check if there are more results
        setHasMore(data.repos.length === 10)
      } catch (err) {
        console.error("Error fetching repos:", err)
        setError("Failed to load repositories. Please try again.")
        setHasMore(false)
      } finally {
        setLoading(false)
      }
    },
    [searchQuery, category, loading],
  )

  useEffect(() => {
    setPage(1)
    setRepos([])
    setHasMore(true)
    fetchRepos(1, true)
  }, [searchQuery, category])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          const nextPage = page + 1
          setPage(nextPage)
          fetchRepos(nextPage)
        }
      },
      { threshold: 0.1, rootMargin: "100px" },
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [hasMore, loading, page, fetchRepos])

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  if (error && repos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
        <button
          onClick={() => fetchRepos(1, true)}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <section className="py-8">
      <div className="space-y-6">
        {repos.map((repo) => (
          <Card key={repo.id} className="glass-strong border-0 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gradient mb-2">{repo.name}</h3>
                  <p className="text-sm text-muted-foreground">{repo.full_name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    aria-label={isBookmarked(repo.id) ? "Remove bookmark" : "Add bookmark"}
                    onClick={() => (isBookmarked(repo.id) ? removeBookmark(repo.id) : addBookmark(repo))}
                    className="p-2 hover:bg-accent rounded-lg transition-colors"
                  >
                    <Star
                      size={20}
                      className={`transition-all ${
                        isBookmarked(repo.id)
                          ? "fill-yellow-400 text-yellow-400 scale-110"
                          : "text-muted-foreground hover:text-yellow-400"
                      }`}
                    />
                  </button>
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-accent rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-5 h-5 text-muted-foreground hover:text-primary" />
                  </a>
                </div>
              </div>

              <p className="text-foreground/80 mb-4 line-clamp-2">{repo.description || "No description available"}</p>

              {repo.topics.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {repo.topics.slice(0, 5).map((topic) => (
                    <Badge key={topic} variant="secondary" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                  {repo.topics.length > 5 && (
                    <Badge variant="outline" className="text-xs">
                      +{repo.topics.length - 5} more
                    </Badge>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    <span>{formatNumber(repo.stargazers_count)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GitFork className="w-4 h-4" />
                    <span>{formatNumber(repo.forks_count)}</span>
                  </div>
                  {repo.language && (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-accent"></div>
                      <span>{repo.language}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(repo.updated_at)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Loading more repositories...</span>
        </div>
      )}

      {!hasMore && repos.length > 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            You've reached the end of the results. Found {repos.length} repositories.
          </p>
        </div>
      )}

      <div ref={observerTarget} className="h-4" />
    </section>
  )
}
