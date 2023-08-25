import { createAction } from "redux-actions";

const GET_MORE_CONFERENCE_LIBRARIES = "GET_MORE_CONFERENCE_LIBRARIES";
const SET_MORE_CONFERENCE_LIBRARIES = "SET_MORE_CONFERENCE_LIBRARIES";
const SEARCH_CONFERENCE_LIBRARIES = "SEARCH_CONFERENCE_LIBRARIES";
const SET_SEARCH_CONFERENCE_LIBRARIES = "SET_SEARCH_CONFERENCE_LIBRARIES";
const SET_LOADING = "SET_CONFERENCE_LIBRARY_LOADING";
const CLAIM_CONFERENCE_LIBRARY = "CLAIM_CONFERENCE_LIBRARY";
const SET_CONFERENCE_VIEWED = "SET_CONFERENCE_VIEWED";
const UPDATE_CONFERENCE_VIEWED = "UPDATE_CONFERENCE_VIEWED";
const GET_CONFERENCE_LIBRARY = "GET_CONFERENCE_LIBRARY";
const SET_CONFERENCE_LIBRARY = "SET_CONFERENCE_LIBRARY";
const SAVE_FOR_LATER_CONFERENCE = "SAVE_FOR_LATER_CONFERENCE";
const UPDATE_SAVE_FOR_LATER_CONFERENCE = "UPDATE_SAVE_FOR_LATER_CONFERENCE"

export const constants = {
  GET_MORE_CONFERENCE_LIBRARIES,
  SET_MORE_CONFERENCE_LIBRARIES,
  SEARCH_CONFERENCE_LIBRARIES,
  SET_SEARCH_CONFERENCE_LIBRARIES,
  SET_LOADING,
  CLAIM_CONFERENCE_LIBRARY,
  SET_CONFERENCE_VIEWED,
  UPDATE_CONFERENCE_VIEWED,
  GET_CONFERENCE_LIBRARY,
  SET_CONFERENCE_LIBRARY,
  SAVE_FOR_LATER_CONFERENCE,
  UPDATE_SAVE_FOR_LATER_CONFERENCE
};

// ------------------------------------
// Actions
// ------------------------------------
export const getMoreConferenceLibraries = createAction(
  GET_MORE_CONFERENCE_LIBRARIES,
  (filter, years, index) => ({
    filter,
    years,
    index
  })
);
export const setMoreConferenceLibraries = createAction(
  SET_MORE_CONFERENCE_LIBRARIES,
  (libraries, index) => ({
    libraries,
    index
  })
);
export const searchConferenceLibraries = createAction(
  SEARCH_CONFERENCE_LIBRARIES,
  (filter, years) => ({
    filter,
    years
  })
);
export const setSearchConferenceLibraries = createAction(
  SET_SEARCH_CONFERENCE_LIBRARIES,
  (libraries) => ({
    libraries,
  })
);
export const setLoading = createAction(SET_LOADING, (loading) => ({ loading }));
export const claimConferenceLibrary = createAction(
  CLAIM_CONFERENCE_LIBRARY,
  (id, callback) => ({
    id,
    callback,
  })
);
export const setConferenceLibraryViewed = createAction(
  SET_CONFERENCE_VIEWED,
  (id, viewed, index) => ({
    id,
    viewed,
    index
  })
);
export const updateConferenceLibraryViewed = createAction(
  UPDATE_CONFERENCE_VIEWED,
  (data, index) => ({ data, index })
);

export const getConferenceLibrary = createAction(
  GET_CONFERENCE_LIBRARY,
  (id) => ({
    id,
  })
);

export const setConferenceLibrary = createAction(
  SET_CONFERENCE_LIBRARY,
  (data) => ({
    data,
  })
);

export const saveForLaterConference = createAction(
  SAVE_FOR_LATER_CONFERENCE,
  (id, UserId, status, yearIndex, isInHRCredits) => ({ id, UserId, status, yearIndex, isInHRCredits })
);

export const updateSaveForLaterConference = createAction(UPDATE_SAVE_FOR_LATER_CONFERENCE, (data, index) => ({ data, index }))

export const actions = {
  getMoreConferenceLibraries,
  setMoreConferenceLibraries,
  searchConferenceLibraries,
  setSearchConferenceLibraries,
  setLoading,
  claimConferenceLibrary,
  setConferenceLibraryViewed,
  updateConferenceLibraryViewed,
  getConferenceLibrary,
  setConferenceLibrary,
  saveForLaterConference,
  updateSaveForLaterConference
};
