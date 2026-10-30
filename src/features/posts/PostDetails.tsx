import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { getSinglePost} from "../../apis/singlePost.api";
import type { Post } from "../../interfaces/post.interface";
import PostItem from "./PostItem";
import CommentsSection from "../../components/comments/CommentSection";

export default function PostDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    setLoading(true);
    setError("");

    getSinglePost(id)
      .then((data) => {
        if (!cancelled) setPost(data);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6">
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate("/feed")}
        className="mb-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 font-semibold shadow hover:bg-gray-100"
      >
        <FiArrowLeft size={18} /> Back
      </button>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {post && (
        <>
        <PostItem post={post} key={post._id} />
       <CommentsSection postId={post._id} />
       </>
      )}
    </div>
  );
}