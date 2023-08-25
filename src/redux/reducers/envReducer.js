import { handleActions } from "redux-actions";
import { Map } from "immutable";

// Action Type Imports
import { constants as envConstants } from "../actions/env-actions";
import supportedLanguages from "../../config/supportedLanguages";

export const reducers = {
  [envConstants.SET_ENV]: (state, { payload }) => {
    return state.merge({ ...payload });
  },
  [envConstants.SET_DIMENSIONS]: (state, { payload }) => {
    return state.merge({ ...payload });
  },
  [envConstants.SET_IS_MOBILE]: (state, { payload }) => {
    return state.merge({ ...payload });
  },
  [envConstants.SET_COLLAPSED]: (state, { payload }) => {
    return state.merge({ siderMenuCollapsed: payload.collapsed });
  },
  [envConstants.SET_LANG]: (state, { payload }) => {
    return state.merge({ ...payload });
  },
  [envConstants.SET_EDITOR_SIGNATURE]: (state, { payload }) => {
    return state.merge({ ...payload });
  },
};

export const initialState = () =>
  Map({
    width: 1000,
    height: 1000,
    isMobile: false,
    siderMenuCollapsed: true,
    lang: supportedLanguages.includes(navigator.language.split(/[-_]/)[0])
      ? navigator.language.split(/[-_]/)[0]
      : "en", // language without region code
    s3Hash: {},
  });

export default handleActions(reducers, initialState());
