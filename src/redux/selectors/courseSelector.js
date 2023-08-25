import { createSelector } from "reselect";

const courseDataSelector = (state) => state.course;

const resultSelector = createSelector(courseDataSelector, (payload) => {
  return {
    loading: payload.get("loading"),
    allCourses: payload.get("allCourses"),
    course: payload.get("course"),
    classes: payload.get("classes"),
    instructors: payload.get("instructors"),
    sponsors: payload.get("sponsors"),
  };
});

export const courseSelector = (state) => ({
  ...resultSelector(state),
});
