import httpClient from "./httpClient";

export const getChannelCategories = () => {
  return httpClient.get(`public/channel-category`);
};
