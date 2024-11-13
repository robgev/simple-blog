import { Link } from "react-router-dom";
import { TPost } from "../types";

type PostRowProps = TPost & {
  onDelete: (id: number) => void;
};

const PostRow = ({
  id,
  title,
  content,
  created_by: { email },
  onDelete,
}: PostRowProps) => {
  const handleDelete = () => {
    onDelete(id);
  };

  return (
    <div className="border">
      <div className="flex">
        <button onClick={handleDelete}>delete</button>
        <Link
          to={`/post/${id}/edit`}
          className="text-inherit hover:text-inherit"
        >
          <button>edit</button>
        </Link>
      </div>
      <Link to={`/post/${id}`}>
        <h3>{title}</h3>
      </Link>
      <h5>{content.substring(0, 20)}...</h5>
      <p className="w-full align-right">Created By: {email}</p>
    </div>
  );
};

export default PostRow;
