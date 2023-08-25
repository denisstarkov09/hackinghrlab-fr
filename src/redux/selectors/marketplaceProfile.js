import { createSelector } from "reselect";

const marketplaceProfileDataSelector = (state) => state.marketplaceProfile;

const resultSelector = createSelector(
  marketplaceProfileDataSelector,
  (payload) => {
    return {
      marketplaceProfiles: payload.get("marketplaceProfiles"),
      marketplaceProfile: payload.get("marketplaceProfile"),
    };
  }
);

export const marketplaceProfileSelector = (state) => ({
  ...resultSelector(state),
});
