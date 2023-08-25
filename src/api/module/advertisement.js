import httpClient from "./httpClient";

export const getAdvertisementsByPage = async (filter) => {
  let newFilter = {};

  if (filter) {
    newFilter = { ...filter };
  }

  const parsedFilter = Object.keys(newFilter)
    .map((item) => `${item}=${newFilter[item]}`)
    .join("&");

  return await httpClient.get(`private/ads-by-page?${parsedFilter}`);
};

export const getAdvertisementByAdvertiser = async (data) => {
  const { UserId } = data;

  return await httpClient.get(`private/ads/${UserId}`);
};

export const createAdvertisement = async (data) => {
  const { advertisement } = data;

  return await httpClient.post(`private/ad`, { ...advertisement });
};

export const getAdvertisementById = async (data) => {
  const { advertisementId } = data;

  return await httpClient.get(`private/ad/${advertisementId}`);
};

export const getAllActiveAdvertisements = async () => {
  return await httpClient.get(`private/ads/active`);
};

export const editAdvertisement = async (data) => {
  const { AdvertisementId, payload } = data;

  return httpClient.put(`private/ad/${AdvertisementId}`, { ...payload });
};

export const createAdvertisementClick = (data) => {
  const { advertisementId } = data;

  return httpClient.post(`private/ad/click`, { advertisementId });
};
