import { handleActions } from "redux-actions";
import { Map } from "immutable";

import { constants as skillCohortConstants } from "../actions/skillCohort-actions";

export const reducers = {
  [skillCohortConstants.SET_SKILL_COHORT]: (state, { payload }) => {
    return state.merge({ ...payload });
  },
  [skillCohortConstants.SET_ALL_OF_MY_COHORT]: (state, { payload }) => {
    return state.merge({ ...payload });
  },
  [skillCohortConstants.SET_ALL_SKILL_COHORT]: (state, { payload }) => {
    return state.merge({ ...payload });
  },
};

export const initialState = () => {
  return Map({
    allSkillCohorts: [],
    allOfMySkillCohorts: [],
    skillCohort: {},
  });
};

export default handleActions(reducers, initialState());
