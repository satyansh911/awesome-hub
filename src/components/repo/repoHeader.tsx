import { GitHubRepo } from "@/lib/github";
import Image from "next/image";
import { Heart,  GitFork, Star, } from "lucide-react"; 
import Link from "next/link";

interface Props {
  repo: GitHubRepo;
}

export default function RepoActionBar({ repo }: Props) {
  const formatCount = (count: number) => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'k';
    }
    return count.toLocaleString();
  };
  return (
    <div className=" py-3 px-6 flex items-center justify-between  rounded-xl  bg-gray-900 my-6">
      
      <div className="flex items-center gap-2">
        <Image
          src={repo.owner.avatar_url}
          alt={repo.owner.login}
          width={48}
          height={48}
          className="rounded-full"
        />
        
        {/* Repo Name */}
        <h1 className="text-2xl font-semibold text-white">
          <Link href={repo.owner.html_url}  className="text-white hover:text-blue-400">
            {repo.owner.login}
          </Link>
          <span className="mx-1 text-white">/</span>
          <Link href={repo.html_url} className="hover:text-blue-400">
            {repo.name}
          </Link>
        </h1>
        
        {/* Public Badge */}
        <span className="text-xs font-medium text-gray-400 border border-gray-700 rounded-full px-2 py-0.5">
          Public
        </span>
      </div>

      {/* Right Side: Action Buttons and Stats */}
      <div className="flex items-center gap-2">
        
        {/* Sponsor Button */}
        <button className="flex items-center gap-1 bg-[#21262D] text-white px-3 py-1.5 rounded-lg border border-gray-700 hover:border-gray-500 transition-colors">
          <Heart className="w-4 h-4 text-pink-400" />
          <span className="text-sm font-medium">Sponsor</span>
        </button>

        {/* Fork Button Group */}
        <div className="flex rounded-lg overflow-hidden border border-gray-700">
          <button className="flex items-center gap-1 bg-[#21262D] text-white px-3 py-1.5 hover:bg-[#30363D] transition-colors">
            <GitFork className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium">Fork</span>
          </button>
          <button className="bg-[#21262D] text-white px-2 py-1.5 border-l border-gray-700 hover:bg-[#30363D] transition-colors">
            {formatCount(repo.forks_count)}
          </button>
         
        </div>

        {/* Star Button Group */}
        <div className="flex rounded-lg overflow-hidden border border-gray-700">
          <button className="flex items-center gap-1 bg-[#21262D] text-white px-3 py-1.5 hover:bg-[#30363D] transition-colors">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium">Star</span>
          </button>
          <button className="bg-[#21262D] text-white px-2 py-1.5 border-l border-gray-700 hover:bg-[#30363D] transition-colors">
            {formatCount(repo.stargazers_count)}
          </button>
         
        </div>

      </div>
    </div>
  );
}