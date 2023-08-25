import { createAction } from "redux-actions";

const GET_BUSINESS_PARTNER_MEMBERS = "GET_BUSINESS_PARTNER_MEMBERS";
const SET_BUSINESS_PARTNER_MEMBERS = "SET_BUSINESS_PARTNER_MEMBERS";
const CREATE_BUSINESS_PARTNER_RESOURCE = "CREATE_BUSINESS_PARTNER_RESOURCE";
const SET_BUSINESS_PARTNER_RESOURCE = "SET_BUSINESS_PARTNER_RESOURCE";
const DELETE_BUSINESS_PARTNER_RESOURCE = "DELETE_BUSINESS_PARTNER_RESOURCE";
const GET_BUSINESS_PARTNER_RESOURCE = "GET_BUSINESS_PARTNER_RESOURCE";
const SET_BUSINESS_PARTNER_RESOURCES = "SET_BUSINESS_PARTNER_RESOURCES";
const UPDATE_BUSINESS_PARTNER_RESOURCES_INFORMATION =
  "UPDATE_BUSINESS_PARTNER_RESOURCES_INFORMATION";
const UPDATE_BUSINESS_PARTNER_RESOURCE = "UPDATE_BUSINESS_PARTNER_RESOURCE";
const GET_BUSINESS_PARTNER_DOCUMENTS = "GET_BUSINESS_PARTNER_DOCUMENTS";
const CREATE_BUSINESS_PARTNER_DOCUMENT = "CREATE_BUSINESS_PARTNER_DOCUMENT";
const UPDATE_BUSINESS_PARTNER_DOCUMENT_FILE =
  "UPDATE_BUSINESS_PARTNER_DOCUMENT_FILE";
const SET_BUSINESS_PARTNER_DOCUMENT = "SET_BUSINESS_PARTNER_DOCUMENT";
const SET_BUSINESS_PARTNER_DOCUMENTS = "SET_BUSINESS_PARTNER_DOCUMENTS";
const UPDATE_BUSINESS_PARTNER_DOCUMENTS = "UPDATE_BUSINESS_PARTNER_DOCUMENTS";
const UPDATE_BUSINESS_PARTNER_DOCUMENT = "UPDATE_BUSINESS_PARTNER_DOCUMENT";
const GET_BUSINESS_PARTNER_RESOURCES = "GET_BUSINESS_PARTNER_RESOURCES";
const DELETE_BUSINESS_PARTNER_DOCUMENT = "DELETE_BUSINESS_PARTNER_DOCUMENT";

export const constants = {
  GET_BUSINESS_PARTNER_MEMBERS,
  SET_BUSINESS_PARTNER_MEMBERS,
  CREATE_BUSINESS_PARTNER_RESOURCE,
  DELETE_BUSINESS_PARTNER_RESOURCE,
  SET_BUSINESS_PARTNER_RESOURCES,
  SET_BUSINESS_PARTNER_RESOURCE,
  GET_BUSINESS_PARTNER_RESOURCE,
  GET_BUSINESS_PARTNER_RESOURCES,
  CREATE_BUSINESS_PARTNER_DOCUMENT,
  UPDATE_BUSINESS_PARTNER_DOCUMENTS,
  GET_BUSINESS_PARTNER_DOCUMENTS,
  UPDATE_BUSINESS_PARTNER_RESOURCE,
  UPDATE_BUSINESS_PARTNER_RESOURCES_INFORMATION,
  UPDATE_BUSINESS_PARTNER_DOCUMENT_FILE,
  SET_BUSINESS_PARTNER_DOCUMENTS,
  SET_BUSINESS_PARTNER_DOCUMENT,
  DELETE_BUSINESS_PARTNER_DOCUMENT,
};

export const getBusinessPartnerMembers = createAction(
  GET_BUSINESS_PARTNER_MEMBERS
);
export const setBusinessPartnerMembers = createAction(
  SET_BUSINESS_PARTNER_MEMBERS,
  (businessPartnerMembers) => ({ businessPartnerMembers })
);

export const getBusinessPartnerResources = createAction(
  GET_BUSINESS_PARTNER_RESOURCES
  );
  
  export const updateBusinessPartnerResource = createAction(
    UPDATE_BUSINESS_PARTNER_RESOURCE,
    (resource) => resource
  );

export const deleteBusinessPartnerResource = createAction(
  DELETE_BUSINESS_PARTNER_RESOURCE,
  (id, callback) => ({
    id,
    callback,
  })
);

export const getBusinessPartnerResourceById = createAction(
  GET_BUSINESS_PARTNER_RESOURCE,
  (id, callback) => ({
    id,
    callback,
  })
);

export const setBusinessPartnerResource = createAction(
  SET_BUSINESS_PARTNER_RESOURCE,
  (businessPartnerResource) => ({ businessPartnerResource })
);

export const setBusinessPartnerResources = createAction(
  SET_BUSINESS_PARTNER_RESOURCES,
  (businessPartnerResources) => ({
    businessPartnerResources,
  })
);

export const updateBusinessPartnerResourcesInformation = createAction(
  UPDATE_BUSINESS_PARTNER_RESOURCES_INFORMATION,
  (businessPartnerResources) => ({
    businessPartnerResources,
  })
);

export const createBusinessPartnerDocument = createAction(
  CREATE_BUSINESS_PARTNER_DOCUMENT,
  (businessPartnerDocument, callback) => ({
    businessPartnerDocument,
    callback,
  })
);

export const uploadDocumentFile = createAction(
  UPDATE_BUSINESS_PARTNER_DOCUMENT_FILE,
  (documentFile, callback) => ({
    documentFile,
    callback,
  })
);

export const updateBusinessPartnerDocuments = createAction(
  UPDATE_BUSINESS_PARTNER_DOCUMENTS,
  (businessPartnerDocuments) => ({ businessPartnerDocuments })
);

export const updateBusinessPartnerDocument = createAction(
  UPDATE_BUSINESS_PARTNER_DOCUMENT,
  (businessPartnerDocument) => ({ businessPartnerDocument })
);

export const setBusinessPartnerDocument = createAction(
  SET_BUSINESS_PARTNER_DOCUMENT,
  (businessPartnerDocument) => ({ businessPartnerDocument })
);

export const setBusinessPartnerDocuments = createAction(
  SET_BUSINESS_PARTNER_DOCUMENTS,
  (businessPartnerDocuments) => ({
    businessPartnerDocuments,
  })
);

export const getBusinessPartnerDocuments = createAction(
  GET_BUSINESS_PARTNER_DOCUMENTS
);
export const createBusinessPartnerResource = createAction(
  CREATE_BUSINESS_PARTNER_RESOURCE,
  (businessPartner, callback) => ({
    businessPartner,
    callback,
  })
);

export const deleteBusinessPartnerDocument = createAction(
  DELETE_BUSINESS_PARTNER_DOCUMENT,
  (document) => ({ document })
);

export const actions = {
  getBusinessPartnerMembers,
  setBusinessPartnerMembers,
  getBusinessPartnerResources,
  deleteBusinessPartnerResource,
  setBusinessPartnerResource,
  getBusinessPartnerResourceById,
  updateBusinessPartnerResourcesInformation,
  updateBusinessPartnerResource,
  setBusinessPartnerResources,
  createBusinessPartnerResource,
  getBusinessPartnerDocuments,
  setBusinessPartnerDocument,
  setBusinessPartnerDocuments,
  uploadDocumentFile,
  deleteBusinessPartnerDocument,
  updateBusinessPartnerDocuments,
  createBusinessPartnerDocument,
};
