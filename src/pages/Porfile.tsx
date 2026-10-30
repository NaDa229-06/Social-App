import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ProfileView, { type UserProfile } from "../features/ProfileView";
import type { Post } from "../interfaces/post.interface";
import {
  getBookmarks,
  getMyProfile,
  getUserPosts,
  getUserProfile,
  uploadProfilePhoto,
} from "../apis/profile.api";
import { followUnfollowUser} from "../apis/friends&followers.api"


export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [saved, setSaved] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const isOwner = !id;

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
  
        const profileRes = isOwner ? await getMyProfile() : await getUserProfile(id!);
        const profileUser: UserProfile = profileRes.data.user;
        setUser(profileUser);

         let isFollowing = profileUser.isFollowing;
        if (isFollowing === undefined && !isOwner) {
          const meRes = await getMyProfile();
          const myFollowing: (string | { _id: string })[] =
            meRes.data.user.following ?? [];
          isFollowing = myFollowing.some(
            (f) => (typeof f === "string" ? f : f._id) === profileUser._id,
          );
        }
        setFollowing(!!isFollowing);

   
        const postsRes = await getUserPosts(profileUser._id);
        setPosts(postsRes.data.posts);

     
        if (isOwner) {
          const bookmarksRes = await getBookmarks();
          setSaved(bookmarksRes.data.bookmarks);
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message ?? "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, isOwner]);

  async function handleToggleFollow() {
    if (!user) return;
    setFollowLoading(true);
    try {
      await followUnfollowUser(user._id);
      const nowFollowing = !following;
      setFollowing(nowFollowing);
      setUser((u) =>
        u
          ? { ...u, followersCount: Math.max(0, (u.followersCount ?? 0) + (nowFollowing ? 1 : -1)) }
          : u,
      );
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Something went wrong");
    } finally {
      setFollowLoading(false);
    }
  }

  async function handlePhotoSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await uploadProfilePhoto(file);
      const newPhoto = res.data?.photo;
      setUser((u) => (u ? { ...u, photo: newPhoto ?? URL.createObjectURL(file) } : u));
      toast.success("Photo updated");
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Upload failed");
    } finally {
      e.target.value = ""; 
    }
  }

  return (
    <>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handlePhotoSelected}
      />
      <ProfileView
        user={user}
        posts={posts}
        savedPosts={saved}
        loading={loading}
        isOwner={isOwner}
        isFollowing={following}
        followLoading={followLoading}
        onToggleFollow={handleToggleFollow}
        onChangePhoto={() => fileRef.current?.click()}
        onEditProfile={() => navigate("/change-password")}
      />
    </>
  );
}