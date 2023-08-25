import { createAction } from "redux-actions";

const GET_ALL_SESSIONS = "GET_ALL_SESSIONS";
const SET_ALL_SESSIONS = "SET_ALL_SESSIONS";
const GET_SESSION = "GET_SESSION";
const SET_SESSION = "SET_SESSION";
const GET_SESSION_CLASSES = "GET_SESSION_CLASSES";
const SET_SESSION_CLASSES = "SET_SESSION_CLASSES";
const GET_SESSIONS_ADDED_BY_USER = "GET_SESSIONS_ADDED_BY_USER ";
const SET_SESSIONS_ADDED_BY_USER = "SET_SESSIONS_ADDED_BY_USER";
const GET_SESSIONS_USER_JOINED = "GET_SESSIONS_USER_JOINED";
const SET_SESSIONS_USER_JOINED = "SET_SESSIONS_USER_JOINED";
const GET_PARTICIPANTS = "GET_PARTICIPANTS";
const SET_PARTICIPANTS = "SET_PARTICIPANTS";
const RECOMMENDED_AGENDA = "RECOMMENDED_AGENDA";
const SET_RECOMMENDED_AGENDA = "SET_RECOMMENDED_AGENDA";
const SET_SESSION_LOADING = "SET_SESSION_LOADING";
const SET_MESSAGE_ERROR = "SET_MESSAGE_ERROR";
const CLAIM_SESSION = "CLAIM_SESSION";
const SET_SESSION_VIEWED = "SET_SESSION_VIEWED";
const UPDATE_SESSION_VIEWED = "UPDATE_SESSION_VIEWED";
const SAVE_FOR_LATER_SESSION = "SAVE_FOR_LATER_SESSION";
const UPDATE_SAVE_FOR_LATER_SESSION = "UPDATE_SAVE_FOR_LATER_SESSION";

export const constants = {
  GET_ALL_SESSIONS,
  SET_ALL_SESSIONS,
  GET_SESSION,
  SET_SESSION,
  GET_SESSION_CLASSES,
  SET_SESSION_CLASSES,
  GET_SESSIONS_ADDED_BY_USER,
  SET_SESSIONS_ADDED_BY_USER,
  GET_SESSIONS_USER_JOINED,
  SET_SESSIONS_USER_JOINED,
  GET_PARTICIPANTS,
  SET_PARTICIPANTS,
  RECOMMENDED_AGENDA,
  SET_RECOMMENDED_AGENDA,
  SET_SESSION_LOADING,
  SET_MESSAGE_ERROR,
  CLAIM_SESSION,
  SET_SESSION_VIEWED,
  UPDATE_SESSION_VIEWED,
  SAVE_FOR_LATER_SESSION,
  UPDATE_SAVE_FOR_LATER_SESSION,
};

// ------------------------------------
// Actions
// ------------------------------------
export const getAllSessions = createAction(GET_ALL_SESSIONS, (filters) => ({
  filters,
}));

export const setAllSessions = createAction(SET_ALL_SESSIONS, (allSessions) => ({
  allSessions,
}));

export const getSession = createAction(GET_SESSION, (id,type,callback) => ({ id,type,callback }));

export const setSession = createAction(SET_SESSION, (session) => ({ session }));

export const getSessionClasses = createAction(GET_SESSION_CLASSES, (id,type,callback) => ({
  id,type,callback
}));
export const setSessionClasses = createAction(
  SET_SESSION_CLASSES,
  (classes) => ({
    classes,
  })
);

export const getSessionsAddedbyUser = createAction(
  GET_SESSIONS_ADDED_BY_USER,
  (id) => ({ id })
);
export const setSessionsAddedByUser = createAction(
  SET_SESSIONS_ADDED_BY_USER,
  (sessionsUser) => ({
    sessionsUser,
  })
);

export const getSessionsUserJoined = createAction(
  GET_SESSIONS_USER_JOINED,
  (sessionsId) => ({ sessionsId })
);
export const setSessionsUserJoined = createAction(
  SET_SESSIONS_USER_JOINED,
  (sessionsUserJoined) => ({
    sessionsUserJoined,
  })
);

export const getParticipants = createAction(
  GET_PARTICIPANTS,
  (filters) => filters
);

export const setParticipants = createAction(
  SET_PARTICIPANTS,
  (participants) => ({
    participants,
  })
);

export const recommendedAgenda = createAction(
  RECOMMENDED_AGENDA,
  (filters) => ({ filters })
);

export const setRecommendedAgenda = createAction(
  SET_RECOMMENDED_AGENDA,
  (recommendedAgendaSessions) => ({ recommendedAgendaSessions })
);

export const setSessionLoading = createAction(
  SET_SESSION_LOADING,
  (loading) => ({ loading })
);

export const setMessageError = createAction(SET_MESSAGE_ERROR, (message) => ({
  message,
}));

export const claimSession = createAction(CLAIM_SESSION, (id, type, callback) => ({
  id,
  type,
  callback,
}));

export const setSessionViewed = createAction(
  SET_SESSION_VIEWED,
  (id, UserId, viewed) => ({
    id,
    UserId,
    viewed,
  })
);

export const updateSessionViewed = createAction(
  UPDATE_SESSION_VIEWED,
  (session) => ({ session })
);

export const saveForLaterSession = createAction(
  SAVE_FOR_LATER_SESSION,
  (id, UserId, status) => ({ id, UserId, status })
);

export const updateSaveForLaterSession = createAction(
  UPDATE_SAVE_FOR_LATER_SESSION,
  (session) => ({ session })
);

export const actions = {
  getAllSessions,
  setAllSessions,
  getSession,
  setSession,
  getSessionClasses,
  setSessionClasses,
  getSessionsAddedbyUser,
  setSessionsAddedByUser,
  getSessionsUserJoined,
  setSessionsUserJoined,
  getParticipants,
  setParticipants,
  recommendedAgenda,
  setRecommendedAgenda,
  setSessionViewed,
  updateSessionViewed,
  saveForLaterSession,
  updateSaveForLaterSession,
  setSessionLoading,
  setMessageError,
  claimSession,
};
