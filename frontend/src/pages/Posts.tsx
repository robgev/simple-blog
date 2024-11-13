import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import PostRow from "../components/PostRow";
import { axiosClient, fetcher } from "../utils/axios";
import { endpoints } from "../utils/endpoints";
import { TPost } from "../types";

export default function Posts() {
  const queryClient = useQueryClient();
  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => fetcher(endpoints.posts.list(0)),
  });

  const deletePostMutation = useMutation({
    mutationFn: (id: number) => axiosClient.delete(endpoints.posts.byId(id)),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["posts"] });
    },
  });

  const onDelete = (id: number) => {
    deletePostMutation.mutate(id);
  };

  if (isLoading) return <span>Loading...</span>;

  return (
    <>
      <div className="flex align-center">
        <h2 className="text-xl mr-5">Simple Blog Posts</h2>
        <Link to="/post/create" className="align-right">
          Create new
        </Link>
      </div>
      {posts.map((post: TPost) => (
        <PostRow key={post.id} {...post} onDelete={onDelete} />
      ))}
    </>
  );
}
