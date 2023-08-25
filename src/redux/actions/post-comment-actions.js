import { createAction } from "redux-actions";

const GET_ALL_COMMENTS = "GET_ALL_COMMENTS";
const ADD_COMMENT = "ADD_COMMENT";
const DELETE_COMMENT = "DELETE_COMMENT";
const SET_ALL_COMMENTS = "SET_ALL_COMMENTS";
const SET_LOADING = "SET_COMMENT_LOADING";

export const constants = {
  GET_ALL_COMMENTS,
  ADD_COMMENT,
  DELETE_COMMENT,
  SET_ALL_COMMENTS,
  SET_LOADING,
};

// ------------------------------------
// Actions
// ------------------------------------
export const getAllComments = createAction(GET_ALL_COMMENTS, (filter) => ({
  filter,
}));
export const addComment = createAction(ADD_COMMENT, (comment) => ({ comment }));
export const deleteComment = createAction(DELETE_COMMENT, (comment) => ({
  comment,
}));
export const setAllComments = createAction(
  SET_ALL_COMMENTS,
  (total, page, comments) => ({
    total,
    page,
    comments,
  })
);
export const setLoading = createAction(SET_LOADING, (loading) => ({ loading }));

export const actions = {
  getAllComments,
  addComment,
  deleteComment,
  setAllComments,
  setLoading,
};
