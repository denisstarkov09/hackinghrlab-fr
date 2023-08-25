import { createAction } from "redux-actions";

const GET_ALL_MARKETPLACE = "GET_ALL_MARKETPLACE";
const SET_ALL_MARKETPLACE = "SET_ALL_MARKETPLACE";
const SET_LOADING = "SET_MARKETPLACE_LOADING";

export const constants = {
  GET_ALL_MARKETPLACE,
  SET_ALL_MARKETPLACE,
  SET_LOADING,
};

// ------------------------------------
// Actions
// ------------------------------------
export const getAllMarketplace = createAction(GET_ALL_MARKETPLACE, (orderParam, filter) => ({
  orderParam,
  filter
}));
export const setAllMarketplace = createAction(SET_ALL_MARKETPLACE, (marketplace) => ({
  marketplace,
}));
export const setLoading = createAction(SET_LOADING, (loading) => ({ loading }));

export const actions = {
  getAllMarketplace,
  setAllMarketplace,
  setLoading,
};
