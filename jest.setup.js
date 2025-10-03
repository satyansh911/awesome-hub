require('@testing-library/jest-dom')

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return ''
  },
}))

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    const React = require('react')
    return React.createElement('img', props)
  },
}))

// Mock Next.js server components
global.Request = class MockRequest {
  constructor(url, init) {
    this.url = url
    this.method = init?.method || 'GET'
    this.headers = new Headers(init?.headers)
  }
}

global.Response = class MockResponse {
  constructor(body, init) {
    this.body = body
    this.status = init?.status || 200
    this.headers = new Headers(init?.headers)
  }
  
  static json(data, init) {
    return new MockResponse(JSON.stringify(data), {
      ...init,
      headers: { 'content-type': 'application/json', ...(init?.headers || {}) }
    })
  }
  
  json() {
    return Promise.resolve(JSON.parse(this.body))
  }
}

global.Headers = class MockHeaders extends Map {
  get(name) {
    return super.get(name.toLowerCase())
  }
  
  set(name, value) {
    return super.set(name.toLowerCase(), value)
  }
  
  has(name) {
    return super.has(name.toLowerCase())
  }
}

// Global test setup
beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks()
})

// Suppress console errors during tests unless they're expected
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render is no longer supported') ||
        args[0].includes('Warning: An invalid form control'))
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})