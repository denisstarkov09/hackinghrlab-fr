import { createSelector } from "reselect";

const courseClassUserDataSelector = (state) => state.courseClassUser;

const resultSelector = createSelector(courseClassUserDataSelector, (payload) => {
  return {
    courseUserProgress: payload.get("courseUserProgress"),
  };
});

export const courseClassUserSelector = (state) => ({
  ...resultSelector(state),
});
