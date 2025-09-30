import { Octokit } from '@octokit/rest'

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  stargazers_count: number
  forks_count: number
  language: string | null
  topics: string[]
  created_at: string
  updated_at: string
  owner: {
    login: string
    avatar_url: string
  }
}

export class GitHubService {
  static async searchAwesomeRepos(query: string = 'awesome', page: number = 1): Promise<GitHubRepo[]> {
    try {
      const response = await octokit.rest.search.repos({
        q: `${query} in:name OR ${query} in:description`,
        sort: 'stars',
        order: 'desc',
        per_page: 50,
        page,
      })
      
      return response.data.items as GitHubRepo[]
    } catch (error) {
      console.error('Error searching GitHub repos:', error)
      return []
    }
  }

  static async getRepoDetails(owner: string, repo: string): Promise<GitHubRepo | null> {
    try {
      const response = await octokit.rest.repos.get({
        owner,
        repo,
      })
      
      return response.data as GitHubRepo
    } catch (error) {
      console.error('Error fetching repo details:', error)
      return null
    }
  }

  static async searchAwesomeReposByTopic(topic: string): Promise<GitHubRepo[]> {
    try {
      const response = await octokit.rest.search.repos({
        q: `topic:${topic} awesome in:name OR awesome in:description`,
        sort: 'stars',
        order: 'desc',
        per_page: 30,
      })
      
      return response.data.items as GitHubRepo[]
    } catch (error) {
      console.error('Error searching repos by topic:', error)
      return []
    }
  }

  static async getTrendingAwesomeRepos(): Promise<GitHubRepo[]> {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    const dateString = oneWeekAgo.toISOString().split('T')[0]
    
    try {
      const response = await octokit.rest.search.repos({
        q: `awesome in:name created:>${dateString}`,
        sort: 'stars',
        order: 'desc',
        per_page: 20,
      })
      
      return response.data.items as GitHubRepo[]
    } catch (error) {
      console.error('Error fetching trending repos:', error)
      return []
    }
  }
}

export { octokit }