import { createAction } from "redux-actions";

const GET_SESSION_USER_PROGRESS = "GET_SESSION_USER_PROGRESS";
const SET_SESSION_USER_PROGRESS = "SET_SESSION_USER_PROGRESS";
const SET_SESSION_PROGRESS = "SET_SESSION_PROGRESS";
const SET_LOADING = "SET_COURSE_LOADING";

export const constants = {
  GET_SESSION_USER_PROGRESS,
  SET_SESSION_USER_PROGRESS,
  SET_SESSION_PROGRESS,
  SET_LOADING,
};

// ------------------------------------
// Actions
// ------------------------------------
export const getSessionUserProgress = createAction(
  GET_SESSION_USER_PROGRESS,
  (sessionId) => ({ sessionId })
);
export const setSessionUserProgress = createAction(
  SET_SESSION_USER_PROGRESS,
  (sessionUserProgress) => ({ sessionUserProgress })
);
export const setSessionProgress = createAction(
  SET_SESSION_PROGRESS,
  (data) => ({ data })
);
export const setLoading = createAction(SET_LOADING, (loading) => ({ loading }));

export const actions = {
  getSessionUserProgress,
  setSessionUserProgress,
  setSessionProgress,
  setLoading,
};
