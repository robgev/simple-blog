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
    byId: (id: string) => `/comments/${id}`,
    list: (page: number) => `/posts?page=${page}`,
    root: "/comments",
  }
}
