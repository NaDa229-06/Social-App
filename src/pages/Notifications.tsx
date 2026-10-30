import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiCheck, FiHeart, FiMessageCircle, FiRepeat, FiUserPlus } from "react-icons/fi";
import { IoCheckmarkDone } from "react-icons/io5";
import {
  getNotifications,
  getUnreadCount,
  markAllAsRead,
  markNotificationAsRead,
} from "../apis/notifications.api";
import { type Notification} from "../interfaces/notification.interface"
import { timeAgo } from "../features/utils/timeAgo";

type Tab = "all" | "unread";

function errMsg(error: any) {
  return error?.response?.data?.message ?? "Something went wrong";
}

function describe(type: string) {
  const t = type.toLowerCase();
  if (t.includes("like"))
    return { text: "liked your post", icon: <FiHeart size={16} />, color: "text-red-500" };
  if (t.includes("comment") || t.includes("reply"))
    return { text: "commented on your post", icon: <FiMessageCircle size={16} />, color: "text-blue-600" };
  if (t.includes("share"))
    return { text: "shared your post", icon: <FiRepeat size={16} />, color: "text-green-600" };
  if (t.includes("follow"))
    return { text: "started following you", icon: <FiUserPlus size={16} />, color: "text-purple-600" };
  return { text: "sent you a notification", icon: <FiMessageCircle size={16} />, color: "text-gray-500" };
}

export default function Notifications() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("all");
  const [items, setItems] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [listRes, countRes] = await Promise.all([
          getNotifications({
            unread: tab === "unread" ? true : undefined,
            page: 1,
            limit: 10, 
          }),
          getUnreadCount(),
        ]);
        setItems(listRes.data.data.notifications); 
        setUnread(countRes.data.data.unreadCount); 
      } catch (error) {
        toast.error(errMsg(error));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [tab]);

  async function handleMarkRead(id: string) {
    try {
      await markNotificationAsRead(id);
      setItems((list) => list.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
      setUnread((c) => Math.max(0, c - 1));
    } catch (error) {
      toast.error(errMsg(error));
    }
  }

  async function handleMarkAll() {
    try {
      await markAllAsRead();
      setItems((list) => list.map((n) => ({ ...n, isRead: true })));
      setUnread(0);
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error(errMsg(error));
    }
  }

  function handleOpen(n: Notification) {
    if (!n.isRead) handleMarkRead(n._id);
    if (n.type.toLowerCase().includes("follow")) navigate(`/profile/${n.actor._id}`);
    else if (n.entityId) navigate(`/posts/${n.entityId}`);
  }

  const shown = tab === "unread" ? items.filter((n) => !n.isRead) : items;

  return (
    <div className="mx-auto w-full max-w-5xl px-3 py-4 sm:px-4 sm:py-6">
      <section className="rounded-2xl bg-white p-4 sm:p-6 shadow-md">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold">Notifications</h1>
            <p className="mt-1 text-sm text-gray-500 sm:text-base">
              Realtime updates for likes, comments, shares, and follows.
            </p>
          </div>

          <button
            type="button"
            onClick={handleMarkAll}
            disabled={unread === 0}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 font-semibold hover:bg-gray-50 disabled:opacity-50 sm:w-auto"
          >
            <IoCheckmarkDone size={18} /> Mark all as read
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-5 flex flex-wrap gap-2 border-b border-gray-100 pb-5">
          <button
            type="button"
            onClick={() => setTab("all")}
            className={`rounded-full px-5 py-2 font-semibold ${
              tab === "all" ? "bg-blue-700 text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setTab("unread")}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2 font-semibold ${
              tab === "unread" ? "bg-blue-700 text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            Unread
            <span
              className={`text-sm ${tab === "unread" ? "text-white" : "text-blue-600"}`}
            >
              {unread}
            </span>
          </button>
        </div>

        {/* List */}
        <div className="mt-5 flex flex-col gap-3">
          {loading && <p className="p-6 text-center text-gray-500">Loading...</p>}

          {!loading && shown.length === 0 && (
            <p className="p-8 text-center text-gray-500">
              {tab === "unread" ? "No unread notifications." : "No notifications yet."}
            </p>
          )}

          {shown.map((n) => {
            const { text, icon, color } = describe(n.type);
            const snippet = n.entity?.body 

            return (
              <div
                key={n._id}
                onClick={() => handleOpen(n)}
                className={`flex cursor-pointer gap-3 rounded-2xl border p-3 transition hover:shadow-sm sm:gap-4 sm:p-4 ${
                  n.isRead
                    ? "border-gray-100 bg-white"
                    : "border-blue-100 bg-blue-50"
                }`}
              >
                {/* Avatar + type icon */}
                <div className="relative h-10 w-10 shrink-0 sm:h-12 sm:w-12">
                  <img
                    src={n.actor?.photo}
                    alt={n.actor?.name}
                    className="h-full w-full rounded-full object-cover"
                  />
                  <span
                    className={`absolute -right-1 -bottom-1 grid h-5 w-5 place-items-center rounded-full bg-white shadow sm:h-6 sm:w-6 ${color}`}
                  >
                    {icon}
                  </span>
                </div>

                {/* Text */}
                <div className="min-w-0 flex-1">
                  <p className="wrap-anywhere">
                    <span className="font-bold">{n.actor?.name}</span>{" "}
                    <span className="text-gray-600">{text}</span>
                  </p>

                  {snippet && (
                    <p className="mt-1 truncate text-gray-600">{snippet}</p>
                  )}

                  {!n.isRead && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkRead(n._id);
                      }}
                      className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-blue-600 shadow-sm hover:bg-gray-50"
                    >
                      <FiCheck size={14} /> Mark as read
                    </button>
                  )}
                </div>

                {/* Time + unread dot */}
                <div className="flex shrink-0 items-start gap-2 text-xs text-gray-500 sm:text-sm">
                  <span>{timeAgo(n.createdAt)}</span>
                  {!n.isRead && <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-600" />}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}