'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, Users, BookOpen, Zap } from 'lucide-react';
import { Skeleton } from './skeleton';

interface Stats {
  repositories: number;
  totalStars: number;
  totalForks: number;
  categories: number;
  contributors: number;
}

export function StatsSection() {
  const [loading, setLoading] = useState(true);

  const [animatedStats, setAnimatedStats] = useState<Stats>({
    repositories: 0,
    totalStars: 0,
    totalForks: 0,
    categories: 0,
    contributors: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/stats');
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        
        // Animate numbers
        const animateValue = (key: keyof Stats, target: number) => {
          let current = 0;
          const increment = target / 60; // Slower animation
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            setAnimatedStats(prev => ({ ...prev, [key]: Math.floor(current) }));
          }, 16); // ~60fps
        };

        // Start animations with slight delays
        setTimeout(() => animateValue('repositories', data.repositories), 100);
        setTimeout(() => animateValue('totalStars', data.totalStars), 200);
        setTimeout(() => animateValue('categories', data.categories), 300);
        setTimeout(() => animateValue('contributors', data.contributors), 400);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (loading) {
    return (
      <section className='mb-16'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
          {[...Array(4)].map((_, i) => (
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
            {formatNumber(animatedStats.repositories)}
          </div>
          <div className='text-sm text-gray-600 dark:text-gray-400'>
            Repositories
          </div>
        </div>

        <div className='bg-white dark:bg-slate-800 rounded-xl p-6 text-center shadow-lg'>
          <TrendingUp className='w-8 h-8 text-yellow-500 mx-auto mb-3' />
          <div className='text-2xl font-bold text-gray-900 dark:text-white'>
            {formatNumber(animatedStats.totalStars)}
          </div>
          <div className='text-sm text-gray-600 dark:text-gray-400'>
            Total Stars
          </div>
        </div>

        <div className='bg-white dark:bg-slate-800 rounded-xl p-6 text-center shadow-lg'>
          <Zap className='w-8 h-8 text-purple-500 mx-auto mb-3' />
          <div className='text-2xl font-bold text-gray-900 dark:text-white'>
            {formatNumber(animatedStats.categories)}
          </div>
          <div className='text-sm text-gray-600 dark:text-gray-400'>
            Categories
          </div>
        </div>

        <div className='bg-white dark:bg-slate-800 rounded-xl p-6 text-center shadow-lg'>
          <Users className='w-8 h-8 text-green-500 mx-auto mb-3' />
          <div className='text-2xl font-bold text-gray-900 dark:text-white'>
            {formatNumber(animatedStats.contributors)}
          </div>
          <div className='text-sm text-gray-600 dark:text-gray-400'>
            Contributors
          </div>
        </div>
      </div>
    </section>
  );
}
