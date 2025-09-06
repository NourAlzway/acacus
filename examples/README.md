# Acacus Examples

This folder contains comprehensive examples demonstrating most features of the Acacus state management library.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3001
```

## Examples Overview

### 01-basic-counter

- Simple counter implementation
- Basic get/use pattern
- State updates and rendering

### 02-user-management [In Progress]

- CRUD operations
- Form handling and validation
- Complex state management

### 03-async-operations [In Progress]

- Async actions with loading states
- Error handling
- API integration patterns

### 04-effects-subscriptions [In Progress]

- State subscriptions for side effects
- localStorage persistence
- Theme switching
- Auto-save functionality

## How It Works

The examples app imports Acacus from the built library:

```typescript
import { createStore } from 'acacus';

const store = createStore({ count: 0 })
  .action('increment', state => ({ count: state.count + 1 }))
  .build();

// Usage - get/use pattern
const count = store.get(state => state.count);
const increment = store.use(actions => actions.increment);
```

This demonstrates real-world usage patterns where you import Acacus as a dependency.

## What You'll Learn

- **Clean State Management**: How to structure stores with the get/use pattern
- **Async Operations**: Managing loading states and error handling
- **Side Effects**: Using subscriptions for localStorage, logging, etc.
- **TypeScript Integration**: Proper typing for actions and state
- **Best Practices**: Real-world patterns and code organization
