import { createAction } from "redux-actions";

const SET_MENTORING_INFO = "SET_MENTORING_INFO";
const UPDATE_MENTORING_INFO = "UPDATE_MENTORING_INFO";
const SAVE_MENTORING_INFO = "SAVE_MENTORING_INFO";
const SET_MENTORING_LOADING = "SET_MENTORING_LOADING";
const GET_MENTORING_INFO = "GET_MENTORING_INFO";
const GET_MENTOR_LIST = "GET_MENTOR_LIST";
const SET_MENTOR_LIST = "SET_MENTOR_LIST";
const GET_MORE_MENTOR_LIST = "GET_MORE_MENTOR_LIST";
const GET_MENTEE_LIST = "GET_MENTEE_LIST";
const SET_MENTEE_LIST = "SET_MENTEE_LIST";
const GET_MORE_MENTEE_LIST = "GET_MORE_MENTEE_LIST";
const SET_MENTOR_LOADING = "SET_MENTOR_LOADING";
const SET_MENTEE_LOADING = "SET_MENTEE_LOADING";
const SET_MATCH = "SET_MATCH";
const UPDATE_MATCH = "UPDATE_MATCH";

export const constants = {
  SET_MENTORING_INFO,
  SAVE_MENTORING_INFO,
  SET_MENTORING_LOADING,
  GET_MENTOR_LIST,
  SET_MENTOR_LIST,
  GET_MENTEE_LIST,
  SET_MENTEE_LIST,
  GET_MENTORING_INFO,
  UPDATE_MENTORING_INFO,
  GET_MORE_MENTOR_LIST,
  GET_MORE_MENTEE_LIST,
  SET_MENTOR_LOADING,
  SET_MENTEE_LOADING,
  SET_MATCH,
  UPDATE_MATCH,
};

// ------------------------------------
// Actions
// ------------------------------------
export const setMentoringInfo = createAction(
  SET_MENTORING_INFO,
  (info, callback) => ({
    info,
    callback,
  })
);
export const updateMentoringInfo = createAction(
  UPDATE_MENTORING_INFO,
  (info, callback) => ({ info, callback })
);
export const saveMentoringInfo = createAction(SAVE_MENTORING_INFO, (info) => ({
  info,
}));
export const setMentoringLoading = createAction(
  SET_MENTORING_LOADING,
  (loading) => ({ loading })
);
export const getMentoringInfo = createAction(GET_MENTORING_INFO);
export const getMentorList = createAction(GET_MENTOR_LIST, (filter, order) => ({
  filter,
  order,
}));
export const getMoreMentorList = createAction(
  GET_MORE_MENTOR_LIST,
  (filter, order) => ({
    filter,
    order,
  })
);
export const setMentorList = createAction(
  SET_MENTOR_LIST,
  (countOfResults, currentPage, mentorList) => ({
    countOfResults,
    currentPage,
    mentorList,
  })
);
export const getMenteeList = createAction(GET_MENTEE_LIST, (filter, order) => ({
  filter,
  order,
}));
export const getMoreMenteeList = createAction(
  GET_MORE_MENTEE_LIST,
  (filter, order) => ({
    filter,
    order,
  })
);
export const setMenteeList = createAction(
  SET_MENTEE_LIST,
  (countOfResults, currentPage, menteeList) => ({
    countOfResults,
    currentPage,
    menteeList,
  })
);
export const setMentorLoading = createAction(
  SET_MENTOR_LOADING,
  (mentorLoading) => ({ mentorLoading })
);
export const setMenteeLoading = createAction(
  SET_MENTEE_LOADING,
  (menteeLoading) => ({ menteeLoading })
);
export const setMatch = createAction(SET_MATCH, (source, match, target) => ({
  source,
  match,
  target,
}));
export const updateMatch = createAction(UPDATE_MATCH, (member) => ({ member }));

export const actions = {
  setMentoringInfo,
  saveMentoringInfo,
  setMentoringLoading,
  getMentorList,
  getMoreMentorList,
  setMentorList,
  getMenteeList,
  getMoreMenteeList,
  setMenteeList,
  getMentoringInfo,
  updateMentoringInfo,
  setMentorLoading,
  setMenteeLoading,
  setMatch,
  updateMatch,
};
