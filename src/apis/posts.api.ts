import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL as string;

export async function getPosts() {
  const token = localStorage.getItem("tkn");

  const { data } = await axios.get(
    `${BASE_URL}/posts`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
}