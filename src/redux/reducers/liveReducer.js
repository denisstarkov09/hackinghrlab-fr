import { handleActions } from "redux-actions";
import { Map } from "immutable";

// Action Type Imports
import { constants as liveConstants } from "../actions/live-actions";

// Events's Reducer
export const reducers = {
  [liveConstants.SET_LIVE]: (state, { payload }) => {
    return state.merge({ live: payload.live });
  },
};

export const initialState = () =>
  Map({
    live: {},
  });

export default handleActions(reducers, initialState());
