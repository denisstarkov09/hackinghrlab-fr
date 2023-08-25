import httpClient from "./httpClient";

export const getAllMarketplaceCategories = async () => {
  return await httpClient.get(`public/marketplace-categories`);
};
