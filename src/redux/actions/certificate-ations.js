import { createAction } from "redux-actions";

const CONTROL_CERTIFICATE = "CONTROL_CERTIFICATE";
const GET_CERTIFICATE = "GET_CERTIFICATE";
const UPDATE_CERTIFICATE_INFORMATION = "UPDATE_CERTIFICATE_INFORMATION";
const GET_ALL_CERTIFICATE_TYPE = "GET_ALL_CERTIFICATE_TYPE";
const UPDATE_ALL_CERTIFICATE_INFORMATION = "UPDATE_ALL_CERTIFICATE_INFORMATION"
const GET_CODE_CERTIFICATE = "GET_CODE_CERTIFICATE"

export const constants = {
    CONTROL_CERTIFICATE,
    GET_CERTIFICATE,
    UPDATE_CERTIFICATE_INFORMATION,
    GET_ALL_CERTIFICATE_TYPE,
    UPDATE_ALL_CERTIFICATE_INFORMATION,
    GET_CODE_CERTIFICATE
};

// ------------------------------------
// Actions
// ------------------------------------
export const createControlCertificate = createAction(CONTROL_CERTIFICATE, (data, callback) => ({data,callback}));

export const getCodeCertificate = createAction(GET_CODE_CERTIFICATE, (data, callback) => ({data, callback}))

export const getCertificate = createAction(GET_CERTIFICATE, (code,callback) => ({code,callback}))

export const updateCertificate = createAction(UPDATE_CERTIFICATE_INFORMATION, (data, callback) => ({data,callback}))

export const getAllCertificateType = createAction(GET_ALL_CERTIFICATE_TYPE, (type, callback) => ({type,callback}))

export const updateAllCertificate = createAction(UPDATE_ALL_CERTIFICATE_INFORMATION, (data, callback) => ({data,callback}))

export const actions = {
    createControlCertificate,
    getCertificate,
    getAllCertificateType,
    updateCertificate,
    updateAllCertificate,
    getCodeCertificate
};
