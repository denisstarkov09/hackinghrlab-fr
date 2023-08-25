import { createSelector } from "reselect";

const jobBoardDataSelector = (state) => state.jobBoard;

const resultSelector = createSelector(jobBoardDataSelector, (payload) => {
  return {
    allJobPosts: payload.get("allJobPosts"),
    myJobPosts: payload.get("myJobPosts"),
    jobPost: payload.get("jobPost"),
    currentPage: payload.get("currentPage"),
    countOfResults: payload.get("countOfResults"),
    loading: payload.get("loading"),
  };
});

export const jobBoardSelector = (state) => ({
  ...resultSelector(state),
});
