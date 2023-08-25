import { createSelector } from "reselect";

const authDataSelector = (state) => state.auth;

const resultSelector = createSelector(authDataSelector, (payload) => ({
  isAuthenticated: payload.get("isAuthenticated"),
  loading: payload.get("loading"),
  error: payload.get("error"),
  accessToken: payload.get("accessToken"),
  checkingAuth: payload.get("checkingAuth"),
  id: payload.get("id"),
}));

export const authSelector = (state) => ({
  ...resultSelector(state),
});
