import httpClient from "./httpClient";

export const getAllEvents = () => {
  return httpClient.get("public/events");
};

export const getEvent = ({ id }) => {
  return httpClient.get(`public/event/get/${id}`);
};

export const getMetadata = (metadata) => {
  return httpClient.post(`private/events/metadata/`, {
    metadata,
  });
};

export const getAllEventsChannelsEndPoint = () => {
  return httpClient.get(`private/events/channels`)
}

export const getLiveEventFromAPI = () => {
  return httpClient.get(`private/events-live/`);
};

export const updateEventUserAssistenceFromAPI = (payload) => {
  return httpClient.put(`private/event/user-assistence/${payload.id}`, payload);
};

export const updateEventFromAPI = ({ id }) => {
  return httpClient.put(`private/event/${id}`);
};

export const updateEventStatusFromAPI = ({ event, status }) => {
  return httpClient.put(`private/event/set-status/${event.id}`, { status });
};

export const createChannelEvent = ({ data }) => {
  return httpClient.post("private/event/channel", { ...data });
};

export const getChannelEvents = ({ filter }) => {

  const parsedFilter = Object.keys(filter)
    .map((item) => `${item}=${filter[item]}`)
    .join("&");

  return httpClient.get(`public/event/channel?${parsedFilter}`);
};

export const deleteEvent = ({ event }) => {
  return httpClient.delete(
    `private/event/channel/${event.id}?channel=${event.channel}`
  );
};

export const updateChannelEvent = ({ event }) => {
  return httpClient.put(`private/event/channel/${event.id}`, event);
};

export const claimEventCredit = ({ id, pdf }) => {
  return httpClient.post(`private/event/claim-credit`, { id, pdf });
};

export const claimEventAttendance = ({ id }) => {
  return httpClient.post(`private/event/claim-attendance`, { id });
};

export const verifySuscribedUserEndPoint = () => {
  return httpClient.post(`private/verify/suscribed-user`);
};

export const suscriptionSendingBlueEndPoint = () => {
  return httpClient.post(`private/suscribed-user`);
};
