import axios from "axios";
 
function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem("tkn")}` };
}


// GET Get Follow Suggestions
export async function getFollowSuggestions(limit = 5) {
  const { data } = await  axios.get(`${import.meta.env.VITE_BASE_URL}/users/suggestions`, {
    headers: authHeaders(),
    params: { limit },
  });
  return data;
}
 
// PUT Follow/Unfollow User
export async function followUnfollowUser(userId: string) {
  const { data } = await  axios.put(`${import.meta.env.VITE_BASE_URL}/users/${userId}/follow`, null, {
    headers: authHeaders(),
  });
  return data;
}