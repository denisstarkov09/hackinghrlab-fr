import { createSelector } from "reselect";

const journeyItemDataSelector = (state) => state.journeyItem;

const resultSelector = createSelector(journeyItemDataSelector, (payload) => {
  return {
    loading: payload.get("loading"),
    allJourneyItems: payload.get("allJourneyItems"),
    journeyId: payload.get("journeyId"),
  };
});

export const journeyItemSelector = (state) => ({
  ...resultSelector(state),
});
