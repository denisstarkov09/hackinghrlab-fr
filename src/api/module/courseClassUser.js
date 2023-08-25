import httpClient from "./httpClient";

export const getUserProgress = async (id) => {
  return await httpClient.get(`private/course-classes-user/${id}`);
};

export const setProgress = async (data) => {
  return await httpClient.post(`private/course-classes-user/`, data);
};
