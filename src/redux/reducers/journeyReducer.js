import { handleActions } from "redux-actions";
import { Map } from "immutable";
import cloneDeep from "lodash/cloneDeep";

// Action Type Imports
import { constants as journeyConstants } from "../actions/journey-actions";

// Events's Reducer
export const reducers = {
  [journeyConstants.SET_ALL_JOURNEYS]: (state, { payload }) => {
    return state.merge({ allJourneys: cloneDeep(payload.journeys) });
  },
  [journeyConstants.SET_JOURNEY]: (state, { payload }) => {
    return state.merge({ journey: payload.journey });
  },
  [journeyConstants.UNSET_JOURNEY]: (state, { payload }) => {
    return state.merge({ journey: null });
  },
  [journeyConstants.SHOW_FORM]: (state, { payload }) => {
    return state.merge({ showForm: payload.value });
  },
  [journeyConstants.SET_LOADING]: (state, { payload }) => {
    return state.merge({ ...payload });
  },
};

export const initialState = () =>
  Map({
    loading: false,
    allJourneys: [],
    journey: null,
    showForm: false,
  });

export default handleActions(reducers, initialState());
