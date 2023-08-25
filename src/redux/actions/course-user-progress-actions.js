import { createAction } from "redux-actions";

const GET_COURSE_USER_PROGRESS = "GET_COURSE_USER_PROGRESS";
const SET_COURSE_USER_PROGRESS = "SET_COURSE_USER_PROGRESS";
const SET_PROGRESS = "SET_PROGRESS";
const SET_LOADING = "SET_COURSE_LOADING";

export const constants = {
  GET_COURSE_USER_PROGRESS,
  SET_COURSE_USER_PROGRESS,
  SET_PROGRESS,
  SET_LOADING,
};

// ------------------------------------
// Actions
// ------------------------------------
export const getCourseUserProgress = createAction(
  GET_COURSE_USER_PROGRESS,
  (courseId) => ({ courseId })
);
export const setCourseUserProgress = createAction(
  SET_COURSE_USER_PROGRESS,
  (courseUserProgress) => ({ courseUserProgress })
);
export const setProgress = createAction(SET_PROGRESS, (data) => ({ data }));
export const setLoading = createAction(SET_LOADING, (loading) => ({ loading }));

export const actions = {
  getCourseUserProgress,
  setCourseUserProgress,
  setProgress,
  setLoading,
};
