import { createSelector } from "reselect";

const bonfiresDataSelector = (state) => state.bonfires;

const resultSelector = createSelector(bonfiresDataSelector, (payload) => {
  return {
    bonfires: payload.get("bonfires"),
  };
});

export const bonfireSelector = (state) => ({
  ...resultSelector(state),
});
