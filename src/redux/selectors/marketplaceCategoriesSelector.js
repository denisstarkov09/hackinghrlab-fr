import { createSelector } from "reselect";

const marketplaceCategoriesDataSelector = (state) => state.marketplaceCategories;

const resultSelector = createSelector(marketplaceCategoriesDataSelector, (payload) => {
  return {
    loading: payload.get("loading"),
    allMarketplaceCategories: payload.get("allMarketplaceCategories"),
  };
});

export const marketplaceCategoriesSelector = (state) => ({
  ...resultSelector(state),
});
