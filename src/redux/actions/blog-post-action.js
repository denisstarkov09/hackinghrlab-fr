import { createAction } from "redux-actions";

const CREATE_BLOG_POST = "CREATE_BLOG_POST";
const SEARCH_BLOG_POSTS = "SEARCH_BLOG_POSTS";
const SET_BLOG_POSTS = "SET_BLOG_POSTS";
const GET_BLOGS_POSTS_BY_CHANNEL = "GET_BLOGS_POSTS_BY_CHANNEL";
const SET_BLOGS_POSTS_BY_CHANNEL = "SET_BLOGS_POSTS_BY_CHANNEL";
const SET_CURRENT_PAGE = "SET_CURRENT_PAGE";
const UPDATE_BLOG_POST = "UPDATE_BLOG_POST";
const DELETE_BLOG_POST = "DELETE_BLOG_POST";
const SET_BLOG_POST_LIKE = "SET_BLOG_POST_LIKE";
const DELETE_BLOG_POST_LIKE = "DELETE_BLOG_POST_LIKE";

export const constants = {
  CREATE_BLOG_POST,
  SEARCH_BLOG_POSTS,
  SET_BLOG_POSTS,
  SET_CURRENT_PAGE,
  GET_BLOGS_POSTS_BY_CHANNEL,
  SET_BLOGS_POSTS_BY_CHANNEL,
  UPDATE_BLOG_POST,
  DELETE_BLOG_POST,
  SET_BLOG_POST_LIKE,
  DELETE_BLOG_POST_LIKE,
};
// ------------------------------------
// Actions
// ------------------------------------
export const createBlogPost = createAction(
  CREATE_BLOG_POST,
  (blogpost, callback) => ({
    blogpost,
    callback,
  })
);

export const searchBlogPosts = createAction(
  SEARCH_BLOG_POSTS,
  (filters, page) => ({ filters, page })
);

export const setBlogPosts = createAction(
  SET_BLOG_POSTS,
  (blogsPosts, count) => ({
    blogsPosts,
    count,
  })
);

export const setCurrentPage = createAction(SET_CURRENT_PAGE, (currentPage) => ({
  currentPage,
}));

export const getBlogsPostsByChannel = createAction(
  GET_BLOGS_POSTS_BY_CHANNEL,
  (ChannelId) => ({ ChannelId })
);

export const setBlogsPostsByChannel = createAction(
  SET_BLOGS_POSTS_BY_CHANNEL,
  (blogsPostByChannel) => ({ blogsPostByChannel })
);

export const updateBlogPost = createAction(
  UPDATE_BLOG_POST,
  (blogPostId, data, callback) => ({ blogPostId, data, callback })
);

export const deleteBlogPost = createAction(
  DELETE_BLOG_POST,
  (blogPostId, callback) => ({
    blogPostId,
    callback,
  })
);

export const setBlogPostLike = createAction(
  SET_BLOG_POST_LIKE,
  (data, callback) => ({
    data,
    callback,
  })
);
export const deleteBlogPostLike = createAction(
  DELETE_BLOG_POST_LIKE,
  (id, callback) => ({ id, callback })
);

export const actions = {
  createBlogPost,
  searchBlogPosts,
  setBlogPosts,
  setCurrentPage,
  getBlogsPostsByChannel,
  setBlogsPostsByChannel,
  updateBlogPost,
  deleteBlogPost,
  setBlogPostLike,
  deleteBlogPostLike,
};
