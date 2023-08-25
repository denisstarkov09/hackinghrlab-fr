import { handleActions } from "redux-actions";
import { Map } from "immutable";

import { constants as categoryConstants } from "../actions/category-actions";

export const reducers = {
  [categoryConstants.SET_CATEGORIES]: (state, { payload }) => {
    return state.merge({ ...payload });
  },
};

export const initialState = () =>
  Map({
    categories: [],
  });

export default handleActions(reducers, initialState());
