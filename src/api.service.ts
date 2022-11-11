import { apiFactory } from './utils';

export const loadUsers = (query?: URLSearchParams) => apiFactory<{ username: string }[]>('/users', query);
export const loadComments = (query?: URLSearchParams) => apiFactory('/comments', query);
export const loadPosts = (userId?: number, query?: URLSearchParams) => apiFactory(`/posts${userId ? '/' + userId : ''}`, query);
