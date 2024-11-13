export const endpoints = {
  auth: {
    register: "/user/register",
    login: "/user/login",
    user: "/user/user",
  },
  posts: {
    byId: (id: string) => `/posts/${id}`,
    list: (page: number) => `/posts?page=${page}`,
    root: "/posts",
  },
  comments: {
    byId: (postId: string, id: string) => `/posts/${postId}/comments/${id}`,
    list: (postId: string, page: number) =>
      `/posts/${postId}/comments?page=${page}`,
    root: (postId: string) => `/posts/${postId}/comments`,
  },
};
