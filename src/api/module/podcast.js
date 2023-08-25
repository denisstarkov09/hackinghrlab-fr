import httpClient from "./httpClient";
import { SETTINGS } from "enum";

export const getAllPodcasts = async (data) => {
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

  return await httpClient.get(`private/podcast/search?${parsedFilter}`);
};

export const getAllPodcastSeries = async ({ filter }) => {
  const parsedFilter = Object.keys(filter)
    .map((item) => `${item}=${filter[item]}`)
    .join("&");

  return await httpClient.get(`private/podcast-series?${parsedFilter}`);
};

export const getPodcastSeries = async ({ id }) => {
  return await httpClient.get(`private/podcast-series/${id}`);
};

export const addPodcastToChannel = ({ podcast }) => {
  return httpClient.post("private/podcast/channel", { ...podcast });
};

export const searchChannelPodcast = ({ filter }) => {
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

  return httpClient.get(`public/podcast/channel?${parsedFilter}`);
};

export const deleteChannelPodcast = ({ episode }) => {
  return httpClient.delete(
    `private/podcast/channel/${episode.id}?channel=${episode.channel}`
  );
};

export const updateChannelPodcast = ({ episode }) => {
  return httpClient.put(`private/podcast/channel/${episode.id}`, episode);
};

export const claimPodcastSeries = ({ id, pdf }) => {
  return httpClient.post(`private/podcast-series/claim`, { id, pdf });
};

export const markPodcastViewed = ({ id, viewed }) => {
  return httpClient.put("private/podcast/viewed", { id, mark: viewed });
};

export const markPodcastseriesViewed = ({ id, viewed }) => {
  return httpClient.put("private/podcast-series/viewed", { id, mark: viewed });
};

export const getPodcast = ({ id }) => {
  return httpClient.get(`private/podcast/episode/${id}`);
};

export const saveForLaterPodcast = (data) => {
  const { id, UserId, status } = data;

  return httpClient.put(`private/podcast/${id}/save-for-later`, {
    UserId,
    status,
  });
};

export const saveForLaterPodcastSeries = (data) => {
  const { id, UserId, status } = data;

  return httpClient.put(`private/podcast-series/${id}/save-for-later`, {
    UserId,
    status,
  });
};
