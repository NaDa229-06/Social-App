import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import CommentInput from "./CommentInput";
import {
  createReply,
  deleteComment,
  getCommentReplies,
  likeUnlikeComment,
  updateComment,
} from "../../apis/comments.api";
import {type Comment} from "../../interfaces/comment.interface"
import { timeAgo } from "../../features/utils/timeAgo";

interface CommentItemProps {
  comment: Comment;
  postId: string;
  currentUserId?: string;
  isReply?: boolean;
  onDeleted?: (commentId: string) => void;
}

function errMsg(error: any) {
  return error?.response?.data?.message ?? "Something went wrong";
}

export default function CommentItem({
  comment,
  postId,
  currentUserId,
  isReply = false,
  onDeleted,
}: CommentItemProps) {
  const [content, setContent] = useState(comment.content);
  const [likesCount, setLikesCount] = useState(
    comment.likesCount ?? comment.likes?.length ?? 0,
  );
  const [liked, setLiked] = useState(
    !!currentUserId && !!comment.likes?.includes(currentUserId),
  );
  const [repliesCount, setRepliesCount] = useState(comment.repliesCount ?? 0);
  const [replies, setReplies] = useState<Comment[]>([]);
  const [showReplies, setShowReplies] = useState(false);
  const [repliesLoaded, setRepliesLoaded] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  const author = comment.commentCreator;
  const isOwner = !!currentUserId && author?._id === currentUserId;

  async function toggleLike() {
    try {
      await likeUnlikeComment(postId, comment._id);
      setLikesCount((c) => c + (liked ? -1 : 1));
      setLiked((l) => !l);
    } catch (error) {
      toast.error(errMsg(error));
    }
  }

  async function toggleReplies() {
    if (!showReplies && !repliesLoaded) {
      try {
        const res = await getCommentReplies(postId, comment._id);
        setReplies(res.data.replies);
        setRepliesLoaded(true);
      } catch (error) {
        toast.error(errMsg(error));
        return;
      }
    }
    setShowReplies((s) => !s);
  }

  async function submitReply(text: string, image?: File) {
    try {
      const res = await createReply(postId, comment._id, text, image);
      const newReply: Comment = res.data.reply; 
      setReplies((r) => [...r, newReply]);
      setRepliesCount((c) => c + 1);
      setRepliesLoaded(true);
      setShowReplies(true);
      setReplyOpen(false);
    } catch (error) {
      toast.error(errMsg(error));
    }
  }

  async function saveEdit(text: string) {
    try {
      await updateComment(postId, comment._id, text);
      setContent(text);
      setEditing(false);
      toast.success("Comment updated");
    } catch (error) {
      toast.error(errMsg(error));
    }
  }

  async function remove() {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await deleteComment(postId, comment._id);
      onDeleted?.(comment._id);
      toast.success("Comment deleted");
    } catch (error) {
      toast.error(errMsg(error));
    }
  }

  const action = "text-xs font-semibold text-gray-500 hover:text-gray-800";

  return (
    <div className="flex gap-3">
      <Link to={`/profile/${author?._id}`} className="shrink-0">
        <img
          src={author?.photo}
          alt={author?.name}
          className={`${isReply ? "h-8 w-8" : "h-10 w-10"} rounded-full object-cover`}
        />
      </Link>

      <div className="min-w-0 flex-1">
        {editing ? (
          <CommentInput
            initialValue={content}
            allowImage={false}
            autoFocus
            onSubmit={saveEdit}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <div className="inline-block max-w-full rounded-2xl bg-gray-100 px-4 py-2">
            <Link to={`/profile/${author?._id}`} className="font-bold hover:underline">
              {author?.name}
            </Link>
            <span className="ml-2 text-xs text-gray-500">
              @{author?.username} · {timeAgo(comment.createdAt)}
            </span>
            {content && (
              <p className="mt-0.5 wrap-break-word whitespace-pre-wrap">{content}</p>
            )}
            {comment.image && (
              <img
                src={comment.image}
                alt="comment"
                className="mt-2 max-h-64 rounded-xl object-cover"
              />
            )}
          </div>
        )}

        {/* Actions */}
        {!editing && (
          <div className="mt-1 flex items-center gap-4 px-2">
            <button
              type="button"
              onClick={toggleLike}
              className={`${action} ${liked ? "text-blue-600!" : ""}`}
            >
              Like ({likesCount})
            </button>

            {!isReply && (
              <button type="button" onClick={() => setReplyOpen((o) => !o)} className={action}>
                Reply
              </button>
            )}

            {isOwner && (
              <>
                <button type="button" onClick={() => setEditing(true)} className={action}>
                  Edit
                </button>
                <button type="button" onClick={remove} className={`${action} text-red-500!`}>
                  Delete
                </button>
              </>
            )}
          </div>
        )}

        {/* Reply box */}
        {replyOpen && (
          <div className="mt-2">
            <CommentInput
              autoFocus
              placeholder={`Reply to ${author?.name}...`}
              onSubmit={submitReply}
              onCancel={() => setReplyOpen(false)}
            />
          </div>
        )}

        {/* Replies */}
        {!isReply && repliesCount > 0 && (
          <button
            type="button"
            onClick={toggleReplies}
            className="mt-1 px-2 text-xs font-semibold text-blue-600"
          >
            {showReplies ? "Hide replies" : `View replies (${repliesCount})`}
          </button>
        )}

        {showReplies && (
          <div className="mt-2 flex flex-col gap-3">
            {replies.map((r) => (
              <CommentItem
                key={r._id}
                comment={r}
                postId={postId}
                currentUserId={currentUserId}
                isReply
                onDeleted={(id) => {
                  setReplies((list) => list.filter((x) => x._id !== id));
                  setRepliesCount((c) => Math.max(0, c - 1));
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}