import { createAction } from "redux-actions";

const LOGIN = "LOGIN";
const SIGNUP = "SIGNUP";
const LOGOUT = "LOGOUT";
const SET_AUTH = "SET_AUTH";

export const constants = {
  LOGIN,
  LOGOUT,
  SIGNUP,
  SET_AUTH,
};

// ------------------------------------
// Actions
// ------------------------------------
export const login = createAction(LOGIN, (email, password, callback) => ({
  email,
  password,
  callback
}));
export const logout = createAction(LOGOUT, () => ({}));
export const setAuth = createAction(SET_AUTH);
export const signUp = createAction(SIGNUP, (payload) => payload);

export const actions = {
  login,
  logout,
  signUp,
  setAuth,
};
