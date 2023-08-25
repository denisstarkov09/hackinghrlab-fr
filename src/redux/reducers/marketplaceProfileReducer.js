import { handleActions } from "redux-actions";
import { Map } from "immutable";

// Action Type Imports
import { constants as marketPlaceProfileConstants } from "../actions/marketplaceProfile-actions";

// Session's Reducer
export const reducers = {
  [marketPlaceProfileConstants.SET_MARKETPLACE_PROFILES]: (
    state,
    { payload }
  ) => {
    return state.merge({
      marketplaceProfiles: payload.marketplaceProfiles,
    });
  },
  [marketPlaceProfileConstants.SET_MARKETPLACE_PROFILE]: (
    state,
    { payload }
  ) => {
    return state.merge({
      marketplaceProfile: payload.marketplaceProfile,
    });
  },
};

export const initialState = () =>
  Map({
    marketplaceProfiles: [],
    marketplaceProfile: {},
  });

export default handleActions(reducers, initialState());
