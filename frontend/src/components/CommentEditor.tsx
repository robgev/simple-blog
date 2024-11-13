import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentSchema, CommentData } from "../validators";
import { AxiosError } from "axios";

type EditorProps = {
  content?: string;
  onSubmit: (data: CommentData) => void;
};

const Editor: React.FC<EditorProps> = ({ content, onSubmit }) => {
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CommentData>({
    resolver: zodResolver(commentSchema),
  });

  const submit = async (comment: CommentData) => {
    setError(null);

    try {
      onSubmit(comment);
    } catch (error) {
      setError((error as AxiosError).message);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Create New Post</h2>
      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <div className="flex justify-between align-center">
          <div>
            <textarea
              placeholder="Add new comment..."
              {...register("content", { value: content })}
              rows={2}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">
                {errors.content.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
          >
            {isSubmitting ? "..." : "Add"}
          </button>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </div>
  );
};

export default Editor;
