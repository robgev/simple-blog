import { TComment } from "../types";

const CommentRow = ({ id, content, by_user: { email } }: TComment) => {
  return (
    <div className="border">
      <span>{email}</span> said:
      <p className="w-full align-right">{content}</p>
    </div>
  );
};

export default CommentRow;
