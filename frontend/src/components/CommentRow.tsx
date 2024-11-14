import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import CommentEditor from "./CommentEditor";
import { useUser } from "../hooks/user";
import { TComment } from "../types";
import { CommentData } from "../validators";
import { axiosClient } from "../utils/axios";
import { endpoints } from "../utils/endpoints";

type CommentRowProps = TComment & {
  postId: number;
  onDelete: (id: number) => void;
};

const CommentRow = ({
  id,
  postId,
  content,
  by_user: { id: userId, email },
  onDelete,
}: CommentRowProps) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const { user, isLoadingUser } = useUser();

  const handleDelete = () => {
    onDelete(id);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const onSubmit = async ({ content }: CommentData) => {
    const { data } = await axiosClient.put(
      endpoints.comments.byId(postId, id),
      {
        content,
      },
    );

    if (data) {
      queryClient.refetchQueries({ queryKey: ["comments", postId] });
      setIsEditing(false);
    }
  };

  if (isLoadingUser) return null;

  return (
    <div className="border">
      {user.id === userId && (
        <div className="flex">
          <button onClick={handleDelete}>delete</button>
          <button onClick={handleEditClick}>edit</button>
        </div>
      )}
      {isEditing ? (
        <CommentEditor content={content} onSubmit={onSubmit} />
      ) : (
        <>
          <span>{email}</span> said:
          <p className="w-full align-right">{content}</p>
        </>
      )}
    </div>
  );
};

export default CommentRow;
