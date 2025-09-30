'use client'

import { Star, GitFork, Code } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="text-center py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
          AwesomeHub
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
          Discover the best curated lists on GitHub. From awesome-react to awesome-python, 
          find everything awesome in one place.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-sm">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="font-medium">50K+ Stars</span>
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-sm">
            <GitFork className="w-4 h-4 text-blue-500" />
            <span className="font-medium">500+ Repos</span>
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-sm">
            <Code className="w-4 h-4 text-green-500" />
            <span className="font-medium">100+ Categories</span>
          </div>
        </div>
      </div>
    </section>
  )
}