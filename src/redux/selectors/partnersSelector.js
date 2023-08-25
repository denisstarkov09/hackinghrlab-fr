import { createSelector } from "reselect";

const partnerDataSelector = (state) => state.partner;

const resultSelector = createSelector(partnerDataSelector, (payload) => {
  return {
    partners: payload.get("partners"),
    selectedPartner: payload.get("selectedPartner"),
  };
});

export const partnerSelector = (state) => ({
  ...resultSelector(state),
});
