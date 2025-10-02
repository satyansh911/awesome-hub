import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create or update categories
  const categories = [
    { name: 'JavaScript', slug: 'javascript', description: 'JavaScript libraries, frameworks, and tools', color: '#f7df1e', icon: '⚡' },
    { name: 'Python', slug: 'python', description: 'Python frameworks, libraries, and resources', color: '#3776ab', icon: '🐍' },
    { name: 'React', slug: 'react', description: 'React ecosystem and related tools', color: '#61dafb', icon: '⚛️' },
    { name: 'Machine Learning', slug: 'machine-learning', description: 'AI/ML frameworks and resources', color: '#ff6b6b', icon: '🤖' },
    { name: 'DevOps', slug: 'devops', description: 'DevOps tools and practices', color: '#4ecdc4', icon: '🚀' },
    { name: 'Java', slug: 'java', description: 'Java frameworks, libraries, and resources', color: '#e86e00', icon: '☕' },
    { name: 'Rust', slug: 'rust', description: 'Rust programming language resources', color: '#dea584', icon: '🦀' },
    { name: 'Mobile', slug: 'mobile', description: 'Mobile development for iOS and Android', color: '#8c82fc', icon: '📱' },
    { name: 'Security', slug: 'security', description: 'Cybersecurity, tools, and resources', color: '#ff4757', icon: '🛡️' },
    { name: 'Design', slug: 'design', description: 'Design systems, UI/UX tools, and resources', color: '#f368e0', icon: '🎨' },
    { name: 'Data Science', slug: 'data-science', description: 'Data science libraries and tools', color: '#feca57', icon: '📊' },
    { name: 'Blockchain', slug: 'blockchain', description: 'Blockchain and cryptocurrency resources', color: '#f9ca24', icon: '⛓️' },
    { name: 'Resources', slug: 'resources', description: 'General developer resources and learning materials', color: '#a4b0be', icon: '📚' },
    // Add missing categories to prevent errors
    { name: 'Go', slug: 'go', description: 'Go programming language resources', color: '#00ADD8', icon: '🐹' },
    { name: 'CSS', slug: 'css', description: 'CSS frameworks and styling resources', color: '#563d7c', icon: '💅' },
    { name: 'C++', slug: 'c-plus-plus', description: 'C++ libraries and resources', color: '#f34b7d', icon: '🔧' },
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
      category: 'Go', // Note: 'Go' category is not in the list, will be created without extra info
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
      category: 'CSS', // Note: 'CSS' category is not in the list
      owner: 'awesome-css-group',
      isAwesome: true
    },
    // --- New Repos ---
    {
      githubId: 25186882,
      name: 'awesome-nodejs',
      fullName: 'sindresorhus/awesome-nodejs',
      description: 'Delightful Node.js packages and resources',
      url: 'https://github.com/sindresorhus/awesome-nodejs',
      stars: 56931,
      forks: 5645,
      language: null,
      topics: ['nodejs', 'javascript', 'awesome', 'list', 'resources'],
      tags: ['backend', 'javascript', 'server'],
      category: 'JavaScript',
      owner: 'sindresorhus',
      isAwesome: true
    },
    {
      githubId: 27193779,
      name: 'awesome-rust',
      fullName: 'rust-unofficial/awesome-rust',
      description: 'A curated list of Rust code and resources.',
      url: 'https://github.com/rust-unofficial/awesome-rust',
      stars: 44100,
      forks: 2596,
      language: 'Rust',
      topics: ['rust', 'awesome', 'list', 'resources', 'rustlang'],
      tags: ['backend', 'systems', 'performance'],
      category: 'Rust',
      owner: 'rust-unofficial',
      isAwesome: true
    },
    {
      githubId: 88536371,
      name: 'awesome-java',
      fullName: 'akullpp/awesome-java',
      description: 'A curated list of awesome frameworks, libraries and software for the Java programming language.',
      url: 'https://github.com/akullpp/awesome-java',
      stars: 41254,
      forks: 5932,
      language: 'Java',
      topics: ['java', 'awesome', 'list', 'framework', 'library'],
      tags: ['backend', 'enterprise', 'web'],
      category: 'Java',
      owner: 'akullpp',
      isAwesome: true
    },
    {
      githubId: 21995734,
      name: 'awesome-devops',
      fullName: 'bregman-arie/awesome-devops',
      description: 'A curated list of awesome DevOps tools, technologies, and resources',
      url: 'https://github.com/bregman-arie/awesome-devops',
      stars: 25487,
      forks: 3121,
      language: null,
      topics: ['devops', 'awesome', 'list', 'sre', 'automation'],
      tags: ['ci-cd', 'monitoring', 'infrastructure'],
      category: 'DevOps',
      owner: 'bregman-arie',
      isAwesome: true
    },
    {
      githubId: 26131233,
      name: 'awesome-security',
      fullName: 'sbilly/awesome-security',
      description: 'A collection of awesome software, libraries, documents, books, resources and cools stuffs about security.',
      url: 'https://github.com/sbilly/awesome-security',
      stars: 12245,
      forks: 2143,
      language: null,
      topics: ['security', 'cybersecurity', 'awesome', 'list', 'hacking'],
      tags: ['pentesting', 'forensics', 'privacy'],
      category: 'Security',
      owner: 'sbilly',
      isAwesome: true
    },
    {
      githubId: 46115236,
      name: 'awesome-design',
      fullName: 'gztchan/awesome-design',
      description: 'A curated list of awesome design resources.',
      url: 'https://github.com/gztchan/awesome-design',
      stars: 16432,
      forks: 1987,
      language: null,
      topics: ['design', 'ui', 'ux', 'awesome', 'resources'],
      tags: ['ui-kits', 'fonts', 'icons', 'inspiration'],
      category: 'Design',
      owner: 'gztchan',
      isAwesome: true
    },
    {
      githubId: 81628189,
      name: 'awesome-flutter',
      fullName: 'Solido/awesome-flutter',
      description: 'An awesome list that curates the best Flutter libraries, tools, tutorials, articles and more.',
      url: 'https://github.com/Solido/awesome-flutter',
      stars: 52103,
      forks: 6432,
      language: 'Dart',
      topics: ['flutter', 'dart', 'mobile', 'awesome', 'list'],
      tags: ['mobile', 'cross-platform', 'ui'],
      category: 'Mobile',
      owner: 'Solido',
      isAwesome: true
    },
    {
      githubId: 20436100,
      name: 'awesome-swift',
      fullName: 'matteocrippa/awesome-swift',
      description: 'A curated list of awesome Swift frameworks, libraries and software.',
      url: 'https://github.com/matteocrippa/awesome-swift',
      stars: 25231,
      forks: 3012,
      language: 'Swift',
      topics: ['swift', 'ios', 'macos', 'awesome', 'list'],
      tags: ['mobile', 'ios', 'apple'],
      category: 'Mobile',
      owner: 'matteocrippa',
      isAwesome: true
    },
    {
      githubId: 23625345,
      name: 'awesome-kotlin',
      fullName: 'KotlinBy/awesome-kotlin',
      description: 'A curated list of awesome Kotlin related stuff Inspired by awesome-java.',
      url: 'https://github.com/KotlinBy/awesome-kotlin',
      stars: 12054,
      forks: 1432,
      language: 'Kotlin',
      topics: ['kotlin', 'android', 'awesome', 'list', 'library'],
      tags: ['mobile', 'backend', 'android'],
      category: 'Mobile',
      owner: 'KotlinBy',
      isAwesome: true
    },
    {
      githubId: 30421935,
      name: 'awesome-datascience',
      fullName: 'academic/awesome-datascience',
      description: 'A curated list of awesome resources for data science, covering machine learning, data analysis, and more.',
      url: 'https://github.com/academic/awesome-datascience',
      stars: 24321,
      forks: 6543,
      language: null,
      topics: ['data-science', 'machine-learning', 'python', 'r', 'awesome'],
      tags: ['data-visualization', 'big-data', 'tutorials'],
      category: 'Data Science',
      owner: 'academic',
      isAwesome: true
    },
    {
      githubId: 100874942,
      name: 'awesome-blockchain-cn',
      fullName: 'chaozh/awesome-blockchain-cn',
      description: 'A curated list of awesome blockchain resources in Chinese.',
      url: 'https://github.com/chaozh/awesome-blockchain-cn',
      stars: 19876,
      forks: 5432,
      language: 'Go',
      topics: ['blockchain', 'ethereum', 'bitcoin', 'awesome', 'list'],
      tags: ['crypto', 'web3', 'solidity'],
      category: 'Blockchain',
      owner: 'chaozh',
      isAwesome: true
    },
    {
      githubId: 21737452,
      name: 'awesome',
      fullName: 'sindresorhus/awesome',
      description: 'Awesome lists about all kinds of interesting topics',
      url: 'https://github.com/sindresorhus/awesome',
      stars: 297000,
      forks: 26000,
      language: null,
      topics: ['awesome', 'lists', 'resources', 'curated', 'meta'],
      tags: ['meta', 'learning', 'inspiration'],
      category: 'Resources',
      owner: 'sindresorhus',
      isAwesome: true
    },
    {
      githubId: 62934079,
      name: 'coding-interview-university',
      fullName: 'jwasham/coding-interview-university',
      description: 'A complete computer science study plan to become a software engineer.',
      url: 'https://github.com/jwasham/coding-interview-university',
      stars: 293000,
      forks: 71000,
      language: null,
      topics: ['computer-science', 'interview-prep', 'algorithms', 'data-structures', 'education'],
      tags: ['learning', 'career', 'interview'],
      category: 'Resources',
      owner: 'jwasham',
      isAwesome: true
    },
    {
      githubId: 44963359,
      name: 'public-apis',
      fullName: 'public-apis/public-apis',
      description: 'A collective list of free APIs',
      url: 'https://github.com/public-apis/public-apis',
      stars: 291000,
      forks: 31000,
      language: 'Python',
      topics: ['api', 'public-apis', 'development', 'resources', 'free'],
      tags: ['api', 'data', 'tools'],
      category: 'Resources',
      owner: 'public-apis',
      isAwesome: true
    },
    {
      githubId: 84333213,
      name: 'developer-roadmap',
      fullName: 'kamranahmedse/developer-roadmap',
      description: 'Interactive roadmaps, guides and other educational content to help developers grow in their careers.',
      url: 'https://github.com/kamranahmedse/developer-roadmap',
      stars: 275000,
      forks: 38000,
      language: 'TypeScript',
      topics: ['roadmap', 'developer', 'career', 'education', 'learning'],
      tags: ['career', 'learning', 'guide'],
      category: 'Resources',
      owner: 'kamranahmedse',
      isAwesome: true
    },
    {
      githubId: 102559011,
      name: 'awesome-selfhosted',
      fullName: 'awesome-selfhosted/awesome-selfhosted',
      description: 'A list of Free Software network services and web applications which can be hosted on your own servers',
      url: 'https://github.com/awesome-selfhosted/awesome-selfhosted',
      stars: 178000,
      forks: 8800,
      language: 'JavaScript',
      topics: ['self-hosted', 'docker', 'homelab', 'awesome', 'list'],
      tags: ['devops', 'privacy', 'tools'],
      category: 'DevOps',
      owner: 'awesome-selfhosted',
      isAwesome: true
    },
    {
      githubId: 147587789,
      name: 'the-book-of-secret-knowledge',
      fullName: 'trimstray/the-book-of-secret-knowledge',
      description: 'A collection of inspiring lists, manuals, cheatsheets, blogs, hacks, one-liners, cli/web tools and more.',
      url: 'https://github.com/trimstray/the-book-of-secret-knowledge',
      stars: 129000,
      forks: 8200,
      language: null,
      topics: ['cheatsheets', 'hacking', 'devops', 'security', 'resources'],
      tags: ['sysadmin', 'pentesting', 'cli'],
      category: 'Security',
      owner: 'trimstray',
      isAwesome: true
    },
    {
      githubId: 104523360,
      name: 'system-design-primer',
      fullName: 'donnemartin/system-design-primer',
      description: 'Learn how to design large-scale systems. Prep for the system design interview. Includes Anki flashcards.',
      url: 'https://github.com/donnemartin/system-design-primer',
      stars: 254000,
      forks: 43000,
      language: 'Python',
      topics: ['system-design', 'interview-prep', 'architecture', 'scalability', 'design-patterns'],
      tags: ['architecture', 'interview', 'learning'],
      category: 'Resources',
      owner: 'donnemartin',
      isAwesome: true
    },
    {
      githubId: 30588478,
      name: 'awesome-cpp',
      fullName: 'fffaraz/awesome-cpp',
      description: 'A curated list of awesome C++ (or C) frameworks, libraries, resources, and shiny things.',
      url: 'https://github.com/fffaraz/awesome-cpp',
      stars: 55000,
      forks: 7500,
      language: 'C++',
      topics: ['cpp', 'c-plus-plus', 'library', 'framework', 'awesome'],
      tags: ['systems', 'performance', 'gamedev'],
      category: 'C++', // Note: 'C++' category is not in the list
      owner: 'fffaraz',
      isAwesome: true
    },
    {
      githubId: 23088748,
      name: 'awesome-android',
      fullName: 'JStumpp/awesome-android',
      description: 'A curated list of awesome Android libraries and resources.',
      url: 'https://github.com/JStumpp/awesome-android',
      stars: 10000,
      forks: 1600,
      language: 'Java',
      topics: ['android', 'java', 'kotlin', 'mobile', 'awesome'],
      tags: ['android', 'mobile', 'ui'],
      category: 'Mobile',
      owner: 'JStumpp',
      isAwesome: true
    },
    {
      githubId: 21289110,
      name: 'awesome-interview-questions',
      fullName: 'DopplerHQ/awesome-interview-questions',
      description: 'A curated list of awesome interview questions',
      url: 'https://github.com/DopplerHQ/awesome-interview-questions',
      stars: 65000,
      forks: 8500,
      language: null,
      topics: ['interview', 'questions', 'career', 'algorithms', 'awesome'],
      tags: ['interview', 'learning', 'career'],
      category: 'Resources',
      owner: 'DopplerHQ',
      isAwesome: true
    }
  ]

for (const repo of awesomeRepos) {
    const categoryRecord = await prisma.category.findUnique({
      where: { name: repo.category },
    });

    if (!categoryRecord) {
      console.warn(`⚠️ Category "${repo.category}" not found for repo "${repo.fullName}". Skipping this entry.`);
      continue;
    }

    const categoryId = categoryRecord.id;
    
    // This removes the string 'category' field before creation
    const { category, ...repoData } = repo;

    await prisma.awesomeRepo.upsert({
      where: { githubId: repo.githubId },
      update: {
        stars: repo.stars,
        forks: repo.forks,
        description: repo.description,
        topics: repo.topics,
        tags: repo.tags,
        lastFetched: new Date(),
        categoryId: categoryId,
      },
      create: {
        ...repoData,
        categoryId: categoryId,
      },
    })
  }

  console.log('Database seeded successfully!')
  console.log(`Created/updated ${categories.length} categories`)
  console.log(`Created/updated ${awesomeRepos.length} awesome repositories`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })