import { createSelector } from "reselect";

const postDataSelector = (state) => state.post;

const resultSelector = createSelector(postDataSelector, (payload) => {
  return {
    loading: payload.get("loading"),
    post: payload.get("post"),
    posts: payload.get("posts"),
    allPosts: payload.get("allPosts"),
    countOfResults: payload.get("countOfResults"),
    currentPage: payload.get("currentPage"),
  };
});

export const postSelector = (state) => ({
  ...resultSelector(state),
});
