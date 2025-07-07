# Testing Documentation

## Overview
This directory contains comprehensive test suites for the ResearchRX application, covering both backend controllers and frontend UI components.

## Test Structure
```
tests/
├── setup/                  # Test setup and configuration
│   ├── testDb.js          # Database setup for tests
│   ├── mockUtils.js       # Common mocks and utilities
│   └── testSetup.js       # Global test setup
├── unit/                  # Unit tests
│   ├── controllers/       # Backend controller tests
│   │   ├── patientAuth.test.js
│   │   └── researcherAuth.test.js
│   └── models/           # Database model tests
├── integration/          # Integration tests
│   └── auth/            # Authentication flow tests
└── ui/                  # UI component tests
    ├── patient/         # Patient portal components
    └── researcher/      # Researcher portal components
```

## Running Tests

### Install Dependencies
```bash
cd tests
npm install
```

### Running All Tests
```bash
npm test
```

### Running Specific Test Suites
```bash
# Run UI tests only
npm run test ui/

# Run controller tests only
npm run test unit/controllers/

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run with UI
npm run test:ui
```

## Test Coverage Areas

### Backend Controllers
- Authentication (Patient & Researcher)
  - Registration
  - Login
  - Email verification
  - Password reset
- Data validation
- Error handling
- JWT token management

### UI Components
- Form validations
- User interactions
- Navigation flows
- Error states
- Loading states
- Component rendering

## Writing Tests

### Controller Tests
```javascript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { testDb } from '../../setup/testDb';

describe('Controller Name', () => {
  beforeEach(async () => {
    await testDb.connect();
  });

  afterEach(async () => {
    await testDb.clearDatabase();
  });

  it('should do something', async () => {
    // Test implementation
  });
});
```

### UI Component Tests
```javascript
import { render, fireEvent, waitFor } from '@testing-library/react-native';

describe('Component Name', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Component />);
    expect(getByText('Expected Text')).toBeTruthy();
  });

  it('handles user interaction', async () => {
    const { getByText } = render(<Component />);
    fireEvent.press(getByText('Button Text'));
    await waitFor(() => {
      // Assert expected behavior
    });
  });
});
```

## Mocking

### API Calls
```javascript
jest.mock('../../config/api.config', () => ({
  apiCall: jest.fn(),
  // Other mocked functions
}));
```

### Navigation
```javascript
const mockNavigation = {
  navigate: jest.fn(),
  reset: jest.fn()
};
```

## Best Practices
1. Use descriptive test names
2. Test both success and failure cases
3. Clean up after each test
4. Mock external dependencies
5. Test edge cases
6. Keep tests focused and atomic
7. Use setup and teardown hooks appropriately

## Adding New Tests
1. Create test file in appropriate directory
2. Import necessary utilities and components
3. Write tests following existing patterns
4. Ensure all tests pass before committing
5. Update test documentation if needed

## Troubleshooting
- Check mock implementations
- Verify test setup is correct
- Ensure dependencies are installed
- Check for async operation handling
- Verify component props and state

## Contributing
When adding new features:
1. Write tests first (TDD approach)
2. Follow existing test patterns
3. Update documentation
4. Ensure all tests pass
5. Submit PR for review
