import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const repos = await prisma.awesomeRepo.findMany({
      include: {
        category: true,
      },
      orderBy: { stars: 'desc' },
      take: 6, // Get top 6 repositories for featured section
    })

    return NextResponse.json(repos.map(repo => ({
      githubId: repo.githubId,
      name: repo.name,
      fullName: repo.fullName,
      description: repo.description,
      stars: repo.stars,
      forks: repo.forks,
      language: repo.language,
      url: repo.url,
      updatedAt: repo.updatedAt,
      topics: repo.topics,
    })))
  } catch (error) {
    console.error('Featured repos error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch featured repositories' },
      { status: 500 }
    )
  }
}