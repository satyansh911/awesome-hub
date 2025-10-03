import { render, screen, fireEvent } from '@testing-library/react'
import { SearchResults } from '@/components/search-results'

const mockRepositories = [
  {
    id: 1,
    githubId: 123,
    name: 'awesome-react',
    fullName: 'facebook/awesome-react',
    description: 'A collection of awesome React resources',
    url: 'https://github.com/facebook/awesome-react',
    stars: 1500,
    forks: 200,
    language: 'JavaScript',
    topics: ['react', 'javascript', 'frontend'],
    tags: ['ui', 'library'],
    owner: 'facebook',
    lastFetched: '2024-01-01T00:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    githubId: 456,
    name: 'awesome-vue',
    fullName: 'vuejs/awesome-vue',
    description: 'A curated list of awesome things related to Vue.js',
    url: 'https://github.com/vuejs/awesome-vue',
    stars: 72000,
    forks: 10200,
    language: 'JavaScript',
    topics: ['vue', 'vuejs'],
    tags: [],
    owner: 'vuejs',
    lastFetched: '2024-01-01T00:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  }
]

const defaultProps = {
  results: mockRepositories,
  isLoading: false,
  hasMore: false,
  isLoadingMore: false,
  onLoadMore: jest.fn(),
  searchQuery: 'awesome',
  category: 'all'
}

describe('SearchResults', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render search results correctly', () => {
    render(<SearchResults {...defaultProps} />)
    
    expect(screen.getByText('Search Results')).toBeInTheDocument()
    expect(screen.getByText('Found 2 repositories')).toBeInTheDocument()
    expect(screen.getByText('awesome-react')).toBeInTheDocument()
    expect(screen.getByText('awesome-vue')).toBeInTheDocument()
  })

  it('should display loading state', () => {
    render(
      <SearchResults 
        {...defaultProps} 
        isLoading={true}
        results={[]}
      />
    )
    
    expect(screen.getByText('Searching repositories...')).toBeInTheDocument()
    expect(screen.getByText('Finding awesome repositories for "awesome"')).toBeInTheDocument()
  })

  it('should display empty state when no results', () => {
    render(
      <SearchResults 
        {...defaultProps} 
        results={[]}
      />
    )
    
    expect(screen.getByText('No repositories found')).toBeInTheDocument()
    expect(screen.getByText(/Try adjusting your search terms/)).toBeInTheDocument()
  })

  it('should format star and fork counts correctly', () => {
    render(<SearchResults {...defaultProps} />)
    
    expect(screen.getByText('1.5K')).toBeInTheDocument() // 1500 stars
    expect(screen.getByText('72.0K')).toBeInTheDocument() // 72000 stars
    expect(screen.getByText('10.2K')).toBeInTheDocument() // 10200 forks
  })

  it('should display repository topics and tags', () => {
    render(<SearchResults {...defaultProps} />)
    
    expect(screen.getByText('react')).toBeInTheDocument()
    expect(screen.getByText('javascript')).toBeInTheDocument()
    expect(screen.getByText('frontend')).toBeInTheDocument()
    expect(screen.getByText('vue')).toBeInTheDocument()
    expect(screen.getByText('vuejs')).toBeInTheDocument()
  })

  it('should show load more button when hasMore is true', () => {
    const mockOnLoadMore = jest.fn()
    render(
      <SearchResults 
        {...defaultProps} 
        hasMore={true}
        onLoadMore={mockOnLoadMore}
      />
    )
    
    const loadMoreButton = screen.getByText('Load More Repositories')
    expect(loadMoreButton).toBeInTheDocument()
    
    fireEvent.click(loadMoreButton)
    expect(mockOnLoadMore).toHaveBeenCalledTimes(1)
  })

  it('should show loading more state', () => {
    render(
      <SearchResults 
        {...defaultProps} 
        hasMore={true}
        isLoadingMore={true}
      />
    )
    
    expect(screen.getByText('Loading more...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /loading more/i })).toBeDisabled()
  })

  it('should display search query in results header', () => {
    render(
      <SearchResults 
        {...defaultProps} 
        searchQuery="react"
      />
    )
    
    expect(screen.getByText('for "react"')).toBeInTheDocument()
  })

  it('should display category in results header', () => {
    render(
      <SearchResults 
        {...defaultProps} 
        category="javascript"
      />
    )
    
    expect(screen.getByText('in javascript')).toBeInTheDocument()
  })

  it('should open repository links in new tab', () => {
    render(<SearchResults {...defaultProps} />)
    
    const githubLinks = screen.getAllByTitle('Open on GitHub')
    expect(githubLinks[0]).toHaveAttribute('href', 'https://github.com/facebook/awesome-react')
    expect(githubLinks[0]).toHaveAttribute('target', '_blank')
    expect(githubLinks[0]).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('should handle repositories with null description', () => {
    const reposWithNullDescription = [
      {
        ...mockRepositories[0],
        description: null
      }
    ]
    
    render(
      <SearchResults 
        {...defaultProps} 
        results={reposWithNullDescription}
      />
    )
    
    expect(screen.getByText('No description available')).toBeInTheDocument()
  })

  it('should truncate topics and tags when there are many', () => {
    const repoWithManyTopics = [
      {
        ...mockRepositories[0],
        topics: ['react', 'javascript', 'frontend', 'ui', 'library', 'components'],
        tags: ['awesome', 'curated', 'list']
      }
    ]
    
    render(
      <SearchResults 
        {...defaultProps} 
        results={repoWithManyTopics}
      />
    )
    
    // Should show +X for additional topics/tags
    expect(screen.getByText(/\+\d+/)).toBeInTheDocument()
  })

  it('should display correct language colors', () => {
    render(<SearchResults {...defaultProps} />)
    
    const languageIndicators = screen.getAllByText('JavaScript')
    expect(languageIndicators).toHaveLength(2)
  })

  it('should format dates correctly', () => {
    render(<SearchResults {...defaultProps} />)
    
    expect(screen.getAllByText('Jan 1, 2024')).toHaveLength(2)
  })

  it('should show loading skeleton during initial load', () => {
    render(
      <SearchResults 
        {...defaultProps} 
        isLoading={true}
        results={[]}
      />
    )
    
    // Check for skeleton elements
    const skeletons = screen.getAllByRole('generic')
    expect(skeletons.length).toBeGreaterThan(0)
  })
})