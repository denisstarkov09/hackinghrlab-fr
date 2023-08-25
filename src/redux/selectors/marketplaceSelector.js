import { createSelector } from "reselect";

const marketplaceDataSelector = (state) => state.marketplace;

const resultSelector = createSelector(marketplaceDataSelector, (payload) => {
  return {
    loading: payload.get("loading"),
    allMarketplace: payload.get("allMarketplace"),
  };
});

export const marketplaceSelector = (state) => ({
  ...resultSelector(state),
});
