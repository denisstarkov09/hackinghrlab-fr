import httpClient from "./httpClient";

export const getPartners = () => {
  return httpClient.get(`private/partner`);
};

export const getPartner = ({ id }) => {
  return httpClient.get(`private/partner/${id}`);
};
