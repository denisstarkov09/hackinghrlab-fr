import { createAction } from "redux-actions";

const GET_ALL_BUSINESS_PARTNER_COMMENTS = "GET_ALL_BUSINESS_PARTNER_COMMENTS_COMMENTS";
const ADD_BUSINESS_PARTNER_COMMENT = "ADD_COMMENT";
const DELETE_BUSINESS_PARTNER_COMMENT = "DELETE_BUSINESS_PARTNER_COMMENT_COMMENT";
const SET_ALL_BUSINESS_PARTNER_COMMENTS = "SET_ALL_COMMENTS";
const SET_LOADING = "SET_COMMENT_LOADING";

export const constants = {
  GET_ALL_BUSINESS_PARTNER_COMMENTS,
  ADD_BUSINESS_PARTNER_COMMENT,
  DELETE_BUSINESS_PARTNER_COMMENT,
  SET_ALL_BUSINESS_PARTNER_COMMENTS,
  SET_LOADING,
};

// ------------------------------------
// Actions
// ------------------------------------
export const getAllBusinessPartnerComments = createAction(
  GET_ALL_BUSINESS_PARTNER_COMMENTS,
  (filter) => ({
    filter,
  })
);
export const addBusinessPartnerComment = createAction(
  ADD_BUSINESS_PARTNER_COMMENT,
  (comment) => ({ comment })
);
export const deleteBusinessPartnerComment = createAction(
  DELETE_BUSINESS_PARTNER_COMMENT,
  (comment) => ({
    comment,
  })
);
export const setAllBusinessPartnerComments = createAction(
  SET_ALL_BUSINESS_PARTNER_COMMENTS,
  (total, page, comments) => ({
    total,
    page,
    comments,
  })
);
export const setLoading = createAction(SET_LOADING, (loading) => ({ loading }));

export const actions = {
  getAllBusinessPartnerComments,
  addBusinessPartnerComment,
  deleteBusinessPartnerComment,
  setAllBusinessPartnerComments,
  setLoading,
};
