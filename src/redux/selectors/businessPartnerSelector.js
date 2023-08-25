import { createSelector } from "reselect";

const businessPartnerDataSelector = (state) => state.businessPartner;

const resultSelector = createSelector(businessPartnerDataSelector, (payload) => {
  return {
    businessPartnerMembers: payload.get("businessPartnerMembers"),
    businessPartnerResources: payload.get("businessPartnerResources"),
    businessPartnerResource: payload.get("businessPartnerResource"),
    businessPartnerDocuments: payload.get("businessPartnerDocuments"),
    businessPartnerDocument: payload.get("businessPartnerDocument"),
    // setting: payload.get("setting"),
  };
});

export const businessPartnerSelector = (state) => ({
  ...resultSelector(state),
});
