import httpClient from "./httpClient";

export const getCheckoutSession = async (data) => {
  return await httpClient.post(`private/stripe/checkout-session/`, {
    ...data,
  });
};

export const getPortalSession = async () => {
  return await httpClient.get(`private/stripe/portal-session/`);
};

export const getSubscription = async () => {
  return await httpClient.get(`private/stripe/subscription/`);
};
