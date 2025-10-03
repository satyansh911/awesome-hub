import { GET } from '@/app/api/search/route'
import { NextRequest } from 'next/server'
import { GitHubService } from '@/lib/github'
import { prisma } from '@/lib/prisma'

// Mock dependencies
jest.mock('@/lib/github')
jest.mock('@/lib/prisma', () => ({
  prisma: {
    awesomeRepo: {
      findMany: jest.fn(),
      upsert: jest.fn(),
    },
  },
}))

const mockGitHubService = GitHubService as jest.Mocked<typeof GitHubService>
const mockPrisma = prisma as jest.Mocked<typeof prisma>

describe('/api/search', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const mockRepo = {
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
  }

  const mockGitHubRepo = {
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

  it('should return repositories from database when found', async () => {
    mockPrisma.awesomeRepo.findMany.mockResolvedValueOnce([mockRepo])

    const request = new NextRequest('http://localhost:3000/api/search?q=react')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.repos).toHaveLength(1)
    expect(data.repos[0]).toMatchObject({
      name: 'awesome-react',
      stars: 1500,
      topics: ['react', 'javascript'],
      tags: [],
    })
    expect(data.pagination).toEqual({
      page: 1,
      hasMore: false,
    })
  })

  it('should fetch from GitHub when no database results', async () => {
    // First call returns empty array (no database results)
    mockPrisma.awesomeRepo.findMany
      .mockResolvedValueOnce([])  // First query
      .mockResolvedValueOnce([mockRepo])  // Second query after GitHub fetch

    mockGitHubService.searchAwesomeRepos.mockResolvedValueOnce([mockGitHubRepo])
    mockPrisma.awesomeRepo.upsert.mockResolvedValue(mockRepo)

    const request = new NextRequest('http://localhost:3000/api/search?q=react')
    const response = await GET(request)
    const data = await response.json()

    expect(mockGitHubService.searchAwesomeRepos).toHaveBeenCalledWith('react', 1)
    expect(mockPrisma.awesomeRepo.upsert).toHaveBeenCalledWith({
      where: { githubId: mockGitHubRepo.id },
      update: {
        stars: mockGitHubRepo.stargazers_count,
        forks: mockGitHubRepo.forks_count,
        description: mockGitHubRepo.description,
        lastFetched: expect.any(Date),
      },
      create: {
        githubId: mockGitHubRepo.id,
        name: mockGitHubRepo.name,
        fullName: mockGitHubRepo.full_name,
        description: mockGitHubRepo.description,
        url: mockGitHubRepo.html_url,
        stars: mockGitHubRepo.stargazers_count,
        forks: mockGitHubRepo.forks_count,
        language: mockGitHubRepo.language,
        topics: mockGitHubRepo.topics,
        owner: mockGitHubRepo.owner.login,
      },
    })

    expect(response.status).toBe(200)
    expect(data.repos).toHaveLength(1)
  })

  it('should handle query parameter correctly', async () => {
    mockPrisma.awesomeRepo.findMany.mockResolvedValueOnce([mockRepo])

    const request = new NextRequest('http://localhost:3000/api/search?q=vue')
    await GET(request)

    expect(mockPrisma.awesomeRepo.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: [
            { name: { contains: 'vue' } },
            { description: { contains: 'vue' } },
          ],
        },
      })
    )
  })

  it('should handle category parameter correctly', async () => {
    mockPrisma.awesomeRepo.findMany.mockResolvedValueOnce([mockRepo])

    const request = new NextRequest('http://localhost:3000/api/search?q=react&category=javascript')
    await GET(request)

    expect(mockPrisma.awesomeRepo.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: [
            { name: { contains: 'react' } },
            { description: { contains: 'react' } },
          ],
          category: 'javascript',
        },
      })
    )
  })

  it('should handle page parameter correctly', async () => {
    mockPrisma.awesomeRepo.findMany.mockResolvedValueOnce(Array(20).fill(mockRepo))

    const request = new NextRequest('http://localhost:3000/api/search?q=react&page=2')
    const response = await GET(request)
    const data = await response.json()

    expect(mockPrisma.awesomeRepo.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 20, // (page - 1) * 20
        take: 20,
      })
    )

    expect(data.pagination.page).toBe(2)
  })

  it('should indicate hasMore when result count equals limit', async () => {
    const twentyRepos = Array(20).fill(mockRepo)
    mockPrisma.awesomeRepo.findMany.mockResolvedValueOnce(twentyRepos)

    const request = new NextRequest('http://localhost:3000/api/search?q=react')
    const response = await GET(request)
    const data = await response.json()

    expect(data.pagination.hasMore).toBe(true)
  })

  it('should indicate no more when result count is less than limit', async () => {
    const fewRepos = Array(5).fill(mockRepo)
    mockPrisma.awesomeRepo.findMany.mockResolvedValueOnce(fewRepos)

    const request = new NextRequest('http://localhost:3000/api/search?q=react')
    const response = await GET(request)
    const data = await response.json()

    expect(data.pagination.hasMore).toBe(false)
  })

  it('should default to "awesome" query when no query provided', async () => {
    mockPrisma.awesomeRepo.findMany.mockResolvedValueOnce([mockRepo])

    const request = new NextRequest('http://localhost:3000/api/search')
    await GET(request)

    expect(mockPrisma.awesomeRepo.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: [
            { name: { contains: 'awesome' } },
            { description: { contains: 'awesome' } },
          ],
        },
      })
    )
  })

  it('should handle database errors gracefully', async () => {
    mockPrisma.awesomeRepo.findMany.mockRejectedValueOnce(new Error('Database connection failed'))

    const request = new NextRequest('http://localhost:3000/api/search?q=react')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Failed to search repositories')
  })

  it('should handle GitHub API errors gracefully', async () => {
    mockPrisma.awesomeRepo.findMany
      .mockResolvedValueOnce([])  // Empty database results
      .mockResolvedValueOnce([])  // Still empty after GitHub fetch fails

    mockGitHubService.searchAwesomeRepos.mockRejectedValueOnce(new Error('GitHub API rate limit'))

    const request = new NextRequest('http://localhost:3000/api/search?q=react')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.repos).toHaveLength(0)
  })

  it('should handle upsert errors during GitHub data storage', async () => {
    mockPrisma.awesomeRepo.findMany
      .mockResolvedValueOnce([])  // Empty database results
      .mockResolvedValueOnce([])  // Still empty after GitHub fetch

    mockGitHubService.searchAwesomeRepos.mockResolvedValueOnce([mockGitHubRepo])
    mockPrisma.awesomeRepo.upsert.mockRejectedValueOnce(new Error('Unique constraint violation'))

    const request = new NextRequest('http://localhost:3000/api/search?q=react')
    const response = await GET(request)

    // Should still continue and return results even if upsert fails
    expect(response.status).toBe(200)
  })

  it('should not filter by category when category is "all"', async () => {
    mockPrisma.awesomeRepo.findMany.mockResolvedValueOnce([mockRepo])

    const request = new NextRequest('http://localhost:3000/api/search?q=react&category=all')
    await GET(request)

    expect(mockPrisma.awesomeRepo.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: [
            { name: { contains: 'react' } },
            { description: { contains: 'react' } },
          ],
          // Should not include category filter
        },
      })
    )
  })

  it('should ensure topics and tags are arrays in response', async () => {
    const repoWithNullTopics = { ...mockRepo, topics: null, tags: null }
    mockPrisma.awesomeRepo.findMany.mockResolvedValueOnce([repoWithNullTopics])

    const request = new NextRequest('http://localhost:3000/api/search?q=react')
    const response = await GET(request)
    const data = await response.json()

    expect(data.repos[0].topics).toEqual([])
    expect(data.repos[0].tags).toEqual([])
  })
})