import { createSelector } from "reselect";

const envDataSelector = (state) => state.env;

const resultSelector = createSelector(envDataSelector, (payload) => {
  return {
    width: payload.get("width"),
    height: payload.get("height"),
    isMobile: payload.get("isMobile"),
    siderMenuCollapsed: payload.get("siderMenuCollapsed"),
    lang: payload.get("lang"),
    s3Hash: payload.get("s3Hash"),
  };
});

export const envSelector = (state) => ({
  ...resultSelector(state),
});
