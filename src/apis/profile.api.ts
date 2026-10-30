import axios from "axios";


function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem("tkn")}` };
}


export async function getMyProfile() {

  const { data } = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/users/profile-data`,
    {
      headers: authHeaders(),
    }
  );

  return data;
}


// PUT Upload Profile Photo
export async function uploadProfilePhoto(file: File) {
  const formData = new FormData();
  formData.append("photo", file);
  const { data } = await axios.put(`${import.meta.env.VITE_BASE_URL}/users/upload-photo`, formData, {
    headers: authHeaders(),
  });
  return data;
}

// PATCH Change Password
export async function changePassword(password: string, newPassword: string) {
  const { data } = await axios.patch(
    `${import.meta.env.VITE_BASE_URL}/users/change-password`,
    { password, newPassword },
    { headers: authHeaders() },
  );
  return data;
}

// GET Get Bookmarks
export async function getBookmarks() {
  const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/bookmarks`, { headers: authHeaders() });
  return data;
}

// GET Get User Profile (أي يوزر بالـ id)
export async function getUserProfile(userId: string) {
  const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/${userId}/profile`, {
    headers: authHeaders(),
  });
  return data;
}

// GET Get User Posts (Nested)
export async function getUserPosts(userId: string) {
  const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/${userId}/posts`, {
    headers: authHeaders(),
  });
  return data;
}