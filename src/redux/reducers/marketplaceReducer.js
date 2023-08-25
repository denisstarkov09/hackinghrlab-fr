import { handleActions } from "redux-actions";
import { Map } from "immutable";
import cloneDeep from "lodash/cloneDeep";

// Action Type Imports
import { constants as marketplaceConstants } from "../actions/marketplace-actions";

// Events's Reducer
export const reducers = {
  [marketplaceConstants.SET_ALL_MARKETPLACE]: (state, { payload }) => {
    return state.merge({ allMarketplace: cloneDeep(payload.marketplace) });
  },
  [marketplaceConstants.SET_LOADING]: (state, { payload }) => {
    return state.merge({ ...payload });
  },
};

export const initialState = () =>
  Map({
    loading: false,
    allMarketplace: [],
  });

export default handleActions(reducers, initialState());
