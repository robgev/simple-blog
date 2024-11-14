import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import CommentRow from "../components/CommentRow";
import CommentEditor from "../components/CommentEditor";
import { axiosClient, fetcher } from "../utils/axios";
import { endpoints } from "../utils/endpoints";
import { CommentData } from "../validators";
import { TComment } from "../types";

export default function SinglePost() {
  const params = useParams();
  const queryClient = useQueryClient();
  const id = parseInt(params.id || "0");

  // Maybe show toast on error
  const { data: post, isLoading } = useQuery({
    queryKey: ["post", id],
    enabled: Boolean(id),
    queryFn: async () => fetcher(endpoints.posts.byId(id)),
  });

  const { data: comments, isLoading: isLoadingComments } = useQuery({
    queryKey: ["comments", id],
    enabled: Boolean(id),
    queryFn: async () => fetcher(endpoints.comments.list(id, 0)),
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
        {comments?.map((comment: TComment) => (
          <CommentRow
            key={comment.id}
            postId={id}
            onDelete={onDelete}
            {...comment}
          />
        ))}
      </div>
    </div>
  );
}
