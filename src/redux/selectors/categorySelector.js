import { createSelector } from "reselect";

const categoryDataSelector = (state) => state.category;

const resultSelector = createSelector(categoryDataSelector, (payload) => {
  return {
    categories: payload.get("categories"),
  };
});

export const categorySelector = (state) => ({
  ...resultSelector(state),
});
