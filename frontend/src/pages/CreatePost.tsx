import React from "react";
import { useNavigate } from "react-router-dom";

import { PostData } from "../validators";
import { axiosClient } from "../utils/axios";
import { endpoints } from "../utils/endpoints";
import Editor from "../components/Editor";

const CreatePost: React.FC = () => {
  const navigate = useNavigate();

  const onSubmit = async ({ title, content }: PostData) => {
    const { data } = await axiosClient.post(endpoints.posts.root, {
      title,
      content,
    });

    if (data) {
      navigate("/posts");
    }
  };

  return <Editor onSubmit={onSubmit} />;
};

export default CreatePost;
