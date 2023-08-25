import { handleActions } from "redux-actions";
import { Map } from "immutable";
import cloneDeep from "lodash/cloneDeep";

import { constants as resourcesConstants } from "../actions/skillCohortResource-actions";

const reducers = {
  [resourcesConstants.SET_ALL_RESOURCE]: (state, { payload }) => {
    return state.merge({
      allSkillCohortResources: cloneDeep([...payload.allSkillCohortResources]),
      currentPage: payload.currentPage,
      countOfResults: payload.countOfResults,
    });
  },
  [resourcesConstants.SET_MORE]: (state, { payload }) => {
    const allSkillCohortResources = state.get("allSkillCohortResources");

    return state.merge({
      allSkillCohortResources: cloneDeep([
        ...allSkillCohortResources,
        ...payload.allSkillCohortResources,
      ]),
      currentPage: payload.currentPage,
      countOfResults: payload.countOfResults,
    });
  },
  [resourcesConstants.SET_RESOURCE]: (state, { payload }) => {
    return state.merge({ ...payload });
  },
  [resourcesConstants.SET_LOADING]: (state, { payload }) => {
    return state.merge({
      loading: payload.loading,
    });
  },
  [resourcesConstants.SET_ENTIRE_RESOURCES]: (state, { payload }) => {
    return state.merge({
      entireSkillCohortResources: cloneDeep([
        ...payload.entireSkillCohortResources,
      ]),
    });
  },
};

export const initialState = () => {
  return Map({
    entireSkillCohortResources: [],
    allSkillCohortResources: [],
    skillCohortResource: {},
    currentPage: 1,
    countOfResults: 0,
    loading: false,
  });
};

export default handleActions(reducers, initialState());
