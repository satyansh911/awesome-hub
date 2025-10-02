import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || 'awesome'
  const page = parseInt(searchParams.get('page') || '1')
  const category = searchParams.get('category')

  try {
    // Search in database
    const repos = await prisma.awesomeRepo.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
        ],
        ...(category && category !== 'all' ? { 
          category: { 
            slug: category 
          } 
        } : {}),
      },
      include: {
        category: true,
      },
      orderBy: { stars: 'desc' },
      take: 20,
      skip: (page - 1) * 20,
    })

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