import { createAction } from "redux-actions";

const GET_ALL_RESOURCE = "GET_ALL_RESOURCES";
const GET_RESOURCE = "GET_RESOURCE";
const SET_ALL_RESOURCE = "SET_ALL_RESOURCES";
const SET_RESOURCE = "SET_RESOURCE";
const GET_MORE = "GET_MORE_RESOURCES";
const SET_MORE = "SET_MORE_RESOURCES";
const SET_LOADING = "SET_LOADING";
const GET_ENTIRE_RESOURCES = "GET_ENTIRE_RESOURCES";
const SET_ENTIRE_RESOURCES = "SET_ENTIRE_RESOURCES";

export const constants = {
  GET_ALL_RESOURCE,
  GET_RESOURCE,
  SET_ALL_RESOURCE,
  SET_RESOURCE,
  GET_MORE,
  SET_MORE,
  SET_LOADING,
  GET_ENTIRE_RESOURCES,
  SET_ENTIRE_RESOURCES,
};

export const getAllSkillCohortResources = createAction(
  GET_ALL_RESOURCE,
  (SkillCohortId, filter) => ({
    SkillCohortId,
    filter,
  })
);
export const getMoreSkillCohortResources = createAction(
  GET_MORE,
  (SkillCohortId, filter) => ({ SkillCohortId, filter })
);
export const getSkillCohortResource = createAction(
  GET_RESOURCE,
  (SkillCohortResourceId) => ({
    SkillCohortResourceId,
  })
);
export const setAllSkillCohortResources = createAction(
  SET_ALL_RESOURCE,
  (countOfResults, currentPage, allSkillCohortResources) => ({
    countOfResults,
    currentPage,
    allSkillCohortResources,
  })
);
export const setMoreSkillCohortResources = createAction(
  SET_MORE,
  (countOfResults, currentPage, allSkillCohortResources) => ({
    countOfResults,
    currentPage,
    allSkillCohortResources,
  })
);
export const setSkillCohortResource = createAction(
  SET_RESOURCE,
  (skillCohortResource) => ({ skillCohortResource })
);
export const getEntireResources = createAction(
  GET_ENTIRE_RESOURCES,
  (SkillCohortId, date) => ({ SkillCohortId, date })
);
export const setEntireResources = createAction(
  SET_ENTIRE_RESOURCES,
  (entireSkillCohortResources) => ({ entireSkillCohortResources })
);

export const setLoading = createAction(SET_LOADING, (loading) => ({ loading }));

export const actions = {
  getAllSkillCohortResources,
  getSkillCohortResource,
  setAllSkillCohortResources,
  setSkillCohortResource,
  getMoreSkillCohortResources,
  setMoreSkillCohortResources,
  setLoading,
  getEntireResources,
  setEntireResources
};
