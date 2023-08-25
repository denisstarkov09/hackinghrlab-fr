import httpClient from "./httpClient";
import { SETTINGS } from "enum";

export const getAllSessions = ({ filters }) => {
  return httpClient.get(`private/session`, { params: { ...filters } });
};

export const getSession = ({ id,type }) => {
  return httpClient.get(`private/session/${id}`,{params:{
    type:type
  }});
};

export const getSessionClasses = async ({ id, type }) => {
  return await httpClient.get(`private/conference-classes/${id}`,{params:{
    type:type
  }});
};

export const getSessionsAddedbyUser = ({ id }) => {
  return httpClient.get(`private/sessions-user?userId=${id}`);
};

export const getSessionsUserJoined = ({ sessionsId }) => {
  return httpClient.get(`private/sessions-user-joined`, {
    params: {
      sessionsId: sessionsId,
    },
  });
};

export const getParticipants = (filters) => {
  let newFilter = {
    num: SETTINGS.MAX_SEARCH_ROW_PARTICIPANTS_NUM,
  };

  if (!filters.page) {
    newFilter = {
      ...newFilter,
      page: 1,
      topics: filters.topics,
      userId: filters.userId,
    };
  } else {
    newFilter = {
      ...newFilter,
      page: filters.page,
      topics: filters.topics,
      userId: filters.userId,
    };
  }

  if (filters.order) {
    newFilter = {
      ...newFilter,
      order: ["pointsConferenceLeaderboard", "DESC"],
    };
  }

  return httpClient.get(`private/session/participants`, {
    params: {
      ...newFilter,
    },
  });
};

export const recommendedAgenda = ({ filters }) => {
  return httpClient.get(`private/session/recommended-agenda`, {
    params: {
      ...filters,
    },
  });
};

export const claimSession = ({ id, type }) => {
  return httpClient.post(`private/session/claim`, { id,type });
};

export const markSessionViewed = ({ id, UserId, viewed }) => {
  return httpClient.put("private/session/viewed", { id, UserId, mark: viewed });
};

export const saveForLaterSession = ({ id, UserId, status }) => {
  return httpClient.put(`private/session/${id}/save-for-later`, {
    UserId,
    status,
  });
};
