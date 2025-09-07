// Mock API service to simulate real async operations

import { Post, User } from './types';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API responses
const mockPosts: Post[] = [
  {
    id: 1,
    title: 'Understanding Async State',
    body: 'Managing async operations in state management...',
    userId: 1,
  },
  {
    id: 2,
    title: 'React Patterns',
    body: 'Common patterns for React development...',
    userId: 2,
  },
  {
    id: 3,
    title: 'TypeScript Best Practices',
    body: 'Writing better TypeScript code...',
    userId: 1,
  },
];

const mockUsers: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
];

export class ApiService {
  static async fetchPosts(): Promise<Post[]> {
    await delay(1500); // Simulate slow network

    // Simulate occasional failure
    if (Math.random() < 0.2) {
      throw new Error('Network error: Failed to fetch posts');
    }

    return mockPosts;
  }

  static async fetchPost(id: number): Promise<Post> {
    await delay(800);

    const post = mockPosts.find(p => p.id === id);
    if (!post) {
      throw new Error(`Post with id ${id} not found`);
    }

    return post;
  }

  static async fetchUsers(): Promise<User[]> {
    await delay(1000);
    return mockUsers;
  }

  static async createPost(post: Omit<Post, 'id'>): Promise<Post> {
    await delay(1200);

    // Simulate validation error
    if (!post.title.trim() || !post.body.trim()) {
      throw new Error('Title and body are required');
    }

    const newPost = {
      ...post,
      id: Math.max(...mockPosts.map(p => p.id)) + 1,
    };

    mockPosts.push(newPost);
    return newPost;
  }

  static async updatePost(id: number, updates: Partial<Post>): Promise<Post> {
    await delay(900);

    const postIndex = mockPosts.findIndex(p => p.id === id);
    if (postIndex === -1) {
      throw new Error(`Post with id ${id} not found`);
    }

    mockPosts[postIndex] = { ...mockPosts[postIndex], ...updates };
    return mockPosts[postIndex];
  }

  static async deletePost(id: number): Promise<void> {
    await delay(700);

    const postIndex = mockPosts.findIndex(p => p.id === id);
    if (postIndex === -1) {
      throw new Error(`Post with id ${id} not found`);
    }

    mockPosts.splice(postIndex, 1);
  }
}
