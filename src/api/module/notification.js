import httpClient from "./httpClient";

export const getNotifications = ({ page, num }) => {
  return httpClient.get(`private/notification?page=${page}&num=${num}`);
};

export const markeToRead = ({ notifications }) => {
  return httpClient.put(`private/notification/mark-to-read`, { notifications });
};

export const markeToUnRead = ({ notifications }) => {
  return httpClient.put(`private/notification/mark-to-un-read`, {
    notifications,
  });
};
