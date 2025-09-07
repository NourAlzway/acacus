import React, { useState } from 'react';

// Import all examples
import { CounterComponent } from './use-cases/01-basic-counter/CounterComponent';
import { UserManagementApp } from './use-cases/02-user-management/UserManagementApp';
import { AsyncOperationsApp } from './use-cases/03-async-operations/AsyncOperationsApp';
import { EffectsSubscriptionsApp } from './use-cases/04-effects-subscriptions/EffectsSubscriptionsApp';

type ExampleKey = 'counter' | 'users' | 'async' | 'effects';

interface Example {
  key: ExampleKey;
  title: string;
  description: string;
  component: React.ComponentType;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

const examples: Example[] = [
  {
    key: 'counter',
    title: 'Basic Counter',
    description: 'Simple state management with get/use pattern',
    component: CounterComponent,
    difficulty: 'Beginner',
  },
  {
    key: 'users',
    title: 'User Management',
    description: 'CRUD operations and form handling',
    component: UserManagementApp,
    difficulty: 'Intermediate',
  },
  {
    key: 'async',
    title: 'Async Operations',
    description: 'Loading states and error handling',
    component: AsyncOperationsApp,
    difficulty: 'Intermediate',
  },
  {
    key: 'effects',
    title: 'State Subscriptions',
    description: 'Side effects and reactive patterns',
    component: EffectsSubscriptionsApp,
    difficulty: 'Advanced',
  },
];

export function MainDemoApp() {
  const [activeExample, setActiveExample] = useState<ExampleKey>('counter');

  const currentExample = examples.find(ex => ex.key === activeExample)!;
  const Component = currentExample.component;

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Header */}
      <header
        style={{
          borderBottom: '1px solid #e5e7eb',
          padding: '1.5rem 0',
          backgroundColor: '#fafafa',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 1rem',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: '600',
              color: '#111827',
              margin: '0 0 0.5rem 0',
            }}
          >
            Acacus Examples
          </h1>
          <p
            style={{
              color: '#6b7280',
              margin: 0,
              fontSize: '1rem',
            }}
          >
            Simple React state management
          </p>
        </div>
      </header>

      <div
        style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}
      >
        {/* Example Tabs */}
        <nav style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {examples.map(example => (
              <button
                key={example.key}
                onClick={() => setActiveExample(example.key)}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  backgroundColor:
                    activeExample === example.key ? '#3b82f6' : 'white',
                  color: activeExample === example.key ? 'white' : '#374151',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'all 0.2s',
                  outline: 'none',
                }}
                onMouseOver={e => {
                  if (activeExample !== example.key) {
                    e.currentTarget.style.borderColor = '#9ca3af';
                  }
                }}
                onMouseOut={e => {
                  if (activeExample !== example.key) {
                    e.currentTarget.style.borderColor = '#d1d5db';
                  }
                }}
              >
                {example.title}
              </button>
            ))}
          </div>
        </nav>

        {/* Current Example Info */}
        <div
          style={{
            backgroundColor: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '0.5rem',
            }}
          >
            <h2
              style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#111827',
                margin: 0,
              }}
            >
              {currentExample.title}
            </h2>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: '500',
                color:
                  currentExample.difficulty === 'Beginner'
                    ? '#059669'
                    : currentExample.difficulty === 'Intermediate'
                      ? '#d97706'
                      : '#dc2626',
                backgroundColor:
                  currentExample.difficulty === 'Beginner'
                    ? '#ecfdf5'
                    : currentExample.difficulty === 'Intermediate'
                      ? '#fffbeb'
                      : '#fef2f2',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                border: `1px solid ${
                  currentExample.difficulty === 'Beginner'
                    ? '#a7f3d0'
                    : currentExample.difficulty === 'Intermediate'
                      ? '#fcd34d'
                      : '#fca5a5'
                }`,
              }}
            >
              {currentExample.difficulty}
            </span>
          </div>
          <p
            style={{
              color: '#6b7280',
              margin: 0,
              fontSize: '0.875rem',
            }}
          >
            {currentExample.description}
          </p>
        </div>

        {/* Example Content */}
        <div
          style={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
          }}
        >
          <Component />
        </div>
      </div>
    </div>
  );
}
