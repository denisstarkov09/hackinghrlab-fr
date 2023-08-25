import { createAction } from "redux-actions";

const GET_COUNCIL_MEMBERS = "GET_COUNCIL_MEMBERS";
const SET_COUNCIL_MEMBERS = "SET_COUNCIL_MEMBERS";
const CREATE_COUNCIL_RESOURCE = "CREATE_COUNCIL_RESOURCE";
const SET_COUNCIL_RESOURCE = "SET_COUNCIL_RESOURCE";
const GET_COUNCIL_RESOURCE = "GET_COUNCIL_RESOURCE";
const SET_COUNCIL_RESOURCES = "SET_COUNCIL_RESOURCES";
const UPDATE_COUNCIL_RESOURCES_INFORMATION =
  "UPDATE_COUNCIL_RESOURCES_INFORMATION";
const GET_COUNCIL_RESOURCES = "GET_COUNCIL_RESOURCES";
const EMAIL_ADD = "EMAIL_ADD"

export const constants = {
  GET_COUNCIL_MEMBERS,
  SET_COUNCIL_MEMBERS,
  CREATE_COUNCIL_RESOURCE,
  SET_COUNCIL_RESOURCES,
  UPDATE_COUNCIL_RESOURCES_INFORMATION,
  SET_COUNCIL_RESOURCE,
  GET_COUNCIL_RESOURCE,
  GET_COUNCIL_RESOURCES,
  EMAIL_ADD
};

export const getCouncilMembers = createAction(GET_COUNCIL_MEMBERS);
export const setCouncilMembers = createAction(
  SET_COUNCIL_MEMBERS,
  (councilMembers) => ({ councilMembers })
);

export const getCouncilResources = createAction(GET_COUNCIL_RESOURCES);

export const getCouncilResourceById = createAction(
  GET_COUNCIL_RESOURCE,
  (id, callback) => ({
    id,
    callback,
  })
);
export const setCouncilResource = createAction(
  SET_COUNCIL_RESOURCE,
  (councilResource) => ({councilResource})
);

export const updateCouncilResourcesInformation = createAction(
  UPDATE_COUNCIL_RESOURCES_INFORMATION,
  (councilResources) => ({
    councilResources,
  })
);
export const setCouncilResources = createAction(
  SET_COUNCIL_RESOURCES,
  (councilResources) => ({
    councilResources,
  })
);
export const createCouncilResource = createAction(
  CREATE_COUNCIL_RESOURCE,
  (council, callback) => ({
    council,
    callback,
  })
);

export const sendEmailsForPartOfCouncil = createAction(
  EMAIL_ADD,
  (data,callback) => ({
    data,callback
  })
)

export const actions = {
  getCouncilMembers,
  setCouncilMembers,
  getCouncilResources,
  setCouncilResource,
  getCouncilResourceById,
  updateCouncilResourcesInformation,
  setCouncilResources,
  createCouncilResource,
};
