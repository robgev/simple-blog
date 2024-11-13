import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import PostRow from "../components/PostRow";
import { fetcher } from "../utils/axios";
import { endpoints } from "../utils/endpoints";
import { TPost } from "../types";

export default function Posts() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["test"],
    queryFn: async () => fetcher(endpoints.posts.list(0)),
  });

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
        <PostRow {...post} />
      ))}
    </>
  );
}
