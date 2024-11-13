import { useQuery } from "@tanstack/react-query";

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
      {posts.map((post: TPost) => (
        <PostRow {...post} />
      ))}
    </>
  );
}
