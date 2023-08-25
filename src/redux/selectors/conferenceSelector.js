import { createSelector } from "reselect";

const conferenceDataSelector = (state) => state.conference;

const resultSelector = createSelector(conferenceDataSelector, (payload) => {
  return {
    loading: payload.get("loading"),
    allConferenceLibraries: payload.get("allConferenceLibraries"),
    error: payload.get("error"),
    countOfResults: payload.get("countOfResults"),
    currentPage: payload.get("currentPage"),
    conferenceLibrary: payload.get("conferenceLibrary"),
  };
});

export const conferenceSelector = (state) => ({
  ...resultSelector(state),
});
