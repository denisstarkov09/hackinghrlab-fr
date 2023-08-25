import { handleActions } from "redux-actions";
import { Map } from "immutable";
import cloneDeep from "lodash/cloneDeep";

// Action Type Imports
import { constants as marketplaceCategoriesConstants } from "../actions/marketplaceCategories-actions";

// Events's Reducer
export const reducers = {
  [marketplaceCategoriesConstants.SET_ALL_MARKETPLACE_CATEGORIES]: (state, { payload }) => {
    return state.merge({ allMarketplaceCategories: cloneDeep(payload.marketplaceCategories) });
  },
  [marketplaceCategoriesConstants.SET_LOADING]: (state, { payload }) => {
    return state.merge({ ...payload });
  },
};

export const initialState = () =>
  Map({
    loading: false,
    allMarketplaceCategories: [],
  });

export default handleActions(reducers, initialState());
