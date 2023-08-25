import { createAction } from "redux-actions";

const GET_ALL_RESOURCE_RESPONSES = "GET_ALL_RESOURCE_RESPONSES";
const SET_ALL_RESOURCE_RESPONSE = "SET_ALL_RESOURCE_RESPONSE";
const CREATE_RESOURCE_RESPONSE = "CREATE_RESOURCE_RESPONSE";
const GET_RESOURCE_RESPONSE = "GET_RESOURCE_RESPONSE";
const UPDATE_RESOURCE_RESPONSE = "UPDATE_RESOURCE_RESPONSE";
const SET_RESOURCE_RESPONSE = "SET_RESOURCE_RESPONSE";

export const constants = {
  GET_ALL_RESOURCE_RESPONSES,
  SET_ALL_RESOURCE_RESPONSE,
  CREATE_RESOURCE_RESPONSE,
  GET_RESOURCE_RESPONSE,
  UPDATE_RESOURCE_RESPONSE,
  SET_RESOURCE_RESPONSE,
};

const getAllResourceResponses = createAction(
  GET_ALL_RESOURCE_RESPONSES,
  (SkillCohortResourceId, SkillCohortParticipantId) => ({
    SkillCohortResourceId,
    SkillCohortParticipantId,
  })
);
const getResourceResponse = createAction(
  GET_RESOURCE_RESPONSE,
  (SkillCohortResourceId, SkillCohortParticipantId) => ({
    SkillCohortResourceId,
    SkillCohortParticipantId,
  })
);
const setAllResourceResponse = createAction(
  SET_ALL_RESOURCE_RESPONSE,
  (allSkillCohortResourceResponses) => ({
    allSkillCohortResourceResponses,
  })
);
const setResourceResponse = createAction(
  SET_RESOURCE_RESPONSE,
  (skillCohortResourceResponse) => ({
    skillCohortResourceResponse,
  })
);
const updateResourceResponse = createAction(
  UPDATE_RESOURCE_RESPONSE,
  (SkillCohortResourceResponseId, response) => ({
    SkillCohortResourceResponseId,
    response,
  })
);
const createResourceResponse = createAction(
  CREATE_RESOURCE_RESPONSE,
  (SkillCohortResourceId, SkillCohortParticipantId, response) => ({
    SkillCohortResourceId,
    SkillCohortParticipantId,
    response,
  })
);

export const actions = {
  getAllResourceResponses,
  getResourceResponse,
  setAllResourceResponse,
  createResourceResponse,
  updateResourceResponse,
  setResourceResponse,
};
