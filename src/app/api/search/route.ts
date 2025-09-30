import { NextResponse } from 'next/server'
import { GitHubService } from '@/lib/github'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || 'awesome'
  const page = parseInt(searchParams.get('page') || '1')
  const category = searchParams.get('category')

  try {
    // First try to get from database
    let repos = await prisma.awesomeRepo.findMany({
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

    // If no results in database, fetch from GitHub
    if (repos.length === 0) {
      const githubRepos = await GitHubService.searchAwesomeRepos(query, page)
      
      // Store in database for future use
      for (const repo of githubRepos) {
        try {
          await prisma.awesomeRepo.upsert({
            where: { githubId: repo.id },
            update: {
              stars: repo.stargazers_count,
              forks: repo.forks_count,
              description: repo.description,
              lastFetched: new Date(),
            },
            create: {
              githubId: repo.id,
              name: repo.name,
              fullName: repo.full_name,
              description: repo.description,
              url: repo.html_url,
              stars: repo.stargazers_count,
              forks: repo.forks_count,
              language: repo.language,
              topics: JSON.stringify(repo.topics),
              owner: repo.owner.login,
            },
          })
        } catch (error) {
          console.error('Error storing repo:', error)
        }
      }

      // Fetch updated results from database
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
    }

    return NextResponse.json({
      repos: repos.map(repo => ({
        ...repo,
        topics: repo.topics ? JSON.parse(repo.topics) : [],
        tags: repo.tags ? JSON.parse(repo.tags) : [],
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