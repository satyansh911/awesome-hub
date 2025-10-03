'use client';

import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Skeleton } from './skeleton';

export function SearchSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isSearching, setIsSearching] = useState(false);

  const categories = [
    'all',
    'javascript',
    'python',
    'react',
    'node',
    'machine-learning',
    'css',
    'go',
    'rust',
    'security',
    'devops',
    'data-science',
  ];

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
    }, 2000);
  };

  return (
    <section className='mb-16'>
      <div className='max-w-4xl mx-auto'>
        <div className='bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8'>
          <div className='flex flex-col md:flex-row gap-4 mb-6'>
            <div className='flex-1 relative'>
              <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
              <input
                type='text'
                placeholder='Search awesome repositories...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white'
              />
            </div>
            <div className='relative'>
              <Filter className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className='pl-10 pr-8 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white appearance-none bg-white cursor-pointer'
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'all'
                      ? 'All Categories'
                      : `awesome-${category}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className='flex justify-center mt-6'>
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className='px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium disabled:opacity-50'
            >
              {isSearching ? 'Searching...' : 'Search Awesome Repos'}
            </button>
          </div>
        </div>

        {isSearching && (
          <div className='mt-8'>
            <h3 className='text-lg font-semibold mb-4 text-gray-900 dark:text-white'>
              Search Results
            </h3>
            <div className='space-y-4'>
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className='bg-white dark:bg-slate-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 animate-pulse'
                >
                  <div className='flex items-start justify-between mb-3'>
                    <Skeleton className='h-5 w-48' />
                    <Skeleton className='h-4 w-12' />
                  </div>
                  <Skeleton className='h-4 w-full mb-2' />
                  <Skeleton className='h-4 w-3/4 mb-3' />
                  <div className='flex items-center justify-between'>
                    <div className='flex gap-2'>
                      <Skeleton className='h-6 w-16 rounded-full' />
                      <Skeleton className='h-6 w-20 rounded-full' />
                    </div>
                    <div className='flex gap-4'>
                      <Skeleton className='h-4 w-12' />
                      <Skeleton className='h-4 w-12' />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
