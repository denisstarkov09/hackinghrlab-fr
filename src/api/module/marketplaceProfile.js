import httpClient from "./httpClient";

export const getMarketplaceProfiles = (data) => {
  let newFilter = {};

  if (data.filter) {
    newFilter = {
      ...newFilter,
      ...data.filter,
    };
  }

  const parsedFilter = Object.keys(newFilter)
    .map((item) => `${item}=${newFilter[item]}`)
    .join("&");

  return httpClient.get(`private/marketplace-profiles?${parsedFilter}`)
};

export const getMarketplaceProfile = ({ id }) => {
  return httpClient.get(`private/marketplace-profiles/${id}`);
};

export const createMarketplaceProfile = (data) => {
  return httpClient.post(`private/marketplace-profiles`, data);
};

export const updateMarketplaceProfile = ({ marketplaceProfile }) => {
  return httpClient.put(
    `private/marketplace-profiles/${marketplaceProfile.id}`,
    marketplaceProfile
  );
};
