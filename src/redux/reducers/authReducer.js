import { handleActions } from "redux-actions";
import { Map } from "immutable";
import storage from "store";

import { constants as authConstants } from "../actions/auth-actions";

export const reducers = {
  [authConstants.SET_AUTH]: (state, { payload }) => {
    if (payload && payload.isAuthenticated) {
      storage.set("community", payload);
    } else {
      storage.remove("community");
    }
    return state.merge({ ...payload });
  },
};

export const initialState = () => {
  let community = storage.get("community");

  return Map({
    isAuthenticated: community ? community.isAuthenticated : false,
    loading: community ? community.loading : false,
    error: community ? community.error : null,
    accessToken: community ? community.accessToken : false,
    checkingAuth: community ? community.checkingAuth : false,
    id: community ? community.id : 0,
  });
};

export default handleActions(reducers, initialState());
