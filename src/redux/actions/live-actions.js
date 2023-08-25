import { createAction } from "redux-actions";

const GET_LIVE = "GET_LIVE";
const SET_LIVE = "SET_LIVE";

export const constants = {
  GET_LIVE,
  SET_LIVE,
};

// ------------------------------------
// Actions
// ------------------------------------
export const getLive = createAction(GET_LIVE);
export const setLive = createAction(SET_LIVE, (live) => ({ live }));

export const actions = {
  getLive,
  setLive,
};
