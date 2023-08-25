import httpClient from "./httpClient";

export const itemsByJourney = async (data) => {
  return await httpClient.get(`private/journey-items/${data.id}`, { params: data});
};

export const put = async (data) => {
  return await httpClient.put(`private/journey-items/${data.id}`, data);
};
