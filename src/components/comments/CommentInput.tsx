import { useEffect, useRef, useState } from "react";
import { FiImage, FiSend, FiX } from "react-icons/fi";

interface CommentInputProps {
  onSubmit: (content: string, image?: File) => Promise<void>;
  placeholder?: string;
  initialValue?: string;
  autoFocus?: boolean;
  allowImage?: boolean; 
  onCancel?: () => void;
}

export default function CommentInput({
  onSubmit,
  placeholder = "Write a comment...",
  initialValue = "",
  autoFocus = false,
  allowImage = true,
  onCancel,
}: CommentInputProps) {
  const [value, setValue] = useState(initialValue);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  
  useEffect(() => {
    if (!image) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(image);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setImage(file);
    e.target.value = "";
  }

  const canSend = (value.trim() || image) && !sending;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSend) return;

    setSending(true);
    try {
      await onSubmit(value.trim(), image ?? undefined);
      setValue("");
      setImage(null);
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      {/* Image preview */}
      {preview && (
        <div className="relative w-fit">
          <img src={preview} alt="preview" className="max-h-40 rounded-xl object-cover" />
          <button
            type="button"
            aria-label="Remove image"
            onClick={() => setImage(null)}
            className="absolute top-1 right-1 grid h-6 w-6 place-items-center rounded-full bg-black/60 text-white"
          >
            <FiX size={14} />
          </button>
        </div>
      )}

      <div className="flex items-end gap-2">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          rows={1}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
          className="max-h-32 min-h-11 flex-1 resize-none rounded-2xl bg-gray-100 px-4 py-2.5 outline-none border-gray-300"
        />

        {allowImage && (
          <>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />
            <button
              type="button"
              aria-label="Add image"
              onClick={() => fileRef.current?.click()}
              className="grid h-11 w-11 place-items-center rounded-full text-gray-500 hover:bg-gray-100"
            >
              <FiImage size={20} />
            </button>
          </>
        )}

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full px-3 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={!canSend}
          aria-label="Send"
          className="grid h-11 w-11 place-items-center rounded-full bg-blue-600 text-white disabled:opacity-40"
        >
          <FiSend size={18} />
        </button>
      </div>
    </form>
  );
}