import { handleActions } from "redux-actions";
import { Map } from "immutable";
import cloneDeep from "lodash/cloneDeep";

import { constants as jobBoardConstants } from "../actions/jobBoard-actions";

const reducers = {
  [jobBoardConstants.SET_ALL_JOB_POSTS]: (state, { payload }) => {
    return state.merge({
      allJobPosts: cloneDeep([...payload.allJobPosts]),
      currentPage: payload.currentPage,
      countOfResults: payload.countOfResults,
    });
  },
  [jobBoardConstants.SET_JOB_POST]: (state, { payload }) => {
    return state.merge({ ...payload });
  },
  [jobBoardConstants.SET_MORE_JOB_POSTS]: (state, { payload }) => {
    const allJobPosts = state.get("allJobPosts");

    return state.merge({
      allJobPosts: cloneDeep([...allJobPosts, ...payload.allJobPosts]),
      currentPage: payload.currentPage,
      countOfResults: payload.countOfResults,
    });
  },
  [jobBoardConstants.SET_LOADING_JOB_BOARD]: (state, { payload }) => {
    return state.merge({
      loading: payload.loading,
    });
  },
  [jobBoardConstants.SET_MY_JOB_POSTS]: (state, { payload }) => {
    return state.merge({
      myJobPosts: cloneDeep([...payload.myJobPosts]),
    });
  },
};

export const initialState = () => {
  return Map({
    allJobPosts: [],
    myJobPosts: [],
    jobPost: {},
    currentPage: 1,
    countOfResults: 0,
    loading: false,
  });
};

export default handleActions(reducers, initialState());
