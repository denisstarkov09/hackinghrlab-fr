import { createAction } from "redux-actions";

// Action Types
const UPDATE_PANEL_SPEAKERS = "UPDATE_PANEL_SPEAKERS"
const GET_PANEL_SPEAKERS = "GET_PANEL_SPEAKERS";
const GET_USERS_SPEAKERS = "GET_USERS_SPEAKERS";
const REMOVE_USERS_PANEL = "REMOVE_USERS_PANEL";
const UPDATE_USERS_SPEAKERS = "UPDATE_USERS_SPEAKERS";
const ADD_SPEAKER_TO_PANEL = "ADD_SPEAKER_TO_PANEL";
const REGISTER_USER_IF_NOT_REGISTER_CONFERENCE_2023 = "REGISTER_USER_IF_NOT_REGISTER_CONFERENCE_2023";
const GET_ALL_PANELS_OF_ONE_USER = "GET_ALL_PANELS_OF_ONE_USER";
const UPDATE_ALL_PANELS_OF_ONE_USER = "UPDATE_ALL_PANELS_OF_ONE_USER";
const SET_BUL_REGISTER = "SET_BUL_REGISTER";
const ADDED_TO_MY_PERSONAL_AGENDA = "ADDED_TO_MY_PERSONAL_AGENDA"
const GET_ALL_SPONSORS = "GET_ALL_SPONSORS";
const UPDATE_ALL_SPONSOR_2023 = "UPDATE_ALL_SPONSOR_2023";
const SET_ACTIVE_BUTTON = "SET_ACTIVE_BUTTON";
const GET_ALL_PARRAF_CONFERENCE = "GET_ALL_PARRAF_CONFERENCE";
const UPDATE_PARRAF = "UPDATE_PARRAF";
const GET_SPEAKER_MEMBER = "GET_SPEAKER_MEMBER";
const SET_SPEAKER_MEMBER = "SET_SPEAKER_MEMBER";
const MY_PANELS_USER = "MY_PANELS_USER";
const MY_PANELS_USER_UPDATE = "MY_PANELS_USER_UPDATE"
const FILTERS_PANELS_SPEAKERS = "FILTERS_PANELS_SPEAKERS"

export const constants = {
  GET_PANEL_SPEAKERS,
  UPDATE_PANEL_SPEAKERS,
  GET_USERS_SPEAKERS,
  REMOVE_USERS_PANEL,
  UPDATE_USERS_SPEAKERS,
  ADD_SPEAKER_TO_PANEL,
  REGISTER_USER_IF_NOT_REGISTER_CONFERENCE_2023,
  GET_ALL_PANELS_OF_ONE_USER,
  UPDATE_ALL_PANELS_OF_ONE_USER,
  SET_BUL_REGISTER,
  ADDED_TO_MY_PERSONAL_AGENDA,
  GET_ALL_SPONSORS,
  UPDATE_ALL_SPONSOR_2023,
  SET_ACTIVE_BUTTON,
  GET_ALL_PARRAF_CONFERENCE,
  UPDATE_PARRAF,
  GET_SPEAKER_MEMBER,
  SET_SPEAKER_MEMBER,
  MY_PANELS_USER,
  MY_PANELS_USER_UPDATE,
  FILTERS_PANELS_SPEAKERS
};

// ------------------------------------
// Actions
// ------------------------------------

export const addUserSpeakerToPanel = createAction(
  ADD_SPEAKER_TO_PANEL,
  (data, callback) => ({ data, callback })
)

export const updatePanelSpeakers = createAction(
  UPDATE_PANEL_SPEAKERS,
  (panelsSpeakers, filters) => ({ panelsSpeakers, filters})
);

export const getAllPanelsOfOneUserSpeakers = createAction(
  MY_PANELS_USER,
  (callback) => ({callback})
)

export const updateAllPanelsOfOneUserSpeakers = createAction(
  MY_PANELS_USER_UPDATE,
  (userSpeakers) => ({ userSpeakers })
)

export const getAllPanelSpeakers = createAction(
  GET_PANEL_SPEAKERS,
  (type, filters) => ({ type, filters })
);

export const getAllUserSpeaker = createAction(
  GET_USERS_SPEAKERS,
  (UserId) => ({ UserId})
)

export const updateAllUserSpeakers = createAction(
  UPDATE_USERS_SPEAKERS,
  (userSpeakers) => ({ userSpeakers })
);

export const removeUserSpeakerToPanel = createAction(
  REMOVE_USERS_PANEL,
  (data, callback) => ({ data, callback})
)

export const registerUserIfNotAreRegisterConference2023 = createAction(
  REGISTER_USER_IF_NOT_REGISTER_CONFERENCE_2023,
  (callback) => ({callback})
)

export const getAllPanelsOfOneUser = createAction(
  GET_ALL_PANELS_OF_ONE_USER,
  (UserId, callback) => ({UserId, callback})
)

export const updateAllPanelsOfOneUser = createAction(
  UPDATE_ALL_PANELS_OF_ONE_USER,
  (userSpeakers) => ({ userSpeakers })
);

export const setBulRegister = createAction(
  SET_BUL_REGISTER,
  (bul) => ({bul})
)

export const setActiveBoton = createAction(
  SET_ACTIVE_BUTTON,
  (bul) => ({bul})
)

export const addedToPersonalAgenda = createAction(
  ADDED_TO_MY_PERSONAL_AGENDA,
  (data, callback) => ({data, callback})
)

export const getAllSponsors = createAction(
  GET_ALL_SPONSORS,
  () => ({})
)

export const updateAllSponsors2023 = createAction(
  UPDATE_ALL_SPONSOR_2023,
  (sponsor) => ({sponsor})
)

export const getAllParafs = createAction(
  GET_ALL_PARRAF_CONFERENCE,
  (type) => ({type})
)

export const updateParraf = createAction(
  UPDATE_PARRAF,
  (parraf) => ({parraf})
)

export const getAllMemberSpeakerPanel = createAction(
  GET_SPEAKER_MEMBER,
  () => ({})
)

export const setAllMemberSpeakerPanel = createAction(
  SET_SPEAKER_MEMBER,
  (member) => ({member})
)

export const actions = {
    setActiveBoton,
    addedToPersonalAgenda,
    updatePanelSpeakers,
    getAllPanelSpeakers,
    getAllUserSpeaker,
    removeUserSpeakerToPanel,
    updateAllUserSpeakers,
    addUserSpeakerToPanel,
    registerUserIfNotAreRegisterConference2023,
    getAllPanelsOfOneUser,
    updateAllPanelsOfOneUser,
    setAllMemberSpeakerPanel,
    getAllMemberSpeakerPanel,
    getAllSponsors,
    updateAllSponsors2023,
    getAllParafs,
    updateParraf,
    getAllPanelsOfOneUserSpeakers,
    updateAllPanelsOfOneUserSpeakers
};
