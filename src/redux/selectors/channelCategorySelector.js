import { createSelector } from "reselect";

const channelCategoryDataSelector = (state) => state.channelCategory;

const resultSelector = createSelector(
  channelCategoryDataSelector,
  (payload) => {
    return {
      categories: payload.get("categories"),
    };
  }
);

export const channelCategorySelector = (state) => ({
  ...resultSelector(state),
});
