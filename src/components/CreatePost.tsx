import { useEffect, useRef, useState } from "react";
import { FiImage, FiSend, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import { createPost } from "../apis/posts.actions.api";
import type { Post } from "../interfaces/post.interface";

interface CreatePostProps {
  user: { name: string; photo?: string } | null;
  onCreated: (post: Post) => void;
}

export default function CreatePost({ user, onCreated }: CreatePostProps) {
  const me = user;
  const fileRef = useRef<HTMLInputElement>(null);

  const [body, setBody] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [privacy, setPrivacy] = useState("public");
  const [preview, setPreview] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!image) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(image);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  const canPost = (body.trim() || image) && !sending;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canPost) return;

    setSending(true);
    try {
      const res = await createPost(body.trim(), image ?? undefined ,privacy);
      onCreated(res.data.post); 
      setBody("");
      setImage(null);
      toast.success("Post created");
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Something went wrong");
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-5 shadow-md">
      {/* User + privacy */}
      <div className="flex items-center gap-3">
        <img
          src={me?.photo}
          alt={me?.name}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div>
          <p className="font-bold">{me?.name}</p>
        
            <select
            value={privacy}
            onChange={(e) => setPrivacy(e.target.value)}
            className="text-sm  text-center text-gray-500 outline-none border-none rounded-full bg-slate-100 px-1"
          >
            <option value="public">Public</option>
            <option value="following">Followers</option>
            <option value="only_me">Only me</option>
          </select>
         
          
          
        </div>
      </div>

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={`What's on your mind, ${me?.name?.trim() ?? ""}?`}
        rows={4}
        className="mt-4 w-full resize-none rounded-2xl bg-gray-50 p-4 outline-none border-gray-300"
      />

      {/* Image preview */}
      {preview && (
        <div className="relative mt-3 w-fit">
          <img src={preview} alt="preview" className="max-h-64 rounded-xl object-cover" />
          <button
            type="button"
            aria-label="Remove image"
            onClick={() => setImage(null)}
            className="absolute top-2 right-2 grid h-7 w-7 place-items-center rounded-full bg-black/60 text-white"
          >
            <FiX size={16} />
          </button>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setImage(file);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 font-semibold text-green-600 hover:bg-gray-100"
        >
          <FiImage size={20} /> Photo
        </button>

        <button
          type="submit"
          disabled={!canPost}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 font-semibold text-white disabled:opacity-40"
        >
          {sending ? "Posting..." : "Post"} <FiSend size={16} />
        </button>
      </div>
    </form>
  );
}

