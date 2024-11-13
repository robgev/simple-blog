import { Link } from "react-router-dom";
import { TPost } from "../types";

const PostRow = ({ id, title, content, created_by: { email } }: TPost) => {
  return (
    <div className="border">
      <div className="flex">
        <div className="text-blue cursor-pointer">delete</div>
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
