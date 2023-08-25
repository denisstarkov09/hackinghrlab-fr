import httpClient from "./httpClient";
import { SETTINGS } from "enum";

export const searchConferenceLibrary = ({ filter, years }) => {
  let newFilter = {
    page: 1,
    num: SETTINGS.MAX_SEARCH_ROW_NUM,
  };

  if (filter) {
    newFilter = { ...newFilter, ...filter };
  }

  const parsedFilter = Object.keys(newFilter)
    .map((item) => `${item}=${newFilter[item]}`)
    .join("&");

  return httpClient.get(`private/conference?${parsedFilter}&listOfYears=[${years}]`);
};

export const claimConferenceLibrary = ({ id }) => {
  return httpClient.post(`private/conference/claim`, { id });
};

export const markConferenceLibraryViewed = ({ id, viewed }) => {
  return httpClient.put("private/conference/viewed", { id, mark: viewed });
};

export const getConferenceLibrary = ({ id }) => {
  return httpClient.get(`private/conference/${id}`);
};

export const saveForLaterConference = (data) => {
  const { id, UserId, status } = data;

  return httpClient.put(`private/conference/${id}/save-for-later`, {
    UserId,
    status,
  });
};
