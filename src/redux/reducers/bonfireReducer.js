import { handleActions } from "redux-actions";
import { Map } from "immutable";

// Action Type Imports
import { constants as bonfireConstants } from "../actions/bonfire-actions";

// Session's Reducer
export const reducers = {
  [bonfireConstants.SET_BONFIRES]: (state, { payload }) => {
    return state.merge({
      bonfires: payload.bonfires,
    });
  },
};

export const initialState = () =>
  Map({
    bonfires: [],
  });

export default handleActions(reducers, initialState());
