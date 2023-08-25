import { handleActions } from "redux-actions";
import { Map } from "immutable";

// Action Type Imports
import { constants as progressConstants } from "../actions/course-user-progress-actions";

// COURSE's Reducer
export const reducers = {
  [progressConstants.SET_COURSE_USER_PROGRESS]: (state, { payload }) => {
    return state.merge({ courseUserProgress: payload.courseUserProgress });
  },
};

export const initialState = () =>
  Map({
    loading: false,
    courseUserProgress: [],
  });

export default handleActions(reducers, initialState());
