import { NextResponse } from 'next/server'
import { GitHubService, SearchFilters } from '@/lib/github'
import { cacheFirst } from '@/lib/cache'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || 'awesome'
  const page = parseInt(searchParams.get('page') || '1')
  const language = searchParams.get('language')
  const topic = searchParams.get('topic')
  const sort = searchParams.get('sort') as 'stars' | 'forks' | 'updated' | null
  const minStars = searchParams.get('minStars')
  const category = searchParams.get('category')

  // Validate page parameter
  if (page < 1 || page > 100) {
    return NextResponse.json(
      { error: 'Page must be between 1 and 100' },
      { status: 400 }
    )
  }

  try {
    // Build cache key from search parameters
    const cacheKey = `search-${JSON.stringify({
      query, page, language, topic, sort, minStars, category
    })}`

    // Cache search results for 15 minutes
    const repos = await cacheFirst(
      cacheKey,
      async () => {
        const filters: SearchFilters = {
          query,
          ...(language && { language }),
          ...(topic && { topic }),
          ...(sort && { sort }),
          ...(minStars && { minStars: parseInt(minStars) })
        }

        // Handle category mapping to topic for now
        if (category && category !== 'all') {
          const categoryTopicMap: Record<string, string> = {
            'javascript': 'javascript',
            'python': 'python',
            'react': 'react',
            'machine-learning': 'machine-learning',
            'security': 'security',
            'devops': 'devops',
            'css': 'css',
            'go': 'go',
            'rust': 'rust'
          }
          
          if (categoryTopicMap[category]) {
            filters.topic = categoryTopicMap[category]
          }
        }

        return await GitHubService.searchAwesomeRepos(filters, page)
      },
      15 // 15 minutes cache for search results
    )

    // Transform GitHub repos to match expected interface
    const transformedRepos = repos.map(repo => ({
      id: repo.id,
      githubId: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      url: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      topics: repo.topics || [],
      tags: [], // GitHub doesn't have tags, using empty array
      owner: repo.owner.login,
      lastFetched: new Date().toISOString(),
      createdAt: repo.created_at,
      updatedAt: repo.updated_at
    }))

    return NextResponse.json({
      repos: transformedRepos,
      pagination: {
        page,
        hasMore: repos.length === 50, // GitHub returns 50 per page
      },
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Failed to search repositories' },
      { status: 500 }
    )
  }
}