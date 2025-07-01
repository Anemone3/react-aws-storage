import axios from "axios";
import { API_SPLASH_KEY, API_SPLASH_URL } from "../config/config.js";

const instance = axios.create({
  baseURL: API_SPLASH_URL,
  timeout: 1000,
  headers: { Authorization: `Client-ID ${API_SPLASH_KEY}` },
});

export const searchPhotos = async ({ page = 1, per_page = 10 }) => {
  const data = await instance.get(`photos?page=${page}&per_page=${per_page}`);

  const draft = data?.data.map((photo) => ({
    id: photo.id,
    userId: null,
    title: photo.alt_description.split(" ").splice(2),
    description: photo.alt_description,
    imageUrl: photo.urls.small,
    link: photo.links.html,
    createdAt: photo.created_at,
    updatedAt: photo.updated_at,
    user: {
      id: null,
      email: `${photo.user.username}@unsplash.dev`,
      username: photo.user.username,
      firstname: photo.user.first_name,
      lastname: photo.user.last_name,
      profileUrl: photo.user.profile_image.medium,
      providerId: null,
      provider: "UNSPLASH",
      role: "USER",
      createdAt: photo.user.updated_at,
      updatedAt: photo.user.updated_at,
    },
  }));

  if (!draft || draft.length === 0) throw new Error("Error api splash");

  return draft;
};
