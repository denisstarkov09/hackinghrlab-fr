import httpClient from "./httpClient";

export const sendEmail = async (data) => {
  return await httpClient.post(`private/feedback`, {
    ...data,
  });
};
