import { Link } from "react-router-dom";
import { TPost } from "../types";
import { useUser } from "../hooks/user";

type PostRowProps = TPost & {
  onDelete: (id: number) => void;
};

const PostRow = ({
  id,
  title,
  content,
  created_by: { id: userId, email },
  onDelete,
}: PostRowProps) => {
  const { user, isLoadingUser } = useUser();
  const handleDelete = () => {
    onDelete(id);
  };

  if (isLoadingUser) return null;

  return (
    <div className="border">
      {user?.id === userId && (
        <div className="flex">
          <button onClick={handleDelete}>delete</button>
          <Link
            to={`/post/${id}/edit`}
            className="text-inherit hover:text-inherit"
          >
            <button>edit</button>
          </Link>
        </div>
      )}
      <Link to={`/post/${id}`}>
        <h3>{title}</h3>
      </Link>
      <h5>{content.substring(0, 20)}...</h5>
      <p className="w-full align-right">Created By: {email}</p>
    </div>
  );
};

export default PostRow;
