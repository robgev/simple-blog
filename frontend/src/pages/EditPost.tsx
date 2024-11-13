import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import { PostData } from "../validators";
import { axiosClient, fetcher } from "../utils/axios";
import { endpoints } from "../utils/endpoints";
import Editor from "../components/Editor";

const EditPost: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const id = parseInt(params.id || "0");

  // Maybe show toast on error
  const { data: post, isLoading } = useQuery({
    queryKey: ["post", id],
    enabled: Boolean(id),
    queryFn: async () => fetcher(endpoints.posts.byId(id)),
  });

  const onSubmit = async ({ title, content }: PostData) => {
    const { data } = await axiosClient.put(endpoints.posts.byId(id), {
      title,
      content,
    });

    if (data) {
      navigate("/posts");
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <Editor title={post.title} content={post.content} onSubmit={onSubmit} />
  );
};

export default EditPost;
