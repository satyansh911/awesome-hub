import { SearchApiClient } from '@/lib/search-api'

// Mock fetch for testing
global.fetch = jest.fn()

const mockFetch = fetch as jest.MockedFunction<typeof fetch>

describe('SearchApiClient', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('searchRepositories', () => {
    const mockRepositories = [
      {
        id: 1,
        githubId: 123,
        name: 'awesome-react',
        fullName: 'facebook/awesome-react',
        description: 'A collection of awesome React resources',
        url: 'https://github.com/facebook/awesome-react',
        stars: 1000,
        forks: 200,
        language: 'JavaScript',
        topics: ['react', 'javascript'],
        tags: ['frontend'],
        owner: 'facebook',
        lastFetched: '2024-01-01T00:00:00Z',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }
    ]

    const mockResponse = {
      repos: mockRepositories,
      pagination: {
        page: 1,
        hasMore: true,
      }
    }

    it('should search repositories with default parameters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await SearchApiClient.searchRepositories({})

      expect(mockFetch).toHaveBeenCalledWith('/api/search?', expect.any(Object))
      expect(result).toEqual(mockResponse)
    })

    it('should search repositories with query parameter', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await SearchApiClient.searchRepositories({
        query: 'react'
      })

      expect(mockFetch).toHaveBeenCalledWith('/api/search?q=react', expect.any(Object))
      expect(result).toEqual(mockResponse)
    })

    it('should search repositories with category parameter', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await SearchApiClient.searchRepositories({
        query: 'awesome',
        category: 'javascript'
      })

      expect(mockFetch).toHaveBeenCalledWith('/api/search?q=awesome&category=javascript', expect.any(Object))
      expect(result).toEqual(mockResponse)
    })

    it('should search repositories with page parameter', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await SearchApiClient.searchRepositories({
        query: 'awesome',
        page: 2
      })

      expect(mockFetch).toHaveBeenCalledWith('/api/search?q=awesome&page=2', expect.any(Object))
      expect(result).toEqual(mockResponse)
    })

    it('should handle AbortSignal', async () => {
      const abortController = new AbortController()
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      await SearchApiClient.searchRepositories({
        query: 'test'
      }, abortController.signal)

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/search?q=test', 
        expect.objectContaining({
          signal: abortController.signal
        })
      )
    })

    it('should handle HTTP error responses', async () => {
      const errorResponse = {
        error: 'Search service unavailable'
      }

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 503,
        statusText: 'Service Unavailable',
        json: async () => errorResponse,
      } as Response)

      await expect(SearchApiClient.searchRepositories({
        query: 'test'
      })).rejects.toThrow('Search service unavailable')
    })

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(SearchApiClient.searchRepositories({
        query: 'test'
      })).rejects.toThrow('Network error')
    })

    it('should handle malformed JSON responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => {
          throw new Error('Invalid JSON')
        },
      } as Response)

      await expect(SearchApiClient.searchRepositories({
        query: 'test'
      })).rejects.toThrow('HTTP 500: Internal Server Error')
    })

    it('should not include category parameter when value is "all"', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      await SearchApiClient.searchRepositories({
        query: 'awesome',
        category: 'all'
      })

      expect(mockFetch).toHaveBeenCalledWith('/api/search?q=awesome', expect.any(Object))
    })
  })
})