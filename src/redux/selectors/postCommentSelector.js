import { createSelector } from "reselect";

const postCommentDataSelector = (state) => state.postComment;

const resultSelector = createSelector(postCommentDataSelector, (payload) => {
  return {
    loading: payload.get("loading"),
    allComments: payload.get("allComments"),
    countOfResults: payload.get("countOfResults"),
    currentPage: payload.get("currentPage"),
  };
});

export const postCommentSelector = (state) => ({
  ...resultSelector(state),
});