import { SearchSection } from '@/components/search-section'
import { HeroSection } from '@/components/hero-section'
import { FeaturedRepos } from '@/components/featured-repos'
import { StatsSection } from '@/components/stats-section'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <main className="container mx-auto px-4 py-8">
        <HeroSection />
        <SearchSection />
        <StatsSection />
        <FeaturedRepos />
      </main>
    </div>
  )
}
