import { createSelector } from "reselect";

const councilDataSelector = (state) => state.council;

const resultSelector = createSelector(councilDataSelector, (payload) => {
  return {
    councilMembers: payload.get("councilMembers"),
    councilResources: payload.get("councilResources"),
    councilResource: payload.get("councilResource")
    // setting: payload.get("setting"),
  };
});

export const councilSelector = (state) => ({
  ...resultSelector(state),
});
