import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import CommentRow from "../components/CommentRow";
import { fetcher } from "../utils/axios";
import { endpoints } from "../utils/endpoints";
import { TComment } from "../types";

export default function SinglePost() {
  const { id = "" } = useParams();

  // Maybe show toast on error
  const { data: post, isLoading } = useQuery({
    queryKey: ["post", id],
    enabled: Boolean(id),
    queryFn: async () => fetcher(endpoints.posts.byId(id || "")),
  });

  const { data: comments, isLoading: isLoadingComments } = useQuery({
    queryKey: ["comments", id],
    enabled: Boolean(id),
    queryFn: async () => fetcher(endpoints.comments.list(id, 0)),
  });

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
        {comments?.map((comment: TComment) => (
          <CommentRow key={comment.id} {...comment} />
        ))}
      </div>
    </div>
  );
}
