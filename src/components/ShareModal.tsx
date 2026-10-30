import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import type { Post } from "../interfaces/post.interface";

interface ShareModalProps {
  post: Post; 
  onClose: () => void;
  onShare: (text: string) => Promise<void>;
}

export default function ShareModal({ post, onClose, onShare }: ShareModalProps) {
  const [text, setText] = useState("");
  const [sharing, setSharing] = useState(false);

  // يقفل المودال + نمنع سكرول الصفحة وهو مفتوح
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  async function handleShare() {
    setSharing(true);
    try {
      await onShare(text.trim());
    } finally {
      setSharing(false);
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Share post</h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full hover:bg-gray-100"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* My comment */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Say something about this..."
          rows={3}
          autoFocus
          className="mt-4 w-full resize-none rounded-xl border border-gray-200 p-3 outline-none focus:border-blue-400"
        />

        {/* Original post preview */}
        <div className="mt-4 rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <img
              src={post.user.photo}
              alt={post.user.name}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div>
              <p className="font-bold">{post.user.name}</p>
              <p className="text-sm text-gray-500">@{post.user.username}</p>
            </div>
          </div>

          {post.body && (
            <p className="mt-3 whitespace-pre-wrap wrap-anywhere">{post.body}</p>
          )}
          {post.image && (
            <img
              src={post.image}
              alt="post"
              className="mt-3 max-h-80 w-full rounded-lg object-cover"
            />
          )}
        </div>

        {/* Actions */}
        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-5 py-2.5 font-semibold hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleShare}
            disabled={sharing}
            className="rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white disabled:opacity-60"
          >
            {sharing ? "Sharing..." : "Share now"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}