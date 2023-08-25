import { handleActions } from "redux-actions";
import { Map } from "immutable";

import { constants as matchmakingConstants } from "../actions/matchmaking-actions";

export const reducers = {
  [matchmakingConstants.SET_MATCHMAKE]: (state, { payload }) => {
    return state.merge({ matchmakingUsers: payload.matchmakingUsers });
  },
};

export const initialState = () =>
  Map({
    matchmakingUsers: [],
  });

export default handleActions(reducers, initialState());
