import { createSelector } from "reselect";

const businessPartnerCommentDataSelector = (state) => state.businessPartnerComment;

const resultSelector = createSelector(businessPartnerCommentDataSelector, (payload) => {
  return {
    loading: payload.get("loading"),
    allComments: payload.get("allComments"),
    countOfResults: payload.get("countOfResults"),
    currentPage: payload.get("currentPage"),
  };
});

export const businessPartnerCommentsSelector = (state) => ({
  ...resultSelector(state),
});
