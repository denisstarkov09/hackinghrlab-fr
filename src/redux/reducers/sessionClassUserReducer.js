import { handleActions } from "redux-actions";
import { Map } from "immutable";

// Action Type Imports
import { constants as progressConstants } from "../actions/session-class-user-action";

// COURSE's Reducer
export const reducers = {
  [progressConstants.SET_SESSION_USER_PROGRESS]: (state, { payload }) => {
    return state.merge({ sessionUserProgress: payload.sessionUserProgress });
  },
};

export const initialState = () =>
  Map({
    loading: false,
    sessionUserProgress: [],
  });

export default handleActions(reducers, initialState());
