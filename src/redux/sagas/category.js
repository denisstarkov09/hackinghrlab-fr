import { put, fork, takeLatest, call } from "redux-saga/effects";

import {
  constants as categoryConstants,
  actions as categoryActions,
} from "../actions/category-actions";
import { logout } from "../actions/auth-actions";
import { actions as homeActions } from "../actions/home-actions";
import { getCategories } from "../../api";

export function* getCategoriesSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(getCategories);

    if (response.status === 200) {
      yield put(categoryActions.setCategories(response.data.categories));
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

function* watchCategory() {
  yield takeLatest(categoryConstants.GET_CATEGORIES, getCategoriesSaga);
}

export const categorySaga = [fork(watchCategory)];
