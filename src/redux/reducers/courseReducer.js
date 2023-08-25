import { handleActions } from "redux-actions";
import { Map } from "immutable";
import cloneDeep from "lodash/cloneDeep";

// Action Type Imports
import { constants as courseConstants } from "../actions/course-actions";

// COURSE's Reducer
export const reducers = {
  [courseConstants.SET_ALL_COURSES]: (state, { payload }) => {
    return state.merge({ allCourses: cloneDeep(payload.courses) });
  },
  [courseConstants.SET_COURSE]: (state, { payload }) => {
    return state.merge({ course: payload.course });
  },
  [courseConstants.SET_COURSE_CLASSES]: (state, { payload }) => {
    return state.merge({ classes: cloneDeep(payload.classes) });
  },
  [courseConstants.SET_COURSE_INSTRUCTORS]: (state, { payload }) => {
    return state.merge({ instructors: cloneDeep(payload.instructors) });
  },
  [courseConstants.SET_COURSE_SPONSORS]: (state, { payload }) => {
    return state.merge({ sponsors: cloneDeep(payload.sponsors) });
  },
  [courseConstants.SET_LOADING]: (state, { payload }) => {
    return state.merge({ ...payload });
  },
};

export const initialState = () =>
  Map({
    loading: false,
    allCourses: [],
    course: {},
    classes: [],
    instructors: [],
    sponsors: [],
  });

export default handleActions(reducers, initialState());
