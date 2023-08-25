import httpClient from "./httpClient";
import { SETTINGS } from "enum";

export const getAllComments = async (data) => {
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

  return await httpClient.get(`private/postComment/?${parsedFilter}`);
};

export const post = async (data) => {
  return await httpClient.post(`private/postComment/`, data);
};

export const remove = async (data) => {
  return await httpClient.delete(`private/postComment/${data.id}`);
};
