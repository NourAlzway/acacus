import { createStore } from 'acacus';
import { ApiService } from './ApiService';
import { Post, User } from './types';

interface BlogState {
  posts: Post[];
  users: User[];
  selectedPostId: number | null;
}

const initialState: BlogState = {
  posts: [],
  users: [],
  selectedPostId: null,
};

export const blogStore = createStore(initialState)
  // Regular synchronous actions
  .action('selectPost', (_state, postId: number | null) => ({
    selectedPostId: postId,
  }))
  .action('clearPosts', () => ({
    posts: [],
  }))
  .action('setPosts', (_state, posts: Post[]) => ({
    posts,
  }))
  .action('setUsers', (_state, users: User[]) => ({
    users,
  }))
  .action('addPost', (state, post: Post) => ({
    posts: [...state.posts, post],
  }))
  .action('updatePostInList', (state, updatedPost: Post) => ({
    posts: state.posts.map(p => (p.id === updatedPost.id ? updatedPost : p)),
  }))
  .action('removePost', (state, postId: number) => ({
    posts: state.posts.filter(p => p.id !== postId),
  }))

  // Async actions - automatically get loading/error/data states
  .asyncAction('fetchPosts', async () => {
    const posts = await ApiService.fetchPosts();
    return posts;
  })
  .asyncAction('fetchPost', async (_state, postId: number) => {
    const post = await ApiService.fetchPost(postId);
    return post;
  })
  .asyncAction('fetchUsers', async () => {
    const users = await ApiService.fetchUsers();
    return users;
  })
  .asyncAction(
    'createPost',
    async (
      _state,
      postData: { title: string; body: string; userId: number }
    ) => {
      const newPost = await ApiService.createPost(postData);
      return newPost;
    }
  )
  .asyncAction(
    'updatePost',
    async (_state, postId: number, updates: Partial<Post>) => {
      const updatedPost = await ApiService.updatePost(postId, updates);
      return updatedPost;
    }
  )
  .asyncAction('deletePost', async (_state, postId: number) => {
    await ApiService.deletePost(postId);
    return postId; // Return the ID for UI updates
  })

  .build();

// Subscribe to handle async operation results
blogStore.subscribe((state, prevState) => {
  const currentState = state;
  const prevStateAny = prevState;

  // Update posts after fetch - check if we have new data and it's different
  if (
    currentState.fetchPosts?.data &&
    (!prevStateAny.fetchPosts?.data ||
      currentState.fetchPosts.data !== prevStateAny.fetchPosts.data)
  ) {
    const setPosts = blogStore.use(actions => actions.setPosts);
    setPosts(currentState.fetchPosts.data);
  }

  // Update users after fetch - check if we have new data and it's different
  if (
    currentState.fetchUsers?.data &&
    (!prevStateAny.fetchUsers?.data ||
      currentState.fetchUsers.data !== prevStateAny.fetchUsers.data)
  ) {
    const setUsers = blogStore.use(actions => actions.setUsers);
    setUsers(currentState.fetchUsers.data);
  }

  // Add post after create - check if we have new data and it's different
  if (
    currentState.createPost?.data &&
    (!prevStateAny.createPost?.data ||
      currentState.createPost.data !== prevStateAny.createPost.data)
  ) {
    const newPost = currentState.createPost.data;
    // Check if post doesn't already exist in the list
    const postExists = currentState.posts.some(
      (p: Post) => p.id === newPost.id
    );
    if (!postExists) {
      const addPost = blogStore.use(actions => actions.addPost);
      addPost(newPost);
    }
  }

  // Update post after edit - check if we have new data and it's different
  if (
    currentState.updatePost?.data &&
    (!prevStateAny.updatePost?.data ||
      currentState.updatePost.data !== prevStateAny.updatePost.data)
  ) {
    const updatePostInList = blogStore.use(actions => actions.updatePostInList);
    updatePostInList(currentState.updatePost.data);
  }

  // Remove post after delete - check if we have new data and it's different
  if (
    currentState.deletePost?.data &&
    (!prevStateAny.deletePost?.data ||
      currentState.deletePost.data !== prevStateAny.deletePost.data)
  ) {
    const removePost = blogStore.use(actions => actions.removePost);
    removePost(currentState.deletePost.data);
  }
});
