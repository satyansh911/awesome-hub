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
    
    if (params.query?.trim()) {
      searchParams.append('q', params.query.trim())
    }
    
    if (params.category && params.category !== 'all') {
      searchParams.append('category', params.category)
    }
    
    if (params.page && params.page > 0) {
      searchParams.append('page', params.page.toString())
    }

    const url = `${this.baseUrl}?${searchParams.toString()}`
    
    try {
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

      const data = await response.json()
      
      // Validate response structure
      if (!data.repos || !Array.isArray(data.repos)) {
        throw new Error('Invalid response format')
      }

      return data
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw error // Re-throw abort errors
      }
      
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection.')
      }
      
      throw error
    }
  }
}