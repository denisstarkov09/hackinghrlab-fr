import { createAction } from "redux-actions";

const GET_ALL_JOB_POSTS = "GET_ALL_JOB_POSTS";
const GET_JOB_POST = "GET_JOB_POST";
const SET_ALL_JOB_POSTS = "SET_ALL_JOB_POSTS";
const SET_JOB_POST = "SET_JOB_POST";
const GET_MORE_JOB_POSTS = "GET_MORE_JOB_POSTS";
const SET_MORE_JOB_POSTS = "SET_MORE_JOB_POSTS";
const SET_LOADING_JOB_BOARD = "SET_LOADING_JOB_BOARD";
const UPSERT_JOB_POST = "CREATE_JOB_POST";
const GET_MY_JOB_POSTS = "GET_MY_JOB_POSTS";
const SET_MY_JOB_POSTS = "SET_MY_JOB_POSTS";
const INVITATION_TO_APPLY = "INVITATION_TO_APPLY";

export const constants = {
  GET_ALL_JOB_POSTS,
  GET_JOB_POST,
  SET_ALL_JOB_POSTS,
  SET_JOB_POST,
  GET_MORE_JOB_POSTS,
  SET_MORE_JOB_POSTS,
  SET_LOADING_JOB_BOARD,
  UPSERT_JOB_POST,
  GET_MY_JOB_POSTS,
  SET_MY_JOB_POSTS,
  INVITATION_TO_APPLY,
};

export const getAllJobPosts = createAction(GET_ALL_JOB_POSTS, (filter) => ({
  filter,
}));

export const getJobPost = createAction(GET_JOB_POST, (JobPostId) => ({
  JobPostId,
}));

export const setAllJobPosts = createAction(
  SET_ALL_JOB_POSTS,
  (countOfResults, currentPage, allJobPosts) => ({
    countOfResults,
    currentPage,
    allJobPosts,
  })
);

export const setJobPost = createAction(SET_JOB_POST, (jobPost) => ({
  jobPost,
}));

export const getMoreJobPosts = createAction(GET_MORE_JOB_POSTS, (filter) => ({
  filter,
}));

export const setMoreJobPosts = createAction(
  SET_MORE_JOB_POSTS,
  (countOfResults, currentPage, allJobPosts) => ({
    countOfResults,
    currentPage,
    allJobPosts,
  })
);

export const upsertJobPost = createAction(UPSERT_JOB_POST, (jobPost) => ({
  jobPost,
}));

export const getMyJobPosts = createAction(GET_MY_JOB_POSTS, (filter) => ({
  filter,
}));

export const setMyJobPosts = createAction(SET_MY_JOB_POSTS, (myJobPosts) => ({
  myJobPosts,
}));

export const setLoadingJobBoard = createAction(
  SET_LOADING_JOB_BOARD,
  (loading) => ({ loading })
);

export const invitationToApply = createAction(
  INVITATION_TO_APPLY,
  (UserId, JobPostId) => ({ UserId, JobPostId })
);

export const actions = {
  getAllJobPosts,
  getJobPost,
  setAllJobPosts,
  setJobPost,
  getMoreJobPosts,
  setMoreJobPosts,
  setLoadingJobBoard,
  upsertJobPost,
  getMyJobPosts,
  setMyJobPosts,
  invitationToApply,
};
