/**
 * Integration test to verify the complete search flow
 * This test verifies that the search functionality works end-to-end
 */

import { GET } from '@/app/api/search/route'
import { NextRequest } from 'next/server'
import { SearchApiClient } from '@/lib/search-api'

// Mock the external dependencies
jest.mock('@/lib/github', () => ({
  GitHubService: {
    searchAwesomeRepos: jest.fn().mockResolvedValue([
      {
        id: 123456789,
        name: 'awesome-react',
        full_name: 'facebook/awesome-react',
        description: 'A collection of awesome React resources',
        html_url: 'https://github.com/facebook/awesome-react',
        stargazers_count: 1500,
        forks_count: 200,
        language: 'JavaScript',
        topics: ['react', 'javascript'],
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        owner: {
          login: 'facebook',
          avatar_url: 'https://avatars.githubusercontent.com/u/69631?v=4',
        },
      }
    ])
  }
}))

jest.mock('@/lib/prisma', () => ({
  prisma: {
    awesomeRepo: {
      findMany: jest.fn().mockResolvedValue([]),
      upsert: jest.fn().mockResolvedValue({
        id: 1,
        githubId: 123456789,
        name: 'awesome-react',
        fullName: 'facebook/awesome-react',
        description: 'A collection of awesome React resources',
        url: 'https://github.com/facebook/awesome-react',
        stars: 1500,
        forks: 200,
        language: 'JavaScript',
        topics: ['react', 'javascript'],
        tags: [],
        owner: 'facebook',
        category: null,
        lastFetched: new Date('2024-01-01'),
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      })
    }
  }
}))

describe('Search Integration Tests', () => {
  beforeEach(() => {
    // Mock fetch for SearchApiClient
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('API Route Integration', () => {
    it('should handle complete search flow from API route', async () => {
      const request = new NextRequest('http://localhost:3000/api/search?q=react&page=1')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty('repos')
      expect(data).toHaveProperty('pagination')
      expect(data.pagination).toHaveProperty('page', 1)
      expect(data.pagination).toHaveProperty('hasMore')
    })

    it('should handle search with category filter', async () => {
      const request = new NextRequest('http://localhost:3000/api/search?q=react&category=javascript&page=1')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.repos).toBeDefined()
      expect(data.pagination.page).toBe(1)
    })

    it('should handle pagination correctly', async () => {
      const request = new NextRequest('http://localhost:3000/api/search?q=react&page=2')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.pagination.page).toBe(2)
    })
  })

  describe('Search API Client Integration', () => {
    it('should make correct API calls with SearchApiClient', async () => {
      const mockResponse = {
        repos: [
          {
            id: 1,
            githubId: 123,
            name: 'awesome-react',
            fullName: 'facebook/awesome-react',
            description: 'A collection of awesome React resources',
            url: 'https://github.com/facebook/awesome-react',
            stars: 1500,
            forks: 200,
            language: 'JavaScript',
            topics: ['react', 'javascript'],
            tags: [],
            owner: 'facebook',
            lastFetched: '2024-01-01T00:00:00Z',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          }
        ],
        pagination: {
          page: 1,
          hasMore: false
        }
      }

      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await SearchApiClient.searchRepositories({
        query: 'react',
        category: 'javascript',
        page: 1
      })

      expect(fetch).toHaveBeenCalledWith(
        '/api/search?q=react&category=javascript&page=1',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        })
      )

      expect(result).toEqual(mockResponse)
    })

    it('should handle API errors correctly', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => Promise.resolve({ error: 'Search failed' })
      })

      await expect(
        SearchApiClient.searchRepositories({ query: 'react' })
      ).rejects.toThrow('Search failed')
    })

    it('should handle network errors', async () => {
      ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

      await expect(
        SearchApiClient.searchRepositories({ query: 'react' })
      ).rejects.toThrow('Network error')
    })

    it('should support request cancellation', async () => {
      const controller = new AbortController()
      
      ;(global.fetch as jest.Mock).mockImplementation(() => {
        return new Promise((_, reject) => {
          controller.signal.addEventListener('abort', () => {
            reject(new Error('AbortError'))
          })
        })
      })

      const searchPromise = SearchApiClient.searchRepositories(
        { query: 'react' },
        controller.signal
      )

      controller.abort()

      await expect(searchPromise).rejects.toThrow('AbortError')
    })
  })

  describe('Complete Search Functionality', () => {
    it('should demonstrate complete search workflow', async () => {
      // 1. Setup mock API response
      const mockApiResponse = {
        repos: [
          {
            id: 1,
            githubId: 123456789,
            name: 'awesome-react',
            fullName: 'facebook/awesome-react',
            description: 'A collection of awesome React resources',
            url: 'https://github.com/facebook/awesome-react',
            stars: 1500,
            forks: 200,
            language: 'JavaScript',
            topics: ['react', 'javascript'],
            tags: [],
            owner: 'facebook',
            lastFetched: '2024-01-01T00:00:00Z',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          }
        ],
        pagination: {
          page: 1,
          hasMore: true
        }
      }

      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockApiResponse)
      })

      // 2. Test search with various parameters
      const searchParams = [
        { query: 'react' },
        { query: 'react', category: 'javascript' },
        { query: 'react', page: 1 },
        { query: 'react', category: 'javascript', page: 2 }
      ]

      for (const params of searchParams) {
        const result = await SearchApiClient.searchRepositories(params)
        
        expect(result).toHaveProperty('repos')
        expect(result).toHaveProperty('pagination')
        expect(result.repos).toBeInstanceOf(Array)
        expect(result.pagination).toHaveProperty('page')
        expect(result.pagination).toHaveProperty('hasMore')
        
        if (result.repos.length > 0) {
          const repo = result.repos[0]
          expect(repo).toHaveProperty('name')
          expect(repo).toHaveProperty('description')
          expect(repo).toHaveProperty('url')
          expect(repo).toHaveProperty('stars')
          expect(repo).toHaveProperty('forks')
          expect(repo).toHaveProperty('language')
          expect(repo).toHaveProperty('topics')
          expect(repo.topics).toBeInstanceOf(Array)
        }
      }
    })
  })
})