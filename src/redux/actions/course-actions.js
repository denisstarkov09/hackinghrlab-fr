import { createAction } from "redux-actions";

const GET_ALL_COURSES = "GET_ALL_COURSES";
const SET_ALL_COURSES = "SET_ALL_COURSES";
const GET_COURSE = "GET_COURSE";
const SET_COURSE = "SET_COURSE";
const GET_COURSE_CLASSES = "GET_COURSE_CLASSES";
const SET_COURSE_CLASSES = "SET_COURSE_CLASSES";
const GET_COURSE_INSTRUCTORS = "GET_COURSE_INSTRUCTORS";
const SET_COURSE_INSTRUCTORS = "SET_COURSE_INSTRUCTORS";
const GET_COURSE_SPONSORS = "GET_COURSE_SPONSORS";
const SET_COURSE_SPONSORS = "SET_COURSE_SPONSORS";
const SET_LOADING = "SET_COURSE_LOADING";
const CLAIM_COURSE = "CLAIM_COURSE";

export const constants = {
  GET_ALL_COURSES,
  SET_ALL_COURSES,
  GET_COURSE,
  SET_COURSE,
  GET_COURSE_CLASSES,
  SET_COURSE_CLASSES,
  GET_COURSE_INSTRUCTORS,
  SET_COURSE_INSTRUCTORS,
  GET_COURSE_SPONSORS,
  SET_COURSE_SPONSORS,
  SET_LOADING,
  CLAIM_COURSE,
};

// ------------------------------------
// Actions
// ------------------------------------
export const getAllCourses = createAction(GET_ALL_COURSES, (filter) => ({
  filter,
}));
export const setAllCourses = createAction(SET_ALL_COURSES, (courses) => ({
  courses,
}));
export const getCourse = createAction(GET_COURSE, (id) => ({ id }));
export const setCourse = createAction(SET_COURSE, (course) => ({ course }));
export const getCourseClasses = createAction(GET_COURSE_CLASSES, (id) => ({
  id,
}));
export const setCourseClasses = createAction(SET_COURSE_CLASSES, (classes) => ({
  classes,
}));
export const getCourseInstructors = createAction(
  GET_COURSE_INSTRUCTORS,
  (id) => ({ id })
);
export const setCourseInstructors = createAction(
  SET_COURSE_INSTRUCTORS,
  (instructors) => ({ instructors })
);
export const getCourseSponsors = createAction(GET_COURSE_SPONSORS, (id) => ({
  id,
}));
export const setCourseSponsors = createAction(
  SET_COURSE_SPONSORS,
  (sponsors) => ({ sponsors })
);
export const setLoading = createAction(SET_LOADING, (loading) => ({ loading }));
export const claimCourse = createAction(CLAIM_COURSE, (id, pdf, callback) => ({
  id,
  pdf,
  callback,
}));

export const actions = {
  getAllCourses,
  setAllCourses,
  getCourse,
  setCourse,
  getCourseClasses,
  setCourseClasses,
  getCourseInstructors,
  setCourseInstructors,
  getCourseSponsors,
  setCourseSponsors,
  setLoading,
  claimCourse,
};
