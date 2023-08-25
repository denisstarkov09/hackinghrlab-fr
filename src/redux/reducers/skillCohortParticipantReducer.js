import { handleActions } from "redux-actions";
import { Map } from "immutable";

import { constants as skillCohortParticipanActions } from "redux/actions/skillCohortParticipant-actions";

const reducers = {
  [skillCohortParticipanActions.SET_SKILL_COHORT_PARTICIPANT]: (
    state,
    { payload }
  ) => {
    return state.merge({ ...payload });
  },
  [skillCohortParticipanActions.SET_ALL_SKILL_COHORT_PARTICIPANTS]: (
    state,
    { payload }
  ) => {
    return state.merge({ ...payload });
  },
  [skillCohortParticipanActions.SET_PARTICIPATED]: (state, { payload }) => {
    return state.merge({ ...payload });
  },
};

export const initialState = () => {
  return Map({
    allSkillCohortParticipants: [],
    allParticipated: [],
    skillCohortParticipant: {},
  });
};

export default handleActions(reducers, initialState());
