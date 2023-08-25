import httpClient from "./httpClient";
import { SETTINGS } from "enum";

export const getAllCompleted = ({ filter }) => {
  let newFilter = {
    page: 1,
    num: SETTINGS.MAX_SEARCH_ROW_NUM,
  };

  if (filter) {
    newFilter = {
      ...newFilter,
      ...filter,
    };
  }

  const parsedFilter = Object.keys(newFilter)
    .map((item) => `${item}=${newFilter[item]}`)
    .join("&");

  return httpClient.get(`private/my-learnings/completed?${parsedFilter}`);
};

export const getAllSaved = ({ filter }) => {
  let newFilter = {
    page: 1,
    num: SETTINGS.MAX_SEARCH_ROW_NUM,
  };

  if (filter) {
    newFilter = {
      ...newFilter,
      ...filter,
    };
  }

  const parsedFilter = Object.keys(newFilter)
    .map((item) => `${item}=${newFilter[item]}`)
    .join("&");

  return httpClient.get(`private/my-learnings/saved?${parsedFilter}`);
};

export const getAllItemsWithHRCredits = ({ filter }) => {
  let newFilter = {
    page: 1,
    num: SETTINGS.MAX_SEARCH_ROW_NUM,
  };

  if (filter) {
    newFilter = {
      ...newFilter,
      ...filter,
    };
  }

  const parsedFilter = Object.keys(newFilter)
    .map((item) => `${item}=${newFilter[item]}`)
    .join("&");

  return httpClient.get(
    `private/my-learnings/items-with-hr-credits?${parsedFilter}`
  );
};

export const getEventVideos = (filter) => {
  return httpClient.get(`private/my-learnings/event-videos`);
};

export const getAllLibrariesEndPoint = (filter) => {
  return httpClient.get(`private/my-learnings/event-libraris-videos`);
};
