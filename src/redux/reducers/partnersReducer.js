import { handleActions } from "redux-actions";
import { Map } from "immutable";

// Action Type Imports
import { constants as partnersConstants } from "../actions/partner-actions";

// Session's Reducer
export const reducers = {
  [partnersConstants.SET_PARTNERS]: (state, { payload }) => {
    return state.merge({
      partners: payload.partners,
    });
  },
  [partnersConstants.SET_PARTNER]: (state, { payload }) => {
    return state.merge({
      selectedPartner: payload.partner,
    });
  },
};

export const initialState = () =>
  Map({
    partners: [],
    selectedPartner: {},
  });

export default handleActions(reducers, initialState());
