import httpClient from "./httpClient";
import { SETTINGS } from "enum";

export const getAllBusinessPartnerCommentsFromAPI = async (data) => {
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
  return await httpClient.get(`private/business-partner-comments/?${parsedFilter}`);
};

export const postBusinessPartnerCommentFromAPI = async (data) => {
  return await httpClient.post(`private/business-partner-comments/create-comment`, data);
};

export const removeBusinessPartnerCommentFromAPI = async (data) => {
  return await httpClient.delete(`private/business-partner-comments/delete-comment/${data.id}`);
};
