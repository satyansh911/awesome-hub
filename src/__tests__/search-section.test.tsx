import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SearchSection } from '@/components/search-section'
import { SearchApiClient } from '@/lib/search-api'

// Mock the SearchApiClient
jest.mock('@/lib/search-api', () => ({
  SearchApiClient: {
    searchRepositories: jest.fn(),
  },
}))

// Mock the SearchResults component
jest.mock('@/components/search-results', () => ({
  SearchResults: ({ results, isLoading, searchQuery }: any) => (
    <div data-testid="search-results">
      {isLoading && <div>Loading...</div>}
      {!isLoading && results.length > 0 && (
        <div>Found {results.length} results for "{searchQuery}"</div>
      )}
      {!isLoading && results.length === 0 && <div>No results found</div>}
    </div>
  ),
}))

const mockSearchRepositories = SearchApiClient.searchRepositories as jest.MockedFunction<
  typeof SearchApiClient.searchRepositories
>

describe('SearchSection', () => {
  beforeEach(() => {
    mockSearchRepositories.mockClear()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  const mockRepositories = [
    {
      id: 1,
      githubId: 123,
      name: 'awesome-react',
      fullName: 'facebook/awesome-react',
      description: 'A collection of awesome React resources',
      url: 'https://github.com/facebook/awesome-react',
      stars: 1000,
      forks: 200,
      language: 'JavaScript',
      topics: ['react', 'javascript'],
      tags: ['frontend'],
      owner: 'facebook',
      lastFetched: '2024-01-01T00:00:00Z',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    }
  ]

  it('should render search form correctly', () => {
    render(<SearchSection />)
    
    expect(screen.getByPlaceholderText('Search awesome repositories...')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /search awesome repos/i })).toBeInTheDocument()
  })

  it('should handle search input changes', () => {
    render(<SearchSection />)
    
    const searchInput = screen.getByPlaceholderText('Search awesome repositories...')
    fireEvent.change(searchInput, { target: { value: 'react' } })
    
    expect(searchInput).toHaveValue('react')
  })

  it('should handle category selection changes', () => {
    render(<SearchSection />)
    
    const categorySelect = screen.getByRole('combobox')
    fireEvent.change(categorySelect, { target: { value: 'javascript' } })
    
    expect(categorySelect).toHaveValue('javascript')
  })

  it('should perform search when search button is clicked', async () => {
    mockSearchRepositories.mockResolvedValueOnce({
      repos: mockRepositories,
      pagination: { page: 1, hasMore: false }
    })

    render(<SearchSection />)
    
    const searchInput = screen.getByPlaceholderText('Search awesome repositories...')
    const searchButton = screen.getByRole('button', { name: /search awesome repos/i })
    
    fireEvent.change(searchInput, { target: { value: 'react' } })
    fireEvent.click(searchButton)
    
    await waitFor(() => {
      expect(mockSearchRepositories).toHaveBeenCalledWith(
        {
          query: 'react',
          category: undefined,
          page: 1
        },
        expect.any(AbortSignal)
      )
    })
  })

  it('should perform search when Enter key is pressed', async () => {
    mockSearchRepositories.mockResolvedValueOnce({
      repos: mockRepositories,
      pagination: { page: 1, hasMore: false }
    })

    render(<SearchSection />)
    
    const searchInput = screen.getByPlaceholderText('Search awesome repositories...')
    
    fireEvent.change(searchInput, { target: { value: 'vue' } })
    fireEvent.keyPress(searchInput, { key: 'Enter', code: 'Enter' })
    
    await waitFor(() => {
      expect(mockSearchRepositories).toHaveBeenCalledWith(
        {
          query: 'vue',
          category: undefined,
          page: 1
        },
        expect.any(AbortSignal)
      )
    })
  })

  it('should show loading state during search', async () => {
    // Create a promise that won't resolve immediately
    let resolveSearch: any
    const searchPromise = new Promise(resolve => {
      resolveSearch = resolve
    })
    mockSearchRepositories.mockReturnValueOnce(searchPromise)

    render(<SearchSection />)
    
    const searchInput = screen.getByPlaceholderText('Search awesome repositories...')
    const searchButton = screen.getByRole('button', { name: /search awesome repos/i })
    
    fireEvent.change(searchInput, { target: { value: 'react' } })
    fireEvent.click(searchButton)
    
    // Check loading state
    expect(screen.getByText('Searching...')).toBeInTheDocument()
    expect(searchButton).toBeDisabled()
    expect(searchInput).toBeDisabled()
    
    // Resolve the promise
    resolveSearch({
      repos: mockRepositories,
      pagination: { page: 1, hasMore: false }
    })
    
    await waitFor(() => {
      expect(screen.queryByText('Searching...')).not.toBeInTheDocument()
    })
  })

  it('should handle search errors', async () => {
    mockSearchRepositories.mockRejectedValueOnce(new Error('Search failed'))

    render(<SearchSection />)
    
    const searchInput = screen.getByPlaceholderText('Search awesome repositories...')
    const searchButton = screen.getByRole('button', { name: /search awesome repos/i })
    
    fireEvent.change(searchInput, { target: { value: 'react' } })
    fireEvent.click(searchButton)
    
    await waitFor(() => {
      expect(screen.getByText('Search failed')).toBeInTheDocument()
    })
  })

  it('should show error when searching without query and category is all', async () => {
    render(<SearchSection />)
    
    const searchButton = screen.getByRole('button', { name: /search awesome repos/i })
    fireEvent.click(searchButton)
    
    await waitFor(() => {
      expect(screen.getByText('Please enter a search term or select a category')).toBeInTheDocument()
    })
  })

  it('should include category in search when selected', async () => {
    mockSearchRepositories.mockResolvedValueOnce({
      repos: mockRepositories,
      pagination: { page: 1, hasMore: false }
    })

    render(<SearchSection />)
    
    const searchInput = screen.getByPlaceholderText('Search awesome repositories...')
    const categorySelect = screen.getByRole('combobox')
    const searchButton = screen.getByRole('button', { name: /search awesome repos/i })
    
    fireEvent.change(searchInput, { target: { value: 'react' } })
    fireEvent.change(categorySelect, { target: { value: 'javascript' } })
    fireEvent.click(searchButton)
    
    await waitFor(() => {
      expect(mockSearchRepositories).toHaveBeenCalledWith(
        {
          query: 'react',
          category: 'javascript',
          page: 1
        },
        expect.any(AbortSignal)
      )
    })
  })

  it('should show clear results button after search', async () => {
    mockSearchRepositories.mockResolvedValueOnce({
      repos: mockRepositories,
      pagination: { page: 1, hasMore: false }
    })

    render(<SearchSection />)
    
    const searchInput = screen.getByPlaceholderText('Search awesome repositories...')
    const searchButton = screen.getByRole('button', { name: /search awesome repos/i })
    
    fireEvent.change(searchInput, { target: { value: 'react' } })
    fireEvent.click(searchButton)
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /clear results/i })).toBeInTheDocument()
    })
  })

  it('should clear results when clear button is clicked', async () => {
    mockSearchRepositories.mockResolvedValueOnce({
      repos: mockRepositories,
      pagination: { page: 1, hasMore: false }
    })

    render(<SearchSection />)
    
    const searchInput = screen.getByPlaceholderText('Search awesome repositories...')
    const searchButton = screen.getByRole('button', { name: /search awesome repos/i })
    
    fireEvent.change(searchInput, { target: { value: 'react' } })
    fireEvent.click(searchButton)
    
    await waitFor(() => {
      expect(screen.getByTestId('search-results')).toBeInTheDocument()
    })
    
    const clearButton = screen.getByRole('button', { name: /clear results/i })
    fireEvent.click(clearButton)
    
    expect(screen.queryByTestId('search-results')).not.toBeInTheDocument()
  })
})