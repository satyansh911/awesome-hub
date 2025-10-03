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

  try {
    // Build cache key from search parameters
    const cacheKey = `search-${JSON.stringify({
      query, page, language, topic, sort, minStars
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

        return await GitHubService.searchAwesomeRepos(filters, page)
      },
      15 // 15 minutes cache for search results
    )

    return NextResponse.json({
      repos,
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