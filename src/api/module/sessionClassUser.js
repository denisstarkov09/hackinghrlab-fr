import httpClient from "./httpClient";

export const getUserProgress = async (data) => {
  return await httpClient.get(`private/conference-classes-user/${data.sessionId}`, {
    params: {
      type: data.type
    }
  });
};

export const setProgress = async (data) => {
  return await httpClient.post(`private/conference-classes-user/`, data);
};
