import RepoActionBar from "@/components/repo/repoHeader"
import RepoContributors from "@/components/repo/repoContributor"
import RelatedRepos from "@/components/repo/RealtedRepo"
import { GitHubService } from "@/lib/github"
import RepoReadme from "@/components/repo/repoReadme"
import RepoSidebarAbout from "@/components/repo/repoSidebar"
import { markdownToHtml } from "@/lib/markup"
import { Header } from "@/components/header"


export default async function RepoDetailPage({ params }: { params: Promise<{ owner: string; name: string }> }) {
  const { owner, name } = await params

  const repo = await GitHubService.getRepoDetails(owner, name)
  const readme = await GitHubService.getRepoReadme(owner, name)
  const related = await GitHubService.getRelatedRepos(owner, name)

  const parsed = await markdownToHtml(readme!)


  if (!repo) {
    return <div className="p-6 text-red-500">Repo not found.</div>
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Header />
      <main className="p-6 mt-20 ">
        <RepoActionBar repo={repo} />


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="col-span-2 space-y-6">
            <RepoReadme readme={parsed!} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <RepoSidebarAbout repo={repo} />
            <RepoContributors owner={owner} name={name} />
            <RelatedRepos repos={related} />
          </div>
        </div>
      </main>

    </div>
  )
}


