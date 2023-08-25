import { createSelector } from "reselect";

const councilEventDataSelector = (state) => state.councilEvent;

const resultSelector = createSelector(councilEventDataSelector, (payload) => {
  return {
    allCouncilEvents: payload.get("allCouncilEvents"),
    councilEvent: payload.get("councilEvent"),
    searchedUsersForCouncilEvent: payload.get("searchedUsersForCouncilEvent"),
    emailDraftChannel: payload.get("emailDraftChannel"),
    allEmailSendEvent: payload.get("allEmailSendEvent"),
  };
});

export const councilEventSelector = (state) => ({
  ...resultSelector(state),
});
