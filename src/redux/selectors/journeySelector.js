import { createSelector } from "reselect";

const journeyDataSelector = (state) => state.journey;

const resultSelector = createSelector(journeyDataSelector, (payload) => {
  return {
    loading: payload.get("loading"),
    allJourneys: payload.get("allJourneys"),
    journey: payload.get("journey"),
    showForm: payload.get("showForm"),
  };
});

export const journeySelector = (state) => ({
  ...resultSelector(state),
});
