import httpClient from "./httpClient";

export const post = async (data) => {
  return await httpClient.post(`private/postLike/`, data);
};

export const remove = async (id) => {
  return await httpClient.delete(`private/postLike/${id}`);
};
