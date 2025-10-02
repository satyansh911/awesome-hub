'use client';

import { useState, useEffect } from 'react';
import { Star, GitFork, ExternalLink, Calendar } from 'lucide-react';
import { useBookmarks } from '@/hooks/useBookmarks';
import { Skeleton } from './skeleton';

export interface Repository {
  id: number;
  name: string;
  fullName: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  url: string;
  updatedAt: string;
  topics: string[];
}

export function FeaturedRepos() {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const { bookmarks, addBookmark, removeBookmark } = useBookmarks();
  const isBookmarked = (id: number) => bookmarks.some((b) => b.id === id);
  console.log(isBookmarked, 'hhh');

  useEffect(() => {
    // Mock data for now
    const mockRepos: Repository[] = [
      {
        id: 1,
        name: 'awesome-react',
        fullName: 'enaqx/awesome-react',
        description: 'A collection of awesome things regarding React ecosystem',
        stars: 63000,
        forks: 7200,
        language: 'JavaScript',
        url: 'https://github.com/enaqx/awesome-react',
        updatedAt: '2024-10-01',
        topics: ['react', 'javascript', 'frontend', 'library'],
      },
      {
        id: 2,
        name: 'awesome-python',
        fullName: 'vinta/awesome-python',
        description:
          'A curated list of awesome Python frameworks, libraries, software and resources',
        stars: 216000,
        forks: 25000,
        language: 'Python',
        url: 'https://github.com/vinta/awesome-python',
        updatedAt: '2024-09-28',
        topics: ['python', 'awesome', 'list', 'resources'],
      },
      {
        id: 3,
        name: 'awesome-go',
        fullName: 'avelino/awesome-go',
        description:
          'A curated list of awesome Go frameworks, libraries and software',
        stars: 130000,
        forks: 11800,
        language: 'Go',
        url: 'https://github.com/avelino/awesome-go',
        updatedAt: '2024-09-30',
        topics: ['go', 'golang', 'awesome', 'list'],
      },
      {
        id: 4,
        name: 'awesome-vue',
        fullName: 'vuejs/awesome-vue',
        description: 'A curated list of awesome things related to Vue.js',
        stars: 72000,
        forks: 10200,
        language: 'JavaScript',
        url: 'https://github.com/vuejs/awesome-vue',
        updatedAt: '2024-09-29',
        topics: ['vue', 'vuejs', 'javascript', 'frontend'],
      },
      {
        id: 5,
        name: 'awesome-machine-learning',
        fullName: 'josephmisiti/awesome-machine-learning',
        description:
          'A curated list of awesome Machine Learning frameworks, libraries and software',
        stars: 65000,
        forks: 14300,
        language: 'Python',
        url: 'https://github.com/josephmisiti/awesome-machine-learning',
        updatedAt: '2024-09-25',
        topics: ['machine-learning', 'ai', 'data-science', 'python'],
      },
      {
        id: 6,
        name: 'awesome-css',
        fullName: 'awesome-css-group/awesome-css',
        description:
          'A curated list of awesome frameworks, style guides, and other cool nuggets for CSS',
        stars: 17000,
        forks: 1200,
        language: 'CSS',
        url: 'https://github.com/awesome-css-group/awesome-css',
        updatedAt: '2024-09-20',
        topics: ['css', 'frontend', 'styling', 'web-development'],
      },
    ];

    setTimeout(() => {
      setRepos(mockRepos);
      setLoading(false);
    }, 1000);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <section className='mb-16'>
        <h2 className='text-3xl font-bold text-center mb-8'>
          Featured Repositories
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className='bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg'
            >
              <Skeleton className='h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4' />
              <Skeleton className='h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2' />
              <Skeleton className='h-3 bg-gray-200 dark:bg-gray-700 rounded mb-4' />
              <Skeleton className='flex justify-between'>
                <Skeleton className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-16' />
                <Skeleton className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-16' />
              </Skeleton>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className='mb-16'>
      <h2 className='text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white'>
        Featured Repositories
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {repos.map((repo) => (
          <div
            key={repo.id}
            className='bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200'
          >
            <div className='flex items-start justify-between mb-4'>
              <div className='flex-1'>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-1'>
                  {repo.name}
                </h3>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  {repo.fullName}
                </p>
              </div>
              <button
                aria-label={
                  isBookmarked(repo.id) ? 'Remove bookmark' : 'Add bookmark'
                }
                onClick={() =>
                  isBookmarked(repo.id)
                    ? removeBookmark(repo.id)
                    : addBookmark(repo)
                }
              >
                <Star
                  size={20}
                  className={`ml-2 mt-1 transition-colors ${
                    isBookmarked(repo.id)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-400'
                  }`}
                />
              </button>

              <a
                href={repo.url}
                target='_blank'
                rel='noopener noreferrer'
                className='p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'
              >
                <ExternalLink className='w-4 h-4' />
              </a>
            </div>

            <p className='text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2'>
              {repo.description}
            </p>

            <div className='flex flex-wrap gap-1 mb-4'>
              {repo.topics.slice(0, 3).map((topic) => (
                <span
                  key={topic}
                  className='px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full'
                >
                  {topic}
                </span>
              ))}
              {repo.topics.length > 3 && (
                <span className='px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full'>
                  +{repo.topics.length - 3}
                </span>
              )}
            </div>

            <div className='flex items-center justify-between text-sm text-gray-600 dark:text-gray-400'>
              <div className='flex items-center gap-4'>
                <div className='flex items-center gap-1'>
                  <Star className='w-4 h-4' />
                  <span>{formatNumber(repo.stars)}</span>
                </div>
                <div className='flex items-center gap-1'>
                  <GitFork className='w-4 h-4' />
                  <span>{formatNumber(repo.forks)}</span>
                </div>
              </div>
              <div className='flex items-center gap-1'>
                <Calendar className='w-4 h-4' />
                <span>{formatDate(repo.updatedAt)}</span>
              </div>
            </div>

            {repo.language && (
              <div className='mt-3 pt-3 border-t border-gray-200 dark:border-gray-700'>
                <span className='inline-flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400'>
                  <div className='w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-500'></div>
                  {repo.language}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className='text-center mt-8'>
        <button className='px-6 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors font-medium'>
          View All Repositories
        </button>
      </div>
    </section>
  );
}
