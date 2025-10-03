// API client utilities for search functionality

export interface Repository {
  id: number
  githubId: number
  name: string
  fullName: string
  description: string | null
  url: string
  stars: number
  forks: number
  language: string | null
  topics: string[]
  tags: string[]
  owner: string
  lastFetched: string
  createdAt: string
  updatedAt: string
}

export interface SearchResponse {
  repos: Repository[]
  pagination: {
    page: number
    hasMore: boolean
  }
}

export interface SearchParams {
  query?: string
  category?: string
  page?: number
}

export class SearchApiClient {
  private static baseUrl = '/api/search'

  static async searchRepositories(params: SearchParams, signal?: AbortSignal): Promise<SearchResponse> {
    const searchParams = new URLSearchParams()
    
    if (params.query) {
      searchParams.append('q', params.query)
    }
    
    if (params.category && params.category !== 'all') {
      searchParams.append('category', params.category)
    }
    
    if (params.page) {
      searchParams.append('page', params.page.toString())
    }

    const url = `${this.baseUrl}?${searchParams.toString()}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
    }

    return response.json()
  }
}

// Hook for managing search state
export function useSearchState() {
  return {
    // This will be implemented if we add React hooks for state management
    // For now, we're using useState directly in components
  }
}