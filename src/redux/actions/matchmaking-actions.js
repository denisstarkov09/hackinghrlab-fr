import { createAction } from "redux-actions";

const GET_MATCHMAKE = "GET_MATCHMAKE";
const SET_MATCHMAKE = "SET_MATCHMAKE";
const SEND_MATCH_EMAIL = "SEND_MATCH_EMAIL";

export const constants = {
  GET_MATCHMAKE,
  SET_MATCHMAKE,
  SEND_MATCH_EMAIL,
};

const getMatchmake = createAction(GET_MATCHMAKE, (filters, callback) => ({
  filters,
  callback,
}));
const setMatchmake = createAction(SET_MATCHMAKE, (matchmakingUsers) => ({
  matchmakingUsers,
}));
const sendMatchEmail = createAction(SEND_MATCH_EMAIL, (id, message) => ({
  id,
  message,
}));

export const actions = {
  getMatchmake,
  setMatchmake,
  sendMatchEmail,
};
