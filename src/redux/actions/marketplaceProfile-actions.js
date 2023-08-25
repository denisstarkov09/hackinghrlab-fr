import { createAction } from "redux-actions";

const CREATE_MARKETPLACE_PROFILE = "CREATE_MARKETPLACE_PROFILE";
const GET_MARKETPLACE_PROFILES = "GET_MARKETPLACE_PROFILES";
const SET_MARKETPLACE_PROFILES = "SET_MARKETPLACE_PROFILES";
const GET_MARKETPLACE_PROFILE = "GET_MARKETPLACE_PROFILE";
const SET_MARKETPLACE_PROFILE = "SET_MARKETPLACE_PROFILE";
const UPDATE_MARKETPLACE_PROFILE = "UPDATE_MARKETPLACE_PROFILE";

export const constants = {
  CREATE_MARKETPLACE_PROFILE,
  GET_MARKETPLACE_PROFILES,
  SET_MARKETPLACE_PROFILES,
  GET_MARKETPLACE_PROFILE,
  SET_MARKETPLACE_PROFILE,
  UPDATE_MARKETPLACE_PROFILE,
};

// ------------------------------------
// Actions
// ------------------------------------
export const createMarketplaceProfile = createAction(
  CREATE_MARKETPLACE_PROFILE,
  (marketplaceProfile) => ({ marketplaceProfile })
);

export const getMarketplaceProfiles = createAction(
  GET_MARKETPLACE_PROFILES,
  (filter) => ({ filter })
);

export const setMarketPlaceProfiles = createAction(
  SET_MARKETPLACE_PROFILES,
  (marketplaceProfiles) => ({
    marketplaceProfiles,
  })
);

export const getMarketplaceProfile = createAction(
  GET_MARKETPLACE_PROFILE,
  (id) => ({ id })
);
export const setMarketPlaceProfile = createAction(
  SET_MARKETPLACE_PROFILE,
  (marketplaceProfile) => ({
    marketplaceProfile,
  })
);

export const updateMarketPlaceProfile = createAction(
  UPDATE_MARKETPLACE_PROFILE,
  (marketplaceProfile) => ({
    marketplaceProfile,
  })
);

export const actions = {
  createMarketplaceProfile,
  getMarketplaceProfiles,
  setMarketPlaceProfiles,
  getMarketplaceProfile,
  setMarketPlaceProfile,
  updateMarketPlaceProfile,
};
