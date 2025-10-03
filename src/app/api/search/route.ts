import { NextResponse } from 'next/server'
import { GitHubService } from '@/lib/github'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || 'awesome'
  const page = parseInt(searchParams.get('page') || '1')
  const category = searchParams.get('category')

  let repos: any[] = []
  let usedDatabase = false

  try {
    // Try to get from database first (if available)
    try {
      repos = await prisma.awesomeRepo.findMany({
        where: {
          OR: [
            { name: { contains: query } },
            { description: { contains: query } },
          ],
          ...(category && category !== 'all' ? { category } : {}),
        },
        orderBy: { stars: 'desc' },
        take: 20,
        skip: (page - 1) * 20,
      })
      usedDatabase = true
      console.log(`Found ${repos.length} repos in database`)
    } catch (dbError) {
      console.log('Database not available, falling back to GitHub API:', dbError instanceof Error ? dbError.message : 'Unknown error')
      repos = []
    }

    // If no results in database or database unavailable, fetch from GitHub
    if (repos.length === 0) {
      console.log('Fetching from GitHub API...')
      try {
        const githubRepos = await GitHubService.searchAwesomeRepos(query, page)
        
        // Transform GitHub repos to match our interface
        repos = githubRepos.map(repo => ({
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
          tags: [],
          owner: repo.owner.login,
          category: null,
          lastFetched: new Date().toISOString(),
          createdAt: repo.created_at,
          updatedAt: repo.updated_at,
        }))

        // Try to store in database for future use (if database is available)
        if (usedDatabase) {
          for (const githubRepo of githubRepos) {
            try {
              await prisma.awesomeRepo.upsert({
                where: { githubId: githubRepo.id },
                update: {
                  stars: githubRepo.stargazers_count,
                  forks: githubRepo.forks_count,
                  description: githubRepo.description,
                  lastFetched: new Date(),
                },
                create: {
                  githubId: githubRepo.id,
                  name: githubRepo.name,
                  fullName: githubRepo.full_name,
                  description: githubRepo.description,
                  url: githubRepo.html_url,
                  stars: githubRepo.stargazers_count,
                  forks: githubRepo.forks_count,
                  language: githubRepo.language,
                  topics: githubRepo.topics || [],
                  owner: githubRepo.owner.login,
                },
              })
            } catch (error) {
              console.error('Error storing repo:', error)
            }
          }
        }
      } catch (githubError) {
        console.error('GitHub API failed:', githubError instanceof Error ? githubError.message : 'Unknown error')
        // Return empty results when both database and GitHub fail
        repos = []
      }
    }

    return NextResponse.json({
      repos: repos.map(repo => ({
        ...repo,
        topics: repo.topics || [],
        tags: repo.tags || [],
      })),
      pagination: {
        page,
        hasMore: repos.length === 20,
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