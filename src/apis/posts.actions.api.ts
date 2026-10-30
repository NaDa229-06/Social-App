import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL as string;

function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem("tkn")}` };
}

// GET Get Home Feed (بوستاتي + بوستات اللي عاملهم follow)
export async function getHomeFeed(params: { only?: string; limit?: number } = { limit: 10 }) {
  const { data } = await axios.get(`${BASE_URL}/posts/feed`, {
    headers: authHeaders(),
    params,
  });
  return data;
}

// POST Create Post 
export async function createPost(body: string, image?: File, privacy = "public") {
  const formData = new FormData();
  if (body) formData.append("body", body);
  if (image) formData.append("image", image);
  formData.append("privacy", privacy);
  const { data } = await axios.post(`${BASE_URL}/posts`, formData, { headers: authHeaders() });
  return data;
}

// PUT Update Post
export async function updatePost(postId: string, body: string) {
  const formData = new FormData();
  formData.append("body", body);
  const { data } = await axios.put(`${BASE_URL}/posts/${postId}`, formData, {
    headers: authHeaders(),
  });
  return data;
}

// DELETE Delete Post
export async function deletePost(postId: string) {
  const { data } = await axios.delete(`${BASE_URL}/posts/${postId}`, { headers: authHeaders() });
  return data;
}

// PUT Like/Unlike Post
export async function likePost(postId: string) {
  const { data } = await axios.put(`${BASE_URL}/posts/${postId}/like`, null, {
    headers: authHeaders(),
  });
  return data;
}

// POST Share Post 
export async function sharePost(postId: string, body: string) {
  const { data } = await axios.post(
    `${BASE_URL}/posts/${postId}/share`,
    { body },
    { headers: authHeaders() },
  );
  return data;
}

// PUT Bookmark/Unbookmark Post
export async function bookmarkPost(postId: string) {
  const { data } = await axios.put(`${BASE_URL}/posts/${postId}/bookmark`, null, {
    headers: authHeaders(),
  });
  return data;
}