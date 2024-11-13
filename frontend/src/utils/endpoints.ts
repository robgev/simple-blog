export const endpoints = {
  auth: {
    register: "/user/register",
    login: "/user/login",
    user: "/user/user",
  },
  posts: {
    byId: (id: number) => `/posts/${id}`,
    list: (page: number) => `/posts?page=${page}`,
    root: "/posts",
  },
  comments: {
    byId: (postId: number, id: number) => `/posts/${postId}/comments/${id}`,
    list: (postId: number, page: number) =>
      `/posts/${postId}/comments?page=${page}`,
    root: (postId: number) => `/posts/${postId}/comments`,
  },
};
