

"use client"

import { useEffect, useState } from "react"
import { GitHubContributor, GitHubService } from "@/lib/github"
import Image from "next/image"

interface Props {
  owner: string
  name: string
}

export default function RepoContributors({ owner, name }: Props) {
  const [contributors, setContributors] = useState<GitHubContributor[]>([])
  const [loading, setLoading] = useState(false)
  const [totalCount, setTotalCount] = useState(0)

  
  const DISPLAY_TOTAL_COUNT = 606; 
  const MAX_AVATARS_DISPLAY = 14;

  useEffect(() => {
    const loadContributors = async () => {
      // Only load the first page initially if we haven't loaded anything
      if (contributors.length === 0) {
        setLoading(true)
        const initialData = await GitHubService.getRepoContributors(owner, name, 1, MAX_AVATARS_DISPLAY)
        setContributors(initialData)
        setLoading(false)
        
        setTotalCount(initialData.length); 
      }
    }
    loadContributors()
  }, [owner, name])


  const remainingContributors = DISPLAY_TOTAL_COUNT - contributors.length;

  return (
    <div className="bg-gray-900 rounded-xl p-4 space-y-4 border border-gray-700">
      
      <h2 className="text-xl font-semibold text-white flex items-baseline gap-2">
        Contributors
        <span className="text-lg text-gray-400 font-normal">
          {DISPLAY_TOTAL_COUNT.toLocaleString()}
        </span>
      </h2>
      
      <div className="flex flex-wrap gap-2">
        {contributors.slice(0, MAX_AVATARS_DISPLAY).map((c) => (
          <a
            key={c.login}
            href={c.html_url}
            target="_blank"
            title={c.login}
            className="block hover:opacity-80 transition-opacity"
          >
            <div className="relative w-8 h-8">
              <Image
                src={c.avatar_url}
                alt={c.login}
                fill
                className="rounded-full object-cover border-2 border-transparent hover:border-blue-500"
              />
            </div>
          </a>
        ))}
      </div>

      {DISPLAY_TOTAL_COUNT > contributors.length && (
        <div className="pt-2">
          <a
            href={`https://github.com/${owner}/${name}/graphs/contributors`} 
            target="_blank"
            className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
          >
            + {remainingContributors.toLocaleString()} contributors
          </a>
        </div>
      )}
      
    </div>
  )
}