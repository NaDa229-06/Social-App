import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";
import { createComment, getPostComments} from "../../apis/comments.api";
import { getMyProfile } from "../../apis/profile.api";
import {type Comment} from "../../interfaces/comment.interface"


export default function CommentsSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [commentsRes, meRes] = await Promise.all([
          getPostComments(postId),
          getMyProfile(),
        ]);
        setComments(commentsRes.data.comments); 
        setCurrentUserId(meRes.data.user._id);
      } catch (error: any) {
        toast.error(error?.response?.data?.message ?? "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [postId]);

  async function handleCreate(content: string, image?: File) {
    try {
      const res = await createComment(postId, content, image);
      const newComment: Comment = res.data.comment; 
      setComments((c) => [newComment, ...c]);
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Something went wrong");
    }
  }

  return (
    <section className="mt-4 rounded-2xl bg-white p-5 shadow-md">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
        Comments
        <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-sm text-blue-600">
          {comments.length}
        </span>
      </h2>

      <CommentInput onSubmit={handleCreate} placeholder="Write a comment..." />

      {loading && <p className="mt-4 text-gray-500">Loading...</p>}

      {!loading && comments.length === 0 && (
        <p className="mt-4 text-center text-gray-500">No comments yet. Be the first!</p>
      )}

      <div className="mt-5 flex flex-col gap-5">
        {comments.map((c) => (
          <CommentItem
            key={c._id}
            comment={c}
            postId={postId}
            currentUserId={currentUserId}
            onDeleted={(id) => setComments((list) => list.filter((x) => x._id !== id))}
          />
        ))}
      </div>
    </section>
  );
}