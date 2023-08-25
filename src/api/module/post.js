import httpClient from "./httpClient";
import { SETTINGS } from "enum";

export const getAllPosts = async (data) => {
  let newFilter = {
    page: 1,
    num: SETTINGS.MAX_SEARCH_ROW_NUM,
  };

  if (data.filter) {
    newFilter = { ...newFilter, ...data.filter };
  }

  const parsedFilter = Object.keys(newFilter)
    .map((item) => `${item}=${newFilter[item]}`)
    .join("&");

  return await httpClient.get(`private/posts/search?${parsedFilter}`);
};

export const get = async (id) => {
  return await httpClient.get(`private/post/${id}`);
};

export const post = async (data) => {
  return await httpClient.post(`private/post/`, data);
};

export const put = async (data) => {
  return await httpClient.put(`private/post/${data.id}`, data);
};

export const remove = async (data) => {
  return await httpClient.delete(`private/post/${data.id}`);
};