'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, Users, BookOpen, Zap, Star } from 'lucide-react';
import { useBookmarks } from '@/hooks/useBookmarks';
import { Skeleton } from './skeleton';

export function StatsSection() {
  const [loading, setLoading] = useState(true);
  const { bookmarks } = useBookmarks();
  const [stats, setStats] = useState({
    repositories: 0,
    stars: 0,
    categories: 0,
    contributors: 0,
    bookmarksCount: 0,
  });

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
      // Animate numbers on mount
      const targets = {
        repositories: 1247,
        stars: 125432,
        categories: 127,
        contributors: 8943,
        bookmarksCount: bookmarks.length,
      };

      const animateStat = (key: keyof typeof stats, target: number) => {
        let current = 0;
        const increment = target / 50;
        const statTimer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(statTimer);
          }
          setStats((prev) => ({ ...prev, [key]: Math.floor(current) }));
        }, 30);
      };

      Object.entries(targets).forEach(([key, target]) => {
        animateStat(key as keyof typeof stats, target);
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, [bookmarks.length]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (loading) {
    return (
      <section className='mb-16'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className='bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg'
            >
              <Skeleton className='h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4' />
              <Skeleton className='h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2' />
              <Skeleton className='h-3 bg-gray-200 dark:bg-gray-700 rounded mb-4' />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className='mb-16'>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
        <div className='bg-white dark:bg-slate-800 rounded-xl p-6 text-center shadow-lg'>
          <BookOpen className='w-8 h-8 text-blue-500 mx-auto mb-3' />
          <div className='text-2xl font-bold text-gray-900 dark:text-white'>
            {formatNumber(stats.repositories)}
          </div>
          <div className='text-sm text-gray-600 dark:text-gray-400'>
            Repositories
          </div>
        </div>

        <div className='bg-white dark:bg-slate-800 rounded-xl p-6 text-center shadow-lg'>
          <TrendingUp className='w-8 h-8 text-yellow-500 mx-auto mb-3' />
          <div className='text-2xl font-bold text-gray-900 dark:text-white'>
            {formatNumber(stats.stars)}
          </div>
          <div className='text-sm text-gray-600 dark:text-gray-400'>
            Total Stars
          </div>
        </div>

        <div className='bg-white dark:bg-slate-800 rounded-xl p-6 text-center shadow-lg'>
          <Zap className='w-8 h-8 text-purple-500 mx-auto mb-3' />
          <div className='text-2xl font-bold text-gray-900 dark:text-white'>
            {formatNumber(stats.categories)}
          </div>
          <div className='text-sm text-gray-600 dark:text-gray-400'>
            Categories
          </div>
        </div>

        <div className='bg-white dark:bg-slate-800 rounded-xl p-6 text-center shadow-lg'>
          <Users className='w-8 h-8 text-green-500 mx-auto mb-3' />
          <div className='text-2xl font-bold text-gray-900 dark:text-white'>
            {formatNumber(stats.contributors)}
          </div>
          <div className='text-sm text-gray-600 dark:text-gray-400'>
            Contributors
          </div>
        </div>
        <div className='bg-white dark:bg-slate-800 rounded-xl p-6 text-center shadow-lg'>
          <Star className='w-8 h-8 text-yellow-500 mx-auto mb-3' />
          <div className='text-2xl font-bold text-gray-900 dark:text-white'>
            {formatNumber(stats.bookmarksCount)}
          </div>
          <div className='text-sm text-gray-600 dark:text-gray-400'>
            Bookmarked Repos
          </div>
        </div>
      </div>
    </section>
  );
}
