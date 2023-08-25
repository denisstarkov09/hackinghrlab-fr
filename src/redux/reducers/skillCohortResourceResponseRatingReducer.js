import { handleActions } from "redux-actions";
import { Map } from "immutable";

import { constants as responseRatingConstants } from "../actions/skillCohortResourceResponseRating-actions";

const reducers = {
  [responseRatingConstants.SET_ALL_RESPONSE_RATING]: (state, { payload }) => {
    return state.merge({ ...payload });
  },
};

const initialState = () => {
  return Map({
    allSkillCohortResourceResponseRatings: [],
  });
};

export default handleActions(reducers, initialState());
