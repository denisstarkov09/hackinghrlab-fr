import { createSelector } from "reselect";

const sessionClassUserDataSelector = (state) => state.sessionClassUser;

const resultSelector = createSelector(
  sessionClassUserDataSelector,
  (payload) => {
    return {
      sessionUserProgress: payload.get("sessionUserProgress"),
    };
  }
);

export const sessionClassUserSelector = (state) => ({
  ...resultSelector(state),
});
