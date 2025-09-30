import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const stats = await prisma.$transaction([
      prisma.awesomeRepo.count(),
      prisma.awesomeRepo.aggregate({
        _sum: {
          stars: true,
          forks: true,
        },
      }),
      prisma.category.count(),
    ])

    const [repoCount, aggregates, categoryCount] = stats

    return NextResponse.json({
      repositories: repoCount,
      totalStars: aggregates._sum.stars || 0,
      totalForks: aggregates._sum.forks || 0,
      categories: categoryCount,
      // Mock additional stats
      contributors: Math.floor(repoCount * 7.2), // Estimated
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}