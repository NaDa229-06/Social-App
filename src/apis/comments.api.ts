import axios from "axios";
 
const BASE_URL = import.meta.env.VITE_BASE_URL as string;
 
function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem("tkn")}` };
}
 

 
// GET Get Post Comments
export async function getPostComments(postId: string) {
 const { data } = await  axios.get(`${BASE_URL}/posts/${postId}/comments`, {
    headers: authHeaders(),
  });
   return data;
}
 
// POST Create Comment
function buildBody(content: string, image?: File) {
  const formData = new FormData();
  if (content) formData.append("content", content);
  if (image) formData.append("image", image); 
  return formData;
}
 
export async function createComment(postId: string, content: string, image?: File) {
  const { data } = await axios.post(
    `${BASE_URL}/posts/${postId}/comments`,
    buildBody(content, image),
    { headers: authHeaders() },
  );
   return data;
}
 
// GET Get Comment Replies
export async function getCommentReplies(postId: string, commentId: string) {
 const { data } = await  axios.get(`${BASE_URL}/posts/${postId}/comments/${commentId}/replies`, {
    headers: authHeaders(),
  });
   return data;
}
 
// POST Create Reply
export async function createReply(
  postId: string,
  commentId: string,
  content: string,
  image?: File,
) {
  const { data } = await axios.post(
    `${BASE_URL}/posts/${postId}/comments/${commentId}/replies`,
    buildBody(content, image),
    { headers: authHeaders() },
  );
   return data;
}
 
// PUT Update Comment
export async function updateComment(postId: string, commentId: string, content: string) {
 const { data } = await  axios.put(
    `${BASE_URL}/posts/${postId}/comments/${commentId}`,
    { content },
    { headers: authHeaders() },
  );
   return data;
}
 
// DELETE Delete Comment
export async function deleteComment(postId: string, commentId: string) {
 const { data } = await  axios.delete(`${BASE_URL}/posts/${postId}/comments/${commentId}`, {
    headers: authHeaders(),
  });
   return data;
}
 
// PUT Like/Unlike Comment
export async function likeUnlikeComment(postId: string, commentId: string) {
 const { data } = await  axios.put(`${BASE_URL}/posts/${postId}/comments/${commentId}/like`, null, {
    headers: authHeaders(),
  });
   return data;
}
 