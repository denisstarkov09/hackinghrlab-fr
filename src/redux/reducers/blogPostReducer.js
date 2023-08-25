import { handleActions } from "redux-actions";
import { Map } from "immutable";

import { constants as blogPostConstants } from "../actions/blog-post-action";

export const reducers = {
  [blogPostConstants.SET_BLOGS_POSTS_BY_CHANNEL]: (state, { payload }) => {
    return state.merge({
      blogsPostByChannel: payload.blogsPostByChannel,
    });
  },
  [blogPostConstants.SET_BLOG_POSTS]: (state, { payload }) => {
    return state.merge({
      blogsPosts: payload.blogsPosts,
      totalBlogPosts: payload.count,
    });
  },
  [blogPostConstants.SET_CURRENT_PAGE]: (state, { payload }) => {
    return state.merge({
      currentPage: payload.currentPage,
    });
  },
};

export const initialState = () =>
  Map({
    loading: false,
    error: null,
    blogsPosts: [],
    blogsPostByChannel: [],
    currentPage: 1,
    totalBlogPosts: 0,
  });

export default handleActions(reducers, initialState());
