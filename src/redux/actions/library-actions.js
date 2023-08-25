import { createAction } from "redux-actions";

const GET_MORE_LIBRARIES = "GET_MORE_LIBRARIES";
const SET_MORE_LIBRARIES = "SET_MORE_LIBRARIES";
const ADD_LIBRARY = "ADD_LIBRARY";
const SET_LIBRARY = "SET_LIBRARY";
const GET_LIBRARY = "GET_LIBRARY";
const SEARCH_LIBRARIES = "SEARCH_LIBRARIES";
const SET_SEARCH_LIBRARIES = "SET_SEARCH_LIBRARIES";
const SET_LOADING = "SET_LIBRARY_LOADING";
const GET_RECOMMENDATIONS = "GET_RECOMMENDATIONS";
const SET_RECOMMENDATIONS = "SET_RECOMMENDATIONS";
const ADD_CHANNEL_LIBRARY = "ADD_CHANNEL_LIBRARY";
const UPDATE_CHANNEL_LIBRARY = "UPDATE_CHANNEL_LIBRARY";
const GET_FIRST_CHANNEL_LIBRARY_LIST = "GET_FIRST_CHANNEL_LIBRARY_LIST";
const SET_FIRST_CHANNEL_LIBRARY_LIST = "SET_FIRST_CHANNEL_LIBRARY_LIST";
const GET_MORE_CHANNEL_LIBRARY_LIST = "GET_MORE_CHANNEL_LIBRARY_LIST";
const SET_MORE_CHANNEL_LIBRARY_LIST = "SET_MORE_CHANNEL_LIBRARY_LIST";
const DELETE_CHANNEL_LIBRARY = "DELETE_CHANNEL_LIBRARY";
const SHARE_CHANNEL_LIBRARY = "SHARE_CHANNEL_LIBRARY";
const CLAIM_LIBRARY = "CLAIM_LIBRARY";
const SET_LIBRARY_VIEWED = "SET_LIBRARY_VIEWED";
const UPDATE_LIBRARY_VIEWED = "UPDATE_LIBRARY_VIEWED";
const SAVE_FOR_LATER_LIBRARY = "SAVE_FOR_LATER_LIBRARY";
const SET_SAVE_FOR_LATER_LIBRARY = "SET_SAVE_FOR_LATER_LIBRARY";
const UPDATE_LIBRARY_SAVE_FOR_LATER = "UPDATE_LIBRARY_SAVE_FOR_LATER";
const GET_FIRST_CHANNEL_LIBRARY_LIST_HOME = "GET_FIRST_CHANNEL_LIBRARY_LIST_HOME";
const SET_FIRST_CHANNEL_LIBRARY_LIST_HOME = "SET_FIRST_CHANNEL_LIBRARY_LIST_HOME"
const ORDER_LIBRARYES = "ORDER_LIBRARYES";

export const constants = {
  GET_MORE_LIBRARIES,
  SET_MORE_LIBRARIES,
  ADD_LIBRARY,
  SET_LIBRARY,
  GET_LIBRARY,
  SEARCH_LIBRARIES,
  SET_SEARCH_LIBRARIES,
  SET_LOADING,
  GET_RECOMMENDATIONS,
  SET_RECOMMENDATIONS,
  ADD_CHANNEL_LIBRARY,
  UPDATE_CHANNEL_LIBRARY,
  GET_FIRST_CHANNEL_LIBRARY_LIST,
  SET_FIRST_CHANNEL_LIBRARY_LIST,
  GET_MORE_CHANNEL_LIBRARY_LIST,
  SET_MORE_CHANNEL_LIBRARY_LIST,
  DELETE_CHANNEL_LIBRARY,
  SHARE_CHANNEL_LIBRARY,
  CLAIM_LIBRARY,
  SET_LIBRARY_VIEWED,
  UPDATE_LIBRARY_VIEWED,
  SAVE_FOR_LATER_LIBRARY,
  SET_SAVE_FOR_LATER_LIBRARY,
  UPDATE_LIBRARY_SAVE_FOR_LATER,
  GET_FIRST_CHANNEL_LIBRARY_LIST_HOME,
  SET_FIRST_CHANNEL_LIBRARY_LIST_HOME,
  ORDER_LIBRARYES
};

// ------------------------------------
// Actions
// ------------------------------------
export const getMoreLibraries = createAction(
  GET_MORE_LIBRARIES,
  (filter, order) => ({
    filter,
    order,
  })
);
export const setMoreLibraries = createAction(
  SET_MORE_LIBRARIES,
  (countOfResults, currentPage, libraries) => ({
    countOfResults,
    currentPage,
    libraries,
  })
);
export const addLibrary = createAction(ADD_LIBRARY, (library) => ({ library }));
export const setLibrary = createAction(SET_LIBRARY, (library) => ({ library }));
export const getLibrary = createAction(GET_LIBRARY, (id) => ({ id }));
export const searchLibraries = createAction(
  SEARCH_LIBRARIES,
  (filter, order) => ({
    filter,
    order,
  })
);
export const setSearchLibraries = createAction(
  SET_SEARCH_LIBRARIES,
  (countOfResults, currentPage, libraries) => ({
    countOfResults,
    currentPage,
    libraries,
  })
);
export const setLoading = createAction(SET_LOADING, (loading) => ({ loading }));
export const getRecommendations = createAction(GET_RECOMMENDATIONS);
export const setRecommendations = createAction(
  SET_RECOMMENDATIONS,
  (libraries) => ({ libraries })
);
export const addChannelLibrary = createAction(
  ADD_CHANNEL_LIBRARY,
  (library, callback) => ({ library, callback })
);
export const updateChannelLibrary = createAction(
  UPDATE_CHANNEL_LIBRARY,
  (library, callback) => ({ library, callback })
);
export const getFirstChannelLibraryList = createAction(
  GET_FIRST_CHANNEL_LIBRARY_LIST,
  (filter, order) => ({ filter, order })
);
export const getFirstChannelLibraryListHome = createAction(
  GET_FIRST_CHANNEL_LIBRARY_LIST_HOME,
  (filter, order) => ({filter, order})
)
export const setFirstChannelLibraryListHome = createAction(
  SET_FIRST_CHANNEL_LIBRARY_LIST_HOME,
  (total, page, channelLibraries) => ({ total, page, channelLibraries })
);
export const setFirstChannelLibraryList = createAction(
  SET_FIRST_CHANNEL_LIBRARY_LIST,
  (total, page, channelLibraries) => ({ total, page, channelLibraries })
);
export const getMoreChannelLibraryList = createAction(
  GET_MORE_CHANNEL_LIBRARY_LIST,
  (filter, order) => ({ filter, order })
);
export const setMoreChannelLibraryList = createAction(
  SET_MORE_CHANNEL_LIBRARY_LIST,
  (total, page, channelLibraries) => ({ total, page, channelLibraries })
);
export const deleteChannelLibrary = createAction(
  DELETE_CHANNEL_LIBRARY,
  (library, callback) => ({ library, callback })
);
export const shareChannelLibrary = createAction(
  SHARE_CHANNEL_LIBRARY,
  (library, callback) => ({ library, callback })
);
export const claimLibrary = createAction(CLAIM_LIBRARY, (id, callback) => ({
  id,
  callback,
}));
export const setLibraryViewed = createAction(
  SET_LIBRARY_VIEWED,
  (id, viewed) => ({
    id,
    viewed,
  })
);
export const updateLibraryViewed = createAction(
  UPDATE_LIBRARY_VIEWED,
  (data) => ({ data })
);
export const saveForLaterLibrary = createAction(
  SAVE_FOR_LATER_LIBRARY,
  (id, UserId, status, isInHRCredits) => ({ id, UserId, status, isInHRCredits })
);
export const setSaveForLaterLibrary = createAction(
  SET_SAVE_FOR_LATER_LIBRARY,
  (allLearningLibraries) => ({ allLearningLibraries })
);

export const updateLibrarySaveForLater = createAction(
  UPDATE_LIBRARY_SAVE_FOR_LATER,
  (data) => ({ data })
);

export const orderLibrariesAction = createAction(
  ORDER_LIBRARYES,
  (data, callback) => ({data,callback})
)

export const actions = {
  getMoreLibraries,
  setMoreLibraries,
  addLibrary,
  setLibrary,
  getLibrary,
  searchLibraries,
  setSearchLibraries,
  setLoading,
  getRecommendations,
  setRecommendations,
  addChannelLibrary,
  getFirstChannelLibraryList,
  setFirstChannelLibraryList,
  getMoreChannelLibraryList,
  setMoreChannelLibraryList,
  deleteChannelLibrary,
  shareChannelLibrary,
  claimLibrary,
  setLibraryViewed,
  updateLibraryViewed,
  saveForLaterLibrary,
  setSaveForLaterLibrary,
  updateLibrarySaveForLater,
  getFirstChannelLibraryListHome,
  setFirstChannelLibraryListHome,
  orderLibrariesAction,
};
