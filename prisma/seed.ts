import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create categories
  const categories = [
    {
      name: 'JavaScript',
      slug: 'javascript',
      description: 'JavaScript libraries, frameworks, and tools',
      color: '#f7df1e',
      icon: '⚡'
    },
    {
      name: 'Python',
      slug: 'python',
      description: 'Python frameworks, libraries, and resources',
      color: '#3776ab',
      icon: '🐍'
    },
    {
      name: 'React',
      slug: 'react',
      description: 'React ecosystem and related tools',
      color: '#61dafb',
      icon: '⚛️'
    },
    {
      name: 'Machine Learning',
      slug: 'machine-learning',
      description: 'AI/ML frameworks and resources',
      color: '#ff6b6b',
      icon: '🤖'
    },
    {
      name: 'DevOps',
      slug: 'devops',
      description: 'DevOps tools and practices',
      color: '#4ecdc4',
      icon: '🚀'
    }
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    })
  }

  // Create awesome repositories
  const awesomeRepos = [
    {
      githubId: 11691151,
      name: 'awesome-react',
      fullName: 'enaqx/awesome-react',
      description: 'A collection of awesome things regarding React ecosystem',
      url: 'https://github.com/enaqx/awesome-react',
      stars: 63547,
      forks: 7201,
      language: 'JavaScript',
      topics: ['react', 'javascript', 'frontend', 'library', 'awesome'],
      tags: ['frontend', 'ui', 'components'],
      category: 'React',
      owner: 'enaqx',
      isAwesome: true
    },
    {
      githubId: 21289110,
      name: 'awesome-python',
      fullName: 'vinta/awesome-python',
      description: 'A curated list of awesome Python frameworks, libraries, software and resources',
      url: 'https://github.com/vinta/awesome-python',
      stars: 218234,
      forks: 24785,
      language: 'Python',
      topics: ['python', 'awesome', 'list', 'resources', 'framework'],
      tags: ['backend', 'data-science', 'web'],
      category: 'Python',
      owner: 'vinta',
      isAwesome: true
    },
    {
      githubId: 43716886,
      name: 'awesome-go',
      fullName: 'avelino/awesome-go',
      description: 'A curated list of awesome Go frameworks, libraries and software',
      url: 'https://github.com/avelino/awesome-go',
      stars: 130145,
      forks: 11800,
      language: 'Go',
      topics: ['go', 'golang', 'awesome', 'list', 'framework'],
      tags: ['backend', 'performance', 'microservices'],
      category: 'Go',
      owner: 'avelino',
      isAwesome: true
    },
    {
      githubId: 54292999,
      name: 'awesome-vue',
      fullName: 'vuejs/awesome-vue',
      description: 'A curated list of awesome things related to Vue.js',
      url: 'https://github.com/vuejs/awesome-vue',
      stars: 72089,
      forks: 10234,
      language: 'JavaScript',
      topics: ['vue', 'vuejs', 'javascript', 'frontend', 'awesome'],
      tags: ['frontend', 'spa', 'component'],
      category: 'JavaScript',
      owner: 'vuejs',
      isAwesome: true
    },
    {
      githubId: 15118074,
      name: 'awesome-machine-learning',
      fullName: 'josephmisiti/awesome-machine-learning',
      description: 'A curated list of awesome Machine Learning frameworks, libraries and software',
      url: 'https://github.com/josephmisiti/awesome-machine-learning',
      stars: 65432,
      forks: 14321,
      language: 'Python',
      topics: ['machine-learning', 'ai', 'data-science', 'python', 'awesome'],
      tags: ['ai', 'ml', 'data-science', 'algorithms'],
      category: 'Machine Learning',
      owner: 'josephmisiti',
      isAwesome: true
    },
    {
      githubId: 64928294,
      name: 'awesome-css',
      fullName: 'awesome-css-group/awesome-css',
      description: 'A curated list of awesome frameworks, style guides, and other cool nuggets for CSS',
      url: 'https://github.com/awesome-css-group/awesome-css',
      stars: 17543,
      forks: 1234,
      language: 'CSS',
      topics: ['css', 'frontend', 'styling', 'web-development', 'awesome'],
      tags: ['frontend', 'styling', 'design'],
      category: 'CSS',
      owner: 'awesome-css-group',
      isAwesome: true
    }
  ]

  for (const repo of awesomeRepos) {
    await prisma.awesomeRepo.upsert({
      where: { githubId: repo.githubId },
      update: {
        stars: repo.stars,
        forks: repo.forks,
        description: repo.description,
        lastFetched: new Date(),
      },
      create: repo,
    })
  }

  console.log('Database seeded successfully!')
  console.log(`Created ${categories.length} categories`)
  console.log(`Created ${awesomeRepos.length} awesome repositories`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })