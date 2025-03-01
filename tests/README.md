# ResearchRX - Tests

## Overview
This directory contains the test suites for the ResearchRX project, covering unit tests, integration tests, and end-to-end tests for all components of the system.

## 🚀 Quick Start

### Prerequisites
- Node.js (v19.0.0 or higher)
- npm or yarn

### Installation
```bash
# Install dependencies
npm install
```

### Running Tests
```bash
# Run all tests
npm run tests

# Run tests in watch mode
npm run tests:watch
```

## 🏗️ Test Structure

```
tests/
├── unit/                  # Unit tests
│   ├── auth/             # Authentication tests
│   ├── blog/             # Blog functionality tests
│   └── medical/          # Medical data tests
├── integration/          # Integration tests
│   ├── api/             # API endpoint tests
│   └── database/        # Database operation tests
├── e2e/                 # End-to-end tests
│   ├── patient/        # Patient portal tests
│   └── researcher/     # Researcher portal tests
└── utils/              # Test utilities and helpers
```

## 🛠️ Testing Tools

### Testing Framework
- Vitest - Fast testing framework compatible with Vite
- Jest-like API for familiar testing patterns
- Built-in code coverage reporting

### Testing Utilities
- React Testing Library for component tests
- MSW (Mock Service Worker) for API mocking
- Supertest for HTTP assertions
- Faker.js for generating test data

## 💻 Writing Tests

### Unit Test Example
```javascript
import { describe, it, expect } from 'vitest'
import { sum } from '../sum'

describe('sum function', () => {
  it('adds two numbers correctly', () => {
    expect(sum(1, 2)).toBe(3)
  })
})
```

### Component Test Example
```javascript
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Login from '../components/Login'

describe('Login Component', () => {
  it('renders login form', () => {
    render(<Login />)
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })
})
```

### API Test Example
```javascript
import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../server'

describe('Auth API', () => {
  it('should login user with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('token')
  })
})
```

## 📊 Code Coverage

To generate code coverage reports:
```bash
npm run tests:coverage
```

Coverage reports will be available in the `coverage` directory.

## 🔍 Test Categories

### Unit Tests
- Individual component testing
- Utility function testing
- State management testing
- Form validation testing

### Integration Tests
- API endpoint testing
- Database operations testing
- Authentication flow testing
- File upload testing

### End-to-End Tests
- User journey testing
- Cross-component interaction testing
- Real-world scenario testing

## 🤝 Contributing

### Adding New Tests
1. Create test file in appropriate directory
2. Follow existing test patterns
3. Include meaningful test descriptions
4. Test both success and failure cases

### Test Guidelines
- Write clear test descriptions
- Use meaningful variable names
- Mock external dependencies
- Clean up after tests
- Keep tests independent

## 🐛 Debugging Tests

### Common Issues
- Async test timing
- Component mounting/unmounting
- State management
- API mocking

### Debugging Tools
- Vitest UI for visual debugging
- Console logging
- Error stack traces
- Test isolation

## 📝 Best Practices

1. Follow AAA pattern (Arrange, Act, Assert)
2. Keep tests focused and atomic
3. Use meaningful test descriptions
4. Mock external dependencies
5. Clean up after tests
6. Maintain test independence

## 📞 Support
For support, contact vinaayakgaikwad@gmail.com

---
Part of ResearchRX - Google Solutions Challenge 2025
