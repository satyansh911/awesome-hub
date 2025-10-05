import { SearchSection } from "../components/search-section"
import { HeroSection } from "../components/hero-section"
import { FeaturedRepos } from "../components/featured-repos"
import { StatsSection } from "../components/stats-section"
import { Header } from "../components/header"
import { RepoListInfinite } from "../components/repo-list-infinite"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Add top padding to account for fixed header */}
      <main className="pt-16">
        <HeroSection />
        <SearchSection />
        <div className="container mx-auto px-4 lg:px-6">
          <FeaturedRepos />
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-8 text-gradient">Explore All Repositories</h2>
            <RepoListInfinite />
          </div>
        </div>
        <StatsSection />
        {/* Footer spacer */}
        <div className="h-20" />
      </main>
    </div>
  )
}