import { createSelector } from "reselect";

const councilCommentDataSelector = (state) => state.councilComment;

const resultSelector = createSelector(councilCommentDataSelector, (payload) => {
  return {
    loading: payload.get("loading"),
    allComments: payload.get("allComments"),
    countOfResults: payload.get("countOfResults"),
    currentPage: payload.get("currentPage"),
  };
});

export const councilCommentsSelector = (state) => ({
  ...resultSelector(state),
});
