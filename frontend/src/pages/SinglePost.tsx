import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import CommentRow from "../components/CommentRow";
import CommentEditor from "../components/CommentEditor";
import { axiosClient, fetcher } from "../utils/axios";
import { endpoints } from "../utils/endpoints";
import { CommentData } from "../validators";
import { TComment } from "../types";

export default function SinglePost() {
  const [page, setPage] = useState(0);
  const params = useParams();
  const queryClient = useQueryClient();
  const id = parseInt(params.id || "0");

  // Maybe show toast on error
  const { data: post, isLoading } = useQuery({
    queryKey: ["post", id],
    enabled: Boolean(id),
    queryFn: async () => fetcher(endpoints.posts.byId(id)),
  });

  const {
    data,
    isLoading: isLoadingComments,
    isPlaceholderData,
  } = useQuery({
    queryKey: ["comments", id, page],
    enabled: Boolean(id),
    queryFn: async () => fetcher(endpoints.comments.list(id, page)),
    placeholderData: keepPreviousData,
  });

  const deletePostMutation = useMutation({
    mutationFn: (commentId: number) =>
      axiosClient.delete(endpoints.comments.byId(id, commentId)),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["comments", id] });
    },
  });

  const onDelete = (commentId: number) => {
    deletePostMutation.mutate(commentId);
  };

  const onSubmit = async ({ content }: CommentData) => {
    const { data } = await axiosClient.post(endpoints.comments.root(id), {
      content,
    });

    if (data) {
      queryClient.refetchQueries({ queryKey: ["comments", id] });
    }
  };

  if (isLoading) return <span>Loading...</span>;

  return (
    <div>
      <h3>{post.title}</h3>
      <p className="w-full align-right">
        Created By: {post?.created_by?.email}
      </p>
      <h5>{post.content}</h5>
      <hr />
      <h4>Comments</h4>
      <div>
        <CommentEditor onSubmit={onSubmit} />
        {data?.items?.map((comment: TComment) => (
          <CommentRow
            key={comment.id}
            postId={id}
            onDelete={onDelete}
            {...comment}
          />
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
      </div>
    </div>
  );
}
