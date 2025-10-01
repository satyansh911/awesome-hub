# Contributing to AwesomeHub

Thank you for your interest in contributing to AwesomeHub! This document provides guidelines and information for contributors, especially those participating in Hacktoberfest 2025.

## Hacktoberfest 2025

AwesomeHub is officially participating in Hacktoberfest 2025! We welcome contributions from developers of all skill levels. Whether you're a first-time contributor or an experienced developer, there's something for everyone.

### Issue Labels for Hacktoberfest

- `hacktoberfest` - Issues eligible for Hacktoberfest
- `good-first-issue` - Perfect for newcomers
- `help-wanted` - Community help needed
- `beginner` - Simple tasks requiring minimal experience
- `intermediate` - Moderate complexity tasks
- `advanced` - Complex tasks for experienced developers

## Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/your-username/awesome-hub.git
cd awesome-hub
npm install
```

### 2. Set Up Development Environment

```bash
# Start PostgreSQL database
npm run db:start

# Copy environment file
cp .env.local.example .env

# Add your GitHub token (optional but recommended)
# Edit .env and add: GITHUB_TOKEN=your_token_here
# DATABASE_URL should be: postgresql://awesomehub:awesomehub@localhost:5432/awesomehub_dev

# Set up database
npm run db:generate
npm run db:push

# Start development server
npm run dev
```

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
```

## Contribution Guidelines

### Code Standards

- **Language**: TypeScript (strict mode)
- **Style**: ESLint + Prettier
- **Commits**: Conventional commits format
- **Testing**: Write tests for new features

### Commit Message Format

```
type(scope): description

feat(search): add advanced filtering options
fix(api): resolve database connection issue
docs(readme): update installation instructions
style(components): improve button hover states
```

### Types:
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

## Contribution Areas

### Beginner-Friendly Tasks

Perfect for newcomers to open source or web development:

#### Documentation
- [ ] Improve README sections
- [ ] Add code comments
- [ ] Create API documentation
- [ ] Add troubleshooting guides

#### Data & Content
- [ ] Add new awesome repositories
- [ ] Categorize existing repositories
- [ ] Add repository descriptions
- [ ] Create seed data
- [ ] Validate repository information

#### UI/UX Improvements
- [ ] Fix responsive design issues
- [ ] Improve accessibility (ARIA labels, keyboard navigation)
- [ ] Add loading states
- [ ] Improve error messages
- [ ] Add tooltips and help text

### Intermediate Tasks

For developers with some experience:

#### Features
- [ ] Implement advanced search filters
- [ ] Add sorting options (stars, forks, updated date)
- [ ] Create user bookmarking system
- [ ] Add repository comparison feature
- [ ] Implement export functionality (JSON, CSV)
- [ ] Add repository statistics dashboard

#### Technical Improvements
- [ ] Add unit tests for components
- [ ] Implement API caching
- [ ] Add error boundaries
- [ ] Improve SEO with meta tags
- [ ] Add progressive web app features
- [ ] Implement infinite scroll

#### Integration
- [ ] Add GitHub OAuth integration
- [ ] Implement repository webhooks
- [ ] Add email notifications
- [ ] Create browser extension
- [ ] Add social sharing features

### Advanced Tasks

For experienced developers:

#### Architecture
- [ ] Implement microservices architecture
- [ ] Add Redis caching layer
- [ ] Create advanced analytics system
- [ ] Implement real-time updates with WebSockets
- [ ] Add machine learning recommendations
- [ ] Create admin dashboard

#### Performance
- [ ] Database query optimization
- [ ] Implement CDN for static assets
- [ ] Add monitoring and alerting
- [ ] Create comprehensive logging system
- [ ] Implement rate limiting
- [ ] Add performance metrics

#### DevOps
- [ ] Set up CI/CD pipelines
- [ ] Add Docker containerization
- [ ] Implement automated testing
- [ ] Create deployment strategies
- [ ] Add security scanning
- [ ] Set up monitoring infrastructure

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

- Write unit tests for all new functions
- Add integration tests for API endpoints
- Include component tests for React components
- Mock external dependencies

### Test Files Structure

```
src/
├── components/
│   ├── Button.tsx
│   └── __tests__/
│       └── Button.test.tsx
├── lib/
│   ├── utils.ts
│   └── __tests__/
│       └── utils.test.ts
```

## Database

### Schema Changes

1. Update `prisma/schema.prisma`
2. Run `npm run db:generate`
3. Run `npm run db:push` (development)
4. Create migration: `npm run db:migrate`

### Database Management

```bash
# Start PostgreSQL (development)
npm run db:start

# Stop PostgreSQL
npm run db:stop

# Restart PostgreSQL
npm run db:restart

# Reset database (WARNING: destroys all data)
npm run db:stop
docker volume rm awesome-hub_postgres_data
npm run db:start
npm run db:push
```

### Adding Seed Data

Edit `prisma/seed.ts` to add sample data for development.

## Design Guidelines

### UI Principles
- Mobile-first responsive design
- Consistent spacing using Tailwind's scale
- Accessible color contrast ratios
- Clear visual hierarchy
- Intuitive user interactions

### Component Structure
```tsx
// ComponentName.tsx
'use client'

import { useState } from 'react'
import { SomeIcon } from 'lucide-react'

interface ComponentNameProps {
  // Define props with TypeScript
}

export function ComponentName({ prop1, prop2 }: ComponentNameProps) {
  // Component logic
  
  return (
    <div className="component-styles">
      {/* Component JSX */}
    </div>
  )
}
```

## Pull Request Process

### Before Submitting

1. **Test your changes**
   ```bash
   npm run lint
   npm run type-check
   npm run build
   npm test
   ```

2. **Update documentation** if needed

3. **Add/update tests** for new functionality

4. **Check responsive design** on different screen sizes

### PR Template

When creating a pull request, include:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Other (specify)

## Testing
- [ ] Tests pass locally
- [ ] Added new tests
- [ ] Manual testing completed

## Screenshots (if applicable)
Include before/after screenshots for UI changes

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No breaking changes (or marked as such)
```

### Review Process

1. Automated checks (linting, tests, build)
2. Code review by maintainers
3. Testing on different browsers/devices
4. Final approval and merge

## Recognition

Contributors will be recognized through:

- GitHub contributors page
- Contributor section in README
- Special mentions in release notes
- Hacktoberfest 2025 contributor badge
- Featured contributor of the month

## Getting Help

### Communication Channels

- **GitHub Issues**: Technical questions and bug reports
- **GitHub Discussions**: General questions and ideas
- **Pull Request Comments**: Code-specific discussions

### Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the project goals
- Help create a welcoming environment
- Report any unacceptable behavior

## Thank You

Every contribution, no matter how small, makes AwesomeHub better for the entire developer community. Thank you for being part of this project!

---

Happy coding and happy Hacktoberfest! 