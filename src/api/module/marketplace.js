import httpClient from "./httpClient";

export const getAllMarketplace = async (data) => {
  return await httpClient.post(`public/marketplace`, data);
};
