import { handleActions } from "redux-actions";
import { Map } from "immutable";
import cloneDeep from "lodash/cloneDeep";

// Action Type Imports
import { constants as postConstants } from "../actions/post-actions";

// Events's Reducer
export const reducers = {
  [postConstants.SET_ALL_POSTS]: (state, { payload }) => {
    if (payload.page === 1) {
      return state.merge({
        allPosts: cloneDeep(payload.posts),
        currentPage: payload.page,
        countOfResults: payload.total,
      });
    }
    const allPosts = state.get("allPosts");
    return state.merge({
      allPosts: cloneDeep([...allPosts, ...payload.posts]),
      currentPage: payload.page,
      countOfResults: payload.total,
    });
  },
  [postConstants.SET_POST]: (state, { payload }) => {
    return state.merge({ post: payload.post });
  },
  [postConstants.SET_POSTS]: (state, { payload }) => {
    return state.merge({ posts: payload.posts });
  },
  [postConstants.SET_LOADING]: (state, { payload }) => {
    return state.merge({ loading: payload.loading });
  },
};

export const initialState = () =>
  Map({
    allPosts: [],
    posts: [],
    post: null,
    loading: false,
    currentPage: 1,
    countOfResults: 0,
  });

export default handleActions(reducers, initialState());
