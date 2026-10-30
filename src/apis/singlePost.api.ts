import axios from "axios";
import type { Post } from "../interfaces/post.interface";

const BASE_URL = import.meta.env.VITE_BASE_URL as string;

export async function getSinglePost(postId: string): Promise<Post> {
    const token = localStorage.getItem("tkn");

    const { data } = await axios.get(
    `${BASE_URL}/posts/${postId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data.data.post;
}