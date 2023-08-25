import { handleActions } from "redux-actions";
import { Map } from "immutable";

import { constants as assessmentConstants } from "../actions/skillCohortResourceResponseAssessment-actions";

const reducers = {
  [assessmentConstants.SET_ALL_SKILL_COHORT_RESOURCE_RESPONSE_ASSESSMENT]: (
    state,
    { payload }
  ) => {
    return state.merge({ ...payload });
  },
};

export const initialState = () => {
  return Map({
    allSkillCohortResourceResponseAssessments: [],
  });
};

export default handleActions(reducers, initialState());
