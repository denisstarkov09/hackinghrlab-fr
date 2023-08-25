import { createAction } from "redux-actions";

const GET_ALL_MARKETPLACE_CATEGORIES = "GET_ALL_MARKETPLACE_CATEGORIES";
const SET_ALL_MARKETPLACE_CATEGORIES = "SET_ALL_MARKETPLACE_CATEGORIES";
const SET_LOADING = "SET_MARKETPLACE_CATEGORIES_LOADING";

export const constants = {
  GET_ALL_MARKETPLACE_CATEGORIES,
  SET_ALL_MARKETPLACE_CATEGORIES,
  SET_LOADING,
};

// ------------------------------------
// Actions
// ------------------------------------
export const getAllMarketplaceCategories = createAction(GET_ALL_MARKETPLACE_CATEGORIES);
export const setAllMarketplaceCategories = createAction(SET_ALL_MARKETPLACE_CATEGORIES, (marketplaceCategories) => ({
  marketplaceCategories,
}));
export const setLoading = createAction(SET_LOADING, (loading) => ({ loading }));

export const actions = {
  getAllMarketplaceCategories,
  setAllMarketplaceCategories,
  setLoading,
};
