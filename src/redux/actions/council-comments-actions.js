import { createAction } from "redux-actions";

const GET_ALL_COUNCIL_COMMENTS = "GET_ALL_COUNCIL_COMMENTS";
const ADD_COUNCIL_COMMENT = "ADD_COMMENT";
const DELETE_COUNCIL_COMMENT = "DELETE_COUNCIL_COMMENT";
const SET_ALL_COUNCIL_COMMENTS = "SET_ALL_COMMENTS";
const SET_LOADING = "SET_COMMENT_LOADING";

export const constants = {
  GET_ALL_COUNCIL_COMMENTS,
  ADD_COUNCIL_COMMENT,
  DELETE_COUNCIL_COMMENT,
  SET_ALL_COUNCIL_COMMENTS,
  SET_LOADING,
};

// ------------------------------------
// Actions
// ------------------------------------
export const getAllCouncilComments = createAction(
  GET_ALL_COUNCIL_COMMENTS,
  (filter) => ({
    filter,
  })
);
export const addCouncilComment = createAction(
  ADD_COUNCIL_COMMENT,
  (comment) => ({ comment })
);
export const deleteCouncilComment = createAction(
  DELETE_COUNCIL_COMMENT,
  (comment) => ({
    comment,
  })
);
export const setAllCouncilComments = createAction(
  SET_ALL_COUNCIL_COMMENTS,
  (total, page, comments) => ({
    total,
    page,
    comments,
  })
);
export const setLoading = createAction(SET_LOADING, (loading) => ({ loading }));

export const actions = {
  getAllCouncilComments,
  addCouncilComment,
  deleteCouncilComment,
  setAllCouncilComments,
  setLoading,
};
