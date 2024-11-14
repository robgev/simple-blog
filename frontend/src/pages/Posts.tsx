import { useState } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Link } from "react-router-dom";

import PostRow from "../components/PostRow";
import { axiosClient, fetcher } from "../utils/axios";
import { endpoints } from "../utils/endpoints";
import { TPost } from "../types";

export default function Posts() {
  const [page, setPage] = useState(0);
  const queryClient = useQueryClient();
  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: ["posts", page],
    queryFn: async () => fetcher(endpoints.posts.list(page)),
    placeholderData: keepPreviousData,
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
      {data?.items.map((post: TPost) => (
        <PostRow key={post.id} {...post} onDelete={onDelete} />
      ))}
      <span>Current Page: {page + 1}</span>
      <button
        onClick={() => setPage((old) => Math.max(old - 1, 0))}
        disabled={page === 0}
      >
        Previous Page
      </button>
      <button
        onClick={() => {
          if (!isPlaceholderData && data.hasMore) {
            setPage((old) => old + 1);
          }
        }}
        // Disable the Next Page button until we know a next page is available
        disabled={isPlaceholderData || !data?.hasMore}
      >
        Next Page
      </button>
    </>
  );
}
