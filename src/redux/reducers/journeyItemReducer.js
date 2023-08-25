import { handleActions } from "redux-actions";
import { Map } from "immutable";
import cloneDeep from "lodash/cloneDeep";

// Action Type Imports
import { constants as journeyItemConstants } from "../actions/journeyItem-actions";

// Events's Reducer
export const reducers = {
  [journeyItemConstants.SET_JOURNEY_ITEMS]: (state, { payload }) => {
    return state.merge({ allJourneyItems: cloneDeep(payload.journeyItems) });
  },
  [journeyItemConstants.SET_JOURNEY_ID]: (state, { payload }) => {
    return state.merge({ ...payload });
  },
  [journeyItemConstants.SET_LOADING]: (state, { payload }) => {
    return state.merge({ ...payload });
  },
};

export const initialState = () =>
  Map({
    loading: false,
    allJourneyItems: [],
    journeyId: 0,
  });

export default handleActions(reducers, initialState());
