import { handleActions } from "redux-actions";
import { Map } from "immutable";

import { constants as responseConstants } from "../actions/skillCohortResourceResponse-actions";

const reducers = {
  [responseConstants.SET_ALL_RESOURCE_RESPONSE]: (state, { payload }) => {
    return state.merge({ ...payload });
  },
  [responseConstants.SET_RESOURCE_RESPONSE]: (state, { payload }) => {
    return state.merge({ ...payload });
  },
};

export const initialState = () => {
  return Map({
    allSkillCohortResourceResponses: [],
    skillCohortResourceResponse: {},
  });
};

export default handleActions(reducers, initialState());
