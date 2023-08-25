import { handleActions } from "redux-actions";

// Action Type Imports
import { constants as councilConstants } from "../actions/council-actions";
import { Map } from "immutable";
import { cloneDeep } from "lodash";

// Council Page's Reducer
export const reducers = {
  [councilConstants.SET_COUNCIL_MEMBERS]: (state, { payload }) => {
    return state.merge({
      councilMembers: payload.councilMembers,
    });
  },
  [councilConstants.SET_COUNCIL_RESOURCES]: (state, { payload }) => {
    return state.merge({
      councilResources: payload.councilResources,
    });
  },
  [councilConstants.SET_COUNCIL_RESOURCE]: (state, { payload }) => {
    return state.merge({
      councilResource: payload.councilResource,
    });
  },
  [councilConstants.UPDATE_COUNCIL_RESOURCES_INFORMATION]: (
    state,
    { payload }
  ) => {
    return state.merge({
      councilResources: cloneDeep(payload.councilResources),
    });
  },
};

export const initialState = () =>
  Map({
    councilMembers: [],
    councilResources: [],
    councilResource: null,
  });

export default handleActions(reducers, initialState());
