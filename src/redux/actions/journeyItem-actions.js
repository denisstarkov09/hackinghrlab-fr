import { createAction } from "redux-actions";

const GET_ALL_JOURNEY_ITEMS = "GET_ALL_JOURNEY_ITEMS";
const SET_JOURNEY_ITEMS = "SET_JOURNEY_ITEMS";
const UPDATE_JOURNEY_ITEM = "UPDATE_JOURNEY_ITEM";
const SET_JOURNEY_ID = "SET_JOURNEY_ID";
const SET_LOADING = "SET_JOURNEY_ITEMS_LOADING";

export const constants = {
  GET_ALL_JOURNEY_ITEMS,
  SET_JOURNEY_ITEMS,
  SET_JOURNEY_ID,
  UPDATE_JOURNEY_ITEM,
  SET_LOADING,
};

// ------------------------------------
// Actions
// ------------------------------------
export const getAllJourneyItems = createAction(GET_ALL_JOURNEY_ITEMS, (data) => ({
  data,
}));
export const setAllJourneyItems = createAction(SET_JOURNEY_ITEMS, (journeyItems) => ({
  journeyItems,
}));

export const updateJourneyItem = createAction(UPDATE_JOURNEY_ITEM, (data) => ({
  data,
}));

export const setJourneyId = createAction(SET_JOURNEY_ID, (journeyId) => ({
  journeyId,
}));

export const setLoading = createAction(SET_LOADING, (loading) => ({ loading }));

export const actions = {
  getAllJourneyItems,
  setAllJourneyItems,
  updateJourneyItem,
  setJourneyId,
  setLoading,
};
