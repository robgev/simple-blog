export type TUser = {
  id: string;
  email: string;
};

export type TPost = {
  id: number;
  title: string;
  content: string;
  created_by: TUser;
};

export type TComment = {
  id: number;
  content: string;
  by_user: TUser;
};
