import { createSelector } from "reselect";

const blogPostDataSelector = (state) => state.blogPost;

const resultSelector = createSelector(blogPostDataSelector, (payload) => {
  return {
    loading: payload.get("loading"),
    blogsPosts: payload.get("blogsPosts"),
    blogsPostByChannel: payload.get("blogsPostByChannel"),
    error: payload.get("error"),
    currentPage: payload.get("currentPage"),
    totalBlogPosts: payload.get("totalBlogPosts"),
  };
});

export const blogPostSelector = (state) => ({
  ...resultSelector(state),
});
