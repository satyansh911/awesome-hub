import Link from "next/link";
import { GitHubRepo } from "@/lib/github";
import { BookOpen, Star,GitFork } from 'lucide-react';

interface Props {
  repo: GitHubRepo;
}

export default function RepoSidebarAbout({ repo }: Props) {

  return (
    <div className="bg-gray-900 rounded-xl p-4 space-y-4 border border-gray-700 text-white">
      <h2 className="text-xl font-semibold mb-3">About</h2>

      {/* Description */}
      {repo.description && (
        <p className="text-gray-300 text-base flex items-start gap-2">
          <span>{repo.description}</span>
        </p>
      )}

      <div className="flex flex-wrap gap-2 mt-3">
        {repo.topics?.map((topic) => (
          <span
            key={topic}
            className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-xs font-medium hover:bg-gray-600 transition-colors"
          >
            {topic}
          </span>
        ))}
      </div>

      <hr className="border-gray-700 my-4" />

      {/* Info Links and Stats (Matching the style) */}
      <div className="space-y-3 text-sm">
        {/* Readme Link */}
        <div className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
          <BookOpen className="w-4 h-4 text-gray-400" />
          <Link href={`https://github.com/${repo.owner.login}/${repo.name}?tab=readme-ov-file#readme`} className="hover:underline">Readme</Link>
        </div>

        <hr className="border-gray-700 my-4" />

        {/* Stars */}
        <div className="flex items-center gap-2 text-gray-300">
          <Star className="w-4 h-4 text-gray-400" />
          <span className="text-white font-medium">{repo.stargazers_count.toLocaleString()} stars</span>
        </div>

        {/* Forks */}
        <div className="flex items-center gap-2 text-gray-300">
          <GitFork className="w-4 h-4 text-gray-400" />
          <span className="text-white font-medium">{repo.forks_count.toLocaleString()} forks</span>
        </div>

      </div>
    </div>
  );
}