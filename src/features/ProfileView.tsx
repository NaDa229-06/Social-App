import { useState } from "react";
import { FiCamera, FiEdit2, FiMail, FiUserCheck, FiUserPlus } from "react-icons/fi";
import PostItem from "../features/posts/PostItem";
import type { Post } from "../interfaces/post.interface";


export interface UserProfile {
  _id: string;
  name: string;
  username: string;
  email?: string;
  photo?: string;
  cover?: string;
  followersCount?: number;
  followingCount?: number;
  bookmarksCount?: number;
  isFollowing?: boolean; 
}

interface ProfileViewProps {
  user: UserProfile | null;
  posts: Post[];
  savedPosts?: Post[];
  loading?: boolean;
  isOwner?: boolean;
  isFollowing?: boolean;
  followLoading?: boolean;
  onToggleFollow?: () => void;
  onEditProfile?: () => void;
  onChangePhoto?: () => void;
  onChangeCover?: () => void;
}

type Tab = "posts" | "saved";

export default function ProfileView({
  user,
  posts,
  savedPosts = [],
  loading = false,
  isOwner = true,
  isFollowing = false,
  followLoading = false,
  onToggleFollow,
  onEditProfile,
  onChangePhoto,
}: ProfileViewProps) {
  const [tab, setTab] = useState<Tab>("posts");

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-6xl animate-pulse px-3 py-4 sm:px-4 sm:py-6">
        <div className="h-36 rounded-2xl bg-gray-200 sm:h-48" />
        <div className="mt-4 h-24 rounded-2xl bg-gray-200" />
      </div>
    );
  }

  if (!user) return null;

  const stats = [
    { label: "Posts", value: posts.length },
    { label: "Followers", value: user.followersCount ?? 0 },
    { label: "Following", value: user.followingCount ?? 0 },
  ];

  const list = tab === "posts" ? posts : savedPosts;

  return (
    <div className="mx-auto w-full max-w-6xl px-3 py-4 sm:px-4 sm:py-6">
      {/* Header card */}
      <section className="overflow-hidden rounded-2xl bg-white shadow-md">
        {/* Cover */}
        <div className="relative h-36 bg-linear-to-r from-[#00298d] to-blue-400 sm:h-48 md:h-56">
          {user.cover && (
            <img
              src={user.cover}
              alt="cover"
              className="h-full w-full object-cover"
            />
          )}
        </div>

        {/* Info */}
        <div className="px-4 pb-5 sm:px-5">
          <div className="-mt-12 flex flex-wrap items-end justify-between gap-3 sm:-mt-14">
            <div className="relative">
              <img
                src={user.photo}
                alt={user.name}
                className="h-24 w-24 rounded-full border-4 border-white bg-gray-100 object-cover sm:h-28 sm:w-28"
              />
              {isOwner && (
                <button
                  type="button"
                  aria-label="Change photo"
                  onClick={onChangePhoto}
                  className="absolute right-0 bottom-0 grid h-8 w-8 place-items-center rounded-full bg-white shadow hover:bg-gray-100 sm:right-1 sm:bottom-1"
                >
                  <FiCamera size={16} />
                </button>
              )}
            </div>

            {isOwner && (
              <button
                type="button"
                onClick={onEditProfile}
                className="inline-flex items-center gap-2 rounded-lg bg-[#00298d] px-3 py-2 text-sm font-semibold text-white hover:opacity-90 sm:px-4 sm:text-base"
              >
                <FiEdit2 size={16} /> Change password
              </button>
            )}

            {!isOwner && (
              <button
                type="button"
                onClick={onToggleFollow}
                disabled={followLoading}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold disabled:opacity-60 sm:px-4 sm:text-base ${
                  isFollowing
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    : "bg-[#00298d] text-white hover:opacity-90"
                }`}
              >
                {isFollowing ? <FiUserCheck size={16} /> : <FiUserPlus size={16} />}
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>

          <h1 className="mt-3 text-xl font-bold wrap-anywhere sm:text-2xl">
            {user.name}
          </h1>
          <p className="text-gray-500 wrap-anywhere">@{user.username}</p>
          {user.email && (
            <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
              <FiMail size={14} className="shrink-0" />
              <span className="min-w-0 wrap-anywhere">{user.email}</span>
            </p>
          )}

          {/* Stats */}
          <div className="mt-5 grid grid-cols-3 divide-x divide-gray-100 rounded-xl bg-gray-50 py-3 text-center">
            {stats.map((s) => (
              <div key={s.label} className="min-w-0 px-1">
                <p className="text-lg font-bold sm:text-xl">{s.value}</p>
                <p className="truncate text-xs text-gray-500 sm:text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="mt-4 flex gap-2 rounded-xl bg-white p-1.5 shadow-sm">
        {(
          [
            { key: "posts", label: "My Posts" },
            { key: "saved", label: "Saved" },
          ] as { key: Tab; label: string }[]
        ).map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold sm:text-base ${
              tab === key
                ? "bg-[#00298d] text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Posts mine OR saved */}
      <div className="mt-4 flex flex-col gap-4">
        {list.length === 0 ? (
          <p className="rounded-2xl bg-white p-8 text-center text-gray-500 shadow-sm">
            No posts yet.
          </p>
        ) : (
          list.map((post) => <PostItem key={post._id} post={post} />)
        )}
      </div>
    </div>
  );
}