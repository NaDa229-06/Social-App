import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL as string;

function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem("tkn")}` };
}


// GET Get Notifications
export function getNotifications(
  params: { unread?: boolean ; page?: number; limit?: number; } = {},
) {
  return axios.get(`${BASE_URL}/notifications`, {
    headers: authHeaders(),
    params,
  });
}

// GET Get Unread Count
export function getUnreadCount() {
  return axios.get(`${BASE_URL}/notifications/unread-count`, {
    headers: authHeaders(),
  });
}

// PATCH Mark  AS Read
export function markNotificationAsRead(id: string) {
  return axios.patch(`${BASE_URL}/notifications/${id}/read`, null, {
    headers: authHeaders(),
  });
}

// PATCH Mark All AS Read
export function markAllAsRead() {
  return axios.patch(`${BASE_URL}/notifications/read-all`, null, {
    headers: authHeaders(),
  });
}