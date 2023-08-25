import httpClient from "./httpClient";
import { SETTINGS } from "enum";

export const setMentorInfo = ({ info }) => {
  return httpClient.post(`private/mentoring`, { ...info });
};

export const getMentoringInfo = () => {
  return httpClient.get("private/mentoring");
};

export const updateMentorInfo = ({ info }) => {
  return httpClient.put("private/mentoring", { ...info });
};

export const getMentorList = ({ filter, order }) => {
  let newFilter = {
    page: 1,
    num: SETTINGS.MAX_SEARCH_ROW_NUM,
    // order,
  };

  if (filter) {
    newFilter = { ...newFilter, ...filter };
  }

  const parsedFilter = Object.keys(newFilter)
    .map((item) => `${item}=${newFilter[item]}`)
    .join("&");

  return httpClient.get(`private/mentor/all?${parsedFilter}`);
};

export const getMenteeList = ({ filter, order }) => {
  let newFilter = {
    page: 1,
    num: SETTINGS.MAX_SEARCH_ROW_NUM,
    order,
  };

  if (filter) {
    newFilter = { ...newFilter, ...filter };
  }

  const parsedFilter = Object.keys(newFilter)
    .map((item) => `${item}=${newFilter[item]}`)
    .join("&");

  return httpClient.get(`private/mentee/all?${parsedFilter}`);
};

export const setMatch = ({ source, match, target }) => {
  return httpClient.put(
    `private/mentoring/match?source=${source}&match=${match}&target=${target}`
  );
};
