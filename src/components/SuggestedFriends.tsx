import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FiSearch, FiUserPlus, FiUserCheck, FiUsers } from "react-icons/fi";
import {
  followUnfollowUser,
  getFollowSuggestions,
} from "../apis/friends&followers.api";

interface Suggestion {
  _id: string;
  name: string;
  username: string;
  photo?: string;
  followersCount?: number;
}

export default function SuggestedFriends() {
  const [friends, setFriends] = useState<Suggestion[]>([]);
  const [followed, setFollowed] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await getFollowSuggestions(limit);
        setFriends(res.data.suggestions); // ← تأكدي من المسار بالـ console.log
      } catch (error: any) {
        toast.error(error?.response?.data?.message ?? "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [limit]);

  async function handleFollow(id: string) {
    try {
      await followUnfollowUser(id);
      setFollowed((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Something went wrong");
    }
  }

  const shown = friends.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.username.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <section className="rounded-2xl bg-white p-4 shadow-md">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-bold text-[#00298d]">
          <FiUsers size={20} /> Suggested Friends
        </h3>
        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-sm font-semibold text-gray-600">
          {friends.length}
        </span>
      </div>

      {/* Search */}
      <div className="mt-3 flex items-center gap-2 rounded-xl bg-gray-100 px-3 py-2">
        <FiSearch className="text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search friends..."
          className="w-full bg-transparent text-sm outline-none border-0"
        />
      </div>

    
      <ul className="mt-3 flex max-h-[60vh] flex-col gap-3 overflow-y-auto">
        {loading && <li className="p-4 text-center text-gray-500">Loading...</li>}

        {!loading && shown.length === 0 && (
          <li className="p-4 text-center text-gray-500">No suggestions</li>
        )}

        {shown.map((f) => {
          const isFollowed = followed.has(f._id);
          return (
            <li key={f._id} className="rounded-xl border border-gray-100 p-3">
              <div className="flex items-center gap-3">
                <Link to={`/profile/${f._id}`}>
                  <img
                    src={f.photo}
                    alt={f.name}
                    className="h-11 w-11 rounded-full object-cover"
                  />
                </Link>

                <Link to={`/profile/${f._id}`} className="min-w-0 flex-1">
                  <p className="truncate font-bold">{f.name}</p>
                  <p className="truncate text-sm text-gray-500">@{f.username}</p>
                </Link>

                <button
                  type="button"
                  onClick={() => handleFollow(f._id)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold ${
                    isFollowed
                      ? "bg-gray-100 text-gray-600"
                      : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                  }`}
                >
                  {isFollowed ? <FiUserCheck size={16} /> : <FiUserPlus size={16} />}
                  {isFollowed ? "Following" : "Follow"}
                </button>
              </div>

              <span className="mt-2 inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-500">
                {f.followersCount ?? 0} followers
              </span>
            </li>
          );
        })}
      </ul>

      {/* View more */}
      <button
        type="button"
        onClick={() => setLimit((l) => l + 5)}
        className="mt-3 w-full rounded-xl border border-gray-100 py-2.5 font-semibold hover:bg-gray-50"
      >
        View more
      </button>
    </section>
  );
}