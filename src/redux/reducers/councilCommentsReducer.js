import { handleActions } from "redux-actions";
import { Map } from "immutable";
import cloneDeep from "lodash/cloneDeep";

// Action Type Imports
import { constants as councilCommentsConstants } from "../actions/council-comments-actions";

// Events's Reducer
export const reducers = {
  [councilCommentsConstants.SET_ALL_COUNCIL_COMMENTS]: (state, { payload }) => {
    if (payload.page === 1) {
      return state.merge({
        allComments: cloneDeep(payload.comments),
        currentPage: payload.page,
        countOfResults: payload.total,
      });
    }
    const allComments = state.get("allComments");
    return state.merge({
      allComments: cloneDeep([...allComments, ...payload.comments]),
      currentPage: payload.page,
      countOfResults: payload.total,
    });
  },
  [councilCommentsConstants.SET_LOADING]: (state, { payload }) => {
    return state.merge({ loading: payload.loading });
  },
};

export const initialState = () =>
  Map({
    allComments: [],
    loading: false,
  });

export default handleActions(reducers, initialState());
