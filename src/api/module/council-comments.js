import httpClient from "./httpClient";
import { SETTINGS } from "enum";

export const getAllCouncilCommentsFromAPI = async (data) => {
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
  return await httpClient.get(`private/councilComments/?${parsedFilter}`);
};

export const postCouncilCommentFromAPI = async (data) => {
  return await httpClient.post(`private/councilComments/create-comment`, data);
};

export const removeCouncilCommentFromAPI = async (data) => {
  return await httpClient.delete(`private/councilComments/delete-comment/${data.id}`);
};
