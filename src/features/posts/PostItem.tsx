import { useEffect, useRef, useState } from "react";
import { CiGlobe } from "react-icons/ci";
import { IoIosMore, IoMdRepeat } from "react-icons/io";
import { MdBookmark, MdBookmarkBorder } from "react-icons/md";
import { FaEdit, FaRegTrashAlt, FaRegComment } from "react-icons/fa";
import { AiOutlineLike } from "react-icons/ai";
import { IoShareSocialOutline } from "react-icons/io5";
import type { Post } from "../../interfaces/post.interface";
import { useNavigate, Link } from "react-router-dom";
import { timeAgo } from "../utils/timeAgo";
import CommentInput from "../../components/comments/CommentInput";
import { createComment } from "../../apis/comments.api";
import {
  bookmarkPost,
  deletePost,
  likePost,
  sharePost,
  updatePost,
} from "../../apis/posts.actions.api";
import ShareModal from "../../components/ShareModal";
import { toast } from "react-toastify";

interface PostItemProps {
  post: Post;
  currentUserId?: string; // الـ id بتاعي (بيجي من الـ Feed) علشان يظهر Edit و Delete
  onShared?: (post: Post) => void; // البوست الللي بشيره يظهر في الـ Feed
  onDeleted?: (postId: string) => void; // الـ Feed يشيل البوست من القايمة
  onUnsaved?: (postId: string) => void; // في تاب Saved يشيل البوست لما أعمل Unsave
}

function errMsg(error: any) {
  return error?.response?.data?.message ?? "Something went wrong";
}

export default function PostItem({
  post,
  currentUserId,
  onShared,
  onDeleted,
  onUnsaved,
}: PostItemProps) {
  const navigate = useNavigate();
  const isOwner = !!currentUserId && post.user._id === currentUserId;

  const [menuOpen, setMenuOpen] = useState(false);
  const initiallyLiked = !!(post as Post & { isLiked?: boolean; liked?: boolean })
    .isLiked || !!(post as Post & { liked?: boolean }).liked;
  const [liked, setLiked] = useState(initiallyLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount);

  // Share state
  const [shareOpen, setShareOpen] = useState(false);
  const [sharesCount, setSharesCount] = useState(post.sharesCount);
  const menuRef = useRef<HTMLDivElement>(null);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount);

  // Save / Edit state
  const [saved, setSaved] = useState(
    !!(post as Post & { bookmarked?: boolean }).bookmarked,
  );
  const [body, setBody] = useState(post.body ?? "");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(post.body ?? "");
  const [savingEdit, setSavingEdit] = useState(false);

  async function handleCreateComment(content: string, image?: File) {
    try {
      await createComment(post._id, content, image);
      setCommentsCount((c) => c + 1);
      setShowCommentBox(false);
      toast.success("Comment added");
    } catch (error: any) {
      toast.error(errMsg(error));
    }
  }

  // ---------- Like / Unlike ----------
  async function handleLike() {
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikesCount((c) => c + (wasLiked ? -1 : 1));
    try {
      await likePost(post._id);
    } catch (error) {
      setLiked(wasLiked);
      setLikesCount((c) => c + (wasLiked ? 1 : -1));
      toast.error(errMsg(error));
    }
  }

  // ---------- Share ----------
  async function handleShare(text: string) {
    try {
      const res = await sharePost(post._id, text);
      setSharesCount((c) => c + 1);
      setShareOpen(false);
      toast.success("Post shared");
      const newPost: Post | undefined = res.data?.post;
      if (newPost) onShared?.(newPost);
    } catch (error) {
      toast.error(errMsg(error));
    }
  }

  // ---------- Save / Unsave ----------
  async function handleSave() {
    setMenuOpen(false);
    try {
      await bookmarkPost(post._id);
      const nowSaved = !saved;
      setSaved(nowSaved);
      toast.success(nowSaved ? "Post saved" : "Post removed from saved");
      if (!nowSaved) onUnsaved?.(post._id);
    } catch (error) {
      toast.error(errMsg(error));
    }
  }

  // ---------- Edit ----------
  function handleEdit() {
    setMenuOpen(false);
    setDraft(body);
    setEditing(true);
  }

  async function handleSaveEdit() {
    const text = draft.trim();
    if (!text) return toast.error("Post can't be empty");

    setSavingEdit(true);
    try {
      await updatePost(post._id, text);
      setBody(text);
      setEditing(false);
      toast.success("Post updated");
    } catch (error) {
      toast.error(errMsg(error));
    } finally {
      setSavingEdit(false);
    }
  }

  // ---------- Delete ----------
  async function handleDelete() {
    setMenuOpen(false);
    if (!window.confirm("Delete this post?")) return;
    try {
      await deletePost(post._id);
      toast.success("Post deleted");
      onDeleted?.(post._id);
    } catch (error) {
      toast.error(errMsg(error));
    }
  }

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const menuItem =
    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-base hover:bg-gray-100";

  return (
    <article className="w-full min-w-0 rounded-2xl bg-white px-3 pt-4 pb-2 sm:px-5 sm:pt-5">
      {/* Header */}
      <header className="relative flex items-center gap-3 sm:gap-3.5">
        <img
          src={post.user.photo}
          alt="user"
          className="h-11 w-11 shrink-0 rounded-full object-cover sm:h-13 sm:w-13"
        />

        <div className="min-w-0 flex-1">
          <Link to={`/profile/${post.user._id}`}>
            <h4 className="truncate text-base font-bold hover:underline sm:text-[17px]">
              {post.user.name}
            </h4>
          </Link>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-xs">
            <span className="max-w-full truncate">@{post.user.username}</span>
            <span className="text-gray-500">. {timeAgo(post.createdAt)}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <CiGlobe size={14} />
              {post.privacy}
            </span>
          </div>
        </div>

        {/* 3 dots dropdown */}
        <div className="relative shrink-0" ref={menuRef}>
          <button
            type="button"
            aria-label="Post options"
            onClick={() => setMenuOpen((o) => !o)}
            className="grid h-9 w-9 place-items-center rounded-full text-gray-500 hover:bg-gray-100"
          >
            <IoIosMore size={20} />
          </button>

          {menuOpen && (
            <ul className="absolute right-0 top-11 z-10 w-56 max-w-[calc(100vw-2rem)] rounded-xl bg-white p-2 shadow-xl">
              <li>
                <button type="button" onClick={handleSave} className={menuItem}>
                  {saved ? <MdBookmark size={16} /> : <MdBookmarkBorder size={16} />}
                  {saved ? "Unsave post" : "Save post"}
                </button>
              </li>

              {/* Edit و Delete لصاحب البوست بس */}
              {isOwner && (
                <>
                  <li>
                    <button type="button" onClick={handleEdit} className={menuItem}>
                      <FaEdit size={16} /> Edit post
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={handleDelete}
                      className={`${menuItem} text-red-600`}
                    >
                      <FaRegTrashAlt size={16} /> Delete post
                    </button>
                  </li>
                </>
              )}
            </ul>
          )}
        </div>
      </header>

      {/* Body */}
      {editing ? (
        <div className="mt-3.5 mb-2.5">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={4}
            autoFocus
            className="w-full resize-none rounded-xl bg-gray-100 p-3 outline-none border-gray-300"
          />
          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-lg px-4 py-2 font-semibold text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveEdit}
              disabled={savingEdit}
              className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-60"
            >
              {savingEdit ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      ) : (
        <>
          {body && (
            <p className="mt-3.5 mb-2.5 text-[15px] whitespace-pre-wrap wrap-anywhere">
              {body}
            </p>
          )}

          {/* Original Shared Post (بيظهر حتى لو الشير من غير نص) */}
          {post.sharedPost && (
            <div className="mt-3 min-w-0 rounded-xl border border-gray-200 p-3 sm:p-4">
              <div className="flex flex-wrap items-center gap-2">
                <img
                  src={post.sharedPost.user.photo}
                  className="h-10 w-10 shrink-0 rounded-full object-cover"
                />

                <div className="min-w-0 flex-1">
                  <h4 className="truncate font-bold">{post.sharedPost.user.name}</h4>
                </div>

                <button
                  className="shrink-0 text-xs text-blue-600"
                  type="button"
                  onClick={() => navigate(`/posts/${post.sharedPost._id}`)}
                >
                  View original post
                </button>
              </div>

              {post.sharedPost.body && (
                <p className="mt-3 whitespace-pre-wrap wrap-anywhere">
                  {post.sharedPost.body}
                </p>
              )}

              {post.sharedPost.image && (
                <img
                  src={post.sharedPost.image}
                  className="mt-3 w-full rounded-lg object-cover"
                />
              )}
            </div>
          )}
        </>
      )}

      {post.image && (
        <img
          src={post.image}
          alt="post"
          className="mt-3.5 block max-h-130 w-full rounded-lg object-cover"
        />
      )}

      {/* Stats */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-1 py-3.5 text-gray-500">
        <span className="flex items-center gap-2 text-xs">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-blue-600 text-white">
            <AiOutlineLike size={13} />
          </span>
          {likesCount} likes
        </span>

        <span className="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-xs">
          <span className="inline-flex items-center gap-1">
            <IoMdRepeat size={12} /> {sharesCount} shares
          </span>
          <span>{commentsCount} comments</span>
          <button
            type="button"
            onClick={() => navigate(`/posts/${post._id}`)}
            className="font-semibold text-blue-600"
          >
            View details
          </button>
        </span>
      </div>

      {/* Actions */}
      <footer className="flex border-t border-gray-100 py-1.5">
        {[
          {
            label: "Like",
            icon: <AiOutlineLike size={18} />,
            onClick: handleLike,
            active: liked,
          },
          {
            label: "Comment",
            icon: <FaRegComment size={18} />,
            onClick: () => setShowCommentBox((s) => !s),
          },
          {
            label: "Share",
            icon: <IoShareSocialOutline size={18} />,
            onClick: () => setShareOpen(true),
          },
        ].map(({ label, icon, onClick, active }) => (
          <button
            key={label}
            type="button"
            onClick={onClick}
            aria-label={label}
            className={`flex flex-1 items-center justify-center gap-2.5 rounded-xl p-3 text-sm hover:bg-gray-100 ${
              active ? "text-blue-600" : "text-gray-600"
            }`}
          >
            {icon} <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </footer>

      {/* Top comment */}
      {post.topComment && (
        <div className="mx-1 mb-3 rounded-xl bg-gray-50 p-3">
          <p className="text-xs font-bold text-gray-500">TOP COMMENT</p>
          <div className="mt-2 flex items-start gap-2">
            <img
              src={post.topComment.commentCreator?.photo}
              className="h-8 w-8 shrink-0 rounded-full object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">
                {post.topComment.commentCreator?.name}
              </p>
              <p className="text-sm wrap-anywhere">{post.topComment.content}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate(`/posts/${post._id}`)}
            className="mt-2 text-sm font-semibold text-blue-600"
          >
            View all comments
          </button>
        </div>
      )}

      {/* Create comment */}
      {showCommentBox && (
        <div className="px-1 pb-3">
          <CommentInput autoFocus onSubmit={handleCreateComment} />
        </div>
      )}

      {/* Share modal */}
      {shareOpen && (
        <ShareModal
          post={post}
          onClose={() => setShareOpen(false)}
          onShare={handleShare}
        />
      )}
    </article>
  );
}

