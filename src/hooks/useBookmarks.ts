import { useState, useEffect } from 'react'

// Key used to store bookmarks in localStorage
const BOOKMARKS_KEY = 'bookmarks';

export function useBookmarks() {
  // State to store the list of bookmarked repositories
  const [bookmarks, setBookmarks] = useState<Repo[]>([])

  // Load bookmarks from localStorage when the hook is first used (component mounts)
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || '[]') // Get saved bookmarks or empty array
    setBookmarks(stored) // Update state with saved bookmarks
  }, [])

  // Function to add a repository to bookmarks
  const addBookmark = (repo: Repo) => {
    const newBookmarks = [...bookmarks, repo] // Create a new array including the new repo
    setBookmarks(newBookmarks)                // Update state
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(newBookmarks)) // Save updated bookmarks to localStorage
  }

  // Function to remove a repository from bookmarks by id
  const removeBookmark = (id: number) => {
    const updated = bookmarks.filter(b => b.id !== id) // Filter out the repo to remove
    setBookmarks(updated)                              // Update state
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated)) // Save updated bookmarks
  }

  // Check if a repository is already bookmarked
  const isBookmarked = (repoId: number) => bookmarks.some(r => r.id === repoId)

  // Return the state and functions for use in components
  return { bookmarks, addBookmark, removeBookmark, isBookmarked }
}
