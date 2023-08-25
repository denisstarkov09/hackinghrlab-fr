import httpClient from "./httpClient";

export const get = async () => {
  return await httpClient.get(`private/live/`);
};