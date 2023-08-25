import httpClient from "./httpClient";

export const getAll = async (data) => {
  return await httpClient.get(`private/heart`);
};

export const get = async (data) => {
  return await httpClient.get(`private/heart/${data.id}`, {
    ...data
  });
};

export const post = async (data) => {
  return await httpClient.post(`private/heart/`, {
    ...data
  });
};

export const put = async (data) => {
  return await httpClient.put(`private/heart/${data.id}`, {
    ...data
  });
};

export const remove = async (id) => {
  return await httpClient.delete(`private/heart/${id}`);
};
