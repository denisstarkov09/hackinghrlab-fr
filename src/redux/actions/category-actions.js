import { createAction } from "redux-actions";

const GET_CATEGORIES = "GET_CATEGORIES";
const SET_CATEGORIES = "SET_CATEGORIES";

export const constants = {
  GET_CATEGORIES,
  SET_CATEGORIES,
};

// ------------------------------------
// Actions
// ------------------------------------
export const getCategories = createAction(GET_CATEGORIES);
export const setCategories = createAction(SET_CATEGORIES, (categories) => ({
  categories,
}));

export const actions = {
  getCategories,
  setCategories,
};
