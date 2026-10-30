
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getPosts } from "../apis/posts.api";
import { getHomeFeed } from "../apis/posts.actions.api";
import {
  getBookmarks,
  getMyProfile,
  getUserPosts,
} from "../apis/profile.api";
import PostItem from "../features/posts/PostItem";
import CreatePost from "../components/CreatePost";
import FeedSidebar, { type FeedTab } from "../components/FeedSideBar";
import SuggestedFriends from "../components/SuggestedFriends";
import type { Post } from "../interfaces/post.interface";

const emptyText: Record<FeedTab, string> = {
  feed: "No posts in your feed yet.",
  mine: "You haven't posted anything yet.",
  community: "No posts yet.",
  saved: "You have no saved posts.",
};

export default function Feed() {
  const [me, setMe] = useState<{ _id: string; name: string; photo?: string } | null>(null);

  useEffect(() => {
    getMyProfile()
      .then((res) => setMe(res.data.user))
      .catch(() => {});
  }, []);
  const [tab, setTab] = useState<FeedTab>("feed");
  const [postsArr, setPostsArr] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tab === "mine" && !me) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        let posts: Post[] = [];

        if (tab === "feed") {
          const res = await getHomeFeed();
          posts = res.data.posts; 
        } else if (tab === "mine") {
          const res = await getUserPosts(me!._id);
          posts = res.data.posts;
        } else if (tab === "community") {
          const res = await getPosts();
          posts = res?.data?.posts;
        } else {
          const res = await getBookmarks();
          posts = res.data.bookmarks;
        }

        if (!cancelled) setPostsArr(posts ?? []);
      } catch (error: any) {
        if (!cancelled) {
          toast.error(error?.response?.data?.message ?? "Something went wrong");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [tab, me]);

  function handleCreated(post: Post) {
    if (tab !== "saved") setPostsArr((list) => [post, ...list]);
  }

  function removePost(id: string) {
    setPostsArr((list) => list.filter((p) => p._id !== id));
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl gap-4 px-4 py-4">
      {/* Left: filters */}
      <aside className="hidden lg:block lg:w-1/4">
        <div className="sticky top-20 self-start">
          <FeedSidebar active={tab} onChange={setTab} />
        </div>
      </aside>

      {/* Middle: create post + posts */}
      <main className="flex w-full flex-col gap-4 lg:w-2/4">

        <div className="lg:hidden">
          <FeedSidebar active={tab} onChange={setTab} />
        </div>

        <CreatePost user={me} onCreated={handleCreated} />

        {loading && <p className="p-4 text-center text-gray-500">Loading...</p>}

        {!loading && postsArr.length === 0 && (
          <p className="rounded-2xl bg-white p-8 text-center text-gray-500 shadow-sm">
            {emptyText[tab]}
          </p>
        )}

        {!loading &&
          postsArr.map((post) => (
            <PostItem
              key={post._id}
              post={post}
              currentUserId={me?._id}
              onShared={handleCreated}
              onDeleted={removePost}
              onUnsaved={tab === "saved" ? removePost : undefined}
            />
          ))}
      </main>

      {/* Right: suggestions */}
      <aside className="hidden lg:block lg:w-1/4">
        <div className="sticky top-20 self-start">
          <SuggestedFriends />
        </div>
      </aside>
    </div>
  );
}