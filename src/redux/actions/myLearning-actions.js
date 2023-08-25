import { createAction } from "redux-actions";

const GET_ALL_SAVED = "GET_ALL_SAVED";
const GET_ALL_COMPLETED = "GET_ALL_COMPLETED";
const GET_MORE_COMPLETED = "GET_MORE_COMPLETED";
const SET_ALL_SAVED = "SET_ALL_SAVED";
const SET_ALL_COMPLETED = "SET_ALL_COMPLETED";
const SET_MORE_COMPLETED = "SET_MORE_COMPLETED";
const UPDATE_SAVE_FOR_LATER_LIBRARY = "UPDATE_SAVE_FOR_LATER_LIBRARY";
const UPDATE_COMPLETED_LIBRARY = "UPDATE_COMPLETED_LIBRARY";
const GET_ALL_ITEMS_WITH_HR_CREDITS = "GET_ALL_ITEMS_WITH_HR_CREDITS";
const GET_MORE_ITEMS_WITH_HR_CREDITS = "GET_MORE_ITEMS_WITH_HR_CREDITS";
const SET_ALL_ITEMS_WITH_HR_CREDITS = "SET_ALL_ITEMS_WITH_HR_CREDITS";
const SET_MORE_ALL_ITEMS_WITH_HR_CREDITS = "SET_MORE_ALL_ITEMS_WITH_HR_CREDITS";
const UPDATE_HR_CREDITS = "UPDATE_HR_CREDITS";
const LEARNING_LOADING = "LEARNING_LOADING";
const GET_ALL_EVENT_VIDEOS = "GET_ALL_EVENT_VIDEOS";
const SET_ALL_EVENT_VIDEOS = "SET_ALL_EVENT_VIDEOS";
const GET_MORE_SAVED = "GET_MORE_SAVED";
const SET_MORE_SAVED = "SET_MORE_SAVED";
const UPDATE_EVENT_VIDEOS =
  "UPDATE_EVENT_VIDEOS";
const ALL_LIBRARIES = "ALL_LIBRARIES";
const SET_LBRARIES = "SET_LBRARIES"

export const constants = {
  GET_ALL_SAVED,
  GET_ALL_COMPLETED,
  GET_MORE_COMPLETED,
  SET_ALL_SAVED,
  SET_ALL_COMPLETED,
  UPDATE_SAVE_FOR_LATER_LIBRARY,
  UPDATE_COMPLETED_LIBRARY,
  GET_ALL_ITEMS_WITH_HR_CREDITS,
  GET_MORE_ITEMS_WITH_HR_CREDITS,
  SET_ALL_ITEMS_WITH_HR_CREDITS,
  SET_MORE_ALL_ITEMS_WITH_HR_CREDITS,
  UPDATE_HR_CREDITS,
  LEARNING_LOADING,
  GET_ALL_EVENT_VIDEOS,
  SET_ALL_EVENT_VIDEOS,
  SET_MORE_COMPLETED,
  GET_MORE_SAVED,
  SET_MORE_SAVED,
  UPDATE_EVENT_VIDEOS,
  ALL_LIBRARIES,
  SET_LBRARIES
};

const getAllSaved = createAction(GET_ALL_SAVED, (filter) => ({ filter }));

const getMoreSaved = createAction(GET_MORE_SAVED, (filter) => ({ filter }));

const setMoreSaved = createAction(SET_MORE_SAVED, (items, page) => ({
  items,
  page,
}));

const getAllCompleted = createAction(GET_ALL_COMPLETED, (filter) => ({
  filter,
}));

const getMoreCompleted = createAction(GET_MORE_COMPLETED, (filter) => ({
  filter,
}));

const setMoreCompleted = createAction(SET_MORE_COMPLETED, (items, page) => ({
  items,
  page,
}));

const setAllSaved = createAction(SET_ALL_SAVED, (allSaved) => ({
  allSaved,
}));

const setAllCompleted = createAction(SET_ALL_COMPLETED, (allCompleted) => ({
  allCompleted,
}));

const updateSaveForLaterLibrary = createAction(
  UPDATE_SAVE_FOR_LATER_LIBRARY,
  (data, item) => ({ data, item })
);

const updateCompletedLibrary = createAction(
  UPDATE_COMPLETED_LIBRARY,
  (data) => ({ data })
);
const getAllItemsWithHRCredits = createAction(
  GET_ALL_ITEMS_WITH_HR_CREDITS,
  (filter) => ({ filter })
);
const getMoreItemsWithHRCredits = createAction(
  GET_MORE_ITEMS_WITH_HR_CREDITS,
  (filter) => ({ filter })
);
const setAllItemsWithHRCredits = createAction(
  SET_ALL_ITEMS_WITH_HR_CREDITS,
  (items) => ({ items })
);
const setMoreItemsWithHrCredits = createAction(
  SET_MORE_ALL_ITEMS_WITH_HR_CREDITS,
  (items, page) => ({ items, page })
);
const updateHRCredits = createAction(
  UPDATE_HR_CREDITS,
  (id, data) => ({ id, data })
);

const setLearningLoading = createAction(LEARNING_LOADING, (loading) => ({
  loading,
}));

export const getAllEventVideos = createAction(GET_ALL_EVENT_VIDEOS, (filter) => ({
  filter,
}));

const setAllEventVideos = createAction(SET_ALL_EVENT_VIDEOS, (videos) => ({
  videos,
}));

const updateEventVideos = createAction(
  UPDATE_EVENT_VIDEOS,
  (id, data) => ({ id, data })
);

export const getAllLibraries = createAction(ALL_LIBRARIES,(callback) => ({callback}));

export const setAllLibraries = createAction(SET_LBRARIES, (libraries) => ({libraries}))

export const actions = {
  getAllSaved,
  getAllCompleted,
  getMoreCompleted,
  setAllSaved,
  setAllCompleted,
  updateSaveForLaterLibrary,
  updateCompletedLibrary,
  getAllItemsWithHRCredits,
  getMoreItemsWithHRCredits,
  setAllItemsWithHRCredits,
  setMoreItemsWithHrCredits,
  updateHRCredits,
  setLearningLoading,
  getAllEventVideos,
  setAllEventVideos,
  setMoreCompleted,
  getMoreSaved,
  setMoreSaved,
  updateEventVideos,
  getAllLibraries,
  setAllLibraries
};
