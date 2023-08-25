import { createAction } from "redux-actions";

// supportedLanguages array
import supportedLanguages from "../../config/supportedLanguages";

// Action Types
const SET_ENV = "SET_ENV";
const SET_DIMENSIONS = "SET_DIMENSIONS";
const SET_IS_MOBILE = "SET_IS_MOBILE";
const SET_COLLAPSED = "SET_COLLAPSED";
const SET_LANG = "SET_LANG";
const GET_EDITOR_SIGNATURE = "GET_EDITOR_SIGNATURE";
const SET_EDITOR_SIGNATURE = "SET_EDITOR_SIGNATURE";

export const constants = {
  SET_ENV,
  SET_DIMENSIONS,
  SET_IS_MOBILE,
  SET_COLLAPSED,
  SET_LANG,
  GET_EDITOR_SIGNATURE,
  SET_EDITOR_SIGNATURE,
};

// ------------------------------------
// Actions
// ------------------------------------
export const setEnv = createAction(SET_ENV, (env) => ({ env }));
export const setDimensions = createAction(SET_DIMENSIONS, (width, height) => ({
  width,
  height,
}));
export const setIsMobile = createAction(SET_IS_MOBILE, (isMobile) => ({
  isMobile,
}));
export const setCollapsed = createAction(SET_COLLAPSED, (collapsed) => ({
  collapsed,
}));
export const setLang = createAction(SET_LANG, (lang) => ({
  lang: supportedLanguages.includes(lang) ? lang : "en",
}));
export const getEditorSignature = createAction(GET_EDITOR_SIGNATURE);
export const setEditorSignature = createAction(
  SET_EDITOR_SIGNATURE,
  (s3Hash) => ({ s3Hash })
);

export const actions = {
  setEnv,
  setDimensions,
  setIsMobile,
  setCollapsed,
  setLang,
  getEditorSignature,
  setEditorSignature,
};
