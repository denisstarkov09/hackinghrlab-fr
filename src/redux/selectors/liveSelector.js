import { createSelector } from "reselect";

const liveDataSelector = (state) => state.live;

const resultSelector = createSelector(liveDataSelector, (payload) => {
  return {
    live: payload.get("live"),
  };
});

export const liveSelector = (state) => ({
  ...resultSelector(state),
});
